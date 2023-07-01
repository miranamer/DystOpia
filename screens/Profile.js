import { View, Text } from "react-native";
import { React, useContext, useEffect, useState } from "react";
import { AuthContext } from "../navigation/AuthProvider";
import FormButton from "../components/FormButton";
import { FIREBASE_DB } from "../Firebase";
import {
  updateDoc,
  collection,
  doc,
  setDoc,
  addDoc,
  Firestore,
  serverTimestamp,
  getDoc,
  getDocs,
  orderBy,
  where,
  query
} from "firebase/firestore";
import StarRating from "react-native-star-rating-widget";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import PostCard from "../components/PostCard";

const Profile = ({navigation, route}) => {
  const { user, SignOut } = useContext(AuthContext);
  
  const [username, setUsername] = useState(null);
  const [rating, setRating] = useState(0);
  const [myPosts, setMyPosts] = useState(null);
  const [ratingAvg, setRatingAvg] = useState(0);
  const [peopleCounter, setPeopleCounter] = useState(0);

  useEffect(() => {
    const getUsername = async () => {
      const docRef = doc(FIREBASE_DB, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("User Username => ", docSnap.data().username);
        setUsername(docSnap.data().username);
      } else {
        return null;
      }
    };

    getData();
    getUsername();
    getRating();
    getAverageRating();
  }, []);

  const getData = async () => {

    const q = query(collection(FIREBASE_DB, "posts"), where("userId", "==", route.params ? route.params.userId : user.uid));

    var data = []
    const querySnapshot2 = await getDocs(q);
    querySnapshot2.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
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
      })
    });

    setMyPosts(data);
    
  };

  const updateRating = async () => { // TODO: others will show who rated and my for me only
    const userId = route.params ? route.params.userId : user.uid // who am I rating?
    const docRef = doc(FIREBASE_DB, "users", userId); // doc of person being rated
    const docSnap = await getDoc(docRef);

    const Ratings = docSnap.data().Ratings;
    var newRatings = []
    var isRated = false;

    Ratings.forEach((element) => {
      if(Object.keys(element)[0] === user.uid){
        isRated = true;
        console.log('Y', element)
        const newElement = {}
        newElement[user.uid] = rating;
        newRatings.push(newElement);
      }
      else{
        newRatings.push(element);
      }
    });

    if(isRated === false){
      const newElement = {}
      newElement[user.uid] = rating;
      newRatings.push(newElement);
    }

    await updateDoc(docRef, {
      Ratings: newRatings
    })

  getAverageRating();
  
  };

  useEffect(() => {
    if(rating !== 0){
      updateRating();
    }
    //getRating();
  }, [rating])

  

  const getRating = async () => {
    const userId = route.params ? route.params.userId : user.uid // who am I looking at?
    const docRef = doc(FIREBASE_DB, "users", userId); // doc of person being viewed
    const docSnap = await getDoc(docRef);

    const Ratings = docSnap.data().Ratings;
    var ratingFound = false;

    Ratings.forEach((element) => {
      if(Object.keys(element)[0] === user.uid){
        ratingFound = true;
        setRating(element[user.uid]);
      }
    });
    if(ratingFound !== true){
      setRating(0);
    }
  };

  const getAverageRating = async () => {
    const userId = route.params ? route.params.userId : user.uid // who am I looking at?
    const docRef = doc(FIREBASE_DB, "users", userId); // doc of person being viewed
    const docSnap = await getDoc(docRef);

    const Ratings = docSnap.data().Ratings;

    let averageRating = 0;
    let peopleCounter = 0;
    let ratings = [];

    Ratings.forEach((element) => {
      ratings.push(Object.values(element)[0]);
      peopleCounter++;
    });

    let ratingSum = ratings.reduce((a, b) => a + b, 0);
    averageRating = Number.parseFloat(ratingSum / peopleCounter).toFixed(1);

    setPeopleCounter(peopleCounter);

    if(peopleCounter == 0){
      setRatingAvg(0);
    }
    else{
      setRatingAvg(averageRating);
    }
  }

  

  const onDelete = async (id) => {
    //console.log('Post Id: ', id);
    //await deleteDoc(doc(FIREBASE_DB, "posts", id)); // use id to get post and see if img is null if not then delete img from storage (some photos still in storage - manually delete them)
    
    const docRef = doc(FIREBASE_DB, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data().postImg);
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
      //console.log("No such document!");
    }
  };

  const LikePost = async (id) => {
    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }

    const docRef = doc(FIREBASE_DB, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document Likes:", docSnap.data().likes);
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
    <ScrollView style={{flex: 1, padding: 15, backgroundColor: '#212121'}} showsVerticalScrollIndicator={false} contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
    <View className={route.params ? "w-full h-[150px] flex flex-col items-center justify-center relative top-2" : 'w-full h-[150px] flex flex-col items-center justify-center relative top-20'}>
          <Text className="text-white font-bold text-3xl">{route.params ? route.params.username : username}</Text>
          <View className="flex flex-row items-center justify-center w-[100%] mt-5">
            <Text className="text-[60px] font-bold relative right-3 text-orange-300">
              {ratingAvg}
            </Text>
            <StarRating
              rating={rating}
              onChange={setRating}
              enableHalfStar={false}
              starSize={35}
            />
            <Text className="relative left-3 text-3xl text-red-300 font-semibold">
              {peopleCounter}
            </Text>
          </View>
        </View>
        <View className={route.params ? "w-full h-[0.5px] bg-gray-400 relative top-[20px]" : 'w-full h-[0.5px] bg-gray-400 relative top-[100px]'}></View>
        <View className={route.params ? "w-full relative top-[90px] mb-[250px]" : 'w-full relative top-[170px] mb-[320px]'}>
          {myPosts && myPosts.map((item) => (
            <PostCard key={item.id} item={item} onDelete={onDelete} LikePost={LikePost} />
          ))}
        </View>
      </ScrollView>
  );
};

export default Profile;
