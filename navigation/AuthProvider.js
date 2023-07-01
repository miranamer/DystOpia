import React, { createContext, useState } from "react";
import { FIREBASE_AUTH } from "../Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const auth = FIREBASE_AUTH

    return (
        <AuthContext.Provider
        value={{
            user,
            setUser,
            LoginFunc: async (auth, email, password) => {
                try{
                  await signInWithEmailAndPassword(auth, email, password);
                  alert('Login Successful')
                } catch(error){
                  console.log(error);
                  alert('Wrong Email / Password')
                } 
              },
              CreateAccount: async (auth, email, password) => {
                try{
                  await createUserWithEmailAndPassword(auth, email, password);
                  alert('Account Successfully Created!')
                } catch(error){
                  console.log(error);
                }
              },
              SignOut: async () => {
                auth.signOut();
              }
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}