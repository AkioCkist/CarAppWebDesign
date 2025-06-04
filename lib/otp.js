import crypto from 'crypto';

export function generateNumericOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(crypto.randomInt(0, 10))];
  }
  return otp;
}

export function generateOTPToken(otp, ttl = 5 * 60 * 1000) {
  const expires = Date.now() + ttl;
  const data = `${otp}.${expires}`;
  const hash = crypto
    .createHmac('sha256', process.env.OTP_SECRET || 'default_secret')
    .update(data)
    .digest('hex');
  return `${hash}.${expires}`;
}

export function verifyOTPToken(otp, token) {
  const [hash, expires] = token.split('.');
  if (Date.now() > parseInt(expires)) return false;

  const data = `${otp}.${expires}`;
  const newHash = crypto
    .createHmac('sha256', process.env.OTP_SECRET || 'default_secret')
    .update(data)
    .digest('hex');

  return newHash === hash;
}
