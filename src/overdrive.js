export const OVERDRIVE_EVENT = "repopilot:overdrive";

let pending = false;

export function triggerOverdrive() {
  pending = true;
  window.dispatchEvent(new Event(OVERDRIVE_EVENT));
}

export function takePendingOverdrive() {
  const was = pending;
  pending = false;
  return was;
}
