import React, { useState } from 'react';
import {
  TouchableOpacity, Text, View, StyleSheet,
  ActivityIndicator, Alert, Platform,
} from 'react-native';
import { signInWithApple, isAppleAuthAvailable } from '../../lib/apple-auth';
import { useAuthStore } from '../../store/auth.store';
import { setupE2EE } from '../../lib/e2ee-messaging';
import { colors, radius } from '../../theme';

export function AppleSignInButton() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(s => s.setAuth);

  // Chỉ hiện trên iOS
  if (!isAppleAuthAvailable()) return null;

  async function handle() {
    setLoading(true);
    try {
      const { user, accessToken, refreshToken } = await signInWithApple();
      setAuth(user, accessToken, refreshToken);
      setupE2EE().catch(() => {});
    } catch (e: any) {
      if (e.code !== '1001') { // 1001 = user cancelled
        Alert.alert('Sign-in error', e.message ?? 'Could not sign in with Apple.');
      }
    } finally { setLoading(false); }
  }

  return (
    <TouchableOpacity style={s.btn} onPress={handle} disabled={loading} activeOpacity={0.85}>
      {loading ? (
        <ActivityIndicator color="#000" size="small"/>
      ) : (
        <>
          <Text style={s.appleIcon}></Text>
          <Text style={s.label}>Continue with Apple</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, padding: 14, borderRadius: radius.md,
    backgroundColor: '#fff',
  },
  appleIcon: { fontSize: 18, color: '#000', marginTop: -2 },
  label:     { color: '#000', fontWeight: '700', fontSize: 15 },
});
