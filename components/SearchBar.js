import React from 'react';
import {View, TextInput, StyleSheet, Dimensions} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

const SearchBar = ({labelValue, placeholderText, iconType, ...rest}) => {
  return (
    <View style={styles.inputContainer}>
      <View>
      </View>
      <TextInput
        value={labelValue}
        style={styles.input}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="white"
        {...rest}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '80%',
    height: Dimensions.get('window').height / 15,
    borderRadius: 27,
    color: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: "#3F3F3F",
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    color: "white",
    fontWeight: 'bold'
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});