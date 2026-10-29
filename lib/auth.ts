/**
 * Secure Admin Authentication Helper
 *
 * Checks against environment variables ADMIN_PASSWORD or ADMIN_PIN.
 * Defaults to a secure master password if unset.
 * Never exposed to client bundles.
 */

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_PIN || 'VowsAdmin@2026';
}

export function verifyAdminPassword(pin: unknown): boolean {
  if (typeof pin !== 'string') return false;
  return pin === getAdminPassword();
}
