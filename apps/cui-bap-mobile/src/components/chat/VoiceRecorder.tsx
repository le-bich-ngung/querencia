/**
 * VoiceRecorder - nút giữ để ghi âm, thả để gửi
 * Dùng: react-native-audio-recorder-player
 */
import React, { useState, useRef } from 'react';
import {
  TouchableOpacity, StyleSheet, Animated,
  Alert, Platform, View, Text,
} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';

const recorder = new AudioRecorderPlayer();

interface Props {
  onAudioReady: (uri: string, durationMs: number) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onAudioReady, disabled }: Props) {
  const [recording,   setRecording]   = useState(false);
  const [duration,    setDuration]    = useState(0);
  const scaleAnim    = useRef(new Animated.Value(1)).current;
  const timerRef     = useRef<ReturnType<typeof setInterval>>();

  async function checkMicPermission(): Promise<boolean> {
    const perm = Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;
    const status = await check(perm);
    if (status === RESULTS.GRANTED) return true;
    const result = await request(perm);
    return result === RESULTS.GRANTED;
  }

  async function startRecording() {
    if (disabled) return;
    const hasPermission = await checkMicPermission();
    if (!hasPermission) {
      Alert.alert('Cần quyền microphone', 'Vui lòng cho phép trong Cài đặt.');
      return;
    }

    try {
      const path = Platform.select({
        ios:     `voice_${Date.now()}.m4a`,
        android: `${Date.now()}.mp4`,
      })!;

      await recorder.startRecorder(path, {
        AndroidEncoderType:  AudioEncoderAndroidType.AAC,
        AndroidAudioSource:  AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS:    AVEncodingOption.aac,
      });

      setRecording(true);
      setDuration(0);

      // Animate pulse
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1,   duration: 500, useNativeDriver: true }),
        ])
      );
      pulse.start();

      // Timer
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);

    } catch (e) {
      console.error('Start recording error:', e);
    }
  }

  async function stopRecording(send = true) {
    if (!recording) return;
    clearInterval(timerRef.current);
    scaleAnim.stopAnimation();
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    try {
      const result = await recorder.stopRecorder();
      setRecording(false);
      setDuration(0);

      if (send && result && duration >= 1) {
        onAudioReady(result, duration * 1000);
      }
    } catch (e) {
      console.error('Stop recording error:', e);
      setRecording(false);
    }
  }

  function formatDuration(s: number) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  }

  return (
    <View style={s.container}>
      {recording && (
        <View style={s.recordingBar}>
          <View style={s.recordDot}/>
          <Text style={s.recordTime}>{formatDuration(duration)}</Text>
          <Text style={s.recordHint}>Thả để gửi · Vuốt để hủy</Text>
        </View>
      )}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPressIn={startRecording}
          onPressOut={() => stopRecording(true)}
          onLongPress={() => {}} // prevent default long press
          delayLongPress={100000}
          disabled={disabled}
          style={[
            s.btn,
            recording && s.btnActive,
            disabled && s.btnDisabled,
          ]}
          activeOpacity={0.85}
        >
          <Icon
            name={recording ? 'radio-button-on' : 'mic'}
            size={20}
            color={recording ? '#fff' : colors.textSec}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { alignItems: 'center' },
  recordingBar: {
    position: 'absolute', bottom: 50, left: -120, right: -120,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.bgSurface, borderRadius: 20,
    padding: '8px 14px' as any, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  recordDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  recordTime: { color: colors.text, fontWeight: '700', fontSize: 14 },
  recordHint: { color: colors.textSec, fontSize: 11 },
  btn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.bgSurface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  btnActive:   { backgroundColor: colors.error, borderColor: colors.error },
  btnDisabled: { opacity: 0.4 },
});
