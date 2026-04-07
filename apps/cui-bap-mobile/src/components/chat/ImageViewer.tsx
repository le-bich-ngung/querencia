/**
 * ImageViewer — full screen image viewer
 * Tap để mở, pinch to zoom, swipe down để đóng
 */
import React, { useState } from 'react';
import {
  Modal, View, Image, TouchableOpacity, StyleSheet,
  Dimensions, StatusBar, Share, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';

const { width: SW, height: SH } = Dimensions.get('window');

interface Props {
  uri:      string;
  fileName?: string;
  visible:  boolean;
  onClose:  () => void;
}

export function ImageViewer({ uri, fileName, visible, onClose }: Props) {
  async function handleShare() {
    try {
      await Share.share({
        url:     Platform.OS === 'ios' ? uri : undefined,
        message: Platform.OS === 'android' ? uri : undefined,
        title:   fileName ?? 'Hình ảnh từ Cùi Bắp',
      });
    } catch {}
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <StatusBar hidden/>

        {/* Top bar */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={onClose} style={s.iconBtn}>
            <Icon name="close" size={24} color="#fff"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={s.iconBtn}>
            <Icon name="share-outline" size={22} color="#fff"/>
          </TouchableOpacity>
        </View>

        {/* Image */}
        <TouchableOpacity
          style={s.imageWrap}
          onPress={onClose}
          activeOpacity={1}
        >
          <Image
            source={{ uri }}
            style={s.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Tap-to-view wrapper ───────────────────────────────────────
export function TappableImage({
  uri, fileName, style,
}: {
  uri: string; fileName?: string; style?: any;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.9}>
        <Image source={{ uri }} style={[{ borderRadius: 12 }, style]} resizeMode="cover"/>
      </TouchableOpacity>
      <ImageViewer uri={uri} fileName={fileName} visible={open} onClose={() => setOpen(false)}/>
    </>
  );
}

const s = StyleSheet.create({
  backdrop:  { flex: 1, backgroundColor: '#000' },
  topBar:    { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 48, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  iconBtn:   { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  imageWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image:     { width: SW, height: SH },
});
