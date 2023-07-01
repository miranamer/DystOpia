import { View, Text, Image, ImageBackground } from "react-native";
import { React, useState, useContext, useEffect } from "react";
import StarRating from "react-native-star-rating-widget";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../navigation/AuthProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
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
import { FIREBASE_DB } from "../Firebase";


const PostCard = ({ item, onDelete, LikePost, onPress }) => {
  // TODO: IF THERES NO TEXT JUST IMAGE, MAKE IMG TAKE FULL HEIGHT
  
  const [rating, setRating] = useState(0);
  const { user, SignOut } = useContext(AuthContext);
  const [betaUser, setBetaUser] = useState(false);

  const isBetaUser = async () => {
    const docRef = doc(FIREBASE_DB, "users", item.userId);
    const docSnap = await getDoc(docRef);

    console.log(item.username, docSnap.data().betaUser)

    if(docSnap.data().betaUser === true){
      setBetaUser(true);
    }
    else{
      setBetaUser(false);
    }
  }

  useEffect(() => {
    isBetaUser();
  }, [])

  //console.log('liked users', item)

  return (
    <View className="mb-10">
      <View
        className={
          item.img !== null
            ? `w-[360px] h-[440px] flex flex-col rounded-b-lg`
            : `w-[360px] flex flex-col rounded-b-lg`
        }
      >
        <View className="w[100%] rounded-t-lg bg-white h-[50px] flex flex-row items-center justify-around">
          <TouchableOpacity onPress={onPress}>
            <Text className={item.username === "Admin" ? "font-bold text-lg text-yellow-500 italic" : betaUser === true ? "font-semibold text-lg text-red-400" : "font-semibold text-lg" }>{item.username}{betaUser === true ? ' [BETA]' : null}</Text>
          </TouchableOpacity>
        </View>

        {item.img !== null ? (
          <View className="w-[100%] h-[75%] flex items-center justify-center">
            <Image
              source={{ uri: item.img }}
              style={{ height: "100%", width: "100%" }}
            />
          </View>
        ) : null}

        <View
          className={
            item.img === null
              ? `p-5 bg-white rounded-b-lg border-t-2 border-t-gray-300`
              : `p-5 bg-white rounded-b-lg`
          }
        >
          <Text className="">{item.text}</Text>
        </View>
      </View>

      <View className="relative w-[360px] h-[50px] bg-white rounded-lg mt-3 flex flex-row items-center justify-evenly">
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text className="text-red-400 text-lg font-semibold">
            {item.likes}
          </Text>
          {item.likedUsers?.includes(user.uid) ? (
            <Ionicons
              size={30}
              style={{ color: "red", height: 30 }}
              name="heart"
              onPress={() => LikePost(item.id)}
            />
          ) : (
            <Ionicons
              size={30}
              style={{ color: "red", height: 30 }}
              name="heart-outline"
              onPress={() => LikePost(item.id)}
            />
          )}
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Ionicons
            size={30}
            style={{ color: "blue", height: 30 }}
            name="chatbox-ellipses-outline"
          />
          <Text className="text-blue-600 text-lg font-semibold">
            {item.comments}
          </Text>
        </View>
        {user.uid === item.userId ? (
          <View className="flex flex-row gap-2 items-center justify-center">
            <Ionicons
              size={30}
              style={{ color: "black", height: 30 }}
              name="trash-outline"
              onPress={() => onDelete(item.id)}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default PostCard;
