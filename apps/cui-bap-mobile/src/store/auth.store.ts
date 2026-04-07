ï»¿import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Keychain from 'react-native-keychain';

export interface User { id:string; name:string; email:string; plan:'free'|'pro'; avatarUrl?:string; }

interface AuthState {
  user:User|null; accessToken:string|null; refreshToken:string|null; isLoggedIn:boolean;
  setAuth:(u:User,a:string,r:string)=>void;
  updateUser:(p:Partial<User>)=>void;
  logout:()=>void;
}

// Keychain storage adapter
const keychainStorage = {
  getItem: async (key:string) => {
    const c = await Keychain.getGenericPassword({ service: key });
    return c ? c.password : null;
  },
  setItem: async (key:string, value:string) => {
    await Keychain.setGenericPassword('querencia', value, { service: key });
  },
  removeItem: async (key:string) => {
    await Keychain.resetGenericPassword({ service: key });
  },
};

export const useAuthStore = create<AuthState>()(
  persist((set) => ({
    user:null, accessToken:null, refreshToken:null, isLoggedIn:false,
    setAuth:   (user,accessToken,refreshToken) => set({user,accessToken,refreshToken,isLoggedIn:true}),
    updateUser: (p) => set(s => ({user: s.user ? {...s.user,...p} : null})),
    logout:    () => set({user:null,accessToken:null,refreshToken:null,isLoggedIn:false}),
  }), { name:'cb-auth', storage:createJSONStorage(()=>keychainStorage) })
);
