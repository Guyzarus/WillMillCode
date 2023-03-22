import React, { useEffect, useRef, useState } from "react";

// styles
import "./styles.scss";

// utils
import {
  convertStringToId,
  generateClassPrefix, mapBoxTransitionTime, scssMapBoxTransitionTime,
} from "../../../core/utility/common-utils";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDebouncedCallback } from "use-debounce";
import { POVEvent, usePOVEvents } from "src/contexts/POVEventsContext";
import smiley_face from "src/assets/media/vibes-map-mapbox/smiley_face.webp"
import { useMapbox } from "src/contexts/MapboxContext";
import { ENV } from "src/environments/environment";
import { useNavigate } from "react-router";


// @ts-ignore
mapboxgl.MapboxGeocoder = MapboxGeocoder
const useResizeMap = (target)=>{
  const resizeHandler = useDebouncedCallback(() => {
    target.current.resize();
  },mapBoxTransitionTime)


  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);
}

let markers = []


class ClickableMarker extends mapboxgl.Marker {

  onClick(handleClick) {
    this._handleClick = handleClick;
    return this;
  }

  constructor(params){
    super(params)
  }
  [k:string]:any
  setId(value){
    this._element.id = value;
    return this
  }


  _onMapClick(e) {
    const targetElement = e.originalEvent.target;
    const element = this._element;

    if (this._handleClick && (targetElement === element || element.contains((targetElement)))) {
      this._handleClick();
    }
  }
};
function updateMapBasedOnUserLocation(setLngLat){
  window.navigator.geolocation
  .getCurrentPosition((geoInfo)=>{
    let {longitude,latitude}= geoInfo.coords
    setLngLat([longitude,latitude])
  });
}

export default function VibesMapMapBox(props) {


  const classPrefix = generateClassPrefix("VibesMapMapBox");
  const navigate = useNavigate()
  const{
    lngLat,zoom,setLngLat
  } = useMapbox()
  const {
    eventViews
  } = usePOVEvents()
  const {displayEvents} = usePOVEvents()
  const mapContainer = useRef(null);
  const map = useRef(null);
  const idPrefix = generateClassPrefix("VibesMap");



  useEffect(()=>{
    updateMapBasedOnUserLocation(setLngLat)
  },[])



  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: lngLat,
      zoom: zoom,
    });


    if(ENV.constructor.name !== "DevEnv"){
      map.current.addControl(
        new mapboxgl.MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl
        })
      );
    }

  },[]);

  useEffect(() => {
    map.current.resize()
  },[eventViews])


  useEffect(()=>{
    map.current.setCenter(lngLat)
  },[lngLat])



  useEffect(() => {
    markers.forEach((marker:mapboxgl.Marker)=>{
      marker.remove()
    })
    markers =[]
    displayEvents.forEach((event:POVEvent,index0:number)=>{
      let marker = new ClickableMarker({
        color:event.genre.color,
        transition:scssMapBoxTransitionTime
      })
      .onClick(()=>{
        navigate(`${ENV.nav.urls.vibesMap}/${event.id}`)
      })
      .setLngLat(event.address.coords)
      .setId(idPrefix("EventMapIcon"+event.idByTribeName+event.id))
      markers.push(marker);
    })
    markers.forEach((marker)=>{
      marker
      .addTo(map.current);
    })

  },[displayEvents])


  useResizeMap(map)

  return (
    <div id="VibesMapMapBox">
      <div className={classPrefix("MainPod")}>
        <div ref={mapContainer} className={classPrefix("Pod0")}></div>
      </div>
    </div>
  );
}
