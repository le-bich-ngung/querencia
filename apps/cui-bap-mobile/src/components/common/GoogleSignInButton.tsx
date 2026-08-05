import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { signInWithGoogle } from '../../lib/google-auth';
import { useAuthStore } from '../../store/auth.store';
import { setupE2EE } from '../../lib/e2ee-messaging';
import { colors, radius } from '../../theme';

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(s => s.setAuth);

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      const { user, accessToken, refreshToken } = await signInWithGoogle();
      setAuth(user, accessToken, refreshToken);
      // Set up E2EE keys if this is a new user
      setupE2EE().catch(() => {}); // background
    } catch (error: any) {
      if (error.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('Sign-in error', error.message ?? 'Could not sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      style={s.btn}
      onPress={handleGoogleSignIn}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small"/>
      ) : (
        <>
          {/* Google G logo */}
          <View style={s.gLogo}>
            <Text style={s.gText}>G</Text>
          </View>
          <Text style={s.label}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, padding: 14, borderRadius: radius.md,
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5, borderColor: colors.border,
  },
  gLogo: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  gText:  { color: '#4285F4', fontWeight: '800', fontSize: 13 },
  label:  { color: colors.text, fontWeight: '600', fontSize: 15 },
});
