// Firebase
import { getAnalytics } from "firebase/analytics";
import {  initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase,ref  as databaseRef} from "firebase/database";
import { ENV,environment } from "src/environments/environment";
import { getStorage, connectStorageEmulator,ref  as storageRef } from "firebase/storage";

// Firebase configs
let firebaseConfig = ENV.firebase

// Initialize Firebase & Firebase Authentication:
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const firebaseStorage =  getStorage(app);
export const firebaseStorageRef = storageRef(firebaseStorage);
export const firebaseDB = getDatabase(app);
export const firebaseDBRef= databaseRef(firebaseDB);

// For auth emulator:
if(environment==="dev"){
  connectAuthEmulator(auth, "http://127.0.0.1:9099",{disableWarnings:true})
  connectStorageEmulator(firebaseStorage, "localhost", 9199)
}


export class FBPOVEventAPIModel {
  constructor(params:Partial<FBPOVEventAPIModel>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  address: {
    city: string;
    coords: [number,number];
    number: string;
    state: string;
    streetName: string;
    unit: string;
    zip: string;
    country:string,
    isOnline:boolean
  };
  altImgUrls: string[];
  desc: string;
  eventbriteId: string;
  genreId: number;
  hostedBy: string;
  mainImgUrl: string;
  prices: {
    currency: string;
    display: string;
    major_value: string;
    value: number;
    ticketName:string
  }[];
  schedules: {
    end: string;
    start: string;
  }[];
  title: string;
  vibeScore = {
    amountOfRatings:0,
    density:0,
    diversity:0,
    energy:0,
    friendliness:0,
  };
  id: string;


}

