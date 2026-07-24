import { createPublicOrder } from './_lib/store.js';
import { readJsonBody, sendJson } from './_lib/http.js';
import type { Order } from '../src/types.js';

type PublicOrderPayload = Parameters<typeof createPublicOrder>[0];

function isPublicOrderPayload(payload: unknown): payload is PublicOrderPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const order = payload as Record<string, unknown>;
  const customer = order.customer as Record<string, unknown> | undefined;
  const address = customer?.address as Record<string, unknown> | undefined;
  const numericFields = ['subtotal', 'discount', 'shipping', 'tax', 'total'];

  return (
    Boolean(customer && address) &&
    ['name', 'email', 'phone'].every((field) => typeof customer?.[field] === 'string' && customer[field]) &&
    ['street', 'city', 'state', 'zip', 'country'].every((field) => typeof address?.[field] === 'string' && address[field]) &&
    Array.isArray(order.items) &&
    order.items.length > 0 &&
    order.items.every((item) => item && typeof item === 'object' && typeof (item as Order['items'][number]).productId === 'string') &&
    numericFields.every((field) => typeof order[field] === 'number' && Number.isFinite(order[field])) &&
    (order.paymentMethod === 'COD' || order.paymentMethod === 'UPI' || order.paymentMethod === 'Card')
  );
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    const payload = await readJsonBody<unknown>(req);
    if (!isPublicOrderPayload(payload)) {
      sendJson(res, 400, { message: 'Enter complete and valid order details.' });
      return;
    }

    const order = await createPublicOrder(payload);
    sendJson(res, 201, { message: 'Order placed successfully.', order });
  } catch (error) {
    console.error('Failed to place order', error);
    sendJson(res, 500, { message: 'Unable to place your order right now.' });
  }
}
