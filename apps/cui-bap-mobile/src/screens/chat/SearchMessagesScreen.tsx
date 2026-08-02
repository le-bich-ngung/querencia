/**
 * Tìm kiếm tin nhắn trong conversation
 * Local search - E2EE friendly (không gửi lên server)
 */
import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation';
import { api } from '../../lib/api';
import { colors, spacing, radius } from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParams, 'SearchMessages'>;

interface SearchResult {
  id:      string;
  content: string;
  sentAt:  string;
  sender:  { name: string };
}

function highlight(text: string, query: string) {
  if (!query) return <Text style={sr.resultText}>{text}</Text>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <Text style={sr.resultText}>{text}</Text>;
  return (
    <Text style={sr.resultText}>
      {text.slice(0, idx)}
      <Text style={sr.highlight}>{text.slice(idx, idx + query.length)}</Text>
      {text.slice(idx + query.length)}
    </Text>
  );
}

export function SearchMessagesScreen({ route, navigation }: Props) {
  const { convId, convType, name } = route.params as {
    convId: string; convType: 'direct'|'group'; name: string;
  };

  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    try {
      // Load all messages for this conv and filter locally (E2EE safe)
      const data = convType === 'direct'
        ? await api.getMsgs(convId)
        : await api.getGroupMsgs(convId);
      const msgs: SearchResult[] = (data.messages ?? data);
      const filtered = msgs.filter(m =>
        m.content?.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered);
      setSearched(true);
    } catch {} finally { setLoading(false); }
  }, [convId, convType]);

  return (
    <View style={s.container}>
      {/* Search bar */}
      <View style={s.searchBar}>
        <Icon name="search" size={18} color={colors.gray} style={{ marginLeft: 12 }}/>
        <TextInput
          style={s.input}
          value={query}
          onChangeText={q => { setQuery(q); search(q); }}
          placeholder="Tìm trong cuộc trò chuyện..."
          placeholderTextColor={colors.gray}
          autoFocus
          returnKeyType="search"
          onSubmitEditing={() => search(query)}
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}
            style={{ padding: 12 }}>
            <Icon name="close-circle" size={18} color={colors.gray}/>
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color={colors.sage}/>
        </View>
      ) : searched && results.length === 0 ? (
        <View style={s.center}>
          <Icon name="search" size={40} color={colors.grayLight}/>
          <Text style={s.emptyText}>Không tìm thấy kết quả nào</Text>
          <Text style={s.emptySubText}>Thử từ khóa khác</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={m => m.id}
          contentContainerStyle={{ padding: spacing.md }}
          ListHeaderComponent={searched && results.length > 0 ? (
            <Text style={s.countText}>{results.length} kết quả</Text>
          ) : null}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={sr.item}
              onPress={() => {
                // Pass msgId vào ChatScreen params để scroll đến
                navigation.navigate('Chat', {
                  convId,
                  convType,
                  name,
                  scrollToMsgId: item.id,
                } as any);
              }}
              activeOpacity={0.7}
            >
              <View style={sr.avatar}>
                <Text style={sr.avatarTxt}>{item.sender?.name?.[0]?.toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={sr.header}>
                  <Text style={sr.senderName}>{item.sender?.name}</Text>
                  <Text style={sr.time}>
                    {new Date(item.sentAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                {highlight(item.content ?? '', query)}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgSurface,
    margin: spacing.md, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: colors.border,
  },
  input:     { flex: 1, padding: 12, color: colors.text, fontSize: 15 },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 12 },
  emptySubText: { color: colors.textSec, fontSize: 13 },
  countText: { color: colors.textSec, fontSize: 12, fontWeight: '600', marginBottom: 8 },
});

const sr = StyleSheet.create({
  item:      { flexDirection: 'row', gap: 12, padding: 12, borderRadius: radius.md, marginBottom: 4, backgroundColor: colors.bgSurface },
  avatar:    { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  header:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  senderName:{ color: colors.text, fontWeight: '600', fontSize: 13 },
  time:      { color: colors.gray, fontSize: 11 },
  resultText:{ color: colors.textSec, fontSize: 14, lineHeight: 20 },
  highlight: { backgroundColor: 'rgba(74,124,89,0.2)', color: colors.sage, fontWeight: '700' },
});
