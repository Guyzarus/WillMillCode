import React,{ useState,useEffect } from "react";

// styles
import "./styles.scss";

// utils
import { CSSVARS, generateClassPrefix, WMLButton, WMLImage, WMLOptionsButton, WMLUIProperty } from "src/core/utility/common-utils";

// misc
import logo from "src/assets/media/shared/logo.png";
import Keys, { KeysParams } from "../Keys/keys";
import StrikeThru from "../strike-thru/strike-thru";
import { border } from "@mui/system";
import SecondaryBtn from "../secondaryBtn/SecondaryBtn";

export class DetailCardParams {
  constructor(params:Partial<DetailCardParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.subsections = this.subsections.map((sections)=>{
      sections.value = sections.value.map((subsection)=>{
        if(subsection.type ==="keys"){

          subsection.value.keys[0].container.style =  {
            justifyContent:"flex-start",
            minWidth:"calc(120/16 * 1rem)",
            ...subsection.value.keys[0].container.style
          }
        }
        if(sections.value.every((subsection)=> subsection.type ==="desc")){
          sections.style ={
            overflow: "auto",
            flex:"1 0 calc(96/16* 1rem)",
            alignItems:"flex-start",
            height:"calc(96/16* 1rem)"
          }
        }
        return subsection
      })
      return sections
    })
  }


  readonly reactSetter:React.Dispatch<React.SetStateAction<DetailCardParams>>
  mainImg = new WMLImage({
    src:logo,
    alt:"Logo Img"
  })
  subsections:Array<WMLUIProperty<
    Array<
    WMLUIProperty<
      string,"title"
    > |
    WMLUIProperty<
      string,"desc"
    > |
    WMLUIProperty<
      JSX.Element,"icon"
    > |
    WMLUIProperty<
      string,"text"
    > |
    WMLUIProperty<
      KeysParams,"keys"
    > |
    WMLUIProperty<
      null,"strikethru"
    > |
    WMLUIProperty<
      WMLOptionsButton,"btn"
    >
    >
  >> =[]
}


export default function DetailCard(props:{params:DetailCardParams}) {
  const classPrefix = generateClassPrefix("DetailCard");
  let {params} = props
  const [mainImgSrc,setMainImgSrc] = useState(params.mainImg.src)

  let handleMainImgOnError =(err)=>{
    setMainImgSrc(logo)
  }

  return (
    <div className="DetailCard">
      <div className={classPrefix("MainPod")}>
        <section className={classPrefix("Pod0")}>
          <img
          onError={handleMainImgOnError}
          style={params.mainImg.style} className={classPrefix("Pod0Img0")} src={mainImgSrc} alt={params.mainImg.alt} />
          <section className={classPrefix("Pod0Item0")}>
            {
              React.Children.toArray(params.subsections.map((sections)=>{
                return <div style={sections.style} className={classPrefix("Pod0Item1")}>{

                  React.Children.toArray(
                    sections.value.map((subsection)=>{

                      return (
                        <>
                        {subsection.type ==="title" && <h2 className={classPrefix("Pod0Title0")}>{subsection.value}</h2>}
                        {subsection.type ==="icon" && subsection.value}
                        {subsection.type ==="desc" && <p >{subsection.value}</p>}
                        {subsection.type ==="keys" && <Keys params={subsection.value}/>}
                        {subsection.type ==="strikethru" && <StrikeThru/>}
                        {subsection.type ==="btn" && <SecondaryBtn params={subsection.value}/>}
                        </>
                      )
                    })
                  )
                }</div>
              }))
            }
          </section>
        </section>
      </div>
    </div>
  );
}
