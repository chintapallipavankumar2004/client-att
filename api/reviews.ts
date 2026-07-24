import { createPublicReview } from './_lib/store';
import { readJsonBody, sendJson } from './_lib/http';

type PublicReviewPayload = Parameters<typeof createPublicReview>[0];

function isPublicReviewPayload(payload: unknown): payload is PublicReviewPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const review = payload as Record<string, unknown>;
  return (
    ['productId', 'productName', 'customerName', 'title', 'comment'].every(
      (field) => typeof review[field] === 'string' && review[field],
    ) &&
    typeof review.rating === 'number' &&
    Number.isInteger(review.rating) &&
    review.rating >= 1 &&
    review.rating <= 5
  );
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    const payload = await readJsonBody<unknown>(req);
    if (!isPublicReviewPayload(payload)) {
      sendJson(res, 400, { message: 'Enter complete and valid review details.' });
      return;
    }

    const review = await createPublicReview(payload);
    sendJson(res, 201, { message: 'Review submitted successfully.', review });
  } catch (error) {
    console.error('Failed to submit review', error);
    sendJson(res, 500, { message: 'Unable to submit your review right now.' });
  }
}
