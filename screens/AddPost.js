import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from "../Firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import {
  updateDoc,
  collection,
  doc,
  setDoc,
  addDoc,
  Firestore,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { AuthContext } from "../navigation/AuthProvider";

const AddPost = () => {
  const { user, SignOut } = useContext(AuthContext);

  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  const [image, setImage] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [postText, setPostText] = useState(null);

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(cameraPermission.status === "granted");

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log(imagePermission.status);

    setGalleryPermission(imagePermission.status === "granted");

    if (
      imagePermission.status !== "granted" &&
      cameraPermission.status !== "granted"
    ) {
      alert("Permission for media access needed.");
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log('camera pic data: ', data.uri);
      setImage(data.uri);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(FIREBASE_STORAGE, `Images/image-${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (e) {
      console.log(e);
    }
  };

  const getUsername = async () => {
    const docRef = doc(FIREBASE_DB, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("User Username => ", docSnap.data().username);
      return docSnap.data().username;
    }
    else{
      return null;
    }
  }

  const createPost = async () => {
    const usernameField = await getUsername();
    console.log(usernameField);

    if (image !== null) {
      const URL = await uploadImage(image);
      await addDoc(collection(FIREBASE_DB, "posts"), {
        userId: user.uid,
        username: usernameField,
        post: postText,
        postImg: URL,
        postTime: serverTimestamp(),
        likes: 0,
        comments: 0,
        likedUsers: []
      })
        .then(() => {
          console.log("Post Added");
          Alert.alert("Post Successful");
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    } else {
      await addDoc(collection(FIREBASE_DB, "posts"), {
        userId: user.uid,
        username: usernameField,
        post: postText,
        postImg: null,
        postTime: serverTimestamp(),
        likes: 0,
        comments: 0,
        likedUsers: []
      })
        .then(() => {
          console.log("Post Added");
          Alert.alert("Post Successful");
          setPostText(null);
          setImage(null);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    }
  };



  return (
    <View className="bg-[#212121] h-full flex flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#212121",
          position: "relative",
          bottom: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="h-[200px] w-[200px] relative bottom-20">
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.fixedRatio}
            type={type}
            ratio={"1:1"}
          />
        </View>
        {image != null ? (
          <Image
            style={{
              width: "70%",
              height: 250,
              marginBottom: 10,
              position: "relative",
              bottom: 20,
            }}
            source={{ uri: image }}
          />
        ) : null}
        <TextInput
          onChangeText={(text) => setPostText(text)}
          className="text-white justify-center items-center text-[24px] text-center w-[90%]"
          placeholderTextColor={"grey"}
          placeholder="Type Caption..."
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity onPress={() => createPost()}>
          <View className="flex items-center justify-center w-[90px] h-10 rounded-lg bg-green-400 relative top-2">
            <Text className="text-white font-semibold text-lg">Post</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View className="absolute top-[70%] right-[20%]">
        <ActionButton offsetX={0} buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            spaceBetween={0}
            buttonColor="#9b59b6"
            title="Add Photo"
            onPress={() => pickImageAsync()}
          >
            <Icon name="image-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            spaceBetween={0}
            buttonColor="#3498db"
            title="Take Photo"
            onPress={() => takePicture()}
          >
            <Icon name="camera-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            spaceBetween={0}
            buttonColor="red"
            title="Remove Image"
            onPress={() => setImage(null)}
          >
            <Icon name="trash-bin-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});

export default AddPost;
