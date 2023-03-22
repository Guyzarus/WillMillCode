import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

// styles
import "./styles.scss";

// utils
import {
  generateClassPrefix,
  mapBoxTransitionTime,
} from "../../../core/utility/common-utils";
import { POVEvent, usePOVEvents } from "src/contexts/POVEventsContext";

// material ui
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// misc
import { useDebouncedCallback } from "use-debounce";
import { ENV } from "src/environments/environment";
import { useNavigate } from "react-router";



export default function VibesMapList() {
  const classPrefix = generateClassPrefix("VibesMapList");
  const navigate = useNavigate();
  const idPrefix = generateClassPrefix("VibesMap");
  const { displayEvents, setCurrentEvent,setDisplayEvents } = usePOVEvents();
  function eventClicked(event: POVEvent) {
    navigate(`${ENV.nav.urls.vibesMap}/${event.id}`);
  }



  return (
    <div id="VibesMapListContainer" className="VibesMapList" >
      <div className={classPrefix("MainPod")}>
        {React.Children.toArray(
          displayEvents.map((event: POVEvent, index0) => {
          return (
            <div
              id={idPrefix("EventListItem"+event.idByTribeName+event.id)}
              onClick={() => eventClicked(event)}
              className={classPrefix("MainItem0")}
            >
              <img
                className={classPrefix("MainImg0")}
                src={event.mainImg.src}
                alt={event.mainImg.alt}
              />
              <div className={classPrefix("MainItem1")}>
                <div className={classPrefix("MainItem3")}>
                  <h3 className={classPrefix("MainText0")}>{event.title}</h3>
                </div>
                {React.Children.toArray([
                  "displayVibeScore",
                  "displayAddress",
                  "displayTime",
                  "displayPrice",
                  "displayGenre",
                ].map((eventProperty, index1) => {
                  return (
                    <div  className={classPrefix("MainItem2")}>
                      <i className={classPrefix("MainIcon0")}>
                        {
                          [
                            <EmojiEmotionsOutlinedIcon />,
                            <RoomOutlinedIcon />,
                            <AccessTimeIcon />,
                            <AttachMoneyIcon />,
                            <CloudOutlinedIcon />,
                          ][index1]
                        }
                      </i>
                      <p>{event[eventProperty]}</p>
                    </div>
                  );
                }))}
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
}
