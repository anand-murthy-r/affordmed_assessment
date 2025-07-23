

async function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortcode = '';
  for (let i = 0; i < length; i++) {
    shortcode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortcode;
}

function shortenUrl(originalUrl) {
  const shortcode = generateShortcode();
  urlDatabase[shortcode] = originalUrl;
  return `https://yourdomain.com/${shortcode}`;
}

module.exports = { generateShortcode };