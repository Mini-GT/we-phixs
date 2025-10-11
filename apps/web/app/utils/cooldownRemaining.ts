export function getCooldownRemaining(cooldownUntil: Date | null | undefined) {
  if (!cooldownUntil) return 0; // already full
  const ms = new Date(cooldownUntil).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / 1000) : null; // seconds left
}
