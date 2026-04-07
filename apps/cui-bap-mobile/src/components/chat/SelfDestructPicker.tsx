ï»¿/**
 * Self-Destruct Timer Picker
 * Hiá»n khi báº¥m icon Äá»ng há» trong input bar
 * Chá»n thá»i gian tá»± há»§y cho tin nháº¯n tiáº¿p theo
 */
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, radius } from '../../theme';

interface Props {
  visible:   boolean;
  current:   number | null; // seconds, null = off
  onSelect:  (seconds: number | null) => void;
  onClose:   () => void;
}

const OPTIONS = [
  { label: 'Táº¯t',    value: null,  icon: 'timer-off-outline' },
  { label: '30 giÃ¢y', value: 30,   icon: 'timer-outline' },
  { label: '5 phÃºt',  value: 300,  icon: 'timer-outline' },
  { label: '1 giá»',   value: 3600, icon: 'timer-outline' },
  { label: '1 ngÃ y',  value: 86400,icon: 'timer-outline' },
  { label: '1 tuáº§n',  value: 604800,icon: 'timer-outline' },
];

export function SelfDestructPicker({ visible, current, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.backdrop} onPress={onClose} activeOpacity={1}>
        <View style={s.menu}>
          <View style={s.header}>
            <Icon name="timer-outline" size={18} color={colors.sage}/>
            <Text style={s.title}>Tá»± há»§y sau</Text>
          </View>
          {OPTIONS.map(opt => (
            <TouchableOpacity
              key={String(opt.value)}
              style={[s.option, current === opt.value && s.optionActive]}
              onPress={() => { onSelect(opt.value); onClose(); }}
            >
              <Text style={[s.optionText, current === opt.value && s.optionTextActive]}>
                {opt.label}
              </Text>
              {current === opt.value && (
                <Icon name="checkmark" size={16} color={colors.sage}/>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end', paddingBottom: 80, paddingHorizontal: spacing.md },
  menu:           { backgroundColor: colors.bg, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  header:         { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  title:          { color: colors.text, fontWeight: '700', fontSize: 14 },
  option:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  optionActive:   { backgroundColor: 'rgba(74,124,89,0.06)' },
  optionText:     { color: colors.text, fontSize: 15 },
  optionTextActive: { color: colors.sage, fontWeight: '700' },
});
