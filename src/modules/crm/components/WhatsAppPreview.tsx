'use client';

import { Send, MessageCircle } from 'lucide-react';

interface WhatsAppPreviewProps {
  message: string;
}

export function WhatsAppPreview({ message }: WhatsAppPreviewProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0b141a] shadow-xl max-w-sm mx-auto w-full text-right" dir="rtl">
      {/* Header */}
      <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#d4a853]/20 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-[#d4a853]" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">مطعم الذهبي</p>
          <p className="text-gray-400 text-xs">متصل الآن</p>
        </div>
      </div>
      
      {/* Chat area */}
      <div className="px-3 py-4 space-y-2 min-h-[120px] flex items-end justify-start">
        <div className="bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 max-w-[85%] shadow">
          <p className="text-white text-sm whitespace-pre-wrap leading-relaxed text-right">
            {message || 'اكتب رسالتك هنا...'}
          </p>
          <p className="text-[#8696a0] text-[10px] text-left mt-1">11:30 ص</p>
        </div>
      </div>
      
      {/* Input bar */}
      <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-[#8696a0] text-xs">
          اكتب رسالة
        </div>
        <div className="w-8 h-8 rounded-full bg-[#d4a853] flex items-center justify-center shrink-0">
          <Send className="w-3.5 h-3.5 text-[#0a0a0f]" />
        </div>
      </div>
    </div>
  );
}
