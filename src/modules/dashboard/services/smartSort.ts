/**
 * Triggers the smart-sort API endpoint.
 * Silently fails in demo mode — the dashboard button shows no loading state.
 */
export async function triggerSmartSort(): Promise<void> {
  try {
    const res = await fetch('/api/menu/smart-sort', { method: 'POST' });
    await res.json();
  } catch {
    // Silent fail for demo
  }
}
