import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NotifyParamsSeverityEnum, useNotify } from "src/contexts/NotifyContext";
import { ENV } from "src/environments/environment";
import DoubleWebcam from "../doubleWebcam/DoubleWebcam";
import EnableCapture from "../enableCapture/EnableCapture";

import "./styles.scss";

export default function VibesCapture() {
  const { notificationPopup } = useNotify();
  const navigate = useNavigate()
  const {t,i18n} = useTranslation("common");
  const [state, setState] = useState({
    toggle: false,
    image: "",
    faceImg: "",
    currentFile: "",
    cameraPermission: false,
    gifGenrating: false,
    loaderToggle: false,
    attributes: {},
    // User or Environment camera
    webcam: "environment",
  });
  const webcamRef = useRef(null);

  const {
    toggle,
    image,
    faceImg,
    currentFile,
    cameraPermission,
    gifGenrating,
    webcam,
    loaderToggle,
    attributes,
  } = state;
  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };


  /* regular expression
    containing some mobile devices keywords
    to search it in details string */
  const details = navigator?.userAgent;
  const regexp = /android|iphone|kindle|ipad/i;
  const isMobileDevice = regexp.test(details);

  const doubleCameraProps = {
    image,
    faceImg,
    toggle,
    webcamRef,
    handleSetState,
    webcam,
    loaderToggle,
    attributes,
    isMobileDevice,
  };


  /**
   * @todo for some reason this is not working as expected
  */
  // const enableAccess = () => {
  //   navigator.permissions.query({ name: "camera" }).then((permission) => {

  //     handleSetState({
  //       cameraPermission: permission.state === "granted",
  //       toggle: permission.state === "granted",
  //     });
  //   });
  // };

  const enableAccess = ()=> {
    navigator.mediaDevices.getUserMedia({video:true})
    .then((result)=>{
      handleSetState({
        cameraPermission: result.active,
        toggle: result.active,
      });
    })
    .catch(()=>{
      notificationPopup(true,NotifyParamsSeverityEnum.ERROR,t("VibesCapture.wmlNotify.cameraError"))
      navigate(ENV.nav.urls.vibesMap)
    })
  }


  return (
    <div className="containerWrapper">
      <EnableCapture
        toggle={toggle}
        enableAccess={enableAccess}
        cameraPermission={cameraPermission}
      />
      {toggle && <DoubleWebcam doubleWebcamProps={doubleCameraProps} />}
    </div>
  );
}
