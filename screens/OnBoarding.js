import { StyleSheet, Text, View, Button, Image } from 'react-native';
import React, { Component } from 'react'
import Onboarding from 'react-native-onboarding-swiper';

const OnBoarding = ({navigation}) => {
    return (
      <Onboarding onSkip={() => navigation.replace("Login")} onDone={() => navigation.navigate("Login")}

      pages={[
        {backgroundColor: "#000",
         image: <Image resizeMode="contain"
         style={{ width: 300, height: 300 }} source={require('../assets/graph.png')} />,
         title: "Welcome To Black Mirror", // change to real name of app
         subtitle: "Proceed At Your Own Discretion"
        },
        {backgroundColor: "#fff",
         image: <Image resizeMode="contain"
         style={{ width: 300, height: 300 }} source={require('../assets/graph.png')} />,
         title: "Continue To Login",
         subtitle: ""
        }
      ]}
      />
    )
  }

export default OnBoarding