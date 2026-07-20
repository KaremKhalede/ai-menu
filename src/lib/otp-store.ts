// Simple in-memory OTP store for demo
// In production, use Redis
import crypto from 'crypto';

interface OTPEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

interface MagicLinkEntry {
  token: string;
  expiresAt: number;
}

const store = new Map<string, OTPEntry>();
const magicLinkStore = new Map<string, MagicLinkEntry>();

export function storeOTP(phone: string): { code: string; success: boolean; message: string } {
  const now = Date.now();
  const existing = store.get(phone);

  // Rate limit: max 3 OTP sends per minute
  if (existing && now - existing.lastSentAt < 60000) {
    if (existing.attempts >= 3) {
      return { code: '', success: false, message: 'تم إرسال رمز كثير. حاول بعد دقيقة.' };
    }
  }

  // Generate cryptographically random 6-digit OTP
  const code = crypto.randomInt(100000, 999999).toString();
  const entry: OTPEntry = {
    code,
    expiresAt: now + 120000, // 2 minutes
    attempts: (existing?.attempts ?? 0) + 1,
    lastSentAt: now,
  };

  store.set(phone, entry);
  return { code, success: true, message: 'تم إرسال رمز التحقق عبر واتساب' };
}

export function verifyOTP(phone: string, code: string): { success: boolean; message: string } {
  const entry = store.get(phone);

  if (!entry) {
    return { success: false, message: 'لم يتم إرسال رمز. أدخل رقم الجوال أولاً.' };
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return { success: false, message: 'انتهت صلاحية الرمز. أعد الإرسال.' };
  }

  // Brute-force protection: limit verification attempts
  if (entry.attempts >= 5) {
    store.delete(phone);
    return { success: false, message: 'تم تجاوز الحد الأقصى للمحاولات. أعد إرسال الرمز.' };
  }

  // Increment attempt count on every verify call
  entry.attempts += 1;

  // Use timing-safe comparison to prevent timing attacks
  const codeBuffer = Buffer.from(entry.code);
  const inputBuffer = Buffer.from(code);
  if (codeBuffer.length !== inputBuffer.length || !crypto.timingSafeEqual(codeBuffer, inputBuffer)) {
    return { success: false, message: 'رمز خاطئ. حاول مرة أخرى.' };
  }

  store.delete(phone);
  return { success: true, message: 'تم التحقق بنجاح' };
}

export function storeEmailMagicLink(email: string): { token: string; success: boolean; message: string } {
  // Generate cryptographically secure token (32 bytes = 64 hex chars)
  const token = crypto.randomBytes(32).toString('hex');
  magicLinkStore.set(email, { token, expiresAt: Date.now() + 600000 }); // 10 min
  return { token, success: true, message: 'تم إرسال رابط تسجيل الدخول' };
}

export function verifyMagicLink(email: string, token: string): { success: boolean; message: string } {
  const entry = magicLinkStore.get(email);

  if (!entry) {
    return { success: false, message: 'لم يتم إرسال رابط. أدخل البريد أولاً.' };
  }

  if (Date.now() > entry.expiresAt) {
    magicLinkStore.delete(email);
    return { success: false, message: 'انتهت صلاحية الرابط. أعد الإرسال.' };
  }

  // Validate the token matches using timing-safe comparison
  if (!token || !entry.token) {
    return { success: false, message: 'رمز غير صالح.' };
  }
  const storedBuffer = Buffer.from(entry.token);
  const inputBuffer = Buffer.from(token);
  if (storedBuffer.length !== inputBuffer.length || !crypto.timingSafeEqual(storedBuffer, inputBuffer)) {
    return { success: false, message: 'رمز غير صالح.' };
  }

  magicLinkStore.delete(email);
  return { success: true, message: 'تم التحقق بنجاح' };
}