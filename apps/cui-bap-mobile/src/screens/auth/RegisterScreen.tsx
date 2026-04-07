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
    if (!name.trim()||!email.trim()||!pw) { Alert.alert('Vui lòng điền đầy đủ.'); return; }
    if (pw.length < 8) { Alert.alert('Mật khẩu cần ít nhất 8 ký tự.'); return; }
    setLoading(true);
    try {
      await api.register(name.trim(), email.toLowerCase().trim(), pw);
      Alert.alert('Kiểm tra email', 'Xác nhận email trước khi đăng nhập.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) { Alert.alert('Đăng ký thất bại', e.message); }
    finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={s.wrap} behavior={Platform.OS==='ios'?'padding':'height'}>
      <ScrollView contentContainerStyle={s.inner} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>🌽</Text>
        <Text style={s.title}>Tạo tài khoản</Text>
        <Text style={s.sub}>Miễn phí mãi mãi</Text>
        {[
          { label:'Họ và tên', v:name, set:setName, ph:'Nguyễn Văn A', kbType:undefined as any, secure:false, cap:'words' as any },
          { label:'Email', v:email, set:setEmail, ph:'ban@email.com', kbType:'email-address' as any, secure:false, cap:'none' as any },
          { label:'Mật khẩu', v:pw, set:setPw, ph:'Ít nhất 8 ký tự', kbType:undefined as any, secure:true, cap:'none' as any },
        ].map(f => (
          <View key={f.label}>
            <Text style={s.label}>{f.label}</Text>
            <TextInput style={s.input} value={f.v} onChangeText={f.set} placeholder={f.ph}
              placeholderTextColor={colors.gray} keyboardType={f.kbType} secureTextEntry={f.secure} autoCapitalize={f.cap}/>
          </View>
        ))}
        <TouchableOpacity style={[s.btn, loading&&s.btnOff]} onPress={handle} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff"/> : <Text style={s.btnTxt}>Đăng ký</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={s.back}>
          <Text style={s.backTxt}>← Đã có tài khoản? <Text style={s.link}>Đăng nhập</Text></Text>
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
