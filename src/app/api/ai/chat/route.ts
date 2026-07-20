import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { getSystemPrompt, getGreeting } from '@/lib/voice-personality';
import { rateLimit } from '@/lib/rate-limit';
import type { PersonalityMode } from '@/lib/types';

const VALID_MODES: PersonalityMode[] = ['luxury', 'friendly', 'professional', 'casual', 'playful'];

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 20 chats per minute per IP
    const limiter = rateLimit(req, { intervalMs: 60000, maxRequests: 20 });
    if (!limiter.success) {
      return NextResponse.json(
        { response: 'عذراً، لقد تجاوزت عدد الرسائل المسموح به. يرجى المحاولة بعد قليل.' },
        { status: 429 }
      );
    }

    const {
      message,
      dishContext,
      cartItems,
      history,
      personalityMode,
    } = await req.json();

    const mode: PersonalityMode = VALID_MODES.includes(personalityMode) ? personalityMode : 'luxury';

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { response: getGreeting(mode) },
        { status: 400 }
      );
    }

    // Sanitize user message: basic length and script tag prevention
    const sanitizedMessage = message
      .trim()
      .substring(0, 1000) // Prevent payload exhaustion
      .replace(/<[^>]*>/g, ''); // Simple HTML tag removal

    // Build the full system prompt using the voice personality engine
    const systemPrompt = getSystemPrompt(mode, dishContext, cartItems);

    // Build messages array
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          if (msg.content && typeof msg.content === 'string') {
            messages.push({
              role: msg.role,
              content: msg.content.replace(/<[^>]*>/g, '').substring(0, 1000),
            });
          }
        }
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: sanitizedMessage });

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
        return NextResponse.json({ response: responseText, personalityMode: mode });
      }
    } catch (llmError) {
      console.error('LLM call failed, using fallback:', llmError);
    }

    // Fallback response uses the personality greeting
    return NextResponse.json({
      response: getGreeting(mode),
      personalityMode: mode,
    });
  } catch {
    return NextResponse.json(
      { response: 'أهلاً وسهلاً! كيف أستطيع مساعدتك؟' },
      { status: 500 }
    );
  }
}