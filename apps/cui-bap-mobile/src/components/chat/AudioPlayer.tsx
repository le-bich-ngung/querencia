/**
 * AudioPlayer - inline audio player cho voice messages
 * Play/pause + progress bar + duration
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';

const player = new AudioRecorderPlayer();

interface Props {
  url:       string;
  duration?: number; // ms
  isOut:     boolean;
}

export function AudioPlayer({ url, duration, isOut }: Props) {
  const [playing,   setPlaying]   = useState(false);
  const [position,  setPosition]  = useState(0);   // ms
  const [totalDur,  setTotalDur]  = useState(duration ?? 0); // ms
  const playingUrl  = useRef<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playingUrl.current) {
        player.stopPlayer().catch(() => {});
        player.removePlayBackListener();
      }
    };
  }, []);

  async function handleToggle() {
    if (playing) {
      await player.pausePlayer();
      setPlaying(false);
      return;
    }

    if (playingUrl.current !== url) {
      // Stop previous if different url
      if (playingUrl.current) {
        await player.stopPlayer();
        player.removePlayBackListener();
      }
      playingUrl.current = url;
      await player.startPlayer(url);

      player.addPlayBackListener(e => {
        setPosition(e.currentPosition);
        setTotalDur(e.duration);
        if (e.currentPosition >= e.duration) {
          setPlaying(false);
          setPosition(0);
          player.stopPlayer().catch(() => {});
          player.removePlayBackListener();
          playingUrl.current = null;
        }
      });
    } else {
      await player.resumePlayer();
    }
    setPlaying(true);
  }

  function fmtTime(ms: number) {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  }

  const progress = totalDur > 0 ? position / totalDur : 0;
  const textColor = isOut ? '#fff' : colors.text;
  const trackColor = isOut ? 'rgba(255,255,255,0.3)' : colors.border;
  const fillColor  = isOut ? '#fff' : colors.sage;

  return (
    <View style={[s.container, { minWidth: 180 }]}>
      {/* Play/Pause button */}
      <TouchableOpacity onPress={handleToggle} style={s.btn}>
        <Icon
          name={playing ? 'pause-circle' : 'play-circle'}
          size={32}
          color={isOut ? '#fff' : colors.sage}
        />
      </TouchableOpacity>

      {/* Waveform + progress */}
      <View style={{ flex: 1, gap: 4 }}>
        {/* Progress track */}
        <View style={[s.track, { backgroundColor: trackColor }]}>
          <View style={[s.fill, { width: `${progress * 100}%` as any, backgroundColor: fillColor }]}/>
        </View>
        {/* Duration */}
        <Text style={[s.time, { color: textColor }]}>
          {playing || position > 0 ? fmtTime(position) : fmtTime(totalDur)}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  btn:       { flexShrink: 0 },
  track:     { height: 3, borderRadius: 2, overflow: 'hidden' },
  fill:      { height: '100%', borderRadius: 2 },
  time:      { fontSize: 10, opacity: 0.7 },
});
