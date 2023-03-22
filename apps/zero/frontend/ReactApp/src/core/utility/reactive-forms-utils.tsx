import { AbstractControl } from "react-reactive-form"
import { WMLImage } from "./common-utils"

export let ValidatorsFileType=(fileTypes=["image/png","image/jpeg","image/jpg"]) =>(c:AbstractControl)=>{

  if(!Array.isArray(c.value)  ){
    return null
  }
  /**
   @todo: figure whats going on with the useState hook the the value does have the correct file type even though its async
  **/
  fileTypes.push(undefined)

  let goodFiles = c.value.every((file:WMLImage) => {
    let goodFileExt = fileTypes.includes(file.value.type)
    return goodFileExt
  })
  if(goodFiles){
    return null
  }
  else{
    return{
      fileExt:true
    }
  }
}
