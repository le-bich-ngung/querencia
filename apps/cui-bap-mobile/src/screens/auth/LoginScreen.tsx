import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../../navigation';
import { useAuthStore } from '../../store/auth.store';
import { api } from '../../lib/api';
import { setupE2EE } from '../../lib/e2ee-messaging';
import { GoogleSignInButton }  from '../../components/common/GoogleSignInButton';
import { AppleSignInButton }   from '../../components/common/AppleSignInButton';
import { colors, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const setAuth = useAuthStore(s => s.setAuth);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Vui lòng điền đầy đủ thông tin.'); return;
    }
    setLoading(true);
    try {
      const d = await api.login(email.toLowerCase().trim(), password);
      setAuth(d.user, d.access_token, d.refresh_token);
      setupE2EE().catch(() => {});
    } catch (e: any) {
      Alert.alert('Đăng nhập thất bại', e.message ?? 'Email hoặc mật khẩu không đúng.');
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={s.wrap} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.inner} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>🌽</Text>
        <Text style={s.title}>Cùi Bắp</Text>
        <Text style={s.sub}>Nhắn tin riêng tư · Không quảng cáo</Text>

        {/* Social sign-in - Apple trên iOS, Google trên mọi nền tảng */}
        <View style={s.socialBtns}>
          {/* Apple hiện trước trên iOS (App Store requirement) */}
          <AppleSignInButton/>
          <GoogleSignInButton/>
        </View>

        {/* Divider */}
        <View style={s.divider}>
          <View style={s.divLine}/>
          <Text style={s.divText}>hoặc đăng nhập bằng email</Text>
          <View style={s.divLine}/>
        </View>

        {/* Email form */}
        <Text style={s.label}>Email</Text>
        <TextInput
          style={s.input} value={email} onChangeText={setEmail}
          placeholder="ban@email.com" placeholderTextColor={colors.gray}
          keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
        />

        <Text style={s.label}>Mật khẩu</Text>
        <TextInput
          style={s.input} value={password} onChangeText={setPassword}
          placeholder="••••••••" placeholderTextColor={colors.gray}
          secureTextEntry returnKeyType="done" onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={[s.btn, loading && s.btnOff]}
          onPress={handleLogin} disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff"/>
            : <Text style={s.btnTxt}>Đăng nhập</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={s.switchBtn}>
          <Text style={s.switchTxt}>
            Chưa có tài khoản?{' '}
            <Text style={s.link}>Đăng ký miễn phí</Text>
          </Text>
        </TouchableOpacity>

        {/* Trust indicators */}
        <View style={s.trustRow}>
          <Text style={s.trustText}>🔒 E2EE</Text>
          <Text style={s.trustDot}>·</Text>
          <Text style={s.trustText}>🚫 Không quảng cáo</Text>
          <Text style={s.trustDot}>·</Text>
          <Text style={s.trustText}>🌿 Querencia</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap:       { flex: 1, backgroundColor: colors.bg },
  inner:      { flexGrow: 1, padding: spacing.xxl, justifyContent: 'center' },
  logo:       { fontSize: 56, textAlign: 'center', marginBottom: 6 },
  title:      { fontSize: 30, fontWeight: '800', color: colors.text, textAlign: 'center', letterSpacing: -0.5 },
  sub:        { fontSize: 14, color: colors.gray, textAlign: 'center', marginBottom: 28, marginTop: 4 },
  socialBtns: { gap: 10, marginBottom: 4 },
  divider:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  divLine:    { flex: 1, height: 1, backgroundColor: colors.border },
  divText:    { color: colors.gray, fontSize: 12, flexShrink: 0 },
  label:      { fontSize: 13, fontWeight: '600', color: colors.textSec, marginBottom: 6 },
  input: {
    backgroundColor: colors.bgSurface, color: colors.text,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: 14, fontSize: 15, marginBottom: 14,
  },
  btn:        { backgroundColor: colors.sage, borderRadius: radius.md, padding: 15, alignItems: 'center', marginTop: 8 },
  btnOff:     { opacity: 0.65 },
  btnTxt:     { color: '#fff', fontWeight: '700', fontSize: 16 },
  switchBtn:  { alignItems: 'center', marginTop: 20, padding: 8 },
  switchTxt:  { color: colors.gray, fontSize: 14 },
  link:       { color: colors.sage, fontWeight: '700' },
  trustRow:   { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 24 },
  trustText:  { color: colors.grayLight, fontSize: 11 },
  trustDot:   { color: colors.grayLight, fontSize: 11 },
});
