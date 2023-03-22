import React from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix, WMLUIProperty } from "src/core/utility/common-utils";



export default function StrikeThru(props:{params?:WMLUIProperty}) {
  let params = props.params || new WMLUIProperty();
  return (
    <div className="StrikeThru" style={params.style}>
    </div>
  );
}
