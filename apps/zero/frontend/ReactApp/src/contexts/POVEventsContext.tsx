// react
import React, { useState, createContext, useContext, useEffect } from "react";

// auth
import {ref,get,child, set } from "firebase/database";
import { FBPOVEventAPIModel, firebaseDB, firebaseDBRef, firebaseStorageRef } from "src/api/firebase";
import {
  convertStringToId,
  convertToDateTimeFormatStandardForTheApp,
  getArrayFromFirebaseRealtimeDatabase,
  getHashMapFromFirebaseRealtimeDatabase,
  WMLAPIError,
  WMLImage,
} from "src/core/utility/common-utils";
import { ENV } from "src/environments/environment";

import { eventBriteAPIKey, eventBriteAPIReqParams, orgId } from "src/api/eventbrite";
import dayjs from "dayjs";

// media
import logo from "src/assets/media/shared/logo.png"
import { NotifyParams, NotifyParamsSeverityEnum, useNotify } from "./NotifyContext";
import { StorageReference, listAll, deleteObject,ref  as storageRef } from "firebase/storage";


// @ts-ignore
const EventsContext = createContext<{
  events:POVEvent[],
  displayEvents:POVEvent[],
  currentEvent:POVEvent,
  setCurrentEvent:React.Dispatch<React.SetStateAction<POVEvent>>,
  setDisplayEvents:React.Dispatch<React.SetStateAction<POVEvent[]>>,
  genres:any[],
  setGenres:React.Dispatch<React.SetStateAction<any[]>>,
  provisions:any,
  timeOfDay:any,
  getListOfEvents:any,
  getGenreList:any,
  getTimesOfDay:any,
  updateDisplayEventsBasedOnGenres:any,
  updateDisplayEventsBasedOnTimeOfDay:any,
  eventViews:any,
  setEventViews:any,
  getProvisions:any,
  updateDisplayEventsBasedOnName:any,
  useSetCurrentPOVEvent:any,
  deletePOVEvent:(eventId:string)=>Promise<any>,
  resetDisplayEvents:()=>void,
  getFirebaseEventsTable:()=>Promise<FBEvent[]>,
  getFirebaseUserEventsTable:(userId?:string)=>Promise<any>,
  deleteFirebaseStorageFolder:(StorageReference)=>Promise<any>,
  updateEventBriteEvent:(params:{
    id:string,
    name?:string,
    desc?:string,
    startTime?:string,
    endTime?:string
    cost?:string
  })=>Promise<any>
}>();



export let  usePOVEvents =()=> {
    return useContext(EventsContext);
}


export class POVEvent  {
  constructor(params:Partial<POVEvent>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  id:string
  /**
   * @deprecated do not use
  */
  eventbriteId:string =""

  title:string
  desc:string
  vibeScore={
    diversity: 0,
    density: 0,
    energy: 0,
    friendliness: 0,
    amountOfRatings:0
  }
  provisions:Array<{
    name:string,
    desc:string
  }>=[]
  address:{
    city: string;
    coords: [number,number];
    number: string;
    state: string;
    streetName: string;
    unit: string;
    zip: string;
    country:string
  }

  /**
   * @deprecated use the property on schedules instead
  */
  partsOfDay =[]
  prices = [{
    ticketName:"General",
    display: 'Free',
    currency: 'USD',
    value: 0,
    major_value: '00.00'}]

  genre:{
    color:string,
    name:string,
    id:number
  }

  mainImg=new WMLImage({
    src:logo,
    alt:"POV Logo"
  })
  altImgs:WMLImage[] =[]
  imagesIsPresent:boolean = true



  schedules:{
    start:{
      utc:string,
      local:string
    },
    end:POVEvent["schedules"][number]["start"]
    partsOfDay:[]
  }[] = []
  hostInfo:{
    fullName:string
  }
  get tribe(){
    return this.genre
  }
  get displayProvisionsInfo(){
    let provisionString = this.provisions.map((prov)=>prov.name).join(", ")
    return `Includes ${provisionString}`
  }
  get displayPrice(){
    if(!this.prices){
      console.log(this.id)
      return ""
    }
    return this.prices[0].display
  }
  get displayGenre(){
    return this.genre.name
  }
  get displayVibeScore(){
    let scores = Object.entries(this.vibeScore)
    .filter(([key,value])=>{
      return [
        "diversity",
        "density",
        "energy",
        "friendliness",
      ].includes(key)
    })
    .map(([key,value])=> value)
    let total =       scores
    .reduce((acc,x)=>{
      return acc+x
    })
    let average = (total/scores.length).toFixed(2)
    return `${
      average
    } vibes`
  }
  get displayTime(){
    let start = dayjs(this.schedules[0].start.utc).format("MMM D , YYYY @ h:mm A")
    let end = dayjs(this.schedules[0].end.utc).format("MMM D , YYYY @ h:mm A")
    return `${start} - ${end}`
  }
  get displayAddress(){
    let {number,streetName, unit,city,state,zip} = this.address
    return `${number} ${streetName} ${unit} ${city} ${state}, ${zip}`
  }
  get displayEventDuration(){
    let date1 = new Date(this.schedules[0].start.utc)
    let date2 = new Date(this.schedules[0].end.utc)
    let diff = date2.valueOf() - date1.valueOf();

    let result =dayjs.duration(diff)
    let resultString = ["years","months","days","hours","minutes"]
    .reverse()
    .reduce((acc,x,i)=>{
      let value = result[x]()
      if(value===0 ){
        return acc
      }
      return `${value} ${x} ${acc}`
    },"")
    return resultString
  }
  get idByTribeName(){
    return convertStringToId(this.tribe.name)
  }
}
export class FBEvent {
  constructor(params:Partial<FBEvent>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  address: {
    city: string;
    coords: number[];
    number: string;
    state: string;
    streetName: string;
    unit: string;
    zip: string;
  };
  eventId: string;
  genreId: number;
  hostedBy: string;
  vibeScore= {
    density:0,
    diversity:0,
    energy:0,
    friendliness:0,
    amountOfRatings:0
  }

}




export function EventsProvider({children}) {



  const [events,setEvents] = useState([])
  const [displayEvents,setDisplayEvents] = useState([])
  const [genres,setGenres] = useState([])
  const [timeOfDay,setTimeOfDay] = useState([])
  const [eventViews,setEventViews]:[Array<"list"|"map">,Function] = useState(["list","map"])
  const [currentEvent,setCurrentEvent] = useState<POVEvent>(null)
  const [provisions,setProvisions] = useState([])

  const  {
    setNotifyParams
  } =useNotify()

  let createEventbriteEvent =async (uiReqBody: {
    name:string,
    start: { timezone?: string; value: string };
    end: { timezone?: string; value: string };
    currency?: string;
    cost:string,
    desc:string
  }) => {

    let startUTC= convertToDateTimeFormatStandardForTheApp(uiReqBody.start.value)
    let endUTC= convertToDateTimeFormatStandardForTheApp(uiReqBody.end.value)
    let apiReqBody =  {
      event: {
        name: {
          html:uiReqBody.name
        },
        start: {
          timezone: uiReqBody.start.timezone ??"America/New_York",
          utc: startUTC,
        },
        end: {
          timezone: uiReqBody.end.timezone ?? "America/New_York",
          utc: endUTC,
        },
        currency: uiReqBody.currency ?? "USD",
      },
    }
    let ebEvent = await (
      await fetch(
        `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/`,
        {
          ...eventBriteAPIReqParams,

          body: JSON.stringify(apiReqBody),
        }
      )
    ).json();
    await updateEventBriteEvent({
      id:ebEvent.id,
      name:uiReqBody.name,
      desc:uiReqBody.desc,
      cost:uiReqBody.cost
    })
    await publishEventbriteEvent(ebEvent.id)
    return ebEvent
  }

  function useSetCurrentPOVEvent(navigate,params ) {
    useEffect(() => {
      if (events?.length > 0 && params.id && (!currentEvent || currentEvent.id !== params.id)) {

        let myEvent = events.find((event) => params.id === event.id);

        if (!myEvent) {
          setNotifyParams(
            new NotifyParams({
              isPresent: true,
              severity:NotifyParamsSeverityEnum.INFO,
              text: "This event may have been deleted however you can still see all your NFT related to that event,please try again later or contact support if the issue persists",
            })
          );
          navigate(ENV.nav.urls.vibesMap);
        }
        setCurrentEvent(myEvent);
      }
    }, [params, events]);
  }

  async function addTicketTypeToEventBrite(eventId: string,cost:string) {

    let reqBody:any = {
      ticket_class:{
        name:"general",
        quantity_total: 1,
        free:cost === "0"
      }
    }
    if(!reqBody.ticket_class.free){
      reqBody.ticket_class.cost = `USD,${cost}`
    }
    await (
      await fetch(
        `https://www.eventbriteapi.com/v3/events/${eventId}/ticket_classes/`,
        {
          ...eventBriteAPIReqParams,
          body: JSON.stringify(reqBody),
        }
      )
    ).json();
  }

  async function publishEventbriteEvent(eventId:string) {
    return await (
      await fetch(
        `https://www.eventbriteapi.com/v3/events/${eventId}/publish/`,
        {
          ...eventBriteAPIReqParams,
        }
      )
    ).json();
  }

  let  updateEventBriteEvent = async(params)=>{
    let {id,name,desc,startTime, endTime,cost}= params
    return new Promise(async(resolve, reject)=>{

      let reqBody:any = {
        ...eventBriteAPIReqParams,
        body:{
          "event": {
            "name": {
              "html": name
            },
            "summary": desc,
            "currency": "USD",
            // "online_event": false,
            // "organizer_id": "",
            "listed": false,
            "shareable": false,
            "invite_only": true,
            // "show_remaining": true,
            // "password": "12345",
            // "capacity": 100,
            // "is_reserved_seating": true,
            // "is_series": true,
            // "show_pick_a_seat": true,
            // "show_seatmap_thumbnail": true,
            // "show_colors_in_seatmap_thumbnail": true
          }
        },
      }
      if(startTime){
        reqBody.body.event.start = {
          "timezone": "UTC",
          "utc": convertToDateTimeFormatStandardForTheApp(startTime)
        }
      }
      if(endTime){
        reqBody.body.event.end = {
          "timezone": "UTC",
          "utc": convertToDateTimeFormatStandardForTheApp(endTime)
        }
      }
      reqBody.body = JSON.stringify(reqBody.body);
      let result = await fetch(
        ENV.povEvents.updateEventbriteEvent.url(id),
        reqBody
      )
      if(result.status === 200) {
        resolve(result)
      }
      else{
        reject(result)
      }

    })
    .then(()=>{

      return addTicketTypeToEventBrite(id,cost)
    })

  }


  let deletePOVEvent = async(eventId:string )=>{

    let POVprovisions = await getArrayFromFirebaseRealtimeDatabase(get(child(firebaseDBRef,ENV.firebase.realtimeDatabase.endpoints.povEventsProvisions )))
    POVprovisions = POVprovisions
    .filter((prov)=>prov.eventId !== eventId)
    let userEvents = await getArrayFromFirebaseRealtimeDatabase(get(child(firebaseDBRef, ENV.firebase.realtimeDatabase.endpoints.userEvents )))
    userEvents = Object.entries(userEvents).filter(([key, value]:any) => {
      return value.eventId !== eventId
    })
    userEvents = Object.fromEntries(userEvents)
    return set(ref(firebaseDB,`${ENV.firebase.realtimeDatabase.endpoints.povEvents}/${eventId}`),null)
    .then(()=>{
      return set(ref(firebaseDB,ENV.firebase.realtimeDatabase.endpoints.povEventsProvisions),POVprovisions)
    })
    .then(()=>{
      return set(ref(firebaseDB,ENV.firebase.realtimeDatabase.endpoints.userEvents),userEvents)
    })
    .then(()=>{
      return deleteFirebaseStorageFolder(eventId)
    })
  }

  async function deleteFirebaseStorageFolder(folder:string) {
    let folderRef = storageRef(firebaseStorageRef,folder)
    const fileList = await listAll(folderRef)
    const promises = []
    for(let item of fileList.items) {
        promises.push(deleteObject(item))
    }
    const result = await Promise.all(promises)
    return result
  }

  let getFirebaseEventsTable:()=>Promise<FBEvent[]> = async ()=>{
    return await getArrayFromFirebaseRealtimeDatabase( get(child(firebaseDBRef, `POVEvents/data` )))
  }

  let getFirebaseUserEventsTable = async (userId?)=>{
    return await getArrayFromFirebaseRealtimeDatabase( get(child(firebaseDBRef,ENV.firebase.realtimeDatabase.endpoints.userEvents )))
  }
  let getListOfEvents= async ()=>{

    if(events.length !==0) return
    let genresArray = await getArrayFromFirebaseRealtimeDatabase( get(child(firebaseDBRef,ENV.firebase.realtimeDatabase.endpoints.genreList )))
    let provisionsArray = await getArrayFromFirebaseRealtimeDatabase( get(child(firebaseDBRef,ENV.firebase.realtimeDatabase.endpoints.eventProvisionsList )))
    let POVprovisions = await getArrayFromFirebaseRealtimeDatabase(get(child(firebaseDBRef,ENV.firebase.realtimeDatabase.endpoints.povEventsProvisions )))
    let partsOfDayArray = await getArrayFromFirebaseRealtimeDatabase(get(child(firebaseDBRef,ENV.firebase.realtimeDatabase.endpoints.partsOfDayList )))
    let povEvents = await getHashMapFromFirebaseRealtimeDatabase(get(child(firebaseDBRef,ENV.firebase.realtimeDatabase.endpoints.povEvents )))
    let povEventsArray:FBPOVEventAPIModel[] = Object.entries(povEvents)
    .map((entry:[string,any] ) => {
      let [key,value] = entry
      value.id = key
      return value
    })
    let uiEvents =[]
    if(povEvents instanceof WMLAPIError){
      let  eventError =povEvents
      return eventError
    }
    for(let povEvent of povEventsArray){

      let uiEvent = new POVEvent()
      let allPartsOfDay = determineAllPartsOfDay(povEvent.schedules[0].start,povEvent.schedules[0].end, partsOfDayArray);
      uiEvent.partsOfDay = allPartsOfDay

      uiEvent.schedules = povEvent.schedules.map((durations)=>{
        let startLocal:any = new Date(durations.start)
        let endLocal:any =new Date(durations.end)
        startLocal = startLocal.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })
        endLocal = endLocal.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })
        return {
          start:{
            utc:durations.start,
            local:startLocal
          },
          end:{
            utc:durations.end,
            local:endLocal
          },
          partsOfDay: determineAllPartsOfDay(durations.start,durations.end, partsOfDayArray)
        }
      })
      uiEvent.id  = povEvent.id
      uiEvent.eventbriteId = povEvent.eventbriteId
      uiEvent.title = povEvent.title
      uiEvent.vibeScore = povEvent.vibeScore
      uiEvent.address = povEvent.address
      uiEvent.desc = povEvent.desc
      if(povEvent.mainImgUrl){
        uiEvent.mainImg = new WMLImage({
          src:ENV.firebase.storage.getImage.url(povEvent.mainImgUrl),
          alt:"Main Event Image"
        })
      }

      if(povEvent.altImgUrls){
        uiEvent.altImgs = povEvent.altImgUrls.map(src => {
          return new WMLImage({
            src:ENV.firebase.storage.getImage.url(src),
            alt:"Alt Event Image"
          })
        })
      }
      uiEvent.genre=genresArray.find((genre)=>{
        return genre.id === povEvent.genreId
      })

      let targetProvisions = POVprovisions
      .filter((provision)=>{
        return provision.eventId === uiEvent.id
      })
      uiEvent.provisions = targetProvisions
      .map((prov)=>{
        let defaultProvision = provisionsArray.find((item)=>{
          return prov.eventProvisionsId === item.id
        })
        return {
          ...defaultProvision,
          desc:prov.eventProvisionsDesc ?? defaultProvision.defaultDesc
        }
      })
      uiEvent.hostInfo ={
        fullName:povEvent.hostedBy
      }
      uiEvent.prices = povEvent.prices
      uiEvents.push(uiEvent)

    }


    uiEvents = uiEvents
    .filter((uiEvent)=> uiEvent.id)
    setEvents([...uiEvents])
    setDisplayEvents([...uiEvents])
  }
  let getTimesOfDay = async ()=>{
    if(timeOfDay.length!==0) {
      return
    };
    let targetArray = await getArrayFromFirebaseRealtimeDatabase(get(child(firebaseDBRef,`PartsOfDayList/data` )))
    targetArray = targetArray
    .map((timeDay)=>{
      return {
        ...timeDay,
        isChosen:false
      }
    })
    setTimeOfDay(targetArray)
  }

  let getProvisions = async ()=>{
    if(provisions.length!==0) {
      return
    };
    let targetArray = await getArrayFromFirebaseRealtimeDatabase(get(child(firebaseDBRef,`EventProvisionsList/data` )))
    setProvisions(targetArray)
  }

  let  getGenreList = async ()=>{
    if(genres.length !==0) return
    let genresArray:Array<any> = await getArrayFromFirebaseRealtimeDatabase( get(child(firebaseDBRef,`GenreList/data` )))
    genresArray = genresArray
    .map((genre)=>{
      return {
        ...genre,
        isChosen:false
      }
    })
    setGenres(genresArray)
  }
  let updateDisplayEventsBasedOnGenres=(genreIds:Array<number>,myEvents:POVEvent[])=>{

    genreIds
    .forEach((genreId)=>{

      let toUpdate = genres.find((genre)=>{
        return genre.id === genreId
      })
      toUpdate.isChosen = !toUpdate.isChosen
    })
    let chosenGenresArray = genres
    .filter((genre)=>{
      return genre.isChosen
    })

    let myDisplayEvents = myEvents
    .filter((event)=>{
      return chosenGenresArray.find((genre:any)=>event.genre.name === genre.name)
    })

    myDisplayEvents = checkIfDisplayEventsIsEmpty(myDisplayEvents, myEvents)

    setDisplayEvents(myDisplayEvents)
  }
  let resetDisplayEvents = ()=>{

    setDisplayEvents(events)
  }
  let updateDisplayEventsBasedOnTimeOfDay =(partDayIds:Array<number>,myEvents:POVEvent[])=>{

    let myDisplayEvents = myEvents
    .filter((event)=>{
      return event.partsOfDay.some((part)=>{
        return  partDayIds.includes(part.id)
      })
    })
    myDisplayEvents = checkIfDisplayEventsIsEmpty(myDisplayEvents, myEvents)
    setDisplayEvents(myDisplayEvents)
  }
  let updateDisplayEventsBasedOnName =(eventNames:Array<string>,myEvents:POVEvent[])=>{
    eventNames = eventNames.map((eventName)=>{
      return eventName.toLowerCase()
    })
    let allAreEmptyStrings = eventNames.some((eventName)=>{
      return eventName === ""
    })
    if(allAreEmptyStrings){
      return
    }
    let myDisplayEvents = myEvents
    .filter((event)=>{
      let includeEvent = eventNames.some((eventName)=>{
        return event.title.toLowerCase().includes(eventName)
      })
      return includeEvent
    })
    myDisplayEvents = checkIfDisplayEventsIsEmpty(myDisplayEvents, myEvents)
    setDisplayEvents(myDisplayEvents)
  }

  let value = {
    events,
    genres,
    provisions,
    displayEvents,
    setDisplayEvents,
    timeOfDay,
    getListOfEvents,
    getGenreList,
    getTimesOfDay,
    updateDisplayEventsBasedOnGenres,
    updateDisplayEventsBasedOnTimeOfDay,
    resetDisplayEvents,
    setGenres,
    eventViews,
    setEventViews,
    currentEvent,
    setCurrentEvent,
    getProvisions,
    updateDisplayEventsBasedOnName,
    createEventbriteEvent,
    getFirebaseEventsTable,
    getFirebaseUserEventsTable,
    updateEventBriteEvent,
    deletePOVEvent,
    deleteFirebaseStorageFolder,
    useSetCurrentPOVEvent
  }

  return (
      <EventsContext.Provider value={value}>
        {children}
      </EventsContext.Provider>
  )




  function checkIfDisplayEventsIsEmpty(myDisplayEvents: POVEvent[], myEvents: POVEvent[]): POVEvent[] {
    return myDisplayEvents.length === 0 ? [...myEvents] : myDisplayEvents;
  }

  function determineAllPartsOfDay(start: string,end:string, partsOfDay: any) {
    let startHours = new Date(start).getHours();
    let endHours = new Date(end).getHours();

    let startPoint = partsOfDay.find((part) => {
      return (part.range[0] <= startHours) && (part.range[1] >= startHours);
    });
    let endPoint = partsOfDay.find((part) => {
      return (part.range[0] <= endHours) && (part.range[1] >= endHours);
    });
    let reorder = false;
    let allPartsOfDay = partsOfDay.filter((part) => {
      if (startPoint.id <= endPoint.id) {
        return (part.id >= startPoint.id) && (part.id <= endPoint.id);
      }
      else if (startPoint.id > endPoint.id) {
        reorder = true;
        return (part.id >= startPoint.id) || (part.id <= endPoint.id);
      }

    });
    if (reorder) {
      let beginning = allPartsOfDay.find((part) => part.id === startPoint.id);
      beginning = allPartsOfDay.indexOf(beginning);
      let beginSlice = allPartsOfDay.slice(beginning);
      let endSlice = allPartsOfDay.slice(0, beginning);
      allPartsOfDay = [...beginSlice, ...endSlice];
    }
    return allPartsOfDay;
  }
}

