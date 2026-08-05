/**
 * CallScreen - gọi thoại & video
 * Hiển thị: local video (PiP góc), remote video (full), hoặc avatar khi gọi thoại
 * Controls: mute, camera flip, speaker, end call
 */
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Vibration, Image,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';
import type { CallState, CallType } from '../../hooks/useWebRTC';

interface Props {
  callState:   CallState;
  callType:    CallType;
  callerName:  string;
  localStream: any;
  remoteStream: any;
  isMuted:     boolean;
  isCamOff:    boolean;
  onHangUp:    () => void;
  onAnswer:    () => void;
  onReject:    () => void;
  toggleMute:  () => void;
  toggleCamera:() => void;
  flipCamera:  () => void;
}

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  return (
    <View style={[cs.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[cs.avatarText, { fontSize: size * 0.38 }]}>
        {name?.[0]?.toUpperCase() ?? '?'}
      </Text>
    </View>
  );
}

export function CallScreen({
  callState, callType, callerName,
  localStream, remoteStream,
  isMuted, isCamOff,
  onHangUp, onAnswer, onReject,
  toggleMute, toggleCamera, flipCamera,
}: Props) {
  const [duration, setDuration] = useState(0);

  // Rung khi incoming call
  useEffect(() => {
    if (callState === 'ringing') {
      const pattern = [0, 500, 500, 500];
      Vibration.vibrate(pattern, true);
      return () => Vibration.cancel();
    }
  }, [callState]);

  // Đếm thời gian gọi
  useEffect(() => {
    if (callState !== 'connected') { setDuration(0); return; }
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, [callState]);

  const fmtDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (callState === 'idle' || callState === 'ended') return null;

  return (
    <View style={cs.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.callBg}/>

      {/* Background: video hoặc gradient */}
      {callType === 'video' && remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={cs.remoteVideo}
          objectFit="cover"
        />
      ) : (
        <View style={cs.audioBg}/>
      )}

      {/* Top info */}
      <View style={cs.topInfo}>
        <Text style={cs.callerName}>{callerName}</Text>
        <Text style={cs.statusText}>
          {callState === 'calling'   ? 'Calling...' :
           callState === 'ringing'   ? 'Incoming call' :
           callState === 'connected' ? fmtDuration(duration) :
           ''}
        </Text>
      </View>

      {/* Center: avatar (voice call) hoặc local PiP (video) */}
      {callType === 'voice' || !remoteStream ? (
        <View style={cs.center}>
          <Avatar name={callerName} size={100}/>
          {callState === 'calling' && (
            <View style={cs.callingDots}>
              {[0,1,2].map(i => (
                <View key={i} style={[cs.dot, { opacity: 0.3 + i * 0.3 }]}/>
              ))}
            </View>
          )}
        </View>
      ) : null}

      {/* Local video PiP (video call) */}
      {callType === 'video' && localStream && !isCamOff && (
        <View style={cs.localPip}>
          <RTCView
            streamURL={localStream.toURL()}
            style={cs.localVideo}
            objectFit="cover"
            mirror
          />
        </View>
      )}

      {/* INCOMING CALL - answer/reject */}
      {callState === 'ringing' && (
        <View style={cs.incomingControls}>
          <View style={cs.incomingRow}>
            {/* Reject */}
            <View style={cs.incomingBtnWrap}>
              <TouchableOpacity style={[cs.callBtn, cs.rejectBtn]} onPress={onReject}>
                <Icon name="call" size={28} color="#fff" style={{ transform: [{ rotate: '135deg' }] }}/>
              </TouchableOpacity>
              <Text style={cs.btnLabel}>Decline</Text>
            </View>

            {/* Answer */}
            <View style={cs.incomingBtnWrap}>
              <TouchableOpacity style={[cs.callBtn, cs.answerBtn]} onPress={onAnswer}>
                <Icon name="call" size={28} color="#fff"/>
              </TouchableOpacity>
              <Text style={cs.btnLabel}>Answer</Text>
            </View>
          </View>
        </View>
      )}

      {/* ACTIVE CALL controls */}
      {(callState === 'calling' || callState === 'connected') && (
        <View style={cs.controls}>
          <View style={cs.controlsRow}>

            {/* Mute */}
            <View style={cs.ctrlWrap}>
              <TouchableOpacity
                style={[cs.ctrlBtn, isMuted && cs.ctrlActive]}
                onPress={toggleMute}
              >
                <Icon name={isMuted ? 'mic-off' : 'mic'} size={22} color="#fff"/>
              </TouchableOpacity>
              <Text style={cs.ctrlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </View>

            {/* End call */}
            <View style={cs.ctrlWrap}>
              <TouchableOpacity style={[cs.ctrlBtn, cs.endBtn]} onPress={onHangUp}>
                <Icon name="call" size={26} color="#fff" style={{ transform: [{ rotate: '135deg' }] }}/>
              </TouchableOpacity>
              <Text style={cs.ctrlLabel}>End</Text>
            </View>

            {/* Camera (video only) */}
            {callType === 'video' ? (
              <View style={cs.ctrlWrap}>
                <TouchableOpacity
                  style={[cs.ctrlBtn, isCamOff && cs.ctrlActive]}
                  onPress={toggleCamera}
                >
                  <Icon name={isCamOff ? 'videocam-off' : 'videocam'} size={22} color="#fff"/>
                </TouchableOpacity>
                <Text style={cs.ctrlLabel}>{isCamOff ? 'Turn on cam' : 'Turn off cam'}</Text>
              </View>
            ) : (
              // Speaker toggle for voice calls
              <View style={cs.ctrlWrap}>
                <TouchableOpacity style={cs.ctrlBtn} onPress={() => {}}>
                  <Icon name="volume-high" size={22} color="#fff"/>
                </TouchableOpacity>
                <Text style={cs.ctrlLabel}>Speaker</Text>
              </View>
            )}

          </View>

          {/* Flip camera (video only) */}
          {callType === 'video' && (
            <TouchableOpacity style={cs.flipBtn} onPress={flipCamera}>
              <Icon name="camera-reverse" size={22} color="rgba(255,255,255,0.7)"/>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const cs = StyleSheet.create({
  container:    { position:'absolute', inset:0, backgroundColor:colors.callBg, zIndex:1000 },
  remoteVideo:  { position:'absolute', inset:0 },
  audioBg:      { position:'absolute', inset:0, backgroundColor:colors.callBg },
  topInfo:      { position:'absolute', top:60, left:0, right:0, alignItems:'center', gap:6 },
  callerName:   { color:'#f0efeb', fontSize:26, fontWeight:'800', letterSpacing:-0.5 },
  statusText:   { color:'rgba(240,239,235,0.6)', fontSize:15 },
  center:       { flex:1, alignItems:'center', justifyContent:'center', gap:20 },
  callingDots:  { flexDirection:'row', gap:8 },
  dot:          { width:10, height:10, borderRadius:5, backgroundColor:'#4a7c59' },
  avatar:       { backgroundColor:colors.sage, alignItems:'center', justifyContent:'center' },
  avatarText:   { color:'#fff', fontWeight:'800' },
  localPip:     { position:'absolute', top:120, right:16, width:90, height:130, borderRadius:12, overflow:'hidden', borderWidth:2, borderColor:'rgba(255,255,255,0.2)' },
  localVideo:   { flex:1 },
  incomingControls:{ position:'absolute', bottom:60, left:0, right:0 },
  incomingRow:  { flexDirection:'row', justifyContent:'center', gap:60 },
  incomingBtnWrap:{ alignItems:'center', gap:10 },
  callBtn:      { width:68, height:68, borderRadius:34, alignItems:'center', justifyContent:'center' },
  rejectBtn:    { backgroundColor:colors.error },
  answerBtn:    { backgroundColor:colors.sage },
  btnLabel:     { color:'rgba(240,239,235,0.8)', fontSize:13 },
  controls:     { position:'absolute', bottom:40, left:0, right:0 },
  controlsRow:  { flexDirection:'row', justifyContent:'center', alignItems:'flex-end', gap:28 },
  ctrlWrap:     { alignItems:'center', gap:8 },
  ctrlBtn:      { width:58, height:58, borderRadius:29, backgroundColor:'rgba(255,255,255,0.15)', alignItems:'center', justifyContent:'center' },
  ctrlActive:   { backgroundColor:'rgba(255,255,255,0.3)' },
  endBtn:       { backgroundColor:colors.error, width:68, height:68, borderRadius:34 },
  ctrlLabel:    { color:'rgba(240,239,235,0.7)', fontSize:12 },
  flipBtn:      { position:'absolute', top:-50, right:24, padding:10 },
});
