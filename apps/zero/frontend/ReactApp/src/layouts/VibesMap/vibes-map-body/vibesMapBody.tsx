import React, { useEffect } from "react";

// styles
import  "./styles.scss";


// utils
import {
  generateClassPrefix,
} from "../../../core/utility/common-utils";

import VibesMapList from "../vibes-map-list/VibesMapList";
import VibesMapMapBox from "../vibes-map-mapbox/vibesMapMapbox";
import { usePOVEvents } from "src/contexts/POVEventsContext";

export default function VibesMapBody(props) {

  const {
    eventViews,
    setEventViews
  } = usePOVEvents()

  useEffect(()=>{
    if(eventViews.length ===0){
      setEventViews(["list","map"])
    }
  },[eventViews])

  const classPrefix = generateClassPrefix("VibesMapBody");
  return (
    <div id="VibesMapBody" >
      <div className={classPrefix("MainPod")}>
        {eventViews.includes("map") &&
          <div className={classPrefix("Pod0")}>
            <VibesMapMapBox />
          </div>
        }
        {eventViews.includes("list") &&
          <div className={`${classPrefix("Pod1")}`}>
            <VibesMapList />
          </div>
        }
      </div>
    </div>
  );
}
