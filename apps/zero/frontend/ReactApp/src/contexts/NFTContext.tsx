// react
import React,{ useState,createContext, useContext, useEffect, useMemo} from "react";
import { MintSingleToNear } from "src/shared/components/uploadAndMint/MintSingleToNear";
import { NearWalletPopup } from "src/shared/components/walletPopup/NearWalletPopup";
import { AuthUser, useAuth } from "./AuthContext";
import { useNotify } from "./NotifyContext";





// @ts-ignore
const NFTContext = createContext<{
  mintNft:(nearMintProps: {
    title: string;
    description: string;
    ipfsLink: string;
}) => Promise<any>,
  connectToNear
}>();


export let  useNFT =()=> {
    return useContext(NFTContext);
}


export function NFTProvider({children}) {

  const {
    notificationPopup
  } = useNotify()
  const { nearAccount, nearConnector, setNearConnector, setNearAccount } =
  useAuth();
  const walletProps = { setNearAccount, setNearConnector };


  const mintNft = async(nearMintProps:{
    title:string,
    description:string,
    ipfsLink: string
  })=>{
      let params  = {
        ...nearMintProps,
        notificationPopup
      }
      let mintedHash = await MintSingleToNear(params);
      return mintedHash
      // updateUserNft(media)

  }

  const connectToNear = async () => {
    await NearWalletPopup(walletProps,true);

  };


  const value ={
    mintNft,
    connectToNear
  }


  return (
      <NFTContext.Provider value={value}>
        {children}
      </NFTContext.Provider>
  )



}

