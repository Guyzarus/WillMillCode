import React, { useEffect, useState } from "react";

// styles
import "./styles.scss";

// utils
import {
  generateClassPrefix,
  WMLImage,
  WMLButton,
  displayXXLarge,
  WMLOptionsButton,
} from "../../core/utility/common-utils";
import ShrikhandText, { ShrikhandTextParams } from "src/shared/components/ShrikhandText/Shrikhand";
import PrimaryBtn from "src/shared/components/primaryBtn/primaryBtn";
import PovTable, { PovTableParams } from "src/shared/components/povTable/PovTable";
import { POVEvent, usePOVEvents } from "src/contexts/POVEventsContext";
import { useNavigate } from "react-router-dom";
import { ENV, environment } from "src/environments/environment";
import { useTranslation } from "react-i18next";
import { NotifyParams, NotifyParamsSeverityEnum, useNotify } from "src/contexts/NotifyContext";


let adminTitle = new ShrikhandTextParams({
  text: "Admin Panel",
  type:"h1",
  style:{
    fontSize: displayXXLarge,
  }

})

function useUpdateCurrenTable (setTargetTable,setCurrentTable,entries,index){


  useEffect(()=>{
    setTargetTable((old)=>{
      let myNew = new PovTableParams({
        ...old,
        loading:false
      })
      myNew.rows = entries ?? []

      return myNew
    })
  },[entries])
}
export default function AdminPanelLayout() {

  const {
    events,
    genres,
    timeOfDay,
    provisions
  } = usePOVEvents()
  let navigate = useNavigate()
  const {
    setNotifyParams
  } = useNotify()
  const {t, i18n} = useTranslation('common');

  const [currentTable,setCurrentTable] = useState({value:null})
  const workingOnFeature =           new NotifyParams({
    isPresent:true,
    severity:NotifyParamsSeverityEnum.WARNING,
    text:t("AdminPanel.devsWorking")
  })

  let toggleTable:any =(index0:number)=>{
    setmenuItems((olds)=>{
      let myNew =   olds.map((old,index1)=>{
        if(index1 === index0){
          old.isChosen = true
          setCurrentTable({value:index0})
        }
        else{
          old.isChosen =false
        }
        return new WMLOptionsButton(old)
      })
      return myNew
    })
  }

  const [eventsBtn,provisionsBtn,partsOfDayBtn,tribeBtn] = [
    "Events","Event provisions","Parts of Day","Tribes"
  ]
  .map((text,index0)=>{
    return new WMLOptionsButton({
      isChosen:[true,false,false,false][index0],
      text,
      click:()=>toggleTable(index0)
    })
  })

  const [createEventsBtn,createprovisionsBtn,createpartsOfDayBtn,createTribeBtn] = [
    "Create Event","Create Event provision","Create Parts of Day","Create Tribe"
  ]
  .map((text,index0)=>{
    return new WMLOptionsButton({
      text,
      click:()=>{
        let url = {
          0:ENV.nav.urls.createEvent
        }[index0]
        // window.location.href  = url
        navigate(url)

      }
    })
  })

  const [menuItems,setmenuItems] = useState([eventsBtn,provisionsBtn,partsOfDayBtn,tribeBtn] )
  const [createmenuItems,createsetmenuItems] = useState([createEventsBtn,createprovisionsBtn,createpartsOfDayBtn,createTribeBtn] )
  const classPrefix = generateClassPrefix("AdminPanelLayout");
  const [eventsTable,setEventsTable] = useState(new PovTableParams<POVEvent>({
    columns:[
      {field:"title",headerName:"Event Name",width:320},
      {field:"displayVibeScore",headerName:"Vibe Score"},
      {field:"displayAddress",headerName:"Address",width:300},
      {field:"displayGenre",headerName:"Tribe",width:300},
      {field:"displayPrice",headerName:"Prices"}
    ],
    onCellClick:(params,event,details)=>{
      navigate(ENV.nav.urls.editEvent+"/"+params.row.id)
    }
  }))

  const [provisionsTable,setprovisionsTable] = useState(new PovTableParams({
    columns:[
      {field:"name",headerName:"Provision Name",width:220},
      {field:"defaultDesc",headerName:"Description",width:300},
    ],
  }))

  const  [partsOfDayTable,setPartsOfDayTable] = useState(new PovTableParams({
    columns:[
      {field:"name",headerName:"Time of DAY",width:120},
      {field:"range",headerName:"Defined hour ranges",width:300},
    ],
  }))

  const  [tribesTable,setTribesTable] = useState(new PovTableParams({
    columns:[
      {field:"name",headerName:"Name",width:320},
      {field:"color",headerName:"Color"},
    ],
  }))


  useUpdateCurrenTable(setEventsTable,setCurrentTable,events,0)
  useUpdateCurrenTable(setprovisionsTable,setCurrentTable,provisions,1)
  useUpdateCurrenTable(setPartsOfDayTable,setCurrentTable,timeOfDay,2)
  useUpdateCurrenTable(setTribesTable,setCurrentTable,genres,3)

  let tableInit = false
  useEffect(()=>{
    if(!tableInit){
      tableInit = true
      setCurrentTable({value:0})
    }
  },[events])

  useEffect(()=>{
    if([0,1,2,3].includes(currentTable.value) ){

      setTableParams({
        0:eventsTable,
        1:provisionsTable,
        2:partsOfDayTable,
        3:tribesTable
      }[currentTable.value])
    }
  },[currentTable])

  const [tableParams,setTableParams] = useState(eventsTable)

  const returnToHomeBtn = new WMLOptionsButton({
    text:t("AdminPanel.backToHomePage"),
    click:()=>{
      navigate(ENV.nav.urls.home)
    }
  })


  return (
    <div className="AdminPanelLayout">
      <div className={classPrefix("MainPod")}>
        <div className={classPrefix("Pod0")}>
          <ShrikhandText params={adminTitle}/>
          <PrimaryBtn params={returnToHomeBtn}/>
        </div>
        <div className={classPrefix("Pod1")}>
          <div>
            {menuItems.map((btn,index0)=>{
              return <PrimaryBtn key={index0}  params={btn}/>
            })}
          </div>
          <div>
            {createmenuItems.map((btn,index0)=>{
              return <PrimaryBtn key={index0}  params={btn}/>
            })}
          </div>

        </div>
        <div className={classPrefix("Pod2")}>
          <PovTable params={tableParams}/>
        </div>
      </div>
    </div>
  );
}
