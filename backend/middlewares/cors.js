const allowedCors = [
  'https://elegant.mesto.nomoredomains.monster',
  'http://elegant.mesto.nomoredomains.monster',
  'https://api.elegant.mesto.nomoredomains.monster',
  'http://api.elegant.mesto.nomoredomains.monster',
  'localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');

    const { method } = req;

    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

    const requestHeaders = req.headers['access-control-request-headers'];

    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
      return res.end();
    }
  }
  res.header('Access-Control-Allow-Origin', '*');

  return next();
};
