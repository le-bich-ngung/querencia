ï»¿import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, Pressable,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation';
import { useChatStore }      from '../../store/chat.store';
import { useAuthStore }      from '../../store/auth.store';
import { api }               from '../../lib/api';
import { useSocket }         from '../../hooks/useSocket';
import { useWebRTC }         from '../../hooks/useWebRTC';
import { CallScreen }        from '../call/CallScreen';
import { VoiceRecorder }     from '../../components/chat/VoiceRecorder';
import { AudioPlayer }       from '../../components/chat/AudioPlayer';
import { TappableImage }     from '../../components/chat/ImageViewer';
import Video                 from 'react-native-video';
import { ReadReceipt }       from '../../components/chat/ReadReceipt';
import { SelfDestructPicker } from '../../components/chat/SelfDestructPicker';
import { ForwardMessageModal } from '../../components/chat/ForwardMessageModal';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { colors, spacing, radius } from '../../theme';
import { enqueue }             from '../../lib/offline-queue';
import type { CBMessage } from '../../store/chat.store';

type Props = NativeStackScreenProps<RootStackParams, 'Chat'>;
const SAGE   = colors.sage;
const EMOJIS = ['â¤ï¸','ð','ð','ð®','ð¢','ð¥','ð','ð','ð','ð¯'];

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// ââ Message bubble âââââââââââââââââââââââââââââââââââââââââââââ
function Bubble({ msg, isOut, onLongPress, myId }: {
  msg: CBMessage; isOut: boolean;
  onLongPress: (m: CBMessage) => void;
  myId?: string;
}) {
  if (msg.isDeleted) {
    return (
      <View style={[ms.row, isOut && ms.rowOut]}>
        <View style={[ms.bubble, { backgroundColor: colors.bgSurface, opacity: 0.5 }]}>
          <Text style={{ color: colors.gray, fontStyle: 'italic', fontSize: 13 }}>ð ÄÃ£ xÃ³a</Text>
        </View>
      </View>
    );
  }

  // Receipt status â tá»« store (cáº­p nháº­t real-time qua WebSocket)
  const receiptStatus = !isOut
    ? undefined  // chá» show cho tin mÃ¬nh gá»­i
    : msg.pending
      ? 'sending'
      : msg.receiptStatus ?? 'sent';

  return (
    <Pressable
      onLongPress={() => onLongPress(msg)}
      style={[ms.row, isOut && ms.rowOut]}
    >
      {!isOut && (
        <View style={ms.avatar}>
          <Text style={ms.avatarTxt}>{msg.sender?.name?.[0]?.toUpperCase()}</Text>
        </View>
      )}

      <View style={[ms.col, isOut && ms.colOut]}>
        {!isOut && <Text style={ms.senderName}>{msg.sender?.name}</Text>}

        {/* Reply preview */}
        {msg.replyToId && (
          <View style={[ms.replyBar, isOut && ms.replyBarOut]}>
            <Text style={ms.replyText} numberOfLines={1}>â©ï¸ Tráº£ lá»i tin nháº¯n</Text>
          </View>
        )}

        <View style={[ms.bubble, isOut ? ms.bubbleOut : ms.bubbleIn, msg.pending && { opacity: 0.6 }]}>
          {/* Image */}
          {msg.type === 'image' && msg.fileUrl ? (
            <TappableImage uri={msg.fileUrl} fileName={msg.fileName} style={{ width: 220, height: 180 }}/>

          /* Audio */
          ) : msg.type === 'video' && msg.fileUrl ? (
            <Video
              source={{ uri: msg.fileUrl }}
              style={{ width: 220, height: 160, borderRadius: 12 }}
              controls
              paused
              resizeMode="cover"
            />

          ) : msg.type === 'audio' && msg.fileUrl ? (
            <AudioPlayer url={msg.fileUrl} isOut={isOut}/>

          /* File */
          ) : msg.type === 'file' && msg.fileUrl ? (
            <View style={ms.fileRow}>
              <Icon name="document-attach" size={20} color={isOut ? '#fff' : SAGE}/>
              <View style={{ flex: 1 }}>
                <Text style={[ms.txt, isOut && { color: '#fff' }]} numberOfLines={1}>
                  {msg.fileName || 'File'}
                </Text>
                {msg.fileSize && (
                  <Text style={{ fontSize: 10, opacity: 0.6, color: isOut ? '#fff' : colors.textSec }}>
                    {(msg.fileSize / 1024).toFixed(0)} KB
                  </Text>
                )}
              </View>
            </View>

          /* Text */
          ) : (
            <Text style={[ms.txt, isOut && ms.txtOut]}>
              {msg.content}
              {msg.isEdited && <Text style={{ opacity: 0.5, fontSize: 10 }}> (ÄÃ£ sá»­a)</Text>}
            </Text>
            {/* Link preview cho text messages cÃ³ chá»©a URL */}
            {msg.content && extractUrls(msg.content).length > 0 && (
              <LinkPreview text={msg.content} isOut={isOut}/>
            )}
          )}
        </View>

        {/* Reactions */}
        {Object.keys(msg.reactions ?? {}).length > 0 && (
          <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
            {Object.entries(msg.reactions).map(([e, n]) => (
              <View key={e} style={ms.rxPill}>
                <Text style={{ fontSize: 12 }}>{e} {n}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Time + read receipt */}
        <View style={[ms.meta, isOut && ms.metaOut]}>
          <Text style={ms.time}>{fmt(msg.sentAt)}</Text>
          {isOut && receiptStatus && (
            <ReadReceipt status={receiptStatus} size={12}/>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const ms = StyleSheet.create({
  row:        { flexDirection:'row', marginVertical:3, paddingHorizontal:12, alignItems:'flex-end', gap:8 },
  rowOut:     { justifyContent:'flex-end' },
  avatar:     { width:28, height:28, borderRadius:14, backgroundColor:SAGE, alignItems:'center', justifyContent:'center', flexShrink:0, marginBottom:4 },
  avatarTxt:  { color:'#fff', fontSize:12, fontWeight:'700' },
  col:        { maxWidth:'78%', gap:3 },
  colOut:     { alignItems:'flex-end' },
  senderName: { fontSize:11, color:colors.textSec, fontWeight:'600', marginLeft:2 },
  replyBar:   { backgroundColor:colors.bgSurface, borderRadius:6, borderLeftWidth:2, borderLeftColor:SAGE, paddingHorizontal:8, paddingVertical:4 },
  replyBarOut:{ borderLeftColor:'rgba(255,255,255,0.4)' },
  replyText:  { fontSize:11, color:colors.textSec },
  bubble:     { borderRadius:18, paddingHorizontal:13, paddingVertical:9 },
  bubbleIn:   { backgroundColor:colors.bgSurface, borderBottomLeftRadius:4 },
  bubbleOut:  { backgroundColor:SAGE, borderBottomRightRadius:4 },
  txt:        { color:colors.text, fontSize:15, lineHeight:21 },
  txtOut:     { color:'#fff' },
  fileRow:    { flexDirection:'row', alignItems:'center', gap:8, minWidth:140 },
  rxPill:     { backgroundColor:colors.bgSurface, borderRadius:12, paddingHorizontal:7, paddingVertical:2, borderWidth:1, borderColor:colors.border },
  meta:       { flexDirection:'row', alignItems:'center', gap:4, paddingLeft:4 },
  metaOut:    { flexDirection:'row-reverse' },
  time:       { fontSize:10, color:colors.gray },
});

// ââ ChatScreen âââââââââââââââââââââââââââââââââââââââââââââââââ
export function ChatScreen({ route, navigation }: Props) {
  const { convId, convType, name, otherUserId } = route.params;
  const scrollToMsgId = (route.params as any).scrollToMsgId as string | undefined;

  const isDirect = convType === 'direct';
  const user     = useAuthStore(s => s.user);
  const store    = useChatStore();
  const socketFns = useSocket();

  const [text,            setText]           = useState('');
  const [loading,         setLoading]        = useState(true);
  const [loadingMore,     setLoadingMore]     = useState(false);
  const [replyTo,         setReplyTo]         = useState<CBMessage | null>(null);
  const [showEmoji,       setShowEmoji]       = useState<string | null>(null);
  const [autoDelete,      setAutoDelete]      = useState<number | null>(null);
  const [showDestruct,    setShowDestruct]    = useState(false);
  const [forwardMsg,      setForwardMsg]      = useState<any>(null);
  const [incomingCall,    setIncoming]        = useState<any>(null);
  const [hasMore,         setHasMore]         = useState(false);
  const [beforeCursor,    setBefore]          = useState<string | undefined>();

  const listRef  = useRef<FlatList>(null);
  const typerRef = useRef<ReturnType<typeof setTimeout>>();
  const messages = store.messages[convId] ?? [];

  // WebRTC
  const webrtc = useWebRTC({
    ...socketFns,
    onCallOffer:  (d) => setIncoming(d),
    onCallEnd:    () => {},
    onCallReject: () => Alert.alert('Cuá»c gá»i bá» tá»« chá»i'),
  });

  // Header
  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 8, marginRight: 4 }}>
          <TouchableOpacity onPress={() => navigation.navigate('SearchMessages', { convId, convType, name })}>
            <Icon name="search-outline" size={20} color={colors.text}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PinnedMessages', { convId, convType, name })}>
            <Icon name="pin-outline" size={20} color={colors.text}/>
          </TouchableOpacity>
          {convType === 'group' && (
            <TouchableOpacity onPress={() => navigation.navigate('GroupInfo', { groupId: convId, groupName: name })}>
              <Icon name="people-outline" size={20} color={colors.text}/>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => webrtc.startCall(otherUserId ?? '', convId, 'voice')}>
            <Icon name="call-outline" size={20} color={colors.text}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => webrtc.startCall(otherUserId ?? '', convId, 'video')}>
            <Icon name="videocam-outline" size={20} color={colors.text}/>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [name, convId, convType, otherUserId]); // eslint-disable-line

  // Load messages
  useEffect(() => {
    (async () => {
      try {
        store.setActive(convId, isDirect ? 'direct' : 'group');
        const data = isDirect
          ? await api.getMsgs(convId)
          : await api.getGroupMsgs(convId);
        const msgs = data.messages ?? data;
        store.setMessages(convId, msgs);
        setHasMore(data.hasMore ?? false);
        if (msgs.length > 0) setBefore(msgs[0]?.sentAt);
        store.clearUnread(convId);
        if (isDirect) await api.markRead(convId);
      } catch {} finally { setLoading(false); }
    })();
  }, [convId]); // eslint-disable-line

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 && !loadingMore) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages.length]); // eslint-disable-line

  // Scroll to specific message (from SearchMessages)
  useEffect(() => {
    if (!scrollToMsgId || messages.length === 0) return;
    const idx = messages.findIndex(m => m.id === scrollToMsgId);
    if (idx >= 0) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.4 });
      }, 200);
    }
  }, [scrollToMsgId, messages.length]); // eslint-disable-line

  // Load more (scroll up)
  async function loadMore() {
    if (!hasMore || loadingMore || !beforeCursor) return;
    setLoadingMore(true);
    try {
      const data = isDirect
        ? await api.getMsgs(convId, beforeCursor)
        : await api.getGroupMsgs(convId, beforeCursor);
      const older = data.messages ?? data;
      if (older.length > 0) {
        store.setMessages(convId, [...older, ...messages]);
        setBefore(older[0]?.sentAt);
        setHasMore(data.hasMore ?? false);
      }
    } catch {} finally { setLoadingMore(false); }
  }

  // Send text
  async function handleSend() {
    if (!text.trim()) return;
    const draft = text.trim();
    setText('');
    const tempId = `tmp-${Date.now()}`;
    store.appendMessage(convId, {
      id: tempId, sender: { id: user!.id, name: user!.name },
      type: 'text', content: draft, isEdited: false, isDeleted: false,
      reactions: {}, sentAt: new Date().toISOString(), pending: true,
      replyToId: replyTo?.id,
    });
    setReplyTo(null);
    try {
      const body = {
        content: draft, msgType: 'text',
        replyToId: replyTo?.id,
        autoDeleteAt: autoDelete ? new Date(Date.now() + autoDelete * 1000).toISOString() : undefined,
      };
      const sent = isDirect ? await api.sendMsg(convId, body) : await api.sendGroupMsg(convId, body);
      store.updateMessage(convId, tempId, { ...sent, id: sent.id, pending: false, receiptStatus: 'sent' });
    } catch {
      // LÆ°u vÃ o offline queue â sáº½ retry khi cÃ³ máº¡ng
      enqueue({ tempId, convId, convType, body, queuedAt: new Date().toISOString(), retries: 0 });
      // Message váº«n hiá»n nhÆ°ng vá»i icon pending (sáº½ tá»± gá»­i láº¡i)
    }
  }

  // Image
  async function handlePickImage() {
    const r = await launchImageLibrary({ mediaType: 'photo', quality: 0.85 });
    if (!r.assets?.[0]) return;
    const a = r.assets[0];
    const form = new FormData();
    form.append('file', { uri: a.uri, name: a.fileName ?? 'photo.jpg', type: a.type ?? 'image/jpeg' } as any);
    try {
      const u = await api.upload(form);
      const body = { content: a.fileName ?? 'photo.jpg', msgType: 'image', fileUrl: u.url, fileName: a.fileName, fileSize: a.fileSize };
      const msg  = isDirect ? await api.sendMsg(convId, body) : await api.sendGroupMsg(convId, body);
      store.appendMessage(convId, msg);
    } catch { Alert.alert('Lá»i', 'KhÃ´ng thá» gá»­i áº£nh.'); }
  }


  // Video clip
  async function handlePickVideo() {
    const r = await launchImageLibrary({ mediaType: 'video', videoQuality: 'medium' });
    if (!r.assets?.[0]) return;
    const a = r.assets[0];
    // Giá»i háº¡n 50MB
    if (a.fileSize && a.fileSize > 50 * 1024 * 1024) {
      Alert.alert('File quÃ¡ lá»n', 'Video tá»i Äa 50MB. Thá»­ nÃ©n video láº¡i nhÃ©.'); return;
    }
    const form = new FormData();
    form.append('file', { uri: a.uri, name: a.fileName ?? 'video.mp4', type: a.type ?? 'video/mp4' } as any);
    try {
      const u = await api.upload(form);
      const body = { content: a.fileName ?? 'video.mp4', msgType: 'video', fileUrl: u.url, fileName: a.fileName, fileSize: a.fileSize };
      const msg  = isDirect ? await api.sendMsg(convId, body) : await api.sendGroupMsg(convId, body);
      store.appendMessage(convId, msg);
    } catch { Alert.alert('Lá»i', 'KhÃ´ng thá» gá»­i video.'); }
  }

  // File
  async function handlePickFile() {
    try {
      const r = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.allFiles] });
      const form = new FormData();
      form.append('file', { uri: r.uri, name: r.name, type: r.type ?? 'application/octet-stream' } as any);
      const u = await api.upload(form);
      const body = { content: r.name, msgType: 'file', fileUrl: u.url, fileName: r.name, fileSize: r.size };
      const msg  = isDirect ? await api.sendMsg(convId, body) : await api.sendGroupMsg(convId, body);
      store.appendMessage(convId, msg);
    } catch {}
  }

  // Audio
  async function handleAudio(uri: string) {
    const form = new FormData();
    const name = `voice_${Date.now()}.mp4`;
    form.append('file', { uri, name, type: 'audio/mp4' } as any);
    try {
      const u = await api.upload(form);
      const body = { content: name, msgType: 'audio', fileUrl: u.url, fileName: name, fileSize: u.size };
      const msg  = isDirect ? await api.sendMsg(convId, body) : await api.sendGroupMsg(convId, body);
      store.appendMessage(convId, msg);
    } catch { Alert.alert('Lá»i', 'KhÃ´ng thá» gá»­i voice message.'); }
  }

  // Long press
  function handleLongPress(msg: CBMessage) {
    const isOut = msg.sender?.id === user?.id;
    const opts: any[] = [
      { text: 'â©ï¸ Tráº£ lá»i',      onPress: () => setReplyTo(msg) },
      { text: 'ð React',        onPress: () => setShowEmoji(msg.id) },
      { text: 'âï¸ Chuyá»n tiáº¿p', onPress: () => setForwardMsg(msg) },
    ];
    if (isOut) {
      opts.push({
        text: 'ð XÃ³a', style: 'destructive',
        onPress: async () => {
          await api.deleteMsg(msg.id);
          store.updateMessage(convId, msg.id, { isDeleted: true, content: null });
        },
      });
    }
    opts.push({ text: 'ÄÃ³ng', style: 'cancel' });
    Alert.alert('', undefined, opts);
  }

  // Typing
  function onTextChange(v: string) {
    setText(v);
    if (isDirect && otherUserId) {
      socketFns.sendTyping(otherUserId, convId);
      clearTimeout(typerRef.current);
      typerRef.current = setTimeout(() => socketFns.stopTyping(otherUserId), 2000);
    }
  }

  // Typing indicator â resolve username
  const typingNames = Object.entries(store.typingUsers)
    .filter(([, v]) => v)
    .map(([uid]) => {
      const conv = store.conversations.find(c => c.id === convId);
      if (conv?.otherUser.id === uid) return conv.otherUser.name;
      return null;
    })
    .filter(Boolean);

  return (
    <>
      {/* Call overlay */}
      {webrtc.callState !== 'idle' && webrtc.callState !== 'ended' && (
        <CallScreen
          callState={webrtc.callState} callType={webrtc.callType}
          callerName={name}
          localStream={webrtc.localStream} remoteStream={webrtc.remoteStream}
          isMuted={webrtc.isMuted} isCamOff={webrtc.isCamOff}
          onHangUp={webrtc.hangUp}
          onAnswer={() => incomingCall && webrtc.answerCall(incomingCall.sdp)}
          onReject={webrtc.rejectCall}
          toggleMute={webrtc.toggleMute}
          toggleCamera={webrtc.toggleCamera}
          flipCamera={webrtc.flipCamera}
        />
      )}

      <KeyboardAvoidingView
        style={cs.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        {loading ? (
          <View style={cs.center}><ActivityIndicator color={SAGE} size="large"/></View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={m => m.id}
            renderItem={({ item }) => (
              <Bubble
                msg={item}
                isOut={item.sender?.id === user?.id}
                onLongPress={handleLongPress}
                myId={user?.id}
              />
            )}
            contentContainerStyle={{ paddingVertical: 12, flexGrow: 1 }}
            onContentSizeChange={() => {
              if (!loadingMore) listRef.current?.scrollToEnd({ animated: false });
            }}
            // Pagination: scroll lÃªn Äáº§u â load more
            onScrollBeginDrag={() => {}}
            onEndReachedThreshold={0.1}
            ListHeaderComponent={
              hasMore ? (
                <TouchableOpacity onPress={loadMore} style={cs.loadMore}>
                  {loadingMore
                    ? <ActivityIndicator size="small" color={SAGE}/>
                    : <Text style={cs.loadMoreTxt}>Táº£i thÃªm tin nháº¯n cÅ© hÆ¡n</Text>
                  }
                </TouchableOpacity>
              ) : null
            }
            ListEmptyComponent={
              <View style={cs.center}>
                <Text style={{ color: colors.gray, fontSize: 15 }}>Báº¯t Äáº§u trÃ² chuyá»n ð</Text>
              </View>
            }
            scrollIndicatorInsets={{ right: 1 }}
          />
        )}

        {/* Typing indicator */}
        {typingNames.length > 0 && (
          <Text style={cs.typing}>{typingNames[0]} Äang nháº­p...</Text>
        )}

        {/* Emoji reaction picker */}
        {showEmoji && (
          <View style={cs.emojiRow}>
            {EMOJIS.map(e => (
              <TouchableOpacity key={e} onPress={async () => {
                await api.reactMsg(showEmoji, e);
                setShowEmoji(null);
              }} style={{ padding: 4 }}>
                <Text style={{ fontSize: 24 }}>{e}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowEmoji(null)} style={{ padding: 4 }}>
              <Icon name="close" size={18} color={colors.textSec}/>
            </TouchableOpacity>
          </View>
        )}

        {/* Reply bar */}
        {replyTo && (
          <View style={cs.replyBar}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: SAGE, fontWeight: '700' }}>â©ï¸ Tráº£ lá»i</Text>
              <Text style={{ fontSize: 12, color: colors.textSec }} numberOfLines={1}>
                {replyTo.content || 'ð File'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <Icon name="close" size={18} color={colors.textSec}/>
            </TouchableOpacity>
          </View>
        )}

        {/* Self-destruct timer indicator */}
        {autoDelete && (
          <View style={cs.timerBar}>
            <Icon name="timer" size={13} color={SAGE}/>
            <Text style={cs.timerTxt}>
              Tin nháº¯n tiáº¿p theo sáº½ tá»± há»§y sau{' '}
              {autoDelete < 3600
                ? `${autoDelete / 60} phÃºt`
                : autoDelete < 86400
                  ? `${autoDelete / 3600} giá»`
                  : `${autoDelete / 86400} ngÃ y`
              }
            </Text>
            <TouchableOpacity onPress={() => setAutoDelete(null)}>
              <Icon name="close-circle" size={14} color={colors.textSec}/>
            </TouchableOpacity>
          </View>
        )}

        {/* Input bar */}
        <View style={cs.inputBar}>
          <TouchableOpacity onPress={handlePickImage} style={cs.iconBtn}>
            <Icon name="image-outline" size={22} color={colors.textSec}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickVideo} style={cs.iconBtn}>
            <Icon name="videocam-outline" size={22} color={colors.textSec}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickFile} style={cs.iconBtn}>
            <Icon name="attach-outline" size={22} color={colors.textSec}/>
          </TouchableOpacity>
          <VoiceRecorder onAudioReady={handleAudio} disabled={!convId}/>
          <TouchableOpacity onPress={() => setShowDestruct(true)} style={cs.iconBtn}>
            <Icon name={autoDelete ? 'timer' : 'timer-outline'} size={22}
              color={autoDelete ? SAGE : colors.textSec}/>
          </TouchableOpacity>

          <TextInput
            style={cs.input}
            value={text}
            onChangeText={onTextChange}
            placeholder="Nháº¯n tin..."
            placeholderTextColor={colors.gray}
            multiline
            maxLength={4000}
          />

          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim()}
            style={[cs.sendBtn, !text.trim() && cs.sendOff]}
          >
            <Icon name="send" size={18} color={text.trim() ? '#fff' : colors.gray}/>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modals */}
      <SelfDestructPicker
        visible={showDestruct}
        current={autoDelete}
        onSelect={setAutoDelete}
        onClose={() => setShowDestruct(false)}
      />
      {forwardMsg && (
        <ForwardMessageModal
          visible={!!forwardMsg}
          message={forwardMsg}
          onClose={() => setForwardMsg(null)}
          onSent={() => setForwardMsg(null)}
        />
      )}
    </>
  );
}

const cs = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.bg },
  center:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadMore:     { padding: 14, alignItems: 'center' },
  loadMoreTxt:  { color: colors.textSec, fontSize: 13 },
  typing:       { paddingHorizontal: spacing.lg, paddingVertical: 4, fontSize: 12, color: colors.gray, fontStyle: 'italic' },
  emojiRow:     { flexDirection: 'row', backgroundColor: colors.bgSurface, paddingHorizontal: 12, paddingVertical: 8, gap: 6, borderTopWidth: 1, borderTopColor: colors.border, flexWrap: 'wrap' },
  replyBar:     { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgSurface, paddingHorizontal: spacing.lg, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border, gap: 10 },
  timerBar:     { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.lg, paddingVertical: 5, backgroundColor: 'rgba(74,124,89,0.06)', borderTopWidth: 1, borderTopColor: 'rgba(74,124,89,0.15)' },
  timerTxt:     { flex: 1, fontSize: 11, color: SAGE, fontWeight: '600' },
  inputBar:     { flexDirection: 'row', alignItems: 'flex-end', padding: 10, gap: 6, backgroundColor: colors.bgWarm, borderTopWidth: 1, borderTopColor: colors.borderLight },
  iconBtn:      { padding: 7, alignItems: 'center', justifyContent: 'center' },
  input:        { flex: 1, backgroundColor: colors.bgSurface, color: colors.text, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, maxHeight: 120, borderWidth: 1, borderColor: colors.border },
  sendBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: SAGE, alignItems: 'center', justifyContent: 'center' },
  sendOff:      { backgroundColor: colors.bgSurface },
});
