import React, { SyntheticEvent, useState } from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix, WMLOptionsButton } from "src/core/utility/common-utils";


export class OptionsButtonGroupParams {
  constructor(params:Partial<OptionsButtonGroupParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.options = this.options.map((option,index0)=>{
      option.value._index = index0
      return option
    })
  }
  options:OptionsButtonGroupBtn[]=[]
  limit=Infinity
  chosen:OptionsButtonGroupBtn[]=[]
}

export class OptionsButtonGroupBtn<V={
  [k:string]:any
  _index?:number,
  color:string,
  backgroundColor:string
},T=any> extends WMLOptionsButton {
  constructor(params:Partial<OptionsButtonGroupBtn>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  onPointerMoveAllowDefault = true
  onClickAllowDefault = true
  onPointerMove:(
    reactSetter:React.Dispatch<React.SetStateAction<OptionsButtonGroupParams>>,
    index:number,
    event:React.PointerEvent<HTMLButtonElement>
  )=> void
  onClick:(
    reactSetter:React.Dispatch<React.SetStateAction<OptionsButtonGroupParams>>,
    index:number,
  ) => void
  isHover = false
  value:V
}

export default function OptionsButtonGroup(props:{params:OptionsButtonGroupParams}) {
  const classPrefix = generateClassPrefix("OptionsButtonGroup");
  const [params,setParams] = useState(props.params ?? new OptionsButtonGroupParams())

  let handleOptionBtnOnPointerMove =(index0,event:SyntheticEvent<any,PointerEvent>)=>{

    if(event.nativeEvent.pointerType==="touch"){
      return
    }

    setParams((old)=>{
      let myNew = new OptionsButtonGroupParams(old)
      const newOptions  = old.options
      .map((btn,index1)=>{
        let newBtn = new OptionsButtonGroupBtn(btn)
        if(index0 === index1){
          if(event.type==="pointerleave"){

            newBtn.isHover = false
          }
          else{
            newBtn.isHover = true
          }
        }
        return  newBtn
      })
      myNew.options = newOptions

      return myNew
    })
  }

  let handleOptionBtnOnPointerMoveWrapper =(btn:OptionsButtonGroupBtn,index0:number)=> (event:React.PointerEvent<HTMLButtonElement>)=> {

    btn.onPointerMove?.(setParams,index0,event)
    if(btn.onPointerMoveAllowDefault){
      handleOptionBtnOnPointerMove(index0,event)
    }
  }

  let handleOptionBtnOnClick =(index0:number)=>{
    setParams((old)=>{
      let myNew = new OptionsButtonGroupParams(old)
      let newOptions  = old.options
      .map((btn,index1)=>{
        let newBtn = new OptionsButtonGroupBtn(btn)
        if(index0 === index1){
          newBtn.isChosen = !newBtn.isChosen
          if(newBtn.isChosen){
            myNew.chosen.push(newBtn)
            if(myNew.chosen.length > myNew.limit){
              myNew.chosen.shift()
            }
          }
          else{
            myNew.chosen = myNew.chosen.filter((option)=> option.value._index === newBtn.value._index)
          }
        }
        return  newBtn
      })
      myNew.options = newOptions.map((option)=> {
        if(myNew.chosen.find((chosen)=> chosen.value._index !== option.value._index)){
          option.isChosen = false
        }
        return option
      })
      return myNew
    })
  }

  let handleOptionBtnOnClickWrapper =(btn:OptionsButtonGroupBtn,index0:number)=> (event:React.PointerEvent<HTMLButtonElement>)=> {

    btn.onClick?.(setParams,index0)
    if(btn.onClickAllowDefault){
      handleOptionBtnOnClick(index0)
    }
  }
  return (
    <div className="OptionsButtonGroup">
      <div className={classPrefix("MainPod")}>
        <div className={classPrefix("Pod0")}>{
          React.Children.toArray(
            params.options
            .map((btn,index0)=>{
              return <button
              className={classPrefix("Pod0Btn0")}
              style={{
                backgroundColor: btn?.isHover || btn?.isChosen ? btn?.value.backgroundColor : "",
                color: btn?.isHover || btn?.isChosen ? btn?.value.color : ""
              }}
              onPointerEnter={handleOptionBtnOnPointerMoveWrapper(btn,index0) }
              onPointerLeave={handleOptionBtnOnPointerMoveWrapper(btn,index0) }
              onClick={handleOptionBtnOnClickWrapper(btn,index0) }
              >
                <label>{btn.text}</label>
              </button>
            })
          )
        }</div>
      </div>
    </div>
  );
}
