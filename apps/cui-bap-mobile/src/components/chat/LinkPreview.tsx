ï»¿/**
 * Link Preview â hiá»n og:title, og:image, og:description
 * khi tin nháº¯n chá»©a URL
 * Fetch metadata server-side qua /api/v1/meta/preview?url=...
 * (trÃ¡nh CORS + khÃ´ng expose user IP cho external sites)
 */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Linking, ActivityIndicator,
} from 'react-native';
import { colors, radius } from '../../theme';
import { api } from '../../lib/api';

interface OgMeta {
  title?:       string;
  description?: string;
  image?:       string;
  siteName?:    string;
  url:          string;
}

// Regex nháº­n ra URL trong text
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;

export function extractUrls(text: string): string[] {
  return Array.from(new Set(text.match(URL_REGEX) ?? []));
}

interface Props {
  text:   string;
  isOut:  boolean;
}

export function LinkPreview({ text, isOut }: Props) {
  const urls = extractUrls(text);
  const url  = urls[0]; // chá» preview URL Äáº§u tiÃªn
  if (!url) return null;

  const [meta,    setMeta]    = useState<OgMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed,  setFailed]  = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getLinkPreview(url);
        if (!cancelled && data?.title) setMeta(data);
        else if (!cancelled) setFailed(true);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [url]);

  if (loading) {
    return (
      <View style={[s.card, isOut && s.cardOut, s.loading]}>
        <ActivityIndicator size="small" color={isOut ? 'rgba(255,255,255,0.5)' : colors.sage}/>
      </View>
    );
  }

  if (failed || !meta) return null;

  return (
    <TouchableOpacity
      style={[s.card, isOut && s.cardOut]}
      onPress={() => Linking.openURL(url)}
      activeOpacity={0.8}
    >
      {/* Left accent bar */}
      <View style={[s.accent, isOut && s.accentOut]}/>

      <View style={{ flex: 1 }}>
        {/* Site name */}
        {meta.siteName && (
          <Text style={[s.siteName, isOut && s.textOut]} numberOfLines={1}>
            {meta.siteName}
          </Text>
        )}
        {/* Title */}
        {meta.title && (
          <Text style={[s.title, isOut && s.textOut]} numberOfLines={2}>
            {meta.title}
          </Text>
        )}
        {/* Description */}
        {meta.description && (
          <Text style={[s.desc, isOut && s.descOut]} numberOfLines={2}>
            {meta.description}
          </Text>
        )}
      </View>

      {/* Preview image */}
      {meta.image && (
        <Image
          source={{ uri: meta.image }}
          style={s.image}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card:     { flexDirection: 'row', alignItems: 'stretch', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: radius.md, overflow: 'hidden', marginTop: 6, gap: 8, paddingRight: 4 },
  cardOut:  { backgroundColor: 'rgba(0,0,0,0.12)' },
  loading:  { padding: 10, justifyContent: 'center' },
  accent:   { width: 3, backgroundColor: colors.sage, flexShrink: 0 },
  accentOut:{ backgroundColor: 'rgba(255,255,255,0.6)' },
  siteName: { fontSize: 10, color: colors.sage, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, paddingTop: 8, paddingLeft: 2 },
  title:    { fontSize: 13, fontWeight: '700', color: colors.text, lineHeight: 18, marginTop: 2, paddingLeft: 2 },
  desc:     { fontSize: 11, color: colors.textSec, lineHeight: 16, marginTop: 2, paddingBottom: 8, paddingLeft: 2 },
  textOut:  { color: '#fff' },
  descOut:  { color: 'rgba(255,255,255,0.75)' },
  image:    { width: 64, height: 64, borderRadius: radius.sm, flexShrink: 0, alignSelf: 'center', marginVertical: 4 },
});
