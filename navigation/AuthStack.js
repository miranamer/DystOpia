import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage  from '@react-native-async-storage/async-storage';

import OnBoarding from '../screens/OnBoarding'; // Screens
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AppStack = createStackNavigator();


const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routeName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
  
  }, []);

  if (isFirstLaunch === null) {
    return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
  } else if (isFirstLaunch == true) {
    routeName = 'Onboarding';
  } else {
    routeName = 'Login';
  }

  return (
    <AppStack.Navigator initialRouteName={routeName}>
      <AppStack.Screen
        name="Onboarding"
        component={OnBoarding}
        options={{header: () => null}}
      />
      <AppStack.Screen
        name="Login"
        component={Login}
        options={{header: () => null}}
      />
      <AppStack.Screen
        name="SignUp"
        component={SignUp}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: '#212121',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <FontAwesome.Button 
                name="long-arrow-left"
                size={25}
                backgroundColor="#212121"
                color="white"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          ),
        })}
      />
    </AppStack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});