ï»¿/**
 * Group Info & Management Screen
 * - Xem danh sÃ¡ch thÃ nh viÃªn
 * - ThÃªm thÃ nh viÃªn (owner/admin)
 * - XÃ³a thÃ nh viÃªn (owner/admin)
 * - PhÃ¢n quyá»n admin (owner)
 * - Rá»i nhÃ³m (member)
 * - Giáº£i tÃ¡n nhÃ³m (owner)
 */
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, TextInput, Modal,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';
import { colors, spacing, radius } from '../../theme';

interface Member {
  id:     string;
  name:   string;
  email:  string;
  role:   'owner' | 'admin' | 'member';
}

type Props = NativeStackScreenProps<RootStackParams, 'GroupInfo'>;

const ROLE_LABEL: Record<string, string> = {
  owner: 'ð TrÆ°á»ng nhÃ³m',
  admin: 'ð¡ï¸ Admin',
  member: 'ThÃ nh viÃªn',
};

export function GroupInfoScreen({ route, navigation }: Props) {
  const { groupId, groupName } = route.params as { groupId: string; groupName: string };
  const currentUser = useAuthStore(s => s.user);

  const [members,   setMembers]   = useState<Member[]>([]);
  const [myRole,    setMyRole]    = useState<'owner'|'admin'|'member'>('member');
  const [loading,   setLoading]   = useState(true);
  const [showAdd,   setShowAdd]   = useState(false);
  const [addEmail,  setAddEmail]  = useState('');
  const [addLoading,setAddLoad]   = useState(false);

  async function loadMembers() {
    try {
      const data = await api.getGroupMembers(groupId);
      setMembers(data.members);
      const me = data.members.find((m: Member) => m.id === currentUser?.id);
      if (me) setMyRole(me.role);
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadMembers(); }, [groupId]); // eslint-disable-line

  async function handleAdd() {
    if (!addEmail.trim()) return;
    setAddLoad(true);
    try {
      await api.addGroupMember(groupId, addEmail.trim());
      setAddEmail('');
      setShowAdd(false);
      await loadMembers();
    } catch (e: any) {
      Alert.alert('Lá»i', e.message);
    } finally { setAddLoad(false); }
  }

  async function handleRemove(member: Member) {
    const isSelf = member.id === currentUser?.id;
    const title  = isSelf ? 'Rá»i nhÃ³m' : `XÃ³a ${member.name}`;
    const msg    = isSelf
      ? 'Báº¡n cÃ³ cháº¯c muá»n rá»i nhÃ³m nÃ y khÃ´ng?'
      : `XÃ³a ${member.name} khá»i nhÃ³m?`;

    Alert.alert(title, msg, [
      { text: 'Há»§y', style: 'cancel' },
      {
        text: isSelf ? 'Rá»i nhÃ³m' : 'XÃ³a',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.removeGroupMember(groupId, member.id);
            if (isSelf) {
              navigation.goBack();
              navigation.goBack(); // vá» chat list
            } else {
              await loadMembers();
            }
          } catch (e: any) { Alert.alert('Lá»i', e.message); }
        },
      },
    ]);
  }

  async function handlePromote(member: Member) {
    if (myRole !== 'owner') return;
    Alert.alert(`PhÃ¢n quyá»n ${member.name}`, 'Chá»n quyá»n má»i:', [
      { text: 'Há»§y', style: 'cancel' },
      {
        text: member.role === 'admin' ? 'Xuá»ng Member' : 'LÃªn Admin',
        onPress: async () => {
          try {
            const newRole = member.role === 'admin' ? 'member' : 'admin';
            await api.setMemberRole(groupId, member.id, newRole);
            await loadMembers();
          } catch (e: any) { Alert.alert('Lá»i', e.message); }
        },
      },
    ]);
  }

  function renderMember({ item }: { item: Member }) {
    const isSelf   = item.id === currentUser?.id;
    const canManage = (myRole === 'owner' || myRole === 'admin') && !isSelf && item.role !== 'owner';
    const canLeave  = isSelf && myRole !== 'owner';

    return (
      <View style={s.memberRow}>
        {/* Avatar */}
        <View style={s.avatar}>
          <Text style={s.avatarTxt}>{item.name[0]?.toUpperCase()}</Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={s.memberName}>
            {item.name}
            {isSelf && <Text style={{ color: colors.sage }}> (báº¡n)</Text>}
          </Text>
          <Text style={s.memberRole}>{ROLE_LABEL[item.role]}</Text>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {myRole === 'owner' && !isSelf && item.role !== 'owner' && (
            <TouchableOpacity onPress={() => handlePromote(item)} style={s.actionBtn}>
              <Text style={{ color: colors.sage, fontSize: 12 }}>
                {item.role === 'admin' ? 'â' : 'â'}
              </Text>
            </TouchableOpacity>
          )}
          {(canManage || canLeave) && (
            <TouchableOpacity onPress={() => handleRemove(item)} style={[s.actionBtn, s.removeBtn]}>
              <Text style={{ color: colors.error, fontSize: 12 }}>
                {canLeave ? 'Rá»i' : 'XÃ³a'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Group header */}
      <View style={s.groupHeader}>
        <View style={s.groupAvatar}>
          <Text style={{ fontSize: 28 }}>ð¥</Text>
        </View>
        <Text style={s.groupName}>{groupName}</Text>
        <Text style={s.memberCount}>{members.length} thÃ nh viÃªn</Text>
      </View>

      {/* Add member button */}
      {(myRole === 'owner' || myRole === 'admin') && (
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
          <Text style={s.addBtnTxt}>â ThÃªm thÃ nh viÃªn</Text>
        </TouchableOpacity>
      )}

      {/* Members list */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.sage}/>
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={m => m.id}
          renderItem={renderMember}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListHeaderComponent={
            <Text style={s.sectionLabel}>ThÃ nh viÃªn</Text>
          }
        />
      )}

      {/* Add member modal */}
      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet"
        onRequestClose={() => setShowAdd(false)}>
        <View style={s.modal}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>ThÃªm thÃ nh viÃªn</Text>
            <TouchableOpacity onPress={() => setShowAdd(false)}>
              <Text style={{ color: colors.sage, fontSize: 16 }}>ÄÃ³ng</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.inputLabel}>Email ngÆ°á»i dÃ¹ng</Text>
          <TextInput
            style={s.input}
            value={addEmail}
            onChangeText={setAddEmail}
            placeholder="ban@email.com"
            placeholderTextColor={colors.gray}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />
          <TouchableOpacity
            style={[s.confirmBtn, addLoading && { opacity: 0.6 }]}
            onPress={handleAdd}
            disabled={addLoading}
          >
            {addLoading
              ? <ActivityIndicator color="#fff"/>
              : <Text style={s.confirmTxt}>ThÃªm vÃ o nhÃ³m</Text>
            }
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.bg },
  groupHeader: { alignItems: 'center', padding: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
  groupAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#7c5cbf', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  groupName:   { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  memberCount: { fontSize: 13, color: colors.textSec },
  addBtn:      { margin: spacing.lg, padding: 13, backgroundColor: colors.bgSurface, borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.sage },
  addBtnTxt:   { color: colors.sage, fontWeight: '700', fontSize: 15 },
  sectionLabel:{ fontSize: 12, fontWeight: '700', color: colors.textSec, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: spacing.lg, paddingVertical: 10 },
  memberRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  avatar:      { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  avatarTxt:   { color: '#fff', fontWeight: '700', fontSize: 17 },
  memberName:  { fontSize: 15, fontWeight: '600', color: colors.text },
  memberRole:  { fontSize: 12, color: colors.textSec, marginTop: 2 },
  actionBtn:   { padding: 8, borderRadius: radius.sm, backgroundColor: colors.bgSurface, minWidth: 40, alignItems: 'center' },
  removeBtn:   { borderColor: colors.error + '30', borderWidth: 1 },
  modal:       { flex: 1, backgroundColor: colors.bg, padding: spacing.xl },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle:  { fontSize: 18, fontWeight: '800', color: colors.text },
  inputLabel:  { fontSize: 13, fontWeight: '600', color: colors.textSec, marginBottom: 6 },
  input:       { backgroundColor: colors.bgSurface, color: colors.text, borderRadius: radius.md, padding: 14, fontSize: 15, borderWidth: 1.5, borderColor: colors.border, marginBottom: 16 },
  confirmBtn:  { backgroundColor: colors.sage, borderRadius: radius.md, padding: 15, alignItems: 'center' },
  confirmTxt:  { color: '#fff', fontWeight: '700', fontSize: 16 },
});
