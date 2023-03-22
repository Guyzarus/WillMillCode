import React, { useEffect, useState } from "react";

// styles
import "./styles.scss";

// utils
import {
  generateClassPrefix,
  WMLImage,
  WMLButton,
  generateRandomImage,
  povliteblue,
  povminty,
  povpeach,
  povskyblue,
  povdietpurple,
  WMLOptionsButton,
} from "../../../core/utility/common-utils";
import { POVEvent, usePOVEvents } from "src/contexts/POVEventsContext";
import { generateFakePOVEvents } from "src/core/utility/automate/scratchPad";

// mui
import PovAvatarIcon from "src/shared/components/avatarIcon";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import NightlifeOutlinedIcon from "@mui/icons-material/NightlifeOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import PovIcon from "src/shared/components/povIcon";
import PrimaryBtn from "src/shared/components/primaryBtn/primaryBtn";
import SecondaryBtn from "src/shared/components/secondaryBtn/SecondaryBtn";
import { useLocation, useNavigate, useParams } from "react-router";
import { ENV } from "src/environments/environment";
import { NotifyParams, NotifyParamsSeverityEnum, useNotify } from "src/contexts/NotifyContext";
import ImageUploadPopup from "src/layouts/VibesMap/vibes-map-upload-popup";
import { useAuth } from "src/contexts/AuthContext";

export default function EventDetailMain() {
  const { currentEvent, events, setCurrentEvent,useSetCurrentPOVEvent } = usePOVEvents();
  const params = useParams();
  const [modal, setModal] = useState(false);
  const location = useLocation();
  const {
    getAllUserEvents,
    profileData
  } = useAuth()


  const navigate = useNavigate();
  const { setNotifyParams } = useNotify();
  useSetCurrentPOVEvent( navigate,params);
  //Check if modal was opened before moving to capture screen
  const param = new URLSearchParams(location.search);
  useEffect(() => {
    const modalOpened = param.get("tab");
    if (modalOpened) {
      setModal(true);
    }
  }, []);




  let [tapInBtn, directionsBtn, reportBtn] = Array(3)
    .fill(null)
    .map((nullVal, index0) => {
      return new WMLOptionsButton({
        text: ["Tap In", "Directions", "Report"][index0],
      });
    });
  const [profileOptionBtns, setProfileOptionBtns] = React.useState([
    tapInBtn,
    directionsBtn,
    reportBtn,
  ]);

  let checkIn = async () => {
    if(!profileData){
      setNotifyParams(new NotifyParams({
        text:"You must log in before you can tap into an event",
        severity:NotifyParamsSeverityEnum.ERROR,
        isPresent:true
      }))
      return
    }
    let userEvents = await getAllUserEvents(profileData.userId)

    userEvents = Object.values(userEvents)
    let isUserCheckedIn = userEvents.find((event)=>{
      return event.eventId === currentEvent.id
    })
    if(!isUserCheckedIn){
      setNotifyParams(new NotifyParams({
        text:"You must check into an event before you can tap into an event",
        severity:NotifyParamsSeverityEnum.ERROR,
        isPresent:true
      }))
    }
    else{

      setModal(true)
    }
  }

  const classPrefix = generateClassPrefix("EventDetailMain");
  return (
    <div className="EventDetailMain">
      <div className={classPrefix("MainPod")}>
        <section className={classPrefix("Pod0")}>
          <h1>Silent Music Experience</h1>
        </section>
        {currentEvent && (
          <>
            <section className={classPrefix("Pod1")}>
              <div className={classPrefix("Pod1Item0")}>
                <img
                  className={classPrefix("Pod1Img0")}
                  src={currentEvent.mainImg.src}
                  alt={currentEvent.mainImg.alt}
                />
              </div>
              <div className={classPrefix("Pod1Item1")}>
                {currentEvent.altImgs.slice(0, 4).map((image, index0) => {
                  return (
                    <div key={index0}>
                      <img
                        className={classPrefix("Pod1Img1")}
                        src={image.src}
                        alt={image.alt}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
            <div className={classPrefix("MainItem0")}>
              <div className={classPrefix("MainItem1")}>
                <section className={classPrefix("Pod2")}>
                  <div className={classPrefix("Pod2Item0")}>
                    <h2 className={classPrefix("Pod2Text0")}>
                      {currentEvent.title}
                    </h2>
                    {currentEvent?.hostInfo?.fullName && (
                      <p>
                        <span className={classPrefix("Pod2Text1")}>
                          Hosted By
                        </span>
                        <PovAvatarIcon margin={"0 calc(12/16 * 1rem) 0 0"} />
                        <span>{currentEvent.hostInfo.fullName}</span>
                      </p>
                    )}
                  </div>
                  <div className={classPrefix("Pod2Item1")}>
                    {[
                      "displayEventDuration",
                      "displayVibeScore",
                      "displayProvisionsInfo",
                      "displayGenre",
                    ].map((eventProperty, index0) => {
                      if(eventProperty ==="displayProvisionsInfo" && currentEvent.provisions.length === 0 ) {
                        return (
                          <div key={index0}></div>
                        )
                      }


                      return (
                        <div key={index0} className={classPrefix("Pod2Item3")}>
                          {
                            <div
                              style={{ backgroundColor: [povliteblue,povdietpurple,povminty,povpeach][index0] }}
                              className={classPrefix("Pod2Item4")}
                            >
                              {
                                [
                                  <AccessTimeIcon />,
                                  <InsertEmoticonIcon />,
                                  <NightlifeOutlinedIcon />,
                                  <CloudOutlinedIcon />
                                ][index0]
                              }
                            </div>
                          }
                          <p>{currentEvent[eventProperty]}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className={classPrefix("Pod2Strike0")}></div>
                  <div className={classPrefix("Pod2Item5")}>
                    <h2 className={classPrefix("Pod2Text0")}>About</h2>
                    <p>{currentEvent.desc}</p>
                    <div>
                      {["displayAddress", "displayTime"].map(
                        (eventProperty, index0) => {
                          return (
                            <div
                              key={index0}
                              className={classPrefix("Pod2Item6")}
                            >
                              {
                                [<RoomOutlinedIcon />, <AccessTimeIcon />][
                                  index0
                                ]
                              }
                              <p>{currentEvent[eventProperty]}</p>
                            </div>
                          );
                        }
                      )}
                    </div>
                    <div className={classPrefix("Pod2Strike0")}></div>
                  </div>
                </section>
                <section className={classPrefix("Pod3")}>
                  {currentEvent.provisions.length > 0 && (
                    <>
                      <h2 className={classPrefix("Pod3Text0")}>
                        What's Included
                      </h2>
                      <div className={classPrefix("Pod3Item0")}>
                        {currentEvent.provisions.map((prov, index0) => {
                          return (
                            <div
                              key={index0}
                              className={classPrefix("Pod3Item1")}
                            >
                              <h2 className={classPrefix("Pod3Text0")}>
                                {prov.name}
                              </h2>
                              <p>{prov.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </section>
              </div>
              <div className={classPrefix("MainItem2")}>
                <section className={classPrefix("Pod4")}>
                  <div className={classPrefix("Pod4Item0")}>
                    <div className={classPrefix("Pod4Item4")}>
                      <div className={classPrefix("Pod4Item1")}>
                        <h2>{`${profileData.firstName} ${profileData.lastName}`}</h2>
                        <p className={classPrefix("Pod4Text0")}>
                          <PovIcon type={"type_1"} />
                          <span>{profileData.tapIns}</span>
                          <span>(Tap Ins)</span>
                        </p>
                      </div>
                      <div className={classPrefix("Pod4Item2")}>
                        <PovAvatarIcon fontSize={60} />
                      </div>
                    </div>

                    <div className={classPrefix("Pod4Item3")}>
                      {profileOptionBtns.map((btn, index0) => {
                        {
                          if (index0 === 0) {
                            return (
                              <PrimaryBtn
                                onClick={checkIn}
                                key={index0}
                                params={btn}
                              />
                            );
                          } else {
                            return <SecondaryBtn key={index0} params={btn} />;
                          }
                        }
                      })}
                    </div>
                    <p className={classPrefix("Pod4Text1")}>Vibe Safely</p>
                  </div>
                </section>
              </div>
              <ImageUploadPopup
                modal={modal}
                setModal={setModal}
                handleModalClose={() => setModal(false)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}


