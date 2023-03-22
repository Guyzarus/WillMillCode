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



export default function SecondaryBtn(props:{params:WMLOptionsButton,onClick?:(evt?:any)=>void}) {
  const classPrefix = generateClassPrefix("SecondaryBtn");
  let {params:btn} = props;
  return (
    btn.isPresent &&
    <button
    id={btn.id}
    style={btn.style}
    onClick={props.onClick ?? btn?.click}
    className={`${classPrefix("MainBtn0")} GlobalBtn0`}>
      <label>{btn?.text}</label>
    </button>
  );
}
