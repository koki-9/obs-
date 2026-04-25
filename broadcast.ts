import type { OverlayState } from './types';

const CHANNEL = 'obs-overlay-channel';
const KEY = 'obs-overlay-state';

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel {
  if (!channel) channel = new BroadcastChannel(CHANNEL);
  return channel;
}

export function broadcastState(state: OverlayState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    getChannel().postMessage({ type: 'state', state });
  } catch {}
}

export function readState(): OverlayState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function onStateChange(cb: (state: OverlayState) => void): () => void {
  const ch = getChannel();
  const handler = (e: MessageEvent) => {
    if (e.data?.type === 'state') cb(e.data.state);
  };
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}
