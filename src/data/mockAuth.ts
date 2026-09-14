/**
 * DEMO AUTH CONFIG — prototype only.
 * The OTP is fixed so the flow can be exercised without SMS.
 */
export const mockAuthConfig = {
  otp: '123456',
  otpLength: 6,
  mpinLength: 4,
  resendSeconds: 45,
  /** Simulated request latency */
  latencyMs: 900,
  /** A pre-registered demo member so Login can be tried directly. */
  demoUser: {
    name: 'Priya Menon',
    phone: '9876543210',
    mpin: '1234',
  },
}

export const mockProfile = {
  referralCode: 'TKGD123',
  memberSince: 'September 2026',
}
