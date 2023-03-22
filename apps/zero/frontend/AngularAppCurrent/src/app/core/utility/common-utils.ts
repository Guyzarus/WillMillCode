import { fromEvent, map } from "rxjs";



export class LinkedList<T>{

  constructor(startVal:any){
      this._head.val = startVal;
      (this.list ) = this._head
  }

  addNode= (val)=>{
      (this.list ).next = {
          val,
          next:null
      }
      this.list =  (this.list ).next
  }

  getHead= ()=>{
      return this._head
  }

  closeList = ()=>{
    this.list.next= this.getHead()
  }



  _head:{
    val:T ,
    next:any
  }= {
      val:null as any,
      next:null as any
  }

  list= null
}

export let updateClassString=(obj:any,myClassDefault:string,classListDefault:string)=>{

    return (val:string,type:"add"|"remove"="add")=>{
        let myClass=myClassDefault
        let classList=classListDefault
        if(type === "add"){
          if(!obj[classList].includes(val)){

            obj[classList].push(val)
          }
        }
        else if(type === "remove"){
          obj[classList] = (obj[classList])
          .filter((myClass)=>{
            return myClass !== val
          })
        }
        obj[myClass] = obj[classList]
        .reduce((acc,x,i)=>{
          return acc+ " " +  x
        },"")
      }
  }

export let readFileContent = (
  file: File,
  readPredicate:"readAsBinaryString" |"readAsArrayBuffer" | "readAsDataURL" | "readAsText" ="readAsBinaryString" )=> {
    let reader = new FileReader();
    reader[readPredicate](file)

    return fromEvent(reader as any,"load")
    .pipe(
      map(()=>{

        let content = reader.result.toString()

        return {content,file}
      })
    )

  }


export let  transformFromCamelCaseToSnakeCase = str => str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
export let  transformFromSnakeCaseToCamelCase = (str)=>{
    return   str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('_', '')
    )
  }

export let retriveValueFromPXUnit = (str: string) => {
  return str.match(/\d+/)[0]
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

let root= document.querySelector(":root")
let rootStyle =()=>getComputedStyle(root)
let appTransitionTime =  rootStyle().getPropertyValue("--app-transition-time")
export let  CSSVARS={
  povliteblue : rootStyle().getPropertyValue("--pov-liteblue"),
  povskyblue : rootStyle().getPropertyValue("--pov-skyblue"),
  povpeach : rootStyle().getPropertyValue("--pov-peach"),
  povorange : rootStyle().getPropertyValue("--pov-orange"),
  povminty : rootStyle().getPropertyValue("--pov-minty"),
  povdietpurple : rootStyle().getPropertyValue("--pov-dietpurple"),
  blackColor : rootStyle().getPropertyValue("--black"),
  whiteColor : rootStyle().getPropertyValue("--white"),
  darkGreyColor : rootStyle().getPropertyValue("--dark-grey"),
  displayFont : rootStyle().getPropertyValue("--display"),
  displayXXLarge : rootStyle().getPropertyValue("--display-xx-large"),
  borderRadius0 : rootStyle().getPropertyValue("--border-radius1"),
  appTransitionTime,
  javascriptAppTransitionTime : parseFloat(appTransitionTime.split("s")[0]) * 1000,
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
