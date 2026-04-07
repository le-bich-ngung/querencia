import { createNavigationContainerRef } from '@react-navigation/native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '../store/auth.store';
import { colors } from '../theme';

import { LoginScreen }             from '../screens/auth/LoginScreen';
import { RegisterScreen }          from '../screens/auth/RegisterScreen';
import { ChatsScreen }             from '../screens/main/ChatsScreen';
import { SettingsScreen }          from '../screens/main/SettingsScreen';
import { ChatScreen }              from '../screens/chat/ChatScreen';
import { NewChatScreen }           from '../screens/chat/NewChatScreen';
import { GroupInfoScreen }         from '../screens/chat/GroupInfoScreen';
import { SearchMessagesScreen }    from '../screens/chat/SearchMessagesScreen';
import { BlockReportScreen }       from '../screens/chat/BlockReportScreen';
import { PinnedMessagesScreen }    from '../screens/chat/PinnedMessagesScreen';
import { EditProfileScreen }       from '../screens/main/EditProfileScreen';

export type RootStackParams = {
  Auth:            undefined;
  Main:            undefined;
  Chat:            { convId:string; convType:'direct'|'group'; name:string; otherUserId?:string; };
  NewChat:         undefined;
  GroupInfo:       { groupId:string; groupName:string; };
  SearchMessages:  { convId:string; convType:'direct'|'group'; name:string; };
  BlockReport:     { targetUserId:string; targetName:string; };
  PinnedMessages:  { convId:string; convType:'direct'|'group'; name:string; };
  EditProfile:     undefined;
};
export type AuthStackParams  = { Login:undefined; Register:undefined; };
export type MainTabParams    = { Chats:undefined; Settings:undefined; };

const Root = createNativeStackNavigator<RootStackParams>();
const Auth = createNativeStackNavigator<AuthStackParams>();
const Tab  = createBottomTabNavigator<MainTabParams>();

function AuthStack() {
  return (
    <Auth.Navigator screenOptions={{ headerShown:false }}>
      <Auth.Screen name="Login"    component={LoginScreen}/>
      <Auth.Screen name="Register" component={RegisterScreen}/>
    </Auth.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor:'#111110', borderTopColor:colors.border, paddingBottom:4, height:60 },
      tabBarActiveTintColor:   colors.sage,
      tabBarInactiveTintColor: colors.gray,
      tabBarLabelStyle: { fontSize:11, fontWeight:'600' },
    }}>
      <Tab.Screen name="Chats"    component={ChatsScreen}
        options={{ tabBarLabel:'Tin nhắn', tabBarIcon:({color,size})=><Icon name="chatbubbles" size={size} color={color}/> }}/>
      <Tab.Screen name="Settings" component={SettingsScreen}
        options={{ tabBarLabel:'Cài đặt',  tabBarIcon:({color,size})=><Icon name="settings-outline" size={size} color={color}/> }}/>
    </Tab.Navigator>
  );
}

export const navigationRef = createNavigationContainerRef<RootStackParams>();

export function AppNavigator() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  return (
    <NavigationContainer ref={navigationRef}>
      <Root.Navigator screenOptions={{
        headerStyle:          { backgroundColor:'#111110' },
        headerTintColor:      colors.text,
        headerBackTitleVisible:false,
        contentStyle:         { backgroundColor:colors.bg },
        animation:            'slide_from_right',
      }}>
        {isLoggedIn ? (
          <>
            <Root.Screen name="Main"           component={MainTabs}            options={{ headerShown:false }}/>
            <Root.Screen name="Chat"           component={ChatScreen}          options={({route})=>({ title:(route.params as any).name })}/>
            <Root.Screen name="NewChat"        component={NewChatScreen}       options={{ title:'Tạo mới', presentation:'modal' }}/>
            <Root.Screen name="GroupInfo"      component={GroupInfoScreen}     options={({route})=>({ title:(route.params as any).groupName })}/>
            <Root.Screen name="SearchMessages" component={SearchMessagesScreen} options={{ title:'Tìm kiếm', presentation:'modal' }}/>
            <Root.Screen name="BlockReport"    component={BlockReportScreen}   options={{ title:'Tùy chọn', presentation:'modal' }}/>
            <Root.Screen name="PinnedMessages" component={PinnedMessagesScreen} options={{ title:'Tin nhắn đã ghim' }}/>
            <Root.Screen name="EditProfile"    component={EditProfileScreen}    options={{ title:'Chỉnh sửa hồ sơ', presentation:'modal' }}/>
          </>
        ) : (
          <Root.Screen name="Auth" component={AuthStack} options={{ headerShown:false }}/>
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}
