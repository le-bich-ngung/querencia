ï»¿import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation';
import { api } from '../../lib/api';
import { useChatStore } from '../../store/chat.store';
import { colors, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<RootStackParams, 'NewChat'>;
type Mode = 'direct'|'group';

export function NewChatScreen({ navigation }: Props) {
  const [mode, setMode]     = useState<Mode>('direct');
  const [email, setEmail]   = useState('');
  const [name, setName]     = useState('');
  const [desc, setDesc]     = useState('');
  const [loading, setLoading] = useState(false);
  const { setConversations, setGroups } = useChatStore();

  async function handle() {
    if (mode==='direct'&&!email.trim()) { Alert.alert('Nháº­p email ngÆ°á»i nháº­n'); return; }
    if (mode==='group'&&!name.trim())   { Alert.alert('Nháº­p tÃªn nhÃ³m'); return; }
    setLoading(true);
    try {
      if (mode==='direct') {
        const d = await api.createConv(email.trim());
        const convs = await api.getConvs();
        setConversations(convs);
        navigation.replace('Chat',{convId:d.id, convType:'direct', name:email.trim()});
      } else {
        const d = await api.createGroup(name.trim(), desc.trim());
        const grps = await api.getGroups();
        setGroups(grps);
        navigation.replace('Chat',{convId:d.id, convType:'group', name:name.trim()});
      }
    } catch (e:any) { Alert.alert('Lá»i',e.message); }
    finally { setLoading(false); }
  }

  return (
    <View style={s.container}>
      <View style={s.tabs}>
        {(['direct','group'] as Mode[]).map(m=>(
          <TouchableOpacity key={m} onPress={()=>setMode(m)} style={[s.tab, mode===m&&s.tabOn]}>
            <Text style={[s.tabTxt, mode===m&&s.tabTxtOn]}>{m==='direct'?'ð¬ Chat 1-1':'ð¥ NhÃ³m má»i'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {mode==='direct' ? (
        <>
          <Text style={s.label}>Email ngÆ°á»i nháº­n</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail}
            placeholder="ban@email.com" placeholderTextColor={colors.gray}
            keyboardType="email-address" autoCapitalize="none" autoFocus/>
        </>
      ) : (
        <>
          <Text style={s.label}>TÃªn nhÃ³m *</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder="NhÃ³m cá»§a mÃ¬nh" placeholderTextColor={colors.gray} autoFocus/>
          <Text style={s.label}>MÃ´ táº£</Text>
          <TextInput style={s.input} value={desc} onChangeText={setDesc} placeholder="TÃ¹y chá»n" placeholderTextColor={colors.gray}/>
        </>
      )}
      <TouchableOpacity style={[s.btn, loading&&s.btnOff]} onPress={handle} disabled={loading}>
        <Text style={s.btnTxt}>{loading?'Äang táº¡o...':(mode==='direct'?'Báº¯t Äáº§u chat':'Táº¡o nhÃ³m')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.bg,padding:spacing.xl,paddingTop:24},
  tabs:     {flexDirection:'row',gap:8,marginBottom:24},
  tab:      {flex:1,padding:12,borderRadius:radius.sm,backgroundColor:colors.bgSurface,alignItems:'center'},
  tabOn:    {backgroundColor:colors.sage},
  tabTxt:   {color:colors.gray,fontWeight:'600'},
  tabTxtOn: {color:'#fff'},
  label:    {color:colors.textSec,fontSize:13,fontWeight:'600',marginBottom:6},
  input:    {backgroundColor:colors.bgSurface,color:colors.text,borderRadius:radius.md,padding:14,fontSize:15,borderWidth:1,borderColor:colors.border,marginBottom:16},
  btn:      {backgroundColor:colors.sage,borderRadius:radius.md,padding:15,alignItems:'center',marginTop:8},
  btnOff:   {opacity:0.6},
  btnTxt:   {color:'#fff',fontWeight:'700',fontSize:16},
});
