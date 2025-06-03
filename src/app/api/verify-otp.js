import { verifyOTPToken } from '@/lib/otp';

export default function handler(req, res) {
  const { otp, token } = req.body;

  if (!otp || !token) {
    return res.status(400).json({ success: false, message: 'OTP and token required' });
  }

  const isValid = verifyOTPToken(otp, token);

  if (isValid) {
    res.status(200).json({ success: true, message: 'OTP verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
}
