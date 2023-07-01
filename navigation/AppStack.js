import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from '../components/SearchBar';

import Home from '../screens/Home';
import AddPost from '../screens/AddPost';
import Chat from '../screens/Chat';
import EditProfile from '../screens/EditProfile';
import Messages from '../screens/Messages';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="DystOpia"
      component={Home}
      options={{
        title: '',
          headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontSize: 18,
        },
        headerStyle: {
          //shadowColor: '#fff',
          elevation: 0,
          backgroundColor: '#212121',
        },
        headerShadowVisible: false,
      }}
    />
    <Stack.Screen
      name="AddPostScreen"
      component={AddPost}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#2e64e515',
          shadowColor: '#2e64e515',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="HomeProfile"
      component={Profile}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#212121',
          shadowColor: '#212121',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const MessageStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="MessagesScreen" component={Messages} options={{
        headerShown: false,
      }} />
    <Stack.Screen
      name="ChatScreen"
      component={Chat}
      options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })}
    />
  </Stack.Navigator>
);

const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileScreen"
      component={Profile}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfileScreen"
      component={EditProfile}
      options={{
        headerTitle: 'Edit Profile',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const SettingStack = ({navigation}) => ( // TODO
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsScreen"
      component={Settings}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfileScreen"
      component={EditProfile}
      options={{
        headerTitle: 'Edit Profile',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);


const AppStack = ({user}) => {
  const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow
      }}
    >
      <View style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "white"
      }}>
        {children}
      </View>
    </TouchableOpacity>
  );

  const getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : '';

    if (routeName === 'Chat') {
      return false;
    }
    return true;
  };

  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#F1F7FF',
      tabBarStyle: {
        tabBarLabel: false,
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        elevation: 0,
        backgroundColor: '#6B6464',
        borderRadius: 30,
        height: 60,
        ...styles.shadow // CHANGE SHADOW COLOR LATER
      }
    }}
      >
      <Tab.Screen
        name="Home"
        component={FeedStack}
        screenOptions={{
          header: <><View className="absolute top-0 right-[70px] w-[300px]">
          <SearchBar placeholderText={"Search Post, User..."} autoCapitalize="none" autoCorrect={false} />
        </View>
        <TouchableOpacity className="absolute top-0 right-5 w-[60px] h-[60px] rounded-[30px] flex items-center justify-center bg-[#1F6BFF]">
          <View>
            <Ionicons size={40} style={{color: 'white', height: 40}} name="wifi-outline" />
          </View>
        </TouchableOpacity></>
        }}
        options={({route}) => ({
          headerShown: false,
          tabBarLabel: '',
          // tabBarVisible: route.state && route.state.index === 0,
          tabBarIcon: ({color, size}) => (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', top: 10}}>
              <MaterialCommunityIcons
                name="home-outline"
                color={color}
                style={{height: 35, marginTop: 30}}
                size={size}
              />
            </View>
          )
        })}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={({route}) => ({
          title: '',
          headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontSize: 18,
        },
        headerStyle: {
          //shadowColor: '#fff',
          elevation: 0,
          backgroundColor: '#212121',
        },
        headerShadowVisible: false,
          tabBarLabel: '',
          tabBarVisible: getTabBarVisibility(route),
          // Or Hide tabbar when push!
          // https://github.com/react-navigation/react-navigation/issues/7677
          // tabBarVisible: route.state && route.state.index === 0,
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', top: 10}}>
            <Ionicons
              name="chatbubbles-outline"
              color={color}
              size={size}
              style={{height: 35, marginTop: 30}}
            />
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="AddPost"
        component={AddPost}
        options={{
          title: '',
          headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontSize: 18,
        },
        headerStyle: {
          //shadowColor: '#fff',
          elevation: 0,
          backgroundColor: '#212121',
        },
        headerShadowVisible: false,
          tabBarLabel: '',
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <View>
              <Ionicons name="add-outline" color={'black'} size={40} style={{height: 55, marginTop: 30, left: 1}} />
            </View>
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          )
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: '',
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', top: 10}}>
              <Ionicons name="person-outline" color={color} size={size} style={{height: 35, marginTop: 30}} />
            </View>
          ),
        }}
      />

<Tab.Screen
        name="Settings"
        component={SettingStack}
        options={{
          headerShown: false,
          tabBarLabel: '',
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', top: 10}}>
              <Ionicons name="settings-outline" color={color} size={size} style={{height: 35, marginTop: 30}} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow:{
    shadowColor: 'black',
    shadowOffset:{
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
})

export default AppStack