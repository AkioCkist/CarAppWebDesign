import { generateNumericOTP, generateOTPToken } from '@/lib/otp';

export default function handler(req, res) {
  const otp = generateNumericOTP(); // e.g., 6 digits
  const token = generateOTPToken(otp);

  // You would send this OTP via SMS or email here
  console.log('Generated OTP:', otp);

  res.status(200).json({ token }); // You don't send OTP in real-world APIs!
}
