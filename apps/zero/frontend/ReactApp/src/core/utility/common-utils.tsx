import { faker } from "@faker-js/faker"
import dayjs from "dayjs"
import { CSSProperties, SyntheticEvent } from "react"


export let root= document.querySelector(":root")
export let rootStyle =()=>getComputedStyle(root)
export let povliteblue = rootStyle().getPropertyValue("--pov-liteblue")
export let povskyblue = rootStyle().getPropertyValue("--pov-skyblue")
export let povpeach = rootStyle().getPropertyValue("--pov-peach")
export let povorange = rootStyle().getPropertyValue("--pov-orange")
export let povminty = rootStyle().getPropertyValue("--pov-minty")
export let povdietpurple = rootStyle().getPropertyValue("--pov-dietpurple")
export let blackColor = rootStyle().getPropertyValue("--black")
export let whiteColor = rootStyle().getPropertyValue("--white")
export let darkGreyColor = rootStyle().getPropertyValue("--dark-grey")
export let displayFont = rootStyle().getPropertyValue("--display")
export let displayXXLarge = rootStyle().getPropertyValue("--display-xx-large")
export let borderRadius0 = rootStyle().getPropertyValue("--border_radius1")
export let scssMapBoxTransitionTime = rootStyle().getPropertyValue("--app-transition-time")
export let mapBoxTransitionTime = parseFloat(scssMapBoxTransitionTime.split("s")[0]) * 1000
export let  CSSVARS={
  spacing1:rootStyle().getPropertyValue("--spacing1"),
  spacing2:rootStyle().getPropertyValue("--spacing2"),
  spacing3:rootStyle().getPropertyValue("--spacing3"),
  spacing4:rootStyle().getPropertyValue("--spacing4"),
  spacing5:rootStyle().getPropertyValue("--spacing5"),
  spacing6:rootStyle().getPropertyValue("--spacing6"),
  spacing7:rootStyle().getPropertyValue("--spacing7"),
  spacing8:rootStyle().getPropertyValue("--spacing8"),
  spacing9:rootStyle().getPropertyValue("--spacing9"),
  spacing10:rootStyle().getPropertyValue("--spacing10"),
}

export let convertStringToId= (myStr:string)=>{
  return "_"+myStr.replace(" ","_") + "_"
}

export let generateRandomImage =()=>{
  let src = selectRandomOptionFromArray(Object.values(faker.image).filter((val)=>{
    return val instanceof Function
  }))
  return src()
}
export function   generateClassPrefix(prefix:string) {
  return (val: string) => {
    return prefix + val
  }
}

export function makeLowerCase(myString:string) {
  return myString.toLowerCase()
}



export let updateClassString=(obj:any,myClassDefault:string,classListDefault:string)=>{

  return (val:string,type:"add"|"remove"|"clear"="add")=>{
      let myClass=myClassDefault
      let classList=classListDefault

      if(type === "add" ){
        if(!obj[classList].includes(val)){

          obj[classList].push(val)
        }
      }
      else if(type === "remove"){
        obj[classList] = (obj[classList])
        .filter((targetClass:string)=>{
          return targetClass !== val
        })
      }
      else if(type ==="clear"){
        obj[classList] = []
      }
      obj[myClass] = obj[classList]
      .reduce((acc:string,x:string)=>{
        return acc+ " " +  x
      },"")


    }
}

export let generateRandomNumber = (range: number = 100, additional: number = 0) => {
  return Math.floor(Math.random() * range) + additional
}

export let generateRandomColor = () => {
  return `#${generateRandomNumber(0xFFFFFF).toString(16)}`
}

export let selectRandomOptionFromArray = (myArray: Array<any>, index?: number) => {
  return myArray[generateRandomNumber(index ?? myArray.length)]
}

export let setColorBasedOnHEXBackgroundColor = color =>
{
  const lum = [1,3,5].map(pos => //get RGB colors array from the string at positions 1, 3 and 5 (0 = # character)
  {
    return parseInt(color.substr(pos, 2), 16);
  }).reduce((result, value, index) =>
  {
    const y = [.299 /*red*/,.587 /*green*/,.114 /*blue*/][index];
    return result + y * value // return sum of previous results
  }
  , 0 );

  const isDark = lum < 128;
  return isDark ? "white" : "black";
}



export  async function getArrayFromFirebaseRealtimeDatabase<T=any>(myPromise:Promise<T>){
  return await myPromise
  .then((snapshot:any) => {
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return [];
    }
  })
  .catch((error) => {
    console.log(error)
    return new WMLAPIError();
  })
}

export  async function getHashMapFromFirebaseRealtimeDatabase<T=any>(myPromise:Promise< any>):Promise<{[k:string]:T}> {
  return await myPromise
  .then((snapshot:any) => {
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return {};
    }
  })
  .catch((error) => {
    console.log(error)
    return new WMLAPIError();
  })
}

export let convertMilitaryToStandard = function(time) {
  let timeParts = time.split(":");
  let standardTime = "";

  if (parseInt(timeParts[0]) > 12) {
    timeParts[0] = timeParts[0] - 12;
    standardTime = timeParts.join(":") + " PM";
  } else if (parseInt(timeParts[0]) === 12) {
    standardTime = timeParts.join(":") + " PM";
  } else {
    standardTime = timeParts.join(":") + " AM";
  }

  return standardTime;
}

export let convertToDateTimeFormatStandardForTheApp =(dateTime)=>{
  return dayjs.utc(dateTime).format("YYYY-MM-DDThh:mm:ss")+"Z"
}

export enum InputTypes{
  firstName="given-name",
  lastName="family-name",
  streetNumber="address-line1",
  streetName = "address-line2",
  unit="address-line3",
  city="address-level2",
  state="address-level1",
  postalCode="postal-code",
  country="country"
}

export enum  WMLUseEffectFlags {
  PENDING,
  ACTIVE,
  COMPLETED
}

export enum WMLFormErrors{
  GENERAL,
  INVALID_ADDRESS
}

export class WMLUIProperty<V=any,T=any>{
  constructor(params:Partial<WMLUIProperty> = {}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  isPresent:boolean = true
  // @ts-ignore
  value:V = ""
  text?:string = ""
  get class(){
    return this._class
  }
  set class(val){
    this.updateClassString(val)
  }
  private _class:string = ""
  private _classList:string[] = []
  updateClassString=updateClassString(this,"_class","_classList")
  style:Partial< CSSProperties> = {}
  type?:T
  click:(evt:any)=> void = (evt?:SyntheticEvent)=>{
    evt?.nativeEvent.stopImmediatePropagation()
  }
  element?:React.ElementRef<any>
  id?:string
}

export class WMLRoute<V=any,T=any> extends WMLUIProperty {
  constructor(params:Partial<WMLRoute>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  route:string = "/"
}

export class WMLButton<V=any,T=any>  extends WMLUIProperty {
  constructor(params:Partial<WMLButton> = {}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  get iconClass(){
    return this._iconClass
  }
  set iconClass(val){
    this.updateIconClassString(val)
  }
  private _iconClass:string = ""
  private _iconClassList:string[] = []
  updateIconClassString=updateClassString(this,"_iconClass","_iconClassList")

  textIsPresent:boolean = true
  iconSrc?:string = ""
  iconAlt?:string = ""
  iconIsPresent:boolean = false
  buttonClass?:string

}


export class WMLE2ETarget {
  constructor(params:Partial<WMLE2ETarget>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  runningONE2E=false
  data={}
}
export class WMLImage<V=any,T=any>  extends WMLUIProperty {
  constructor(params:Partial<WMLImage> = {}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  src!:string
  alt!:string
  ariaLabel!:string
  ariaExpanded= false
}

export class WMLEndpoint {
  constructor(params:Partial<WMLEndpoint>={}){

    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  url!:Function
  automate =false
}


export class WMLOptionsButton<V=any,T=any>  extends WMLButton {
  constructor(params:Partial<WMLOptionsButton>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  isChosen: boolean = false
}


export class WMLError {
  constructor(params:Partial<WMLError>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  msg:string|number= "There was an error"
}

export class WMLAPIError extends WMLError {
  constructor(params:Partial<WMLAPIError>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  statusCode = 500
  msg="The application is having an issue as of right now please try again later or contact support if the issue persists"
}
