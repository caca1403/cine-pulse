export default function handler(req, res) {
  res.writeHead(302, {
    Location: 'https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk'
  });
  res.end();
}
