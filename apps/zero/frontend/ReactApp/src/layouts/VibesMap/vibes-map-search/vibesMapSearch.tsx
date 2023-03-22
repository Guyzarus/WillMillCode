import React, { BaseSyntheticEvent, SyntheticEvent, useEffect, useState } from "react"

// styles
import  "./styles.scss";


// utils
import { generateClassPrefix,WMLUIProperty,WMLButton, setColorBasedOnHEXBackgroundColor, WMLOptionsButton} from "../../../core/utility/common-utils"

// mui
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { InputLabel,FormControl,MenuItem,TextField } from "@mui/material";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
// misc
import { usePOVEvents } from "src/contexts/POVEventsContext";
import { generateFakeEventProvisions, generateFakePOVEvents } from "src/core/utility/automate/scratchPad";
import { useMapbox } from "src/contexts/MapboxContext";
import { useDebouncedCallback } from "use-debounce";
import PrimaryBtn from "src/shared/components/primaryBtn/primaryBtn";
import { WMLFormDropdownParams } from "src/shared/components/wml-form/wml-form";
import { OptionsButtonGroupBtn } from "src/shared/components/options-button-group/options-button-group";
import { ENV } from "src/environments/environment";

let root= document.querySelector(":root")
let rootStyle =()=>getComputedStyle(root)
let scssMapBoxTransitionTime = rootStyle().getPropertyValue("--genre-list")
let mapBoxTransitionTime = parseFloat(scssMapBoxTransitionTime.split("s")[0]) * 1000



const useResizeWindow = (setValue)=>{
  const resizeHandler = useDebouncedCallback((event) => {
    setValue(window.innerWidth < 767)
  },mapBoxTransitionTime)


  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);
}


export default function VibesMapSearch(){


  const {
    genres,
    events,
    resetDisplayEvents,
    timeOfDay,
    setGenres,
    updateDisplayEventsBasedOnGenres,
    updateDisplayEventsBasedOnTimeOfDay,
    eventViews,
    setEventViews,
    updateDisplayEventsBasedOnName
  } = usePOVEvents()


  const classPrefix = generateClassPrefix("VibesMapSearch")
  const idPrefix = generateClassPrefix("VibesMap");

  const [myEventNameInput,setMyEventNameInput] = React.useState(new VibesMapSearchInput({
    placeholder:"Search by Event Name"
  }))

  const handleMyInputOnChange = (event:BaseSyntheticEvent)=>{
    setMyEventNameInput((oldInput)=>{
      return new VibesMapSearchInput({
        ...oldInput,
        value:event.target.value,
      })
    })
  }

  const [timeOfDayOptions,setTimeOfDay] = React.useState(new WMLFormDropdownParams({

  }))
  const [toggleTimeOfDayIds,setToggleTimeOfDayIds] = useState({value:null})

  useEffect(()=>{
    if(timeOfDay.length !==0){
      let dropdownField =new WMLFormDropdownParams({
        text:"Time of Day",
        options:timeOfDay
        .map((part)=>{
          return new WMLUIProperty({
            text:part.name,
            value:part.id,
          })
        })
      })
      setTimeOfDay(dropdownField)
    }
  },[timeOfDay])

  function handleTimeOfDayOnChange(event: SelectChangeEvent<Array<number>> ){

    setTimeOfDay((oldVal)=>{

      setToggleTimeOfDayIds({value:event.target.value})
      return new WMLFormDropdownParams({
        ...oldVal,
        // @ts-ignore
        value:event.target.value
      })
    })
  }

  function deselectAllTribes(){
    setFilterBtns((oldBtns)=>{
      const newBtns  = oldBtns
      .map((btn,index1)=>{
        let newBtn = new OptionsButtonGroupBtn(btn)
        newBtn.isChosen = false
        return  newBtn
      })

      return newBtns
    })
    setGenres((old)=>{
      return old.map((oldTribe)=>{
        return {
          ...oldTribe,
          isChosen: false
        }
      })
    })
    resetDisplayEvents()
  }

  function deselectAllTimeOfDay(){
    setTimeOfDay((oldVal)=>{
      return new WMLFormDropdownParams({
        ...oldVal,
        value:[]
      })
    })
    resetDisplayEvents()
  }

  function clearSearch(){
    // @ts-ignore
    handleMyInputOnChange({target:{value:""}})
    resetDisplayEvents()
  }

  const searchBtn = new WMLOptionsButton({
    id:idPrefix("EventNameSearchBtn"),
    text:"Search",
    click:()=>{
      deselectAllTribes()
      deselectAllTimeOfDay()
      updateDisplayEventsBasedOnName([myEventNameInput.value],events)
    }
  })

  let defaultBtn,tribeBtn,designBtn,devBtn,fashionBtn
  const [filterBtns,setFilterBtns]:[OptionsButtonGroupBtn[],React.Dispatch<React.SetStateAction<OptionsButtonGroupBtn[]>>]= React.useState([defaultBtn,tribeBtn,designBtn,devBtn,fashionBtn])
  const [toggleTribeId,setToggleTribeId] = useState({
    value:null
  })

  let handleTribeBtnOnMouseMove =(index0,event:SyntheticEvent<any,PointerEvent>)=>{

    if(event.nativeEvent.pointerType==="touch" || ENV.e2e.tribeBtnHover.runningONE2E){
      return
    }
    setFilterBtns((oldBtns)=>{
      const newBtns  = oldBtns
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
      return newBtns
    })
  }

  let handleTribeBtnClick =(index0)=>{

    setFilterBtns((oldBtns)=>{
      const newBtns  = oldBtns
      .map((btn,index1)=>{
        let newBtn = new OptionsButtonGroupBtn(btn)
        if(index0 === index1){
          newBtn.isChosen = !newBtn.isChosen
          setToggleTribeId({value:newBtn.value.id})
        }
        return  newBtn
      })
      return newBtns
    })

  }

  const [areTribeBtnsInit,setareTribeBtnsInit] = useState(false)
  useEffect(()=>{

    if(areTribeBtnsInit){
      return
    }
    if(!filterBtns.includes(undefined) && events.length ===0  ) {
      return
    };
    if(genres.length ===0){
      return
    }
    setareTribeBtnsInit(true);
    [defaultBtn,tribeBtn,designBtn,devBtn,fashionBtn] = genres
    .map((genre,index0)=>{
      let btn = new OptionsButtonGroupBtn({
        value:{
          id:genre.id,
          backgroundColor:genre.color,
          color:setColorBasedOnHEXBackgroundColor(genre.color)
        },
        class:classPrefix(`Pod1Btn0`),
        text:genre.name
      })
      return btn
    })
    setFilterBtns([defaultBtn,tribeBtn,designBtn,devBtn,fashionBtn])

  },[genres,events,areTribeBtnsInit])


  useEffect(()=>{
    if(toggleTribeId.value){
      deselectAllTimeOfDay()
      clearSearch()
      updateDisplayEventsBasedOnGenres([toggleTribeId.value],events)
    }
  },[toggleTribeId])

  useEffect(()=>{
    if(toggleTimeOfDayIds.value){
      deselectAllTribes()
      clearSearch()
      updateDisplayEventsBasedOnTimeOfDay(toggleTimeOfDayIds.value,events)
    }
  },[toggleTimeOfDayIds])

  const listMapMobileBtn = new WMLButton({
    text:"List"
  })

  const [listBtn,setListBtn] = useState(new WMLOptionsButton())
  const [mapBtn,setMapBtn] = useState(new WMLOptionsButton())
  const [isMobile,setIsMobile] = useState(window.innerWidth < 767)


  let clickListBtn = ()=>{

    setMapBtn((oldVal)=>{
      return new WMLOptionsButton({
        ...oldVal,
        isChosen:false
      })
    })
    setListBtn((oldVal)=>{
      return new WMLOptionsButton({
        ...oldVal,
        isChosen:!listBtn.isChosen
      })
    })
    if(!eventViews.includes("map") ){
      setEventViews(["list","map"])
    }
    else{
      setEventViews(["list"])
    }
  }

  let clickMapBtn =()=>{
    setListBtn((oldVal)=>{
      return new WMLOptionsButton({
        ...oldVal,
        isChosen:false
      })
    })
    setMapBtn((oldVal)=>{
      return new WMLOptionsButton({
        ...oldVal,
        isChosen:!mapBtn.isChosen
      })
    })
    if(!eventViews.includes("list") && !isMobile){
      setEventViews(["list","map"])
    }
    else{
      setEventViews(["map"])
    }
  }

  useResizeWindow(setIsMobile)

  useEffect(()=>{
    if(isMobile && eventViews.includes("list") && eventViews.includes("map")){
      clickMapBtn()
    }
  },[isMobile])

  return (
    <div className="VibesMapSearch" >
      <div className={classPrefix("MainPod")}>
        <div className={classPrefix("Pod0")}>
          <div className={classPrefix("Pod0Item0")}>
            <button
            className={classPrefix("Pod0Btn0")}
            >{listMapMobileBtn.text}</button>
            <div className={classPrefix("Pod0Icon0")}>
              <SearchOutlinedIcon/>
            </div>
            <div className={classPrefix("Pod0Input0")}>
              <TextField fullWidth
                id={idPrefix("EventNameSearch")}
                variant="standard"
                value={myEventNameInput.value}
                label={myEventNameInput.placeholder}
                onChange={handleMyInputOnChange}
              />
            </div>
            <div className={classPrefix("Pod0Item3")}>
            <i className={`fa-solid fa-filter ${classPrefix("Pod0Icon1")}`}></i>
            </div>
          </div>


          <div className={classPrefix("Pod0Item1")}>
            <div className={classPrefix("Pod0Item2")}>
              <FormControl fullWidth>
                <InputLabel  >{timeOfDayOptions.text}</InputLabel>
                <Select
                  multiple
                  // @ts-ignore
                  value={timeOfDayOptions.value}
                  label={timeOfDayOptions.text}
                  onChange={handleTimeOfDayOnChange}
                  id={idPrefix("TimeOfDay")}
                >
                  {
                    React.Children.toArray(
                      timeOfDayOptions.options
                      .map((option,index0)=>{
                        return <MenuItem
                        id={idPrefix("TimeOfDayOption"+index0)}
                        value={option.value}>{option.text}</MenuItem>
                      })
                    )
                  }
                </Select>
              </FormControl>
            </div>

            <PrimaryBtn params={searchBtn}/>
            <button
            id={idPrefix("ToggleMap")}
            style={{
              backgroundColor:mapBtn.isChosen ? "#000000":"",
              color:mapBtn.isChosen ? "#FFFFFF":"",
            }}
            onClick={clickMapBtn} className={classPrefix("Pod0Btn2")}>
              <MapOutlinedIcon/>
            </button>
            <button
            id={idPrefix("ToggleList")}
            style={{
              backgroundColor:listBtn.isChosen ? "#000000":"",
              color:listBtn.isChosen ? "#FFFFFF":"",
            }}
            onClick={clickListBtn}  className={classPrefix("Pod0Btn2")}>
              <FormatListBulletedIcon/>
            </button>
          </div>
        </div>
        <div className={classPrefix("Pod1")}>
          {React.Children.toArray(filterBtns.map((btn,index0)=>{
            return <button
            id={idPrefix(["Tastemaker","Nuts","Devs","Founders","Creatives"][index0])+"ToggleBtn"}
            style={{
              backgroundColor: btn?.isHover || btn?.isChosen ? btn?.value.backgroundColor : "",
              color: btn?.isHover || btn?.isChosen ? btn?.value.color : ""
            }}
            onPointerLeave={(event)=>handleTribeBtnOnMouseMove(index0,event)}
            onPointerEnter={(event)=>handleTribeBtnOnMouseMove(index0,event)}
            onClick={()=>{handleTribeBtnClick(index0)}}
            className={btn?.class}
            >
              {btn?.text}
            </button>
          }))}
        </div>
      </div>
    </div>
  )
}

class VibesMapSearchInput extends WMLUIProperty {
  constructor(params:Partial<VibesMapSearchInput>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  placeholder:string
  onInput
}





