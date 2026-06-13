export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(pass: string): boolean {
  return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
}
