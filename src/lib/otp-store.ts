// Simple in-memory OTP store for demo
// In production, use Redis

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

  // For demo: always use 123456
  const code = '123456';
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

  if (entry.code !== code) {
    return { success: false, message: 'رمز خاطئ. حاول مرة أخرى.' };
  }

  store.delete(phone);
  return { success: true, message: 'تم التحقق بنجاح' };
}

export function storeEmailMagicLink(email: string): { token: string; success: boolean; message: string } {
  const token = Math.random().toString(36).substring(2, 15);
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

  // For demo: any non-empty token works
  if (!token) {
    return { success: false, message: 'رمز غير صالح.' };
  }

  magicLinkStore.delete(email);
  return { success: true, message: 'تم التحقق بنجاح' };
}