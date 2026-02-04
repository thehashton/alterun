/**
 * Play a short glass/crystal tap — like touching a diamond or precious gem.
 * Single clean tone, quick decay, no pitch sweep (avoids laser-like sound).
 */
export function playGemSound(): void {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    if (ctx.state === "suspended") ctx.resume();

    const duration = 0.09;
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    gain.connect(ctx.destination);

    // Single clean tone — fixed pitch, like tapping glass
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, now);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Ignore if AudioContext not supported or autoplay blocked
  }
}
