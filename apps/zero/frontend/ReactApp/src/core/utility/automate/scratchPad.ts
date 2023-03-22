import { faker } from "@faker-js/faker";
import { get, child, ref, set } from "firebase/database";
import { orgId, eventBriteAPIHeaders, eventBriteAPIKey, eventBriteAPIReqParams } from "src/api/eventbrite";
import { firebaseDB, firebaseDBRef } from "src/api/firebase";
import { AuthUser } from "src/contexts/AuthContext";
import { ENV } from "src/environments/environment";
import { getAllNFTsByEventIds } from "src/shared/components/uploadAndMint/UploadFileToStorage";
import { generateRandomNumber, getArrayFromFirebaseRealtimeDatabase, selectRandomOptionFromArray } from "../common-utils";
import adddress from "./nyc.select.json";


export let addFakeEventsToEventbrite =  async () => {

  // let result = await getAllEventbriteEvents()
  // console.log(result)
  // await result.forEach(async (event)=>{
  //     await updateEventBriteEvent(event.id)
  // })
  // let createEventbriteEventResponse = await createEventbriteEvent();
  // await updateEventBriteEvent(createEventbriteEventResponse.id)
  // let addTicketTypeToEventBriteReqBody = {
  //   ticket_class: {
  //     name: "general",
  //     quantity_total: generateRandomNumber(100000),
  //     free: true,
  //   },
  // };
  // await addTicketTypeToEventBrite(
  //   createEventbriteEventResponse,
  //   addTicketTypeToEventBriteReqBody
  // );

  // let publishEventbriteEventResponse = await publishEventbriteEvent(
  //   createEventbriteEventResponse
  // );

};


export let resetVibeScore = async(eventId)=>{

  let firebaseEvents =await getArrayFromFirebaseRealtimeDatabase( get(child(firebaseDBRef,`POVEvents/data` )))
  let fbTarget = firebaseEvents.find((fbEvent) => eventId === fbEvent.eventId);

  fbTarget.vibeScore ={
    diversity: 0,
    density: 0,
    friendliness:0,
    energy:0,
    amountOfRatings:0
  }
  return set(ref(firebaseDB,"POVEvents/data"),firebaseEvents)
}

export function replaceIPFSJsonWithIPFSPhotoURL(currentUsersNFTs,setProfileData,logo){
    for(let nftInfo of currentUsersNFTs){

    fetch(nftInfo.eventPhotoURL)
    .then((res) => {
      let contentType =res.headers.get("Content-Type")
      if(contentType === "application/json"){
        return res.json()
        .then((res) => {
          nftInfo.eventPhotoURL =res.image.replace("ipfs://","https://ipfs.io/ipfs/")
        })
      }
      else{
        return new Promise(()=>{})
      }
    })
    .catch((err)=>{
      nftInfo.eventPhotoURL = logo
    })
    .finally(() => {
      nftInfo.eventPhotoURLWasRetrieved = true
      setProfileData((params) => {
        let newUser = new AuthUser(params);

        newUser.usersNFTs = currentUsersNFTs

        // console.log("inside nfts: ", newUser);
        return newUser;
      })
    })

  }
}
export let removeAllFilesFromPinata =async()=>{
  let nfts = await getAllNFTsByEventIds("",0,1000,"pinned")
  console.log(nfts)
  let timeToWait = 0
  return
  for(let nft of nfts){
    let {ipfs_pin_hash    } = nft
    timeToWait += 2000
    setTimeout(()=>{
      fetch(
        `https://api.pinata.cloud/pinning/unpin/${ipfs_pin_hash}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${ENV.pinataKeys.POV_PINATA_API_JWT}`
          }
        }
      )
    },timeToWait)


  }

}

export let modifyPOVEvents = async()=>{

  let firebaseEvents = await getArrayFromFirebaseRealtimeDatabase( get(child(firebaseDBRef,`POVEvents/data` )))
  firebaseEvents = firebaseEvents.map((event)=>{
    event.vibeScore= {
      "amountOfRatings": 0,
      "density": 0,
      "diversity": 0,
      "energy": 0,
      "friendliness": 0
  }
    return event
  })
  set(ref(firebaseDB,"POVEvents/data"),firebaseEvents)
  console.log(firebaseEvents)
}


export async function generateFakeEventProvisions(){
  let eventBriteEvents:Array<any> = await getAllEventbriteEvents()
  let possibleOptions = await getArrayFromFirebaseRealtimeDatabase( get(child(firebaseDBRef,`EventProvisionsList/data` )))

  let result = eventBriteEvents.map((event)=>{
    return Array(generateRandomNumber(possibleOptions.length))
    .fill(null)
    .map((nullVal,index0)=>{
      return {
        eventId:event.id,
        eventProvisionsId:possibleOptions[generateRandomNumber(possibleOptions.length)].id,
        eventProvisionsDesc:selectRandomOptionFromArray([
          faker.lorem.sentence(),
          null
        ])
      }
    })
  })
  .flat(1)
  console.log(result)
}

export async function generateFakePOVEvents(){

  const dbRef = ref(firebaseDB);
  let eventBriteEvents:Array<any> = await getAllEventbriteEvents()
  let possibleGenreOptions = await getArrayFromFirebaseRealtimeDatabase( get(child(dbRef,`GenreList/data` )))
  let result = eventBriteEvents.map((event,index0)=>{
    let genreId =selectRandomOptionFromArray(possibleGenreOptions).id
    genreId = genreId === 0 ? 1: genreId
    return {
      eventId: event.id,
      genreId,
      hostedBy:`${faker.name.firstName()} ${faker.name.lastName()}`,
      address: selectRandomOptionFromArray(adddress),
      vibeScore: {
        energy: generateRandomNumber(5),
        density: generateRandomNumber(5),
        amnity: generateRandomNumber(5),
        friendliness: generateRandomNumber(5)
      }
    }
  })
  .flat(1)
  console.log(result)
}

async function getAllEventbriteEvents(events =[],continuation?:string){
  let params:any =  {
    page_size:"20",
  }
  if(continuation){
    params.continuation = continuation;
  }
  params = new URLSearchParams(params).toString();
  let result = await(await fetch(
    `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?${params}`,
    {
      headers:eventBriteAPIHeaders
    }
  ))
  .json()
  events.push(...result.events)
  if(result.pagination.has_more_items){
    return await getAllEventbriteEvents(events,result.pagination.continuation)
  }
  else {
    return events
  }
}

async function retrieveUploadToken() {
  return await (
    await fetch(
      `https://www.eventbriteapi.com/v3/media/upload/?type=image-event-logo&token=${eventBriteAPIKey}`
    )
  ).json();
}


async function publishEventbriteEvent(createEventbriteEventResponse: any) {
  return await (
    await fetch(
      `https://www.eventbriteapi.com/v3/events/${createEventbriteEventResponse.id}/publish/`,
      {
        ...eventBriteAPIReqParams,
      }
    )
  ).json();
}

async function createEventbriteEvent(reqBody?: {
  event: {
    name: { html: string };
    start: { timezone: string; utc: string };
    end: { timezone: string; utc: string };
    currency: string;
  };
}) {
  let startDate = faker.date.future();
  let endDate = faker.date.future(0, startDate);
  let transformToEventbriteDate = (date) => {
    return new Date(date).toISOString().replace(/\.[^.]*$/, "Z");
  };
  reqBody = reqBody ?? {
    event: {
      name: {
        html: selectRandomOptionFromArray([
            "Summer Music Fest",
            "Annual Food and Wine Festival",
            "Art in the Park",
            "Charity Run/Walk",
            "New Year's Eve Gala",
            "Business Expo",
            "Comic Con",
            "Farmers' Market",
            "Holiday Light Show",
            "Jazz Festival",
            "Outdoor Movie Night",
            "Spring Fling",
            "Taco Fest",
            "Vintage and Antique Market",
            "Wine Tasting and Pairing Event",
            "Garden Tour",
            "Fashion Show",
            "Cultural Festival",
            "Book Fair",
            "Hiking and Nature Festival",
          ]),
      },
      start: {
        timezone: "America/New_York",
        utc: transformToEventbriteDate(startDate),
      },
      end: {
        timezone: "America/New_York",
        utc: transformToEventbriteDate(endDate),
      },
      currency: "USD",
    },
  }
  return await (
    await fetch(
      `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/`,
      {
        ...eventBriteAPIReqParams,
        // @ts-ignore
        body: JSON.stringify(reqBody),
      }
    )
  ).json();
}

async function updateEventBriteEvent(id){
  return await (await fetch(
    `https://www.eventbriteapi.com/v3/events/${id}/`,
    {
      ...eventBriteAPIReqParams,
      body:JSON.stringify({
        event:{
          summary:faker.lorem.sentences(2)
        }
      }),
    }
  )).json()
}

async function addTicketTypeToEventBrite(
  createEventbriteEventResponse: any,
  addTicketTypeToEventBriteReqBody: {
    ticket_class: { name: string; quantity_total: number; free: boolean };
  }
) {
  await (
    await fetch(
      `https://www.eventbriteapi.com/v3/events/${createEventbriteEventResponse.id}/ticket_classes/`,
      {
        ...eventBriteAPIReqParams,
        body: JSON.stringify(addTicketTypeToEventBriteReqBody),
      }
    )
  ).json();
}


async function uploadImageToEventBrite() {
  let MEDIA_UPLOAD_URL = "https://www.eventbriteapi.com/v3/media/upload/";
  let instructions_url = MEDIA_UPLOAD_URL +
    "?" + new URLSearchParams({
      type: "image-event-logo",
      token: eventBriteAPIKey,
    }).toString();
  console.log(instructions_url)
}


