import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '../../store/auth.store';
import { api } from '../../lib/api';
import { colors, spacing, radius } from '../../theme';

type Props = NativeStackScreenProps<RootStackParams, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { user, updateUser } = useAuthStore();
  const [name,       setName]      = useState(user?.name ?? '');
  const [avatarUri,  setAvatarUri] = useState<string | null>(user?.avatarUrl ?? null);
  const [uploading,  setUploading] = useState(false);
  const [saving,     setSaving]    = useState(false);
  const [newAvatar,  setNewAvatar] = useState<{ uri: string; type: string; name: string } | null>(null);

  async function handlePickAvatar() {
    const result = await launchImageLibrary({
      mediaType:   'photo',
      quality:     0.85,
      maxWidth:    400,
      maxHeight:   400,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setAvatarUri(asset.uri!);
    setNewAvatar({ uri: asset.uri!, type: asset.type ?? 'image/jpeg', name: asset.fileName ?? 'avatar.jpg' });
  }

  async function handleSave() {
    if (!name.trim()) { Alert.alert('Name cannot be empty'); return; }
    setSaving(true);
    try {
      let avatarUrl = user?.avatarUrl;

      // Upload avatar if a new image was picked
      if (newAvatar) {
        setUploading(true);
        const form = new FormData();
        form.append('file', newAvatar as any);
        const uploaded = await api.upload(form);
        avatarUrl = uploaded.url;
        setUploading(false);
      }

      // Update profile
      const updated = await api.updateProfile({ name: name.trim(), avatarUrl });
      updateUser({ name: updated.name, avatarUrl: updated.avatarUrl });

      Alert.alert('Saved', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not update your profile.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  const hasChanges = name !== user?.name || !!newAvatar;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

        {/* Avatar */}
        <View style={s.avatarSection}>
          <TouchableOpacity onPress={handlePickAvatar} style={s.avatarWrap} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={s.avatarImg}/>
            ) : (
              <View style={s.avatarPlaceholder}>
                <Text style={s.avatarInitial}>{(name || user?.name || '?')[0].toUpperCase()}</Text>
              </View>
            )}
            {/* Overlay camera icon */}
            <View style={s.cameraOverlay}>
              <Icon name="camera" size={16} color="#fff"/>
            </View>
          </TouchableOpacity>
          <Text style={s.avatarHint}>Tap to change your photo</Text>
        </View>

        {/* Name */}
        <Text style={s.label}>Display name</Text>
        <TextInput
          style={s.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.gray}
          autoCapitalize="words"
          maxLength={50}
          autoFocus
        />
        <Text style={s.charCount}>{name.length}/50</Text>

        {/* Email (readonly) */}
        <Text style={s.label}>Email</Text>
        <View style={[s.input, s.inputReadonly]}>
          <Text style={s.readonlyText}>{user?.email}</Text>
        </View>
        <Text style={s.readonlyHint}>Email cannot be changed</Text>

        {/* Save button */}
        <TouchableOpacity
          style={[s.saveBtn, (!hasChanges || saving) && s.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <ActivityIndicator color="#fff" size="small"/>
              <Text style={s.saveBtnText}>{uploading ? 'Uploading photo...' : 'Saving...'}</Text>
            </View>
          ) : (
            <Text style={s.saveBtnText}>Save changes</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:        { flexGrow: 1, padding: spacing.xl },
  avatarSection:    { alignItems: 'center', marginBottom: 32, marginTop: 8 },
  avatarWrap:       { position: 'relative' },
  avatarImg:        { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.bgSurface },
  avatarPlaceholder:{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  avatarInitial:    { color: '#fff', fontSize: 38, fontWeight: '800' },
  cameraOverlay:    { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg },
  avatarHint:       { color: colors.textSec, fontSize: 12, marginTop: 10 },
  label:            { fontSize: 13, fontWeight: '600', color: colors.textSec, marginBottom: 6 },
  input:            { backgroundColor: colors.bgSurface, color: colors.text, borderRadius: radius.md, padding: 14, fontSize: 15, borderWidth: 1.5, borderColor: colors.border, marginBottom: 4 },
  inputReadonly:    { opacity: 0.6 },
  readonlyText:     { color: colors.textSec, fontSize: 15 },
  charCount:        { fontSize: 11, color: colors.gray, textAlign: 'right', marginBottom: 20 },
  readonlyHint:     { fontSize: 11, color: colors.gray, marginBottom: 28 },
  saveBtn:          { backgroundColor: colors.sage, borderRadius: radius.md, padding: 15, alignItems: 'center', marginTop: 8 },
  saveBtnDisabled:  { opacity: 0.45 },
  saveBtnText:      { color: '#fff', fontWeight: '700', fontSize: 16 },
});
