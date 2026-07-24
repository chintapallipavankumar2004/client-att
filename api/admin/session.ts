import { clearSessionCookie, getAdminSession } from '../_lib/session';
import { sendJson } from '../_lib/http';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    const session = await getAdminSession(req);
    if (!session) {
      sendJson(
        res,
        200,
        { authenticated: false, admin: null },
        {
          'Set-Cookie': clearSessionCookie(),
        },
      );
      return;
    }

    sendJson(res, 200, { authenticated: true, admin: session.admin });
  } catch (error) {
    console.error('Failed to resolve admin session', error);
    sendJson(
      res,
      200,
      { authenticated: false, admin: null },
      {
        'Set-Cookie': clearSessionCookie(),
      },
    );
  }
}
