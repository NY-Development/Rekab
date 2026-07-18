/**
 * The school's receiving accounts per bank. Verify.ET requires the receiver
 * account suffix to verify bank transfers (CBE = exactly 8 digits, BOA = 5),
 * and uses `settlementAccount` to confirm the receipt was actually paid into
 * our account (fraud protection). Configure per bank via env; the primary CBE
 * account is known and used as the default.
 */
export interface SettlementAccount {
  /** Full receiving account number (or wallet phone for Telebirr/M-Pesa). */
  account: string;
  /** Phone number for wallet banks (cbebirr/kaafiebirr) if different. */
  phone?: string;
}

export const SETTLEMENT_ACCOUNTS: Record<string, SettlementAccount> = {
  cbe: { account: process.env.SETTLE_CBE || '1000403196928' },
  boa: { account: process.env.SETTLE_BOA || '' },
  telebirr: { account: process.env.SETTLE_TELEBIRR || '', phone: process.env.SETTLE_TELEBIRR || '' },
  mpesa: { account: process.env.SETTLE_MPESA || '', phone: process.env.SETTLE_MPESA || '' },
  cbebirr: { account: process.env.SETTLE_CBEBIRR || '', phone: process.env.SETTLE_CBEBIRR || '' },
  dashen: { account: process.env.SETTLE_DASHEN || '' },
  awash: { account: process.env.SETTLE_AWASH || '' },
  siinqee: { account: process.env.SETTLE_SIINQEE || '' },
  kaafiebirr: { account: process.env.SETTLE_KAAFIEBIRR || '', phone: process.env.SETTLE_KAAFIEBIRR || '' },
};

/** The student's selected payment method → Verify.ET provider slug. */
export const PAYMENT_METHOD_TO_PROVIDER: Record<string, string> = {
  CBE: 'cbe',
  BOA: 'boa',
  TELEBIRR: 'telebirr',
  MPESA: 'mpesa',
  CBEBIRR: 'cbebirr',
  DASHEN: 'dashen',
  AWASH: 'awash',
  SIINQEE: 'siinqee',
  KAAFI_EBIRR: 'kaafiebirr',
};

/** Methods with no bank receipt Verify.ET can check — these need admin review. */
export const MANUAL_PAYMENT_METHODS = new Set(['CHAPA', 'BANK_TRANSFER', 'CASH']);

/** Verify.ET's per-bank suffix length requirement. */
export function deriveAccountSuffix(provider: string, account: string): string {
  if (!account) return '';
  const p = provider.toLowerCase();
  if (p === 'cbe') return account.length >= 8 ? account.slice(-8) : account;
  if (p === 'boa') return account.length >= 5 ? account.slice(-5) : account;
  return account.length >= 4 ? account.slice(-4) : account;
}
