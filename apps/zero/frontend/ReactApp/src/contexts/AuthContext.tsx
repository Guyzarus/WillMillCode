// react

import React,{ createContext, useContext, useState, useEffect } from "react";


// images
import logo from "src/assets/media/shared/logo.png"
// firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
} from "firebase/auth";

// auth
import { auth, firebaseDB } from "../api/firebase";
import { get, query, ref, set, push, update } from "@firebase/database";
import { ENV } from "src/environments/environment";
import { WMLAPIError, WMLUIProperty } from "src/core/utility/common-utils";
import { useNavigate } from "react-router-dom";
import { NotifyParams, NotifyParamsSeverityEnum, useNotify } from "./NotifyContext";
import { useTranslation } from "react-i18next";

// Returns a Consumer & a Provider component. Provider provides state to its children.
// It takes in the value prop & passes it down to its child components that may need access to them.
// The consumer consumes & uses the state passed down to it by the provider:
// @ts-ignore
const AuthContext = createContext<{
  profileData:AuthUser,
  handleLogout:()=>void
  [k:string]:any
}>();

// Allows us to consum contezt in our application by returning an instance of AuthContext:
export function useAuth() {
  return useContext(AuthContext);
}

export class AuthAddNFT {
  constructor(params = {}) {
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  title= "My NFT"
  description ="My NFT description"
  userId= ""
  eventId= ""
  eventPhotoURL=""
  ipfsURL = ""
  nftTransactionHash=""
  isMftMinted= false
  vibeScore ={friendliness: 0, energy: 0, density: 0, diversity: 0}
  attributes :{
    [k:number]:{trait_type: string, value: string}
  } = {}
}


export class AuthEventCheckIn {
  constructor(params = {}) {
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  userId
  eventId
  isCheckedIn = true
  id = ""
  vibeScore = {
    density: "",
    diversity: "",
    energy: "",
    friendliness: ""
  }
}



export class AuthUser {
  constructor(params = {}) {
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  get displayTapIns(){
    return `${this.tapIns} PoV`
  }

  get displayVibeChecks(){
    return `${this.vibeChecks} Vibe Checks`
  }


  userId = ""
  title = ""
  firstName = ""
  lastName = ""
  phoneNum = ""
  email = ""
  biography = ""
  location = ""
  language = ""
  socialWebsite = ""
  socialTwitter = "https://twitter.com"
  socialInstagram= "https://www.instagram.com"
  socialFacebook= "https://www.facebook.com"
  socialLinkedin= "https://www.linkedin.com"
  tribe ="Main Tribe"
  usersNFTs : {
    userEventNFTId:string,
    eventId:string
    eventPhotoURL:string
    eventPhotoURLWasRetrieved:boolean
    isMftMinted:boolean
    nftTransactionHash:string
    userId:string,
    title:string,
    description:string
    ipfsURL:string,
    vibeScore :{
      friendliness: number,
      energy: number,
      density: number,
      diversity: number
    }
    attributes :{
      [k:number]:{trait_type: string, value: string}
    }
  }[]=[]
  tapIns:number = 0
  vibeChecks:number = 0
  attributes
  isAnonymous = false
  isUserInfoLoaded = false
  isAdmin = false
  userLoginStatus:""|"isLoggedIn"|"isNotLoggedIn"=""
}

export function AuthProvider({children}) {

    const {
      setNotifyParams
    } = useNotify()
    const {t, i18n} = useTranslation('common');

    // User data:
    // do not export this (only use profile Data for deailing iwht user account ingo)
    const [currentAPIUser, setCurrentAPIUser] = useState<any>("a");
    const [profileData, setProfileData] = useState<AuthUser>(new AuthUser());
    const [loading, setLoading] = useState(true);

    const [userDBKey, setUserDBKey] = useState<string>();

    const [capturedFile, setCapturedFile] = useState("")

    //near account data
    const [nearAccount, setNearAccount] = useState("")
    const [nearConnector, setNearConnector] = useState()
    const navigate = useNavigate()


    // If the new account was created, the user is signed in automatically:
    function register(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Logs in a user:
    function login(email, password){

        let result = signInWithEmailAndPassword(auth, email, password);
        return result;
    }

    // Logs in an anonymous user:
    async function loginAnonymously(){
        return signInAnonymously(auth)
            .then(() => {
                // Signed in...
            })
            .catch((error) => {
                const errorCode = error.codePointAt;
                const errorMessage = error.errorMessage;
            });
    }

    // Logs out a user:
    function logout() {
      setProfileData(new AuthUser())
      setUserDBKey("")
      return signOut(auth);
    }

     async function handleNearLogout ()  {
      // @ts-ignore
      let {selector} = window
      if (selector) {
        const nearLogout = await selector.wallet();
        nearLogout.signOut();
      }
    };

    async function handleLogout() {
      try {
        if (profileData.isAnonymous) {
          console.log("Inside Anonymous Signing out");
          handleNearLogout();
        }
        // Logging out w/ firebase & navigating to home:
        await logout();
        navigate("/");
      } catch {
        setNotifyParams(
          new NotifyParams({
            isPresent:true,
            severity:NotifyParamsSeverityEnum.ERROR,
            text:t("Login.wmlNotify.logoutFail")
          })
        )
      }
    }

    // Setting the onAuthStateChanged observer on the auth object. This will notify when the user is
    // signed in & updates the state:
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {

          setCurrentAPIUser(user);
          setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
      if(currentAPIUser ==="a")return
      if(!currentAPIUser) {
        setProfileData((old) => {
          let myNew = new AuthUser(old);
          myNew.userLoginStatus = "isNotLoggedIn";
          return myNew;
        });
        return
      }
      getUserProfileData()
      .then(()=>{
        return getUsersNFTs();
      })
      .then(()=>{
        setProfileData((old) => {
          let myNew = new AuthUser(old);
          myNew.isUserInfoLoaded = true;
          myNew.userLoginStatus = "isLoggedIn";
          return myNew;
        });
      })
    },[currentAPIUser])

    async function checkInUserToAnEvent(eventId) {

      try {
        let userId = currentAPIUser.uid
        let userEventsRef = ref(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.userEvents)
        // let isUserAlreadyCheckedInRef =query(userEventsRef,orderByChild("userId"),equalTo(userId))
        let isUserAlreadyCheckedInRef = query(userEventsRef)
        let userEventsList = (await get(isUserAlreadyCheckedInRef)).val()
        let isUserAlreadyCheckedIn = Object.values(userEventsList ?? {})
          .find((userEvent:AuthEventCheckIn) => {
            return userEvent.userId === userId && userEvent.eventId === eventId;
          })

        if (!isUserAlreadyCheckedIn) {
          let newUserEventRef = push(userEventsRef)
          await set(newUserEventRef, new AuthEventCheckIn({
            eventId,
            userId,
          }))
          return "You have sucessfully checked into the event, you may proceed to event tap in"
        }
        else {
          return "You are already checked into the event you may proceed to event tap in"
        }
      }
      catch (err) {
        console.log(err)
        return "There has been an error, please try again later or contact support if the issue persists"
      }


    }

    async function addNFTToUserEventNFTTable (nftInfo){
      let userEventNFTsRef = ref(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.userEventNfts)
      let newUserEventNFTRef = push(userEventNFTsRef)
      return set(newUserEventNFTRef, nftInfo)
    }

    async function updateUserNft (nftInfo){
      let userEventNFTsRef = ref(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.userEventNfts)
      let newUserEventNFTRef = push(userEventNFTsRef)
      return set(newUserEventNFTRef, nftInfo)
    }

    async function getAllUserEvents(userId) {
      try {
        let userEventsRef = ref(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.userEvents)
        let userEventsList:AuthEventCheckIn[] = (await get(userEventsRef)).val() ?? {}
        let myArray= Object.entries(userEventsList)
        .filter(([key, val]) => {
          return val.userId === userId
        })
        return Object.fromEntries(myArray)

      }
      catch (err) {
        return []
      }
    }
    // Updates User Profile
    async function updateUserProfile (name, lastName, phone, email, bio, location, language, website, twitter){

        let resultSuccess = t("AuthContext.wmlNotify.updateUserProfileSuccess")
        let resultError = t("AuthContext.wmlNotify.updateUserProfileError")
        try{

            // Get current user:
            let userID = currentAPIUser.uid

            // Get POV Users Table:
            let povUsersRef = ref(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.povUsers);

            // Check if user is all ready signed up:
            let isUserAlreadySignedUpRef = query(povUsersRef)
            let povUsersList = (await get(isUserAlreadySignedUpRef)).val()
            let isUserSignedUp = Object.values(povUsersList??{})
                .find((povUser:any)=>{
                    return povUser.userId === userID;
                })
            let updateObj = {
              userId: userID,
              firstName: name,
              lastName: lastName,
              phoneNum: phone,
              email: email,
              biography: bio,
              location: location,
              language: language,
              socialWebsite: website,
              socialTwitter: twitter
            }

            if(!isUserSignedUp){
              let newPOVUserRef = push(povUsersRef)
              setUserDBKey(newPOVUserRef.key);
              await set(newPOVUserRef, updateObj)
            }
            if (isUserSignedUp) {
              let povUserToUpdate = ref(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.povUsers +"/" + userDBKey);
              await update(povUserToUpdate, updateObj)
            }
            setProfileData((old)=>{
              return new AuthUser({
                ...old,
                ...updateObj
              })
            })
            return resultSuccess
        }
        catch (err){
            console.log(err)
            return new WMLAPIError({
              msg:resultError
            })
        }
    }

    // Get User Profile Data:
    async function getUserProfileData() {

      // Get current user:
      let userID = currentAPIUser.uid

      // Get POV Users Table:
      let povUsersRef = ref(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.povUsers);

      let povUserQuery = query(povUsersRef);
      let povUsersList:any = (await get(povUserQuery)).val()
      let userData:any  = Object.entries(povUsersList??{})
      .find((entry:any) => {
        let [key,povUser] = entry
          if(povUser.userId === userID){
              return povUser;
          }
      }) ?? ["",{}]

      setUserDBKey(userData[0])


      let attributes = JSON.parse(currentAPIUser?.reloadUserInfo?.customAttributes ?? "{}")
      let userClaims = attributes;
      let isAdmin = ENV.auth.adminRoles.includes(userClaims.role)

      let profileData = new AuthUser({
        ...userData[1],
        isAdmin,
        attributes
      })

      setProfileData(profileData);
    }

    // Get User Profile NFTS:
    async function getUsersNFTs() {
        // Get POV Users Table:
        let povUsersNFTSRef = ref(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.userEventNfts);


        let povUsersNFTsList:{
          [k:string]:AuthUser["usersNFTs"][number]
        } = (await get(povUsersNFTSRef)).val()

        let povUsersNFTsArray = Object.entries(povUsersNFTsList?? {})
          .filter((entry:any) => {
            let [, value] = entry;
            // console.log("Inside Auth: entry - ", value)
            return value.userId === currentAPIUser.uid;
          })

        // Set User data in context:

        let currentUsersNFTs = povUsersNFTsArray.map((entry) => {
          let [key, value] = entry;
          value.userEventNFTId = key
          return value;
        })

        setProfileData((params) => {
          let newUser = new AuthUser(params);
          newUser.usersNFTs = currentUsersNFTs

          // console.log("inside nfts: ", newUser);
          return newUser;
        })
    }

    // Getting the signed in user data:
    const value = {

        login,
        register,
        nearAccount,
        setNearAccount,
        nearConnector,
        capturedFile,
        setCapturedFile,
        setNearConnector,
        logout,
        loginAnonymously,
        checkInUserToAnEvent,
        updateUserProfile,
        getUserProfileData,
        profileData,
        getAllUserEvents,
        addNFTToUserEventNFTTable,
        getUsersNFTs,
        handleLogout
    };

    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
