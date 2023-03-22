// react
import React, { createContext, useContext, useEffect, useState } from "react";
import { mapBoxAccessToken } from "src/api/mapbox";
import { generateRandomNumber } from "src/core/utility/common-utils";
import { ENV } from "src/environments/environment";

// @ts-ignore
const MapboxContext = createContext<{
  getLntLngBasedOnLocationText:(location: string) => Promise<any>,
  lngLat:[number,number],
  zoom:number,
  setLngLat:React.Dispatch<React.SetStateAction<[number, number]>>
}>();

export let useMapbox = () => {
  return useContext(MapboxContext);
};



export function MapboxProvider({ children }) {

  const [lngLat, setLngLat] = useState<[number,number]>([-73.976,40.752]);
  const [zoom, setZoom] = useState(10);



  async function getLntLngBasedOnLocationText(location:string,types?:Array<"places"|"postcode"|"address">){
    let params:any ={
      limit:1,
      proximity:"ip",
      // types:"place,postcode,address",
      types: types ? types.join(","): "address" ,
      access_token:mapBoxAccessToken
    }
    params = new URLSearchParams(params).toString();
    let url = ENV.mapbox.getLntLngBasedOnLocationTextEndpoint.url(location,params)
    let result
    if(ENV.mapbox.getLntLngBasedOnLocationTextEndpoint.automate){
      return {
        features:Array(1 ??generateRandomNumber(2))
          .fill(null)
          .map((nullVal,index0)=>{
            return {
              center:[-74,40]
            }
          })

      }
    }
    else{

      return await (await fetch(url)).json()
    }
  }

  let value = {
    getLntLngBasedOnLocationText,
    lngLat,
    zoom,
    setLngLat
  };

  return (
    <MapboxContext.Provider value={value}>
      {children}
      </MapboxContext.Provider>
  );
}
