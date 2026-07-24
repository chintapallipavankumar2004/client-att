import { requireAdminSession, SessionError } from '../_lib/session.js';
import { getAdminData } from '../_lib/store.js';
import { sendJson } from '../_lib/http.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    await requireAdminSession(req);
    const data = await getAdminData();
    sendJson(res, 200, data);
  } catch (error) {
    if (error instanceof SessionError) {
      sendJson(res, error.status, { message: error.message });
      return;
    }

    console.error('Failed to load admin data', error);
    sendJson(res, 500, { message: 'Unable to load admin data right now.' });
  }
}
