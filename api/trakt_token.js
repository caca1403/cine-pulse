import { guardNodeRequest } from './_security.js';
import { traktTokenKopru } from './_traktToken.js';

export default async function handler(req, res) {
  if (guardNodeRequest(req, res, { limit: 30, bucket: 'trakt' })) return;
  // Vercel JSON gövdeyi kendisi ayıştırıp req.body'ye koyar.
  return traktTokenKopru(req, res, req.body);
}
