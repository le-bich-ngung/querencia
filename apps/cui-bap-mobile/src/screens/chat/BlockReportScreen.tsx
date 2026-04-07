ï»¿import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, TextInput,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation';
import { api } from '../../lib/api';
import { colors, spacing, radius } from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParams, 'BlockReport'>;

const REPORT_REASONS = [
  'Spam hoáº·c quáº£ng cÃ¡o',
  'Quáº¥y rá»i hoáº·c báº¯t náº¡t',
  'Ná»i dung khÃ´ng phÃ¹ há»£p',
  'Giáº£ máº¡o danh tÃ­nh',
  'LÃ½ do khÃ¡c',
];

export function BlockReportScreen({ route, navigation }: Props) {
  const { targetUserId, targetName } = route.params as {
    targetUserId: string; targetName: string;
  };

  const [loading,      setLoading]      = useState(false);
  const [selectedReason, setReason]     = useState('');
  const [customReason, setCustomReason] = useState('');
  const [mode,         setMode]         = useState<'menu'|'report'>('menu');

  async function handleBlock() {
    Alert.alert(
      `Cháº·n ${targetName}?`,
      'Sau khi cháº·n, ngÆ°á»i nÃ y sáº½ khÃ´ng thá» nháº¯n tin cho báº¡n.',
      [
        { text: 'Há»§y', style: 'cancel' },
        {
          text: 'Cháº·n', style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.blockUser(targetUserId);
              Alert.alert('ÄÃ£ cháº·n', `${targetName} ÄÃ£ bá» cháº·n.`, [
                { text: 'OK', onPress: () => { navigation.goBack(); navigation.goBack(); } },
              ]);
            } catch (e: any) {
              Alert.alert('Lá»i', e.message);
            } finally { setLoading(false); }
          },
        },
      ]
    );
  }

  async function handleReport() {
    const reason = selectedReason === 'LÃ½ do khÃ¡c'
      ? customReason.trim()
      : selectedReason;
    if (!reason) { Alert.alert('Chá»n lÃ½ do bÃ¡o cÃ¡o'); return; }

    setLoading(true);
    try {
      await api.reportUser(targetUserId, reason);
      Alert.alert(
        'ÄÃ£ gá»­i bÃ¡o cÃ¡o',
        'Cáº£m Æ¡n báº¡n. ChÃºng tÃ´i sáº½ xem xÃ©t trong 24 giá».',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert('Lá»i', e.message);
    } finally { setLoading(false); }
  }

  if (mode === 'report') {
    return (
      <View style={s.container}>
        <Text style={s.title}>BÃ¡o cÃ¡o {targetName}</Text>
        <Text style={s.subtitle}>Chá»n lÃ½ do bÃ¡o cÃ¡o:</Text>

        {REPORT_REASONS.map(reason => (
          <TouchableOpacity
            key={reason}
            style={[s.reasonRow, selectedReason === reason && s.reasonSelected]}
            onPress={() => setReason(reason)}
            activeOpacity={0.7}
          >
            <Text style={[s.reasonText, selectedReason === reason && s.reasonTextSelected]}>
              {reason}
            </Text>
            {selectedReason === reason && (
              <Icon name="checkmark-circle" size={20} color={colors.sage}/>
            )}
          </TouchableOpacity>
        ))}

        {selectedReason === 'LÃ½ do khÃ¡c' && (
          <TextInput
            style={s.customInput}
            value={customReason}
            onChangeText={setCustomReason}
            placeholder="MÃ´ táº£ lÃ½ do..."
            placeholderTextColor={colors.gray}
            multiline
            autoFocus
          />
        )}

        <TouchableOpacity
          style={[s.btn, s.reportBtn, (!selectedReason || loading) && s.btnDisabled]}
          onPress={handleReport}
          disabled={!selectedReason || loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="small"/>
            : <Text style={s.btnText}>Gá»­i bÃ¡o cÃ¡o</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode('menu')} style={s.cancelBtn}>
          <Text style={s.cancelText}>â Quay láº¡i</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.userCard}>
        <View style={s.avatar}>
          <Text style={s.avatarTxt}>{targetName[0]?.toUpperCase()}</Text>
        </View>
        <Text style={s.userName}>{targetName}</Text>
      </View>

      <TouchableOpacity style={[s.btn, s.blockBtn]} onPress={handleBlock} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" size="small"/>
          : <>
              <Icon name="ban" size={18} color="#fff"/>
              <Text style={s.btnText}>Cháº·n {targetName}</Text>
            </>
        }
      </TouchableOpacity>

      <TouchableOpacity style={[s.btn, s.warnBtn]} onPress={() => setMode('report')}>
        <Icon name="flag" size={18} color={colors.text}/>
        <Text style={[s.btnText, { color: colors.text }]}>BÃ¡o cÃ¡o {targetName}</Text>
      </TouchableOpacity>

      <Text style={s.note}>
        Khi báº¡n cháº·n ai ÄÃ³, há» sáº½ khÃ´ng thá» nháº¯n tin hoáº·c xem tráº¡ng thÃ¡i cá»§a báº¡n.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: colors.bg, padding: spacing.xl },
  userCard:       { alignItems: 'center', paddingVertical: 28, gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 24 },
  avatar:         { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  avatarTxt:      { color: '#fff', fontSize: 26, fontWeight: '800' },
  userName:       { color: colors.text, fontSize: 18, fontWeight: '700' },
  title:          { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 6 },
  subtitle:       { fontSize: 14, color: colors.textSec, marginBottom: 16 },
  reasonRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: radius.md, marginBottom: 8, backgroundColor: colors.bgSurface, borderWidth: 1.5, borderColor: colors.border },
  reasonSelected: { borderColor: colors.sage, backgroundColor: 'rgba(74,124,89,0.06)' },
  reasonText:     { color: colors.text, fontSize: 14 },
  reasonTextSelected: { color: colors.sage, fontWeight: '600' },
  customInput:    { backgroundColor: colors.bgSurface, color: colors.text, borderRadius: radius.md, padding: 12, fontSize: 14, borderWidth: 1.5, borderColor: colors.border, marginBottom: 16, minHeight: 80, textAlignVertical: 'top' },
  btn:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: radius.md, marginBottom: 12 },
  blockBtn:       { backgroundColor: colors.error },
  warnBtn:        { backgroundColor: colors.bgSurface, borderWidth: 1.5, borderColor: colors.border },
  reportBtn:      { backgroundColor: '#f59e0b' },
  btnDisabled:    { opacity: 0.5 },
  btnText:        { color: '#fff', fontWeight: '700', fontSize: 15 },
  cancelBtn:      { padding: 12, alignItems: 'center' },
  cancelText:     { color: colors.sage, fontSize: 14, fontWeight: '600' },
  note:           { color: colors.textSec, fontSize: 12, lineHeight: 18, marginTop: 8, textAlign: 'center' },
});
