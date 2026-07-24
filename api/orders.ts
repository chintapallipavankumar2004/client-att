import { createPublicOrder } from './_lib/store';
import { readJsonBody, sendJson } from './_lib/http';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const order = await createPublicOrder(payload);
    sendJson(res, 201, { message: 'Order placed successfully.', order });
  } catch (error) {
    console.error('Failed to place order', error);
    sendJson(res, 500, { message: 'Unable to place your order right now.' });
  }
}
