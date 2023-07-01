import { View, Text, TouchableOpacity, Touchable, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useState } from 'react'
import FormButton from '../components/FormButton'
import FormInput from '../components/FormInput'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH, FIREBASE_DB } from '../Firebase'
import { AuthContext } from '../navigation/AuthProvider'
import {
  updateDoc,
  collection,
  doc,
  setDoc,
  addDoc,
  Firestore,
  serverTimestamp,
} from "firebase/firestore";

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const auth = FIREBASE_AUTH

  const {CreateAccount, user} = useContext(AuthContext);

  const CompleteAccountCreation = async () => {
    if(password === confirmPassword){
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(FIREBASE_DB, "users", credentials.user.uid), {
        userId: credentials.user.uid,
        username: username,
        Ratings: [],
        betaUser: false
      });
      console.log('NEW USER CREATED');
    }
    else{
      console.log("Passwords Do Not Match");
    }
  }


  return (
    <View className="flex flex-1 items-center justify-center bg-[#212121] pb-20">
        <Text className="text-white text-[30px] relative bottom-10 font-bold">Sign Up</Text>
        <KeyboardAvoidingView behavior='padding'>
          <FormInput onChangeText={(userEmail) => setEmail(userEmail)} labelValue={email} placeholderText={"Email"} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          <FormInput onChangeText={(userUsername) => setUsername(userUsername)} labelValue={username} placeholderText={"Username"} autoCapitalize="none" autoCorrect={false} />
          <FormInput onChangeText={(userPassword) => setPassword(userPassword)} labelValue={password} placeholderText={"Password"} secureTextEntry={true} />
          <FormInput onChangeText={(userPassword) => setConfirmPassword(userPassword)} labelValue={confirmPassword} placeholderText={"Confirm Password"} secureTextEntry={true} />
        </KeyboardAvoidingView>
        <FormButton buttonTitle={"Create Account"} onPress={() => CompleteAccountCreation()} />

        <TouchableOpacity>
          <Text onPress={() => navigation.navigate("Login")} className="text-white relative top-10 font-semibold">Already Have An Account?</Text>
        </TouchableOpacity>
    </View>
  )
}

export default SignUp