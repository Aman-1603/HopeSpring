// src/lib/api.js
const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function api(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include', // IMPORTANT: send/receive cookies
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}
