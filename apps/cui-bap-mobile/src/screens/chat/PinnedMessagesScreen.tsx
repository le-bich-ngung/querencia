ï»¿import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation';
import { api } from '../../lib/api';
import { colors, spacing, radius } from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParams, 'PinnedMessages'>;

export function PinnedMessagesScreen({ route, navigation }: Props) {
  const { convId, convType, name } = route.params as {
    convId: string; convType: 'direct'|'group'; name: string;
  };
  const [pinned,  setPinned]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = convType === 'direct'
          ? await api.getMsgs(convId)
          : await api.getGroupMsgs(convId);
        const msgs = (data.messages ?? data) as any[];
        setPinned(msgs.filter(m => m.isPinned && !m.isDeleted));
      } catch {} finally { setLoading(false); }
    })();
  }, [convId, convType]);

  async function handleUnpin(msgId: string) {
    await api.pinMessage(msgId);
    setPinned(p => p.filter(m => m.id !== msgId));
  }

  return (
    <View style={s.container}>
      {loading ? (
        <View style={s.center}><ActivityIndicator color={colors.sage}/></View>
      ) : pinned.length === 0 ? (
        <View style={s.center}>
          <Icon name="pin" size={40} color={colors.grayLight}/>
          <Text style={s.emptyTitle}>ChÆ°a cÃ³ tin nháº¯n nÃ o ÄÆ°á»£c ghim</Text>
          <Text style={s.emptySub}>Giá»¯ lÃ¢u tin nháº¯n Äá» ghim</Text>
        </View>
      ) : (
        <FlatList
          data={pinned}
          keyExtractor={m => m.id}
          contentContainerStyle={{ padding: spacing.md }}
          ListHeaderComponent={
            <Text style={s.count}>{pinned.length} tin nháº¯n ÄÆ°á»£c ghim</Text>
          }
          renderItem={({ item }) => (
            <View style={s.item}>
              <Icon name="pin" size={14} color={colors.sage} style={{ marginTop: 2 }}/>
              <View style={{ flex: 1 }}>
                <Text style={s.senderName}>{item.sender?.name}</Text>
                <Text style={s.content} numberOfLines={3}>{item.content}</Text>
                <Text style={s.time}>
                  {new Date(item.sentAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleUnpin(item.id)} style={s.unpinBtn}>
                <Icon name="close" size={16} color={colors.textSec}/>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.bg },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 12 },
  emptySub:   { color: colors.textSec, fontSize: 13 },
  count:      { color: colors.textSec, fontSize: 12, fontWeight: '600', marginBottom: 10 },
  item:       { flexDirection: 'row', gap: 10, padding: 14, backgroundColor: colors.bgSurface, borderRadius: radius.md, marginBottom: 8, alignItems: 'flex-start' },
  senderName: { color: colors.sage, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  content:    { color: colors.text, fontSize: 14, lineHeight: 20 },
  time:       { color: colors.gray, fontSize: 11, marginTop: 4 },
  unpinBtn:   { padding: 4 },
});
