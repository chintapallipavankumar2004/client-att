import { clearSessionCookie, endAdminSession, getAdminSession, recordAuditLog } from '../_lib/session';
import { getRequestIp, getRequestUserAgent, sendJson } from '../_lib/http';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    const session = await getAdminSession(req);
    await endAdminSession(req);

    if (session) {
      await recordAuditLog({
        action: 'admin_logout',
        uid: session.admin.uid,
        email: session.admin.email,
        role: session.admin.role,
        ip: getRequestIp(req),
        userAgent: getRequestUserAgent(req),
      });
    }

    sendJson(
      res,
      200,
      { message: 'Signed out successfully.' },
      {
        'Set-Cookie': clearSessionCookie(),
      },
    );
  } catch (error) {
    console.error('Failed to sign out admin', error);
    sendJson(
      res,
      200,
      { message: 'Signed out successfully.' },
      {
        'Set-Cookie': clearSessionCookie(),
      },
    );
  }
}
