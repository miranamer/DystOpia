import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function FormButton({ buttonTitle, ...rest }) {
  const windowHeight = Dimensions.get('window').height
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <Text className="text-[18px] font-bold text-[#1E5A15]">{buttonTitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer:{
    marginTop: 10,
    width: "80%",
    height: Dimensions.get('window').height / 15,
    backgroundColor: "#8DCD76",
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27,
  }
});
