import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation';
import { useAuthStore } from '../../store/auth.store';
import { colors, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<RootStackParams, 'Main'>;

export function SettingsScreen({ navigation }: Props) {
  const { user, logout } = useAuthStore();

  return (
    <View style={s.container}>
      <Text style={s.title}>Settings</Text>
      <TouchableOpacity style={s.card} onPress={() => (navigation as any).navigate('EditProfile')} activeOpacity={0.8}>
        <View style={s.avatar}><Text style={s.avatarTxt}>{user?.name?.[0]?.toUpperCase()}</Text></View>
        <View style={{flex:1}}>
          <Text style={s.name}>{user?.name}</Text>
          <Text style={s.email}>{user?.email}</Text>
          <Text style={s.plan}>{user?.plan==='pro'?'⭐ Pro':'Free'}</Text>
        </View>
      </TouchableOpacity>
      <Text style={s.editHint}>Tap to edit your profile</Text>
      {[
        {label:'🔔 Notifications',onPress:()=>{}},
        {label:'🎨 Appearance',onPress:()=>{}},
        {label:'🔒 Security',onPress:()=>{}},
        {label:'🌿 About Querencia',onPress:()=>{}},
      ].map(item=>(
        <TouchableOpacity key={item.label} style={s.row} onPress={item.onPress}>
          <Text style={s.rowTxt}>{item.label}</Text>
          <Text style={{color:colors.gray,fontSize:20}}>›</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={s.logout} onPress={()=>Alert.alert('Sign out?','',[ {text:'Cancel',style:'cancel'},{text:'Sign out',style:'destructive',onPress:()=>logout()} ])}>
        <Text style={s.logoutTxt}>🚪 Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.bg,padding:spacing.xl,paddingTop:60},
  title:    {fontSize:24,fontWeight:'800',color:colors.text,marginBottom:24},
  card:     {flexDirection:'row',gap:14,backgroundColor:colors.bgSurface,borderRadius:radius.lg,padding:spacing.lg,marginBottom:24,alignItems:'center'},
  avatar:   {width:52,height:52,borderRadius:26,backgroundColor:colors.sage,alignItems:'center',justifyContent:'center'},
  avatarTxt:{color:'#fff',fontSize:22,fontWeight:'800'},
  name:     {color:colors.text,fontSize:16,fontWeight:'700'},
  email:    {color:colors.textSec,fontSize:13,marginTop:2},
  plan:     {color:colors.sage,fontSize:12,fontWeight:'600',marginTop:4},
  row:      {flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:colors.borderLight},
  rowTxt:   {color:colors.text,fontSize:15},
  editHint: {color:colors.textSec,fontSize:11,textAlign:'center',marginTop:-16,marginBottom:20},
  logout:   {marginTop:32,backgroundColor:colors.bgSurface,borderRadius:radius.md,padding:15,alignItems:'center'},
  logoutTxt:{color:colors.error,fontWeight:'700',fontSize:15},
});
