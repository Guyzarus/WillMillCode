import React from "react";

// styles
import "./styles.scss";

// utils
import {
  generateClassPrefix,
  WMLImage,
  WMLButton,
  WMLOptionsButton,
  WMLUIProperty,
  displayXXLarge,
} from "../../../core/utility/common-utils";



export enum  ShrikhandTextParamsTypeEnum{
  h1 = "h1" ,
  h2 = "h2" ,
  h3 = "h3" ,
  h4 = "h4" ,
  h5 = "h5" ,
  h6 = "h6" ,
  p = "p" ,
  span = "span"
}
export class ShrikhandTextParams extends WMLUIProperty {
  constructor(params:Partial<ShrikhandTextParams >={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
    if(this.type === "h1"){
      this.style.fontSize = this.style.fontSize ?? displayXXLarge;
    }
    this.style =  {
      ...this?.style,
      fontFamily: 'Shrikhand',
    };

  }
  type?: "h1" | "h2" |"h3" |"h4" | "h5" | "h6" | "p" |"span" | ShrikhandTextParamsTypeEnum = "h2"
}

export default function ShrikhandText(props:{params:ShrikhandTextParams}) {
  const classPrefix = generateClassPrefix("Shrikhand");
  let {params} = props;
  return (
    <>
    {params.type === ShrikhandTextParamsTypeEnum.h1 &&   <h1 style={params.style}>{params.text}</h1>}
    {params.type === ShrikhandTextParamsTypeEnum.h2 &&   <h2 style={params.style}>{params.text}</h2>}
    {params.type === ShrikhandTextParamsTypeEnum.h3 &&   <h3 style={params.style}>{params.text}</h3>}
    {params.type === ShrikhandTextParamsTypeEnum.h4 &&   <h4 style={params.style}>{params.text}</h4>}
    {params.type === ShrikhandTextParamsTypeEnum.h5 &&   <h5 style={params.style}>{params.text}</h5>}
    {params.type === ShrikhandTextParamsTypeEnum.h6 &&   <h6 style={params.style}>{params.text}</h6>}
    {params.type === ShrikhandTextParamsTypeEnum.p &&    <p style={params.style}>{params.text}</p>}
    {params.type === ShrikhandTextParamsTypeEnum.span && <span style={params.style}>{params.text}</span>}
    </>
  );
}
