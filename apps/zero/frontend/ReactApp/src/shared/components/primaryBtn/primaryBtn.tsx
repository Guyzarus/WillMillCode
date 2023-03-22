import React from "react";

// styles
import "./styles.scss";

// utils
import {
  generateClassPrefix,
  WMLImage,
  WMLButton,
  WMLOptionsButton,
} from "../../../core/utility/common-utils";



export default function PrimaryBtn(props:{params:WMLOptionsButton,onClick?:(evt?:any)=>void}) {
  const classPrefix = generateClassPrefix("PrimaryBtn");
  let {params:btn} = props;
  return (
    btn.isPresent &&
    <button
    id={btn.id}
    style={btn.style}
    onClick={props.onClick ?? btn?.click}
    className={`${btn?.isChosen ?  "GlobalBtn1Chosen" : "GlobalBtn1" } ${classPrefix("MainBtn0")}`}>
      <label>{btn?.text}</label>
    </button>
  );
}
