import { findTrackableOrder } from '../_lib/store.js';
import { sendJson } from '../_lib/http.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (!query) {
    sendJson(res, 400, { message: 'A tracking query is required.', order: null });
    return;
  }

  try {
    const order = await findTrackableOrder(query);
    if (!order) {
      sendJson(res, 404, { message: 'No matching order was found.', order: null });
      return;
    }

    sendJson(res, 200, { order });
  } catch (error) {
    console.error('Failed to track order', error);
    sendJson(res, 500, { message: 'Unable to track this order right now.', order: null });
  }
}
