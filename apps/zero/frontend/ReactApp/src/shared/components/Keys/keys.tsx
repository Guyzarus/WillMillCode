import React from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix, WMLRoute, WMLUIProperty } from "src/core/utility/common-utils";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ENV } from "src/environments/environment";
import { Link } from "react-router-dom";


export class KeysParams {
  constructor(params:Partial<KeysParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.keys = this.keys
    .map((key)=>{
      if(!key.container){
        key.container = new WMLUIProperty()
      }
      if(!key.text.type){
        key.text.type="text"
      }
      return key
    })
  }
  container = new WMLUIProperty()
  keys:{
    icon:WMLUIProperty<JSX.Element>,
    text:WMLRoute<any,"link"|"text">,
    container?:WMLUIProperty
  }[] = []
}

export default function Keys(props:{params:KeysParams}) {
  const classPrefix = generateClassPrefix("Keys");
  let {params}=props
  return (
    <div className="Keys">
      <div className={classPrefix("MainPod")}>
        <div style={params.container.style} className={classPrefix("Pod0")}>
          {
            React.Children.toArray(
              params.keys
              .map((property)=>{
                return(
                  <div  style={property.container.style} className={classPrefix("Pod0Item0")}>
                  {property.icon.value}
                  { property.text.type === "text" &&
                    <p
                    id={property.text.id}
                    >{property.text.text}</p>
                  }
                  { property.text.type === "link" && !Object.values(ENV.nav.urls).includes(property.text.route) &&
                    <a
                    id={property.text.id}
                    href={property.text.route}>{property.text.text}</a>
                  }
                  { property.text.type === "link" && Object.values(ENV.nav.urls).includes(property.text.route) &&
                    <Link
                    id={property.text.id}
                    to={property.text.route}>{property.text.text}</Link>
                  }
                 </div>
                )
              })
            )
          }
        </div>
      </div>
    </div>
  );
}
