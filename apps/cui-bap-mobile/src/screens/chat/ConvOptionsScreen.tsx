import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, radius } from '../../theme';
import { isHidden, toggleHideConversation, checkBiometricsAvailable } from '../../lib/hidden-chat';
import { api } from '../../lib/api';

interface Props {
  visible: boolean; onClose: () => void;
  convId: string; convName: string;
  convType: 'direct' | 'group'; otherUserId?: string;
  onNavigate: (screen: string, params?: any) => void;
}

export function ConvOptionsModal({ visible, onClose, convId, convName, convType, otherUserId, onNavigate }: Props) {
  const [isConvHidden, setHidden] = useState(false);
  const [isMuted,      setMuted]  = useState(false);
  const [isPinned,     setPinned] = useState(false);
  const [hasBio,       setHasBio] = useState(false);
  const [working,      setWork]   = useState(false);

  useEffect(() => {
    if (visible) {
      setHidden(isHidden(convId));
      checkBiometricsAvailable().then(r => setHasBio(r.available));
    }
  }, [visible, convId]);

  async function handleTogglePin() {
    setWork(true);
    try {
      await api.pinConversation(convId, !isPinned);
      setPinned(v => !v);
    } catch (e: any) { Alert.alert('Lỗi', e.message); }
    finally { setWork(false); onClose(); }
  }

  async function handleToggleMute(val: boolean) {
    try {
      await api.muteConversation(convId, val);
      setMuted(val);
    } catch {}
  }

  async function handleToggleHide() {
    const ok = await toggleHideConversation(convId);
    if (ok) { setHidden(v => !v); onClose(); }
    else Alert.alert('Xác thực thất bại');
  }

  async function handleDelete() {
    Alert.alert('Xóa cuộc trò chuyện?', 'Chỉ xóa ở phía bạn.', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        try {
          await api.deleteConversation(convId);
          onClose();
        } catch (e: any) { Alert.alert('Lỗi', e.message); }
      }},
    ]);
  }

  const options = [
    {
      icon:  isPinned ? 'pin' : 'pin-outline',
      label: isPinned ? 'Bỏ ghim' : 'Ghim cuộc trò chuyện',
      desc:  'Giữ ở đầu danh sách',
      onPress: handleTogglePin,
    },
    {
      icon:  isConvHidden ? 'eye' : 'eye-off',
      label: isConvHidden ? 'Bỏ ẩn' : 'Ẩn cuộc trò chuyện',
      desc:  hasBio ? 'Yêu cầu sinh trắc học để xem' : 'Ẩn khỏi danh sách',
      onPress: handleToggleHide,
    },
    {
      icon:  isMuted ? 'notifications' : 'notifications-off',
      label: isMuted  ? 'Bật thông báo' : 'Tắt thông báo',
      toggle: { value: isMuted, onChange: handleToggleMute },
      onPress: () => handleToggleMute(!isMuted),
    },
    ...(convType === 'direct' ? [
      {
        icon: 'flag', label: `Báo cáo ${convName}`, color: '#f59e0b',
        onPress: () => { onClose(); onNavigate('BlockReport', { targetUserId: otherUserId, targetName: convName }); },
      },
      {
        icon: 'ban', label: `Chặn ${convName}`, color: colors.error,
        onPress: () => { onClose(); onNavigate('BlockReport', { targetUserId: otherUserId, targetName: convName }); },
      },
    ] : []),
    {
      icon: 'trash', label: 'Xóa cuộc trò chuyện', color: colors.error,
      desc: 'Chỉ xóa ở phía bạn',
      onPress: handleDelete,
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.container}>
        <View style={s.handle}/>
        <View style={s.convInfo}>
          <View style={s.avatar}><Text style={s.avatarTxt}>{convName[0]?.toUpperCase()}</Text></View>
          <Text style={s.convName}>{convName}</Text>
          <Text style={s.convType}>{convType === 'direct' ? 'Tin nhắn trực tiếp' : 'Nhóm'}</Text>
        </View>
        <View style={s.options}>
          {options.map((opt, i) => (
            <TouchableOpacity key={opt.label} style={[s.option, i < options.length-1 && s.border]}
              onPress={opt.onPress} disabled={working} activeOpacity={0.7}>
              <View style={[s.optIcon, { backgroundColor: ((opt as any).color ?? colors.sage) + '15' }]}>
                <Icon name={opt.icon as any} size={20} color={(opt as any).color ?? colors.sage}/>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.optLabel, (opt as any).color && { color: (opt as any).color }]}>{opt.label}</Text>
                {(opt as any).desc && <Text style={s.optDesc}>{(opt as any).desc}</Text>}
              </View>
              {(opt as any).toggle && (
                <Switch value={(opt as any).toggle.value} onValueChange={(opt as any).toggle.onChange}
                  trackColor={{ true: colors.sage }} thumbColor="#fff"/>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={s.closeBtn} onPress={onClose}>
          <Text style={s.closeTxt}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container:  { flex:1, backgroundColor:colors.bg, paddingTop:12 },
  handle:     { width:36, height:4, borderRadius:2, backgroundColor:colors.border, alignSelf:'center', marginBottom:16 },
  convInfo:   { alignItems:'center', paddingVertical:20, borderBottomWidth:1, borderBottomColor:colors.border, marginHorizontal:spacing.lg, marginBottom:8 },
  avatar:     { width:56, height:56, borderRadius:28, backgroundColor:colors.sage, alignItems:'center', justifyContent:'center', marginBottom:8 },
  avatarTxt:  { color:'#fff', fontSize:22, fontWeight:'800' },
  convName:   { color:colors.text, fontSize:17, fontWeight:'700' },
  convType:   { color:colors.textSec, fontSize:12, marginTop:3 },
  options:    { margin:spacing.lg, backgroundColor:colors.bgSurface, borderRadius:radius.lg, overflow:'hidden' },
  option:     { flexDirection:'row', alignItems:'center', padding:14, gap:14 },
  border:     { borderBottomWidth:1, borderBottomColor:colors.border },
  optIcon:    { width:38, height:38, borderRadius:10, alignItems:'center', justifyContent:'center' },
  optLabel:   { color:colors.text, fontSize:15, fontWeight:'500' },
  optDesc:    { color:colors.textSec, fontSize:12, marginTop:2 },
  closeBtn:   { margin:spacing.lg, padding:14, backgroundColor:colors.bgSurface, borderRadius:radius.md, alignItems:'center' },
  closeTxt:   { color:colors.text, fontWeight:'700', fontSize:15 },
});
