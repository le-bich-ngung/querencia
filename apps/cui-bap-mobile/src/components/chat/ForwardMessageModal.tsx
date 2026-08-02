/**
 * Forward Message - chuyển tiếp tin nhắn sang conversation khác
 */
import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Modal, TextInput, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../../theme';
import { useChatStore } from '../../store/chat.store';
import { api } from '../../lib/api';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  visible:  boolean;
  message:  { id: string; content: string | null; type: string };
  onClose:  () => void;
  onSent:   () => void;
}

export function ForwardMessageModal({ visible, message, onClose, onSent }: Props) {
  const { conversations, groups } = useChatStore();
  const [search,   setSearch]   = useState('');
  const [sending,  setSending]  = useState<string | null>(null); // convId being forwarded to
  const [sent,     setSent]     = useState<string[]>([]); // convIds already forwarded

  const allConvs = [
    ...conversations.map(c => ({
      id:     c.id,
      name:   c.otherUser.name,
      type:   'direct' as const,
    })),
    ...groups.map(g => ({
      id:     g.id,
      name:   g.name,
      type:   'group' as const,
    })),
  ].filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  async function handleForward(convId: string, convType: 'direct'|'group') {
    if (sent.includes(convId)) return;
    setSending(convId);
    try {
      const body = {
        content:    message.content ?? '',
        msgType:    message.type,
        forwarded:  true,
      };
      if (convType === 'direct') {
        await api.sendMsg(convId, body);
      } else {
        await api.sendGroupMsg(convId, body);
      }
      setSent(p => [...p, convId]);
    } catch {} finally { setSending(null); }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.container}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Chuyển tiếp đến</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={22} color={colors.text}/>
          </TouchableOpacity>
        </View>

        {/* Preview */}
        <View style={s.preview}>
          <Icon name="arrow-redo" size={14} color={colors.textSec}/>
          <Text style={s.previewText} numberOfLines={2}>
            {message.content ?? `[${message.type}]`}
          </Text>
        </View>

        {/* Search */}
        <View style={s.searchWrap}>
          <Icon name="search" size={16} color={colors.gray}/>
          <TextInput
            style={s.search}
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm cuộc trò chuyện..."
            placeholderTextColor={colors.gray}
          />
        </View>

        {/* List */}
        <FlatList
          data={allConvs}
          keyExtractor={c => c.id}
          renderItem={({ item }) => {
            const isSent    = sent.includes(item.id);
            const isSending = sending === item.id;
            return (
              <TouchableOpacity
                style={s.convRow}
                onPress={() => handleForward(item.id, item.type)}
                disabled={isSent || !!sending}
                activeOpacity={0.7}
              >
                <View style={[s.avatar, item.type === 'group' && { backgroundColor: '#7c5cbf' }]}>
                  <Text style={s.avatarTxt}>
                    {item.type === 'group' ? '👥' : item.name[0]?.toUpperCase()}
                  </Text>
                </View>
                <Text style={s.convName}>{item.name}</Text>
                <View style={s.sendStatus}>
                  {isSending ? (
                    <ActivityIndicator size="small" color={colors.sage}/>
                  ) : isSent ? (
                    <Icon name="checkmark-circle" size={22} color={colors.sage}/>
                  ) : (
                    <View style={s.sendBtn}>
                      <Icon name="arrow-redo" size={14} color="#fff"/>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {sent.length > 0 && (
          <TouchableOpacity style={s.doneBtn} onPress={() => { onSent(); onClose(); }}>
            <Text style={s.doneBtnText}>Xong · Đã gửi đến {sent.length} cuộc trò chuyện</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.bg },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  title:       { fontSize: 18, fontWeight: '800', color: colors.text },
  preview:     { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: spacing.md, backgroundColor: colors.bgSurface, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: radius.md },
  previewText: { color: colors.textSec, fontSize: 13, flex: 1, lineHeight: 19 },
  searchWrap:  { flexDirection: 'row', alignItems: 'center', gap: 8, margin: spacing.md, backgroundColor: colors.bgSurface, borderRadius: radius.md, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border },
  search:      { flex: 1, padding: 10, color: colors.text, fontSize: 14 },
  convRow:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  avatar:      { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarTxt:   { color: '#fff', fontWeight: '700', fontSize: 17 },
  convName:    { flex: 1, color: colors.text, fontSize: 15, fontWeight: '500' },
  sendStatus:  { width: 32, alignItems: 'center' },
  sendBtn:     { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  doneBtn:     { margin: spacing.lg, padding: 14, backgroundColor: colors.sage, borderRadius: radius.md, alignItems: 'center' },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
