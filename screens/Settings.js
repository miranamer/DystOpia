import { View, Text } from 'react-native'
import {React, useContext} from 'react'
import { AuthContext } from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';

const Settings = () => {
    const {user, SignOut} = useContext(AuthContext);
    return (
      <View className="flex flex-1 justify-center items-center">
        <Text>Hello {user?.email}</Text>
        <FormButton buttonTitle={"Sign Out"} onPress={() => SignOut()}  />
      </View>
    )
}

export default Settings