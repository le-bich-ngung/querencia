ï»¿/**
 * Read Receipt â tick ÄÆ¡n/ÄÃ´i/xanh cho tin nháº¯n ÄÃ£ gá»­i
 * â  = sent (delivered to server)
 * ââ = delivered (arrived on recipient device)
 * ââ (xanh) = read (recipient opened conversation)
 */
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';

export type ReceiptStatus = 'sending' | 'sent' | 'delivered' | 'read';

interface Props {
  status: ReceiptStatus;
  size?:  number;
}

export function ReadReceipt({ status, size = 14 }: Props) {
  if (status === 'sending') {
    return <Icon name="time-outline" size={size} color="rgba(255,255,255,0.5)"/>;
  }

  if (status === 'sent') {
    return <Icon name="checkmark" size={size} color="rgba(255,255,255,0.6)"/>;
  }

  if (status === 'delivered') {
    return (
      <Icon name="checkmark-done" size={size} color="rgba(255,255,255,0.6)"/>
    );
  }

  // read â double tick xanh
  return (
    <Icon name="checkmark-done" size={size} color={colors.online}/>
  );
}
