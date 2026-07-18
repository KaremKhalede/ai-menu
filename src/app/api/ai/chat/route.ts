import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `أنت "ليو" — نادل محترف في مطعم فاخر.

شخصيتك:
- ودود ولبق
- ذكي في البيع بدون إزعاج
- تعرف الأطباق جيدًا
- تتحدث بثقة وأناقة

أسلوبك:
- مختصر (لا تتجاوز 3 جمل غالبًا)
- تستخدم لغة جذابة
- تركز على الفائدة والنكهة

هدفك الأساسي:
- مساعدة العميل في الاختيار
- زيادة قيمة الطلب
- اقتراح إضافات مناسبة

ممنوع:
- ذكر أنك AI
- إعطاء إجابات طويلة جدًا
- التحدث بشكل روبوتي

دائمًا:
- اقترح إضافة أو تحسين الطلب
- استخدم عبارات مثل: "أنصحك بـ..." "عادة يتم طلب..." "سيكون خيار رائع مع..."
- لغة الرد: نفس لغة المستخدم (عربي أو إنجليزي)`;

const FALLBACK_RESPONSE = 'أهلاً وسهلاً! أنا ليو، سأكون سعيد بمساعدتك في اختيار أفضل الأطباق. ماذا تفضل اليوم؟ 😊';

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      dishContext,
      cartItems,
      history,
    } = await req.json();

    if (!message) {
      return NextResponse.json(
        { response: 'كيف أستطيع مساعدتك؟' },
        { status: 400 }
      );
    }

    // Build context-enhanced system prompt
    let enhancedSystem = SYSTEM_PROMPT;

    if (dishContext) {
      enhancedSystem += `\n\nالصنف الحالي الذي ينظر إليه العميل:\n`;
      enhancedSystem += `- الاسم: ${dishContext.name || ''}\n`;
      enhancedSystem += `- الوصف: ${dishContext.description || ''}\n`;
      enhancedSystem += `- السعر: ${dishContext.price ? `${dishContext.price} ريال` : ''}\n`;

      if (dishContext.addons && dishContext.addons.length > 0) {
        enhancedSystem += `- الإضافات المتاحة: ${dishContext.addons.map((a: { name: string }) => a.name).join('، ')}\n`;
      }

      if (dishContext.pairings && dishContext.pairings.length > 0) {
        enhancedSystem += `- يتناسب مع: ${dishContext.pairings.join('، ')}\n`;
      }
    }

    if (cartItems && cartItems.length > 0) {
      const total = cartItems.reduce((sum: number, item: { totalPrice: number }) => sum + (item.totalPrice || 0), 0);
      const itemNames = cartItems.map((item: { name: string }) => item.name).join('، ');
      enhancedSystem += `\n\nسلة العميل الحالية:\n`;
      enhancedSystem += `- الأصناف: ${itemNames}\n`;
      enhancedSystem += `- الإجمالي: ${total} ريال\n`;
      enhancedSystem += `اقترح إضافات مناسبة لزيادة قيمة الطلب.`;
    }

    // Build messages array
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: enhancedSystem },
    ];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Try to call LLM
    try {
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        model: 'glm-4-flash',
        messages,
      });

      const responseText =
        completion?.choices?.[0]?.message?.content ||
        completion?.message?.content ||
        (typeof completion === 'string' ? completion : null);

      if (responseText) {
        return NextResponse.json({ response: responseText });
      }
    } catch (llmError) {
      console.error('LLM call failed, using fallback:', llmError);
    }

    // Fallback response
    return NextResponse.json({ response: FALLBACK_RESPONSE });
  } catch {
    return NextResponse.json(
      { response: FALLBACK_RESPONSE },
      { status: 500 }
    );
  }
}