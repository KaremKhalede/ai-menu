'use client';

import { useState, useMemo } from 'react';
import {
  campaignTemplates,
  type TargetSegment,
  type CampaignTemplateKey,
  type CampaignOffer,
} from '@/lib/crm-engine';

export function useCampaignForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [campName, setCampName] = useState('');
  const [campType, setCampType] = useState<'whatsapp' | 'push' | 'email'>('whatsapp');
  const [campSegment, setCampSegment] = useState<TargetSegment>('all');
  const [campTemplate, setCampTemplate] = useState<CampaignTemplateKey>('weekly_specials');
  const [campMessage, setCampMessage] = useState('');
  const [offerType, setOfferType] = useState<CampaignOffer['type']>('percentage');
  const [offerValue, setOfferValue] = useState('');
  const [offerMinOrder, setOfferMinOrder] = useState('');

  const previewMessage = useMemo(() => {
    if (!campMessage.trim()) return '';
    return campMessage;
  }, [campMessage]);

  const handleTemplateSelect = (key: CampaignTemplateKey) => {
    setCampTemplate(key);
    const tpl = campaignTemplates[key];
    const seg = tpl.defaultSegment;
    setCampSegment(seg);
    setCampMessage(tpl.defaultMessage);
  };

  const handleCreate = () => {
    setDialogOpen(false);
    // Reset form states
    setCampName('');
    setCampMessage('');
    setOfferValue('');
    setOfferMinOrder('');
  };

  return {
    dialogOpen,
    setDialogOpen,
    campName,
    setCampName,
    campType,
    setCampType,
    campSegment,
    setCampSegment,
    campTemplate,
    setCampTemplate,
    campMessage,
    setCampMessage,
    offerType,
    setOfferType,
    offerValue,
    setOfferValue,
    offerMinOrder,
    setOfferMinOrder,
    previewMessage,
    handleTemplateSelect,
    handleCreate,
  };
}
