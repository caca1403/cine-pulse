import { xtreamPanelsFromEnv } from './_xtreamPanels.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).json(xtreamPanelsFromEnv() || { host: '', panels: [] });
}
