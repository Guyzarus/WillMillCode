// react
import React,{ useState,createContext, useContext, useEffect, useMemo} from "react";
import { WMLUIProperty } from "src/core/utility/common-utils";


export enum NotifyParamsSeverityEnum {
  ERROR= "error",
  WARNING ="warning",
  INFO="info",
  SUCCESS ="success"
}
export class NotifyParams extends WMLUIProperty {
  constructor(params:Partial<NotifyParams>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  isPresent = false;
  text = "Default Text"
  severity:NotifyParamsSeverityEnum=NotifyParamsSeverityEnum.SUCCESS
  autoHide =false
  autoHideDelay =3000
}


// @ts-ignore
const NotifyContext = createContext<{
  notifyParams:NotifyParams,
  setNotifyParams:React.Dispatch<React.SetStateAction<NotifyParams>>,
  notificationPopup:(present, severity?, text?)=>void
}>();




export let  useNotify =()=> {
    return useContext(NotifyContext);
}

export function NotifyProvider({children}) {

  const [notifyParams,setNotifyParams]  = useState(new NotifyParams());

  const notificationPopup = (present, severity?:NotifyParamsSeverityEnum, text?:string) => {
    setNotifyParams(
      new NotifyParams({
        isPresent: present,
        severity,
        text,
      })
    );
  };

  useEffect(()=>{
    if(notifyParams.autoHide){
      setTimeout(()=>{
        setNotifyParams(new NotifyParams({
          isPresent:false
        }));
      },notifyParams.autoHideDelay)
    }
  },[notifyParams])

  const value ={
    notifyParams,setNotifyParams,notificationPopup
  }


  return (
      <NotifyContext.Provider value={value}>
        {children}
      </NotifyContext.Provider>
  )



}

