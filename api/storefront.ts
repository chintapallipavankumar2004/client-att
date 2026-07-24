import { getStorefrontData } from './_lib/store';
import { sendJson } from './_lib/http';

export default async function handler(_req: any, res: any) {
  try {
    const data = await getStorefrontData();
    sendJson(res, 200, data);
  } catch (error) {
    console.error('Failed to load storefront data', error);
    sendJson(res, 500, { message: 'Unable to load storefront data right now.' });
  }
}
