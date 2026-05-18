export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, message: "Proxy is ready for requests" });
    }

    const { u, m, h, b } = req.body || {};

    if (!u) {
      return res.status(400).json({ e: 'URL is missing' });
    }

    const response = await fetch(u, {
      method: (m || 'GET').toUpperCase(),
      headers: h || {},
      body: b ? Buffer.from(b, 'base64') : undefined,
      redirect: 'follow',
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    res.status(200).json({
      s: response.status,
      h: Object.fromEntries(response.headers),
      b: base64Data,
    });
  } catch (error) {
    res.status(200).json({ e: error.message });
