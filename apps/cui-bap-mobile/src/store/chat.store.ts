import { create } from 'zustand';

export interface CBUser    { id:string; name:string; avatarUrl?:string; }
export interface CBMessage {
  id:string; sender:CBUser; type:'text'|'image'|'file'|'audio';
  content:string|null; fileUrl?:string; fileName?:string; fileSize?:number;
  replyToId?:string; isEdited:boolean; isDeleted:boolean;
  reactions:Record<string,number>; sentAt:string; pending?:boolean;
}
export interface CBConversation {
  id:string; otherUser:CBUser; isOnline:boolean;
  lastMessage:{content:string|null;type:string;sentAt:string}|null;
  lastMessageAt:string; unreadCount:number;
}
export interface CBGroup {
  id:string; name:string; memberCount:number; role:'owner'|'admin'|'member';
  lastMessage:{content:string|null;sentAt:string}|null; lastMessageAt:string;
}

interface S {
  conversations:CBConversation[]; groups:CBGroup[];
  messages:Record<string,CBMessage[]>;
  activeConvId:string|null; activeType:'direct'|'group';
  typingUsers:Record<string,boolean>; connected:boolean;
  setConversations:(l:CBConversation[])=>void;
  setGroups:(l:CBGroup[])=>void;
  setMessages:(id:string,m:CBMessage[])=>void;
  appendMessage:(id:string,m:CBMessage)=>void;
  updateMessage:(id:string,mid:string,p:Partial<CBMessage>)=>void;
  setActive:(id:string,t:'direct'|'group')=>void;
  setTyping:(uid:string,v:boolean)=>void;
  setConnected:(v:boolean)=>void;
  updateConvPreview:(id:string,m:CBMessage)=>void;
  clearUnread:(id:string)=>void;
}

export const useChatStore = create<S>()((set) => ({
  conversations:[], groups:[], messages:{},
  activeConvId:null, activeType:'direct', typingUsers:{}, connected:false,
  setConversations: (l)=>set({conversations:l}),
  setGroups:        (l)=>set({groups:l}),
  setMessages:      (id,m)=>set(s=>({messages:{...s.messages,[id]:m}})),
  appendMessage:    (id,m)=>set(s=>({messages:{...s.messages,[id]:[...(s.messages[id]??[]),m]}})),
  updateMessage:    (id,mid,p)=>set(s=>({messages:{...s.messages,[id]:(s.messages[id]??[]).map(m=>m.id===mid?{...m,...p}:m)}})),
  setActive:        (id,t)=>set({activeConvId:id,activeType:t}),
  setTyping:        (uid,v)=>set(s=>({typingUsers:{...s.typingUsers,[uid]:v}})),
  setConnected:     (v)=>set({connected:v}),
  updateConvPreview:(id,m)=>set(s=>({
    conversations: s.conversations
      .map(c=>c.id!==id?c:{...c,lastMessage:{content:m.content,type:m.type,sentAt:m.sentAt},lastMessageAt:m.sentAt})
      .sort((a,b)=>new Date(b.lastMessageAt).getTime()-new Date(a.lastMessageAt).getTime()),
  })),
  clearUnread: (id)=>set(s=>({conversations:s.conversations.map(c=>c.id===id?{...c,unreadCount:0}:c)})),
  updateReceipts: (convId,msgIds,status)=>set(s=>({messages:{...s.messages,[convId]:(s.messages[convId]??[]).map(m=>msgIds.includes(m.id)?{...m,receiptStatus:status}:m)}})),
  setUserOnline: (userId,online)=>set(s=>({conversations:s.conversations.map(c=>c.otherUser.id===userId?{...c,isOnline:online}:c)})),
}));
