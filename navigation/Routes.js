import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { User, onAuthStateChanged } from 'firebase/auth'
import { FIREBASE_AUTH } from "../Firebase";
import { AuthContext } from "./AuthProvider";
import AppStack from "./AppStack";

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    })
  }, [])  

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
