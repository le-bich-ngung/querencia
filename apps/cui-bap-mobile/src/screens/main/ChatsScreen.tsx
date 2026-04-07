ï»¿import { updateAppBadge } from '../../lib/badge';
import { ConvOptionsModal } from '../../components/chat/ConvOptionsModal';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation';
import { ConvOptionsModal } from '../../components/chat/ConvOptionsModal';
import { useChatStore } from '../../store/chat.store';
import { api } from '../../lib/api';
import { useSocket } from '../../hooks/useSocket';
import { colors, spacing, radius } from '../../theme';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

type Props = NativeStackScreenProps<RootStackParams, 'Main'>;

function Avatar({ name, size=46, bg=colors.sage }: {name:string;size?:number;bg?:string}) {
  return (
    <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:bg,alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <Text style={{color:'#fff',fontWeight:'800',fontSize:size*0.38}}>{name?.[0]?.toUpperCase()}</Text>
    </View>
  );
}

type Tab = 'chats'|'groups';

export function ChatsScreen({ navigation }: Props) {
  const [tab, setTab]           = useState<Tab>('chats');
  const [search, setSearch]     = useState('');
  const [refreshing, setRef]    = useState(false);
  const [selectedConv, setSelected] = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const { conversations, groups, connected, setConversations, setGroups } = useChatStore();
  useSocket();

  const load = useCallback(async () => {
    try {
      const [c, g] = await Promise.all([api.getConvs(), api.getGroups()]);
      setConversations(c); setGroups(g);
      const totalUnread = c.reduce((sum: number, cv: any) => sum + (cv.unreadCount ?? 0), 0);
      updateAppBadge(totalUnread);
    } catch {} finally { setLoading(false); setRef(false); }
  }, [setConversations, setGroups]);

  useEffect(() => { load(); }, [load]);

  const filtered = tab==='chats'
    ? conversations.filter(c=>c.otherUser.name?.toLowerCase().includes(search.toLowerCase()))
    : groups.filter(g=>g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>ð½ CÃ¹i Báº¯p</Text>
        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
          <View style={{width:8,height:8,borderRadius:4,backgroundColor:connected?colors.online:colors.error}}/>
          <TouchableOpacity onPress={()=>navigation.navigate('NewChat')} style={s.newBtn}>
            <Text style={{fontSize:20}}>âï¸</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={s.searchWrap}>
        <TextInput style={s.search} value={search} onChangeText={setSearch}
          placeholder="TÃ¬m kiáº¿m..." placeholderTextColor={colors.gray}/>
      </View>
      <View style={s.tabs}>
        {(['chats','groups'] as Tab[]).map(t=>(
          <TouchableOpacity key={t} onPress={()=>setTab(t)} style={[s.tab, tab===t&&s.tabOn]}>
            <Text style={[s.tabTxt, tab===t&&s.tabTxtOn]}>{t==='chats'?'ð¬ Chat':'ð¥ NhÃ³m'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <View style={s.center}><ActivityIndicator color={colors.sage} size="large"/></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i=>i.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRef(true);load();}} tintColor={colors.sage}/>}
          renderItem={({item:c})=>(
            <TouchableOpacity style={s.item} onPress={()=>navigation.navigate('Chat',{
              convId: c.id,
              convType: tab==='chats'?'direct':'group',
              name: tab==='chats'?(c as any).otherUser?.name??'' : (c as any).name??'',
              otherUserId: tab==='chats'?(c as any).otherUser?.id : undefined,
            })}>
              <View style={{position:'relative'}}>
                <Avatar name={tab==='chats'?(c as any).otherUser?.name??'?':(c as any).name??'?'}
                  bg={tab==='groups'?'#7c5cbf':colors.sage}/>
                {tab==='chats' && (c as any).isOnline && (
                  <View style={s.onlineDot}/>
                )}
              </View>
              <View style={s.itemInfo}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text style={s.name} numberOfLines={1}>
                    {tab==='chats'?(c as any).otherUser?.name:(c as any).name}
                  </Text>
                  {(c as any).lastMessageAt && (
                    <Text style={s.time}>
                      {formatDistanceToNow(new Date((c as any).lastMessageAt),{locale:vi})}
                    </Text>
                  )}
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text style={s.preview} numberOfLines={1}>
                    {(c as any).lastMessage?.content || (tab==='groups'?`${(c as any).memberCount} thÃ nh viÃªn`:'Báº¯t Äáº§u trÃ² chuyá»n')}
                  </Text>
                  {(c as any).unreadCount > 0 && (
                    <View style={s.badge}><Text style={s.badgeTxt}>{(c as any).unreadCount}</Text></View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={{fontSize:48,marginBottom:12}}>{tab==='chats'?'ð¬':'ð¥'}</Text>
              <Text style={{color:colors.gray,textAlign:'center',fontSize:15}}>
                {tab==='chats'?'ChÆ°a cÃ³ cuá»c trÃ² chuyá»n\nBáº¥m âï¸ Äá» nháº¯n tin má»i':'ChÆ°a cÃ³ nhÃ³m nÃ o'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.bg},
  header:   {flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:spacing.lg,paddingTop:spacing.sm},
  title:    {fontSize:22,fontWeight:'800',color:colors.text},
  newBtn:   {padding:8,backgroundColor:colors.bgSurface,borderRadius:radius.sm},
  searchWrap:{paddingHorizontal:spacing.lg,marginBottom:8},
  search:   {backgroundColor:colors.bgSurface,color:colors.text,borderRadius:radius.md,paddingHorizontal:14,paddingVertical:10,fontSize:15,borderWidth:1,borderColor:colors.border},
  tabs:     {flexDirection:'row',paddingHorizontal:spacing.lg,gap:8,marginBottom:8},
  tab:      {flex:1,padding:9,borderRadius:radius.sm,backgroundColor:colors.bgSurface,alignItems:'center'},
  tabOn:    {backgroundColor:colors.sage},
  tabTxt:   {color:colors.gray,fontWeight:'600',fontSize:13},
  tabTxtOn: {color:'#fff'},
  item:     {flexDirection:'row',padding:14,paddingHorizontal:spacing.lg,gap:12,borderBottomWidth:1,borderBottomColor:colors.borderLight},
  onlineDot:{position:'absolute',bottom:0,right:0,width:12,height:12,borderRadius:6,backgroundColor:colors.online,borderWidth:2,borderColor:colors.bg},
  itemInfo: {flex:1,justifyContent:'center',gap:3},
  name:     {fontSize:15,fontWeight:'700',color:colors.text,flex:1},
  time:     {fontSize:11,color:colors.gray,marginLeft:8},
  preview:  {fontSize:13,color:colors.gray,flex:1},
  badge:    {backgroundColor:colors.sage,borderRadius:10,paddingHorizontal:6,paddingVertical:2,marginLeft:6},
  badgeTxt: {color:'#fff',fontSize:11,fontWeight:'700'},
  center:   {flex:1,alignItems:'center',justifyContent:'center',paddingTop:60},
  empty:    {flex:1,alignItems:'center',justifyContent:'center',paddingTop:80},
});
