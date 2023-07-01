import { View, Text, TouchableOpacity, Touchable, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useState } from 'react'
import FormButton from '../components/FormButton'
import FormInput from '../components/FormInput'
import { FIREBASE_AUTH } from '../Firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { AuthContext } from '../navigation/AuthProvider'

const Login = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const auth = FIREBASE_AUTH

  const {LoginFunc} = useContext(AuthContext);

  return (
    <View className="flex flex-1 items-center justify-center bg-[#212121]">
        <Text className="text-white text-[30px] relative bottom-10 font-bold">Login</Text>
        <KeyboardAvoidingView behavior='padding'>
          <FormInput onChangeText={(userEmail) => setEmail(userEmail)} labelValue={email} placeholderText={"Email"} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          <FormInput onChangeText={(userPassword) => setPassword(userPassword)} labelValue={password} placeholderText={"Password"} secureTextEntry={true} />
        </KeyboardAvoidingView>
        <FormButton buttonTitle={"Login"} onPress={() => LoginFunc(auth, email, password)} />
        <TouchableOpacity>
          <Text className="text-white relative top-10 font-semibold">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text onPress={() => navigation.navigate("SignUp")} className="text-white relative top-20 font-semibold">Create An Account</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Login