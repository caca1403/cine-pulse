// Vercel entrypoint for Dizisol requests. The shared handler contains the
// upstream routing and response normalization; this file makes the route
// available as a concrete serverless function in production.
export { default } from './[...all].js';
