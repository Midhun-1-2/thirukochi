/** Generate a numeric captcha challenge. */
export function generateCaptcha(length = 4): string {
  let out = ''
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10)
  return out
}
