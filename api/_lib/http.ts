export async function readJsonBody<T = Record<string, unknown>>(req: any): Promise<T> {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve());
    req.on('error', (error: Error) => reject(error));
  });

  if (chunks.length === 0) {
    return {} as T;
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as T;
}

export function setNoStore(res: any) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}

export function sendJson(res: any, status: number, payload: unknown, headers?: Record<string, string>) {
  setNoStore(res);

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }

  res.status(status).json(payload);
}

export function getRequestIp(req: any) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.socket?.remoteAddress || 'unknown';
}

export function getRequestUserAgent(req: any) {
  const userAgent = req.headers['user-agent'];
  return typeof userAgent === 'string' ? userAgent : 'unknown';
}
