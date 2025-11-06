export async function startCheckout(priceId: string) {
  const r = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ priceId })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || 'Checkout failed');
  window.location.href = data.url;
}
