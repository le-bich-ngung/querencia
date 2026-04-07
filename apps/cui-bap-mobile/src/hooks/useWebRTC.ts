ï»¿/**
 * useWebRTC â gá»i thoáº¡i & video qua WebRTC
 * DÃ¹ng react-native-webrtc
 * Flow: caller â call_offer â callee â call_answer â ICE exchange â connected
 */
import { useRef, useState, useCallback, useEffect } from 'react';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';

// STUN/TURN servers â dÃ¹ng Google STUN miá»n phÃ­ + Twilio TURN (náº¿u cáº§n)
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // ThÃªm TURN server khi cáº§n (cho network khÃ³ tÃ­nh):
    // { urls: 'turn:your-turn-server', username: 'user', credential: 'pass' }
  ],
};

export type CallState = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
export type CallType  = 'voice' | 'video';

interface UseWebRTCProps {
  onCallOffer:    (data: { sdp: string; callType: CallType; fromName: string; fromId: string }) => void;
  onCallEnd:      () => void;
  onCallReject:   () => void;
  sendCallOffer:  (targetId: string, convId: string, type: CallType, sdp: string) => void;
  sendCallAnswer: (targetId: string, sdp: string) => void;
  sendIceCandidate: (targetId: string, candidate: any) => void;
  sendCallEnd:    (targetId: string) => void;
  sendCallReject: (targetId: string) => void;
  onCallEvent:    (event: string, cb: (d: any) => void) => () => void;
}

export function useWebRTC({
  onCallOffer, onCallEnd, onCallReject,
  sendCallOffer, sendCallAnswer, sendIceCandidate, sendCallEnd, sendCallReject,
  onCallEvent,
}: UseWebRTCProps) {
  const pc           = useRef<RTCPeerConnection | null>(null);
  const localStream  = useRef<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callState,    setCallState]    = useState<CallState>('idle');
  const [callType,     setCallType]     = useState<CallType>('voice');
  const [targetId,     setTargetId]     = useState<string>('');
  const [isMuted,      setIsMuted]      = useState(false);
  const [isCamOff,     setIsCamOff]     = useState(false);
  const [isSpeaker,    setIsSpeaker]    = useState(false);

  // ââ Khá»i táº¡o PeerConnection ââââââââââââââââââââââââââââââââââ
  const initPC = useCallback(() => {
    const connection = new RTCPeerConnection(ICE_SERVERS);

    connection.onicecandidate = (e: any) => {
      if (e.candidate && targetId) {
        sendIceCandidate(targetId, e.candidate);
      }
    };

    connection.ontrack = (e: any) => {
      if (e.streams && e.streams[0]) {
        setRemoteStream(e.streams[0]);
      }
    };

    connection.oniceconnectionstatechange = () => {
      if (['disconnected', 'failed', 'closed'].includes(connection.iceConnectionState)) {
        hangUp();
      }
    };

    pc.current = connection;
    return connection;
  }, [targetId, sendIceCandidate]); // eslint-disable-line

  // ââ Láº¥y media stream âââââââââââââââââââââââââââââââââââââââââ
  const getLocalStream = useCallback(async (type: CallType) => {
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: type === 'video' ? { facingMode: 'user', width: 640, height: 480 } : false,
    });
    localStream.current = stream;
    return stream;
  }, []);

  // ââ Gá»I (caller) âââââââââââââââââââââââââââââââââââââââââââââ
  const startCall = useCallback(async (toId: string, convId: string, type: CallType) => {
    setTargetId(toId);
    setCallType(type);
    setCallState('calling');

    const connection = initPC();
    const stream     = await getLocalStream(type);

    stream.getTracks().forEach((track: any) => connection.addTrack(track, stream));

    const offer = await connection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: type === 'video',
    });
    await connection.setLocalDescription(offer);

    sendCallOffer(toId, convId, type, offer.sdp ?? '');
  }, [initPC, getLocalStream, sendCallOffer]);

  // ââ NGHE (callee) â khi nháº­n offer âââââââââââââââââââââââââââ
  const receiveOffer = useCallback(async (data: {
    sdp: string; callType: CallType; fromId: string; fromName: string;
  }) => {
    setTargetId(data.fromId);
    setCallType(data.callType);
    setCallState('ringing');
    onCallOffer(data);
  }, [onCallOffer]);

  // ââ NGHE: tráº£ lá»i cuá»c gá»i âââââââââââââââââââââââââââââââââââ
  const answerCall = useCallback(async (remoteSdp: string) => {
    const connection = initPC();
    const stream     = await getLocalStream(callType);

    stream.getTracks().forEach((track: any) => connection.addTrack(track, stream));

    await connection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: remoteSdp }));

    const answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);

    sendCallAnswer(targetId, answer.sdp ?? '');
    setCallState('connected');
  }, [initPC, getLocalStream, callType, targetId, sendCallAnswer]);

  // ââ Caller nháº­n answer âââââââââââââââââââââââââââââââââââââââ
  const handleAnswer = useCallback(async (sdp: string) => {
    if (!pc.current) return;
    await pc.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
    setCallState('connected');
  }, []);

  // ââ ICE candidate ââââââââââââââââââââââââââââââââââââââââââââ
  const handleIceCandidate = useCallback(async (candidate: any) => {
    if (!pc.current) return;
    try {
      await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch {}
  }, []);

  // ââ Káº¿t thÃºc cuá»c gá»i ââââââââââââââââââââââââââââââââââââââââ
  const hangUp = useCallback(() => {
    localStream.current?.getTracks().forEach((t: any) => t.stop());
    pc.current?.close();
    pc.current       = null;
    localStream.current = null;
    setRemoteStream(null);
    setCallState('ended');
    setTimeout(() => setCallState('idle'), 500);
    if (targetId) sendCallEnd(targetId);
  }, [targetId, sendCallEnd]);

  const rejectCall = useCallback(() => {
    setCallState('idle');
    if (targetId) sendCallReject(targetId);
  }, [targetId, sendCallReject]);

  // ââ Controls âââââââââââââââââââââââââââââââââââââââââââââââââ
  const toggleMute = useCallback(() => {
    localStream.current?.getAudioTracks().forEach((t: any) => { t.enabled = !t.enabled; });
    setIsMuted(m => !m);
  }, []);

  const toggleCamera = useCallback(() => {
    localStream.current?.getVideoTracks().forEach((t: any) => { t.enabled = !t.enabled; });
    setIsCamOff(c => !c);
  }, []);

  const flipCamera = useCallback(() => {
    localStream.current?.getVideoTracks().forEach((t: any) => t._switchCamera?.());
  }, []);

  // ââ Listen to socket events âââââââââââââââââââââââââââââââââââ
  useEffect(() => {
    const unsubAnswer  = onCallEvent('call_answer',  (d) => handleAnswer(d.sdp));
    const unsubIce     = onCallEvent('call_ice',     (d) => handleIceCandidate(d.candidate));
    const unsubOffer   = onCallEvent('call_offer',   (d) => receiveOffer({ sdp: d.sdp, callType: d.call_type, fromId: d.from_user_id, fromName: d.from_name ?? '' }));
    const unsubEnd     = onCallEvent('call_end',     () => { hangUp(); onCallEnd(); });
    const unsubReject  = onCallEvent('call_reject',  () => { hangUp(); onCallReject(); });

    return () => { unsubAnswer(); unsubIce(); unsubOffer(); unsubEnd(); unsubReject(); };
  }, [onCallEvent, handleAnswer, handleIceCandidate, receiveOffer, hangUp, onCallEnd, onCallReject]);

  return {
    callState, callType, localStream: localStream.current, remoteStream,
    isMuted, isCamOff, isSpeaker,
    startCall, answerCall, hangUp, rejectCall,
    toggleMute, toggleCamera, flipCamera,
  };
}
