import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../../navigation';
import { api } from '../../lib/api';
import { colors, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParams, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [pw, setPw]         = useState('');
  const [loading, setLoading] = useState(false);

  async function handle() {
    if (!name.trim()||!email.trim()||!pw) { Alert.alert('Please fill in all fields.'); return; }
    if (pw.length < 8) { Alert.alert('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await api.register(name.trim(), email.toLowerCase().trim(), pw);
      Alert.alert('Check your email', 'Confirm your email before signing in.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) { Alert.alert('Registration failed', e.message); }
    finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={s.wrap} behavior={Platform.OS==='ios'?'padding':'height'}>
      <ScrollView contentContainerStyle={s.inner} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>🌽</Text>
        <Text style={s.title}>Create account</Text>
        <Text style={s.sub}>Free forever</Text>
        {[
          { label:'Full name', v:name, set:setName, ph:'John Smith', kbType:undefined as any, secure:false, cap:'words' as any },
          { label:'Email', v:email, set:setEmail, ph:'you@email.com', kbType:'email-address' as any, secure:false, cap:'none' as any },
          { label:'Password', v:pw, set:setPw, ph:'At least 8 characters', kbType:undefined as any, secure:true, cap:'none' as any },
        ].map(f => (
          <View key={f.label}>
            <Text style={s.label}>{f.label}</Text>
            <TextInput style={s.input} value={f.v} onChangeText={f.set} placeholder={f.ph}
              placeholderTextColor={colors.gray} keyboardType={f.kbType} secureTextEntry={f.secure} autoCapitalize={f.cap}/>
          </View>
        ))}
        <TouchableOpacity style={[s.btn, loading&&s.btnOff]} onPress={handle} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff"/> : <Text style={s.btnTxt}>Sign up</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={s.back}>
          <Text style={s.backTxt}>← Already have an account? <Text style={s.link}>Sign in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap:   {flex:1,backgroundColor:colors.bg},
  inner:  {flexGrow:1,padding:spacing.xxl,paddingTop:60},
  logo:   {fontSize:44,textAlign:'center',marginBottom:6},
  title:  {fontSize:26,fontWeight:'800',color:colors.text,textAlign:'center'},
  sub:    {fontSize:13,color:colors.gray,textAlign:'center',marginBottom:32,marginTop:4},
  label:  {fontSize:13,fontWeight:'600',color:colors.textSec,marginBottom:6},
  input:  {backgroundColor:colors.bgSurface,color:colors.text,borderWidth:1.5,borderColor:colors.border,borderRadius:radius.md,padding:14,fontSize:15,marginBottom:14},
  btn:    {backgroundColor:colors.sage,borderRadius:radius.md,padding:15,alignItems:'center',marginTop:8},
  btnOff: {opacity:0.6},
  btnTxt: {color:'#fff',fontWeight:'700',fontSize:16},
  back:   {alignItems:'center',marginTop:20},
  backTxt:{color:colors.gray,fontSize:14},
  link:   {color:colors.sage,fontWeight:'700'},
});
