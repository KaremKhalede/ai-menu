'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { itemVariants } from '../constants';

interface AiChatButtonProps {
  onAIChat: () => void;
}

export function AiChatButton({ onAIChat }: AiChatButtonProps) {
  return (
    <motion.div variants={itemVariants} className="px-5">
      <Button
        variant="outline"
        className="w-full gap-2 border-primary/30 text-sm text-primary hover:bg-primary/10 cursor-pointer"
        onClick={onAIChat}
      >
        <MessageCircle size={16} />
        تحدث مع النادل الذكي عن هذا الطبق
      </Button>
    </motion.div>
  );
}
