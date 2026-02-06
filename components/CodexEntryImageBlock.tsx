"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const LIGHTBOX_EXIT_MS = 200;
const ZOOM_STEPS = [1, 1.25, 1.5, 2, 2.5, 3];
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

type Props = {
  src: string;
  caption: string | null;
  alt?: string;
};

export function CodexEntryImageBlock({ src, caption, alt = "" }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const zoomInBtnRef = useRef<HTMLButtonElement>(null);
  const zoomOutBtnRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; startPanX: number; startPanY: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const inBtn = zoomInBtnRef.current;
    const outBtn = zoomOutBtnRef.current;
    if (!inBtn || !outBtn) return;
    const handleZoomIn = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      setZoom((z) => {
        const next = ZOOM_STEPS.find((s) => s > z) ?? MAX_ZOOM;
        return Math.min(next, MAX_ZOOM);
      });
    };
    const handleZoomOut = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      setZoom((z) => {
        const idx = ZOOM_STEPS.findIndex((s) => s >= z);
        const next = idx <= 0 ? MIN_ZOOM : ZOOM_STEPS[idx - 1];
        return Math.max(next, MIN_ZOOM);
      });
    };
    inBtn.addEventListener("click", handleZoomIn, true);
    outBtn.addEventListener("click", handleZoomOut, true);
    return () => {
      inBtn.removeEventListener("click", handleZoomIn, true);
      outBtn.removeEventListener("click", handleZoomOut, true);
    };
  }, [lightboxOpen]);

  const zoomIn = useCallback(() => {
    setZoom((z) => {
      const next = ZOOM_STEPS.find((s) => s > z) ?? MAX_ZOOM;
      return Math.min(next, MAX_ZOOM);
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const idx = ZOOM_STEPS.findIndex((s) => s >= z);
      const next = idx <= 0 ? MIN_ZOOM : ZOOM_STEPS[idx - 1];
      return Math.max(next, MIN_ZOOM);
    });
  }, []);

  useEffect(() => {
    if (zoom <= 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  const close = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    closeTimeoutRef.current = setTimeout(() => {
      setLightboxOpen(false);
      setIsClosing(false);
      closeTimeoutRef.current = null;
    }, LIGHTBOX_EXIT_MS);
  }, [isClosing]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const clampPan = useCallback((x: number, y: number, z: number) => {
    const el = containerRef.current;
    if (!el || z <= 1) return { x: 0, y: 0 };
    const { width: cw, height: ch } = el.getBoundingClientRect();
    const maxX = Math.max(0, (cw * (z - 1)) / 2);
    const maxY = Math.max(0, (ch * (z - 1)) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (zoom <= 1) return;
      if ("button" in e && e.button !== 0) return; // left click only for mouse
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      dragRef.current = { startX: clientX, startY: clientY, startPanX: pan.x, startPanY: pan.y };
      setIsDragging(true);
    },
    [zoom, pan.x, pan.y]
  );

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;
      const next = clampPan(
        dragRef.current.startPanX + dx,
        dragRef.current.startPanY + dy,
        zoom
      );
      setPan(next);
    },
    [zoom, clampPan]
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  // Reset zoom/pan only when lightbox first opens (not on every re-render)
  useEffect(() => {
    if (lightboxOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else if (e.deltaY > 0) zoomOut();
      }
    };
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (dragRef.current) handlePointerMove(e);
    };
    const onPointerUp = () => {
      if (dragRef.current) handlePointerUp();
    };
    document.addEventListener("keydown", onEscape);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("mouseup", onPointerUp);
    document.addEventListener("touchmove", onPointerMove, { passive: false });
    document.addEventListener("touchend", onPointerUp);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerUp);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, close, zoomIn, zoomOut, handlePointerMove, handlePointerUp]);

  return (
    <>
      <figure className="group">
        <div
          className="relative overflow-hidden rounded border border-alterun-border bg-alterun-bg-card cursor-pointer transition-[border-color,box-shadow] duration-200 hover:border-alterun-gold/40 hover:shadow-[0_0_20px_-4px_rgba(201,162,39,0.12)]"
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setLightboxOpen(true);
            }
          }}
          aria-label="View full size"
        >
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={src}
              alt={alt || caption || "Codex image"}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <div className="absolute bottom-2 right-2 rounded bg-alterun-bg/90 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
            <span className="text-xs text-alterun-gold uppercase tracking-wider">View larger</span>
          </div>
        </div>
        {caption && (
          <figcaption className="mt-2 text-center text-lg text-alterun-muted leading-snug">
            {caption}
          </figcaption>
        )}
      </figure>

      {lightboxOpen && mounted && createPortal(
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 ${isClosing ? "animate-lightbox-overlay-out" : "animate-lightbox-overlay"}`}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Image full size view"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-20 rounded p-2 text-alterun-muted hover:bg-alterun-gold/20 hover:text-alterun-gold focus:outline-none focus:ring-2 focus:ring-alterun-gold/50 disabled:pointer-events-none"
            aria-label="Close"
            disabled={isClosing}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            ref={contentRef}
            className={`relative z-10 max-h-[90vh] w-full max-w-4xl ${isClosing ? "animate-lightbox-content-out" : "animate-lightbox-content"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2 mb-2 z-20 relative" role="group" aria-label="Zoom controls">
              <button
                ref={zoomOutBtnRef}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); zoomOut(); }}
                disabled={zoom <= MIN_ZOOM || isClosing}
                className="rounded p-2 text-alterun-muted hover:bg-alterun-gold/15 hover:text-alterun-gold disabled:opacity-40 disabled:pointer-events-none transition-colors touch-manipulation cursor-pointer"
                aria-label="Zoom out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <span className="text-alterun-muted text-sm tabular-nums min-w-[3rem] text-center select-none" aria-live="polite">{Math.round(zoom * 100)}%</span>
              <button
                ref={zoomInBtnRef}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); zoomIn(); }}
                disabled={zoom >= MAX_ZOOM || isClosing}
                className="rounded p-2 text-alterun-muted hover:bg-alterun-gold/15 hover:text-alterun-gold disabled:opacity-40 disabled:pointer-events-none transition-colors touch-manipulation cursor-pointer"
                aria-label="Zoom in"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
            </div>
            <div
              ref={containerRef}
              className="overflow-hidden w-full h-[80vmin] max-h-[78vh] flex justify-center items-center rounded bg-black/20 select-none touch-none"
              style={{
                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                touchAction: "none",
              }}
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
            >
              <div
                className="inline-flex justify-center items-center will-change-transform"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.15s ease-out",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || caption || "Codex image"}
                  className="block max-h-[78vh] max-w-full w-auto object-contain pointer-events-none select-none"
                  style={{ maxHeight: "78vh" }}
                  draggable={false}
                />
              </div>
            </div>
            {caption && (
              <p className="mt-3 text-center text-base text-alterun-muted">
                {caption}
              </p>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
