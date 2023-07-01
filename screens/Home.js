import { View, Text, ScrollView, FlatList, RefreshControl } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../navigation/AuthProvider";
import FormButton from "../components/FormButton";
import SearchBar from "../components/SearchBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

import StarRating from "react-native-star-rating-widget";
import PostCard from "../components/PostCard";

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from "../Firebase";
import {ref, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject} from 'firebase/storage';
import {
  deleteDoc,
  serverTimestamp,
  updateDoc,
  collection,
  doc,
  setDoc,
  addDoc,
  Firestore,
  QuerySnapshot,
  query,
  DocumentSnapshot,
  getDocs,
  orderBy,
  getDoc
} from "firebase/firestore";

const Home = ({navigation}) => {
  const { user, SignOut } = useContext(AuthContext);
  const [search, setSearch] = useState();

  const [postsObj, setPostsObj] = useState(null);

  const posts = [
    {
      id: 1,
      username: "test user",
      img: require("../images/baroque.jpg"),
      text: "post text",
      liked: true,
      likes: "100",
      comments: "20",
    },
    {
      id: 2,
      username: "Miran",
      img: null,
      text: "Hey There",
      liked: false,
      likes: "200",
      comments: "90",
    },
  ];

  const getData = async () => {
    const querySnapshot = await getDocs(
      collection(FIREBASE_DB, "posts"),
      orderBy("postTime", "desc")
    );
    var data = [];
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().userId}`);
      data.push({
        id: doc.id,
        username: doc.data().username,
        comments: doc.data().comments,
        likes: doc.data().likes,
        text: doc.data().post,
        img: doc.data().postImg,
        postTime: doc.data().postTime,
        userId: doc.data().userId,
        likedUsers: doc.data().likedUsers
      });
    });
    setPostsObj(data);
    //console.log('HERE -> ', data);
  };

  useEffect(() => {
    getData();
    //console.log('Post Obj', postsObj);
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onDelete = async (id) => {
    //console.log('Post Id: ', id);
    //await deleteDoc(doc(FIREBASE_DB, "posts", id)); // use id to get post and see if img is null if not then delete img from storage (some photos still in storage - manually delete them)
    
    const docRef = doc(FIREBASE_DB, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().postImg);
      if(docSnap.data().postImg !== null){
        const storageRef = ref(FIREBASE_STORAGE, docSnap.data().postImg);
        const imageRef = ref(storageRef.fullPath);
        console.log("File in database before delete exists : " + imageRef)

        deleteObject(ref(FIREBASE_STORAGE, imageRef)).then(() => {
          console.log('File: ', docSnap.data().postImg, 'deleted!')
        }).catch((error) => {
          console.log('Error: ', error)
        });
      }
      
      await deleteDoc(doc(FIREBASE_DB, "posts", id));
      getData();
    } 
    
    else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const LikePost = async (id) => {
    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }

    const docRef = doc(FIREBASE_DB, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document Likes:", docSnap.data().likes);
      const likes = docSnap.data().likes
      const likedUsers = docSnap.data().likedUsers
      
      if(likedUsers.includes(user.uid) !== true){
        likedUsers.push(user.uid)
        await updateDoc(docRef, {
          likes: likes + 1,
          likedUsers: likedUsers
        })
      }
      else{
        await updateDoc(docRef, {
          likes: likes - 1,
          likedUsers: likedUsers.filter(e => e !== user.uid)
        })
      }
      getData();
    } 
  }

  return (
    <View className="flex flex-1 justify-center items-center bg-[#212121]">
      <View className="absolute top-0 right-[70px] w-[300px]">
        <SearchBar
          onChangeText={(userSearch) => setSearch(userSearch)}
          labelValue={search}
          placeholderText={"Search Post, User..."}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <TouchableOpacity className="absolute top-0 right-5 w-[60px] h-[60px] rounded-[30px] flex items-center justify-center bg-[#1F6BFF]">
        <View>
          <Ionicons
            size={40}
            style={{ color: "white", height: 40 }}
            name="wifi-outline"
          />
        </View>
      </TouchableOpacity>

      <View className="mt-[80px] mb-[110px]">
        <FlatList
          data={postsObj}
          renderItem={({ item }) => (
            <PostCard key={item.id} item={item} onDelete={onDelete} LikePost={LikePost} onPress={() => navigation.navigate('HomeProfile', {userId: item.userId, username: item.username})} />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getData} />
          }
        />
      </View>
    </View>
  );
};

export default Home;
