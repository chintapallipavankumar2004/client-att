import { createPublicReview } from './_lib/store';
import { readJsonBody, sendJson } from './_lib/http';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const review = await createPublicReview(payload);
    sendJson(res, 201, { message: 'Review submitted successfully.', review });
  } catch (error) {
    console.error('Failed to submit review', error);
    sendJson(res, 500, { message: 'Unable to submit your review right now.' });
  }
}
