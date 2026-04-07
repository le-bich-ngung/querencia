ï»¿/**
 * MFA Push Notification Approve Screen
 * Hiá»n khi nháº­n push notification tá»« ÄÄng nháº­p web
 * User báº¥m PhÃª duyá»t hoáº·c Tá»« chá»i
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { api } from '../../lib/api';
import { colors, spacing, radius } from '../../theme';

interface MFARequest {
  mfaToken:  string;
  device:    string;
  ipAddress: string;
  location?: string;
  createdAt: string;
}

interface Props {
  request:   MFARequest;
  onDismiss: () => void;
}

export function MFAApproveScreen({ request, onDismiss }: Props) {
  const [loading,    setLoading]    = useState(false);
  const [countdown,  setCountdown]  = useState(300); // 5 phÃºt
  const [responded,  setResponded]  = useState<'approved'|'rejected'|null>(null);

  // Äáº¿m ngÆ°á»£c 5 phÃºt
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); onDismiss(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onDismiss]);

  const fmtCountdown = () => {
    const m = Math.floor(countdown / 60);
    const s = countdown % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  async function handleApprove() {
    setLoading(true);
    try {
      await api.mfaRespond(request.mfaToken, 'approved');
      setResponded('approved');
      setTimeout(onDismiss, 1500);
    } catch (e: any) {
      Alert.alert('Lá»i', e.message);
    } finally { setLoading(false); }
  }

  async function handleReject() {
    setLoading(true);
    try {
      await api.mfaRespond(request.mfaToken, 'rejected');
      setResponded('rejected');
      setTimeout(onDismiss, 1500);
    } catch (e: any) {
      Alert.alert('Lá»i', e.message);
    } finally { setLoading(false); }
  }

  if (responded) {
    return (
      <View style={s.container}>
        <View style={s.card}>
          <Icon
            name={responded === 'approved' ? 'checkmark-circle' : 'close-circle'}
            size={60}
            color={responded === 'approved' ? colors.sage : colors.error}
          />
          <Text style={s.resultText}>
            {responded === 'approved' ? 'ÄÃ£ phÃª duyá»t' : 'ÄÃ£ tá»« chá»i'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.card}>
        {/* Icon */}
        <View style={s.iconWrap}>
          <Icon name="laptop" size={36} color={colors.sage}/>
        </View>

        <Text style={s.title}>YÃªu cáº§u ÄÄng nháº­p</Text>
        <Text style={s.subtitle}>
          CÃ³ ngÆ°á»i Äang ÄÄng nháº­p vÃ o tÃ i khoáº£n Querencia cá»§a báº¡n
        </Text>

        {/* Device info */}
        <View style={s.infoBox}>
          <View style={s.infoRow}>
            <Icon name="desktop-outline" size={16} color={colors.textSec}/>
            <Text style={s.infoText}>{request.device}</Text>
          </View>
          {request.location && (
            <View style={s.infoRow}>
              <Icon name="location-outline" size={16} color={colors.textSec}/>
              <Text style={s.infoText}>{request.location}</Text>
            </View>
          )}
          <View style={s.infoRow}>
            <Icon name="globe-outline" size={16} color={colors.textSec}/>
            <Text style={s.infoText}>{request.ipAddress}</Text>
          </View>
          <View style={s.infoRow}>
            <Icon name="time-outline" size={16} color={colors.textSec}/>
            <Text style={s.infoText}>
              {new Date(request.createdAt).toLocaleTimeString('vi-VN')}
            </Text>
          </View>
        </View>

        {/* Countdown */}
        <Text style={s.countdown}>
          Háº¿t háº¡n sau {fmtCountdown()}
        </Text>

        {/* Buttons */}
        <View style={s.buttons}>
          <TouchableOpacity
            style={[s.btn, s.rejectBtn]}
            onPress={handleReject}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" size="small"/> : (
              <>
                <Icon name="close" size={18} color="#fff"/>
                <Text style={s.btnText}>Tá»« chá»i</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.btn, s.approveBtn]}
            onPress={handleApprove}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" size="small"/> : (
              <>
                <Icon name="checkmark" size={18} color="#fff"/>
                <Text style={s.btnText}>PhÃª duyá»t</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={s.warning}>
          â ï¸ Náº¿u báº¡n khÃ´ng yÃªu cáº§u ÄÄng nháº­p, hÃ£y tá»« chá»i vÃ  Äá»i máº­t kháº©u ngay.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: spacing.xl },
  card:       { backgroundColor: colors.bg, borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', gap: 12 },
  iconWrap:   { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(74,124,89,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title:      { fontSize: 20, fontWeight: '800', color: colors.text },
  subtitle:   { fontSize: 14, color: colors.textSec, textAlign: 'center', lineHeight: 20 },
  infoBox:    { width: '100%', backgroundColor: colors.bgSurface, borderRadius: radius.md, padding: 14, gap: 10 },
  infoRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText:   { color: colors.text, fontSize: 13 },
  countdown:  { color: colors.gray, fontSize: 12, fontWeight: '600' },
  buttons:    { flexDirection: 'row', gap: 12, width: '100%' },
  btn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: radius.md },
  approveBtn: { backgroundColor: colors.sage },
  rejectBtn:  { backgroundColor: colors.error },
  btnText:    { color: '#fff', fontWeight: '700', fontSize: 15 },
  warning:    { fontSize: 11, color: colors.textSec, textAlign: 'center', lineHeight: 17 },
  resultText: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12 },
});
