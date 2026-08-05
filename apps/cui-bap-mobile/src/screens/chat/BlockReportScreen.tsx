import React, { useState } from 'react';
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
  'Spam or advertising',
  'Harassment or bullying',
  'Inappropriate content',
  'Impersonation',
  'Other reason',
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
      `Block ${targetName}?`,
      'Once blocked, this person will no longer be able to message you.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block', style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.blockUser(targetUserId);
              Alert.alert('Blocked', `${targetName} has been blocked.`, [
                { text: 'OK', onPress: () => { navigation.goBack(); navigation.goBack(); } },
              ]);
            } catch (e: any) {
              Alert.alert('Error', e.message);
            } finally { setLoading(false); }
          },
        },
      ]
    );
  }

  async function handleReport() {
    const reason = selectedReason === 'Other reason'
      ? customReason.trim()
      : selectedReason;
    if (!reason) { Alert.alert('Choose a reason for reporting'); return; }

    setLoading(true);
    try {
      await api.reportUser(targetUserId, reason);
      Alert.alert(
        'Report sent',
        'Thank you. We will review it within 24 hours.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally { setLoading(false); }
  }

  if (mode === 'report') {
    return (
      <View style={s.container}>
        <Text style={s.title}>Report {targetName}</Text>
        <Text style={s.subtitle}>Choose a reason for reporting:</Text>

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

        {selectedReason === 'Other reason' && (
          <TextInput
            style={s.customInput}
            value={customReason}
            onChangeText={setCustomReason}
            placeholder="Describe the reason..."
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
            : <Text style={s.btnText}>Send report</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode('menu')} style={s.cancelBtn}>
          <Text style={s.cancelText}>← Back</Text>
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
              <Text style={s.btnText}>Block {targetName}</Text>
            </>
        }
      </TouchableOpacity>

      <TouchableOpacity style={[s.btn, s.warnBtn]} onPress={() => setMode('report')}>
        <Icon name="flag" size={18} color={colors.text}/>
        <Text style={[s.btnText, { color: colors.text }]}>Report {targetName}</Text>
      </TouchableOpacity>

      <Text style={s.note}>
        When you block someone, they can no longer message you or see your status.
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
