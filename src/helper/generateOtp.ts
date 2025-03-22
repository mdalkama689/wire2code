function generateOtp() {
  const otp = Math.random().toString().substring(2, 8);
  return otp;
}

export default generateOtp;
