// react
import React,{ useState,createContext, useContext, useEffect, useMemo} from "react";





export class OverlayLoadingParams {
  constructor(params:Partial<OverlayLoadingParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  isPresent =false
}

// @ts-ignore
const OverlayLoadingContext = createContext<{
  toggleOverlayLoading:Function,
  overlayLoadingParams:OverlayLoadingParams
  setoverlayLoadingParams:React.Dispatch<React.SetStateAction<OverlayLoadingParams>>
}>();



export let  useOverlayLoading =()=> {
    return useContext(OverlayLoadingContext);
}


export function OverlayLoadingProvider({children}) {

  const [overlayLoadingParams,setoverlayLoadingParams] = useState(new OverlayLoadingParams())


  let toggleOverlayLoading =(isPresent:boolean) => {
    setoverlayLoadingParams((old)=>{
      let myNew = new OverlayLoadingParams(old);
      myNew.isPresent = isPresent
      return myNew
    });
  }

  const value ={
    overlayLoadingParams,setoverlayLoadingParams,toggleOverlayLoading
  }

  return (
      <OverlayLoadingContext.Provider value={value}>
        {children}
      </OverlayLoadingContext.Provider>
  )



}

