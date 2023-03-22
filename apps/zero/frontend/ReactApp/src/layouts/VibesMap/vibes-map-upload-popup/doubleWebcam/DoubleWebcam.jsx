import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera } from "../../../../shared/components/Camera";
import { useAuth } from "src/contexts/AuthContext";

//icons
import { ReactComponent as IconCapture } from "../../../../assets/media/shared//capture-btn.svg";
import { ReactComponent as CameraSwitch } from "../../../../assets/media/shared//camera-switch.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/media/shared//icon-close.svg";

//styles
import "./styles.scss";
import { ENV } from "src/environments/environment";
import Hypnosis from "../Hypnosis-Loader/Hypnosis";
import {
  getBase64,
  getFileFromBase64,
} from "src/shared/components/uploadAndMint/UploadFileToStorage";

export default function DoubleWebcam({ doubleWebcamProps }) {
  const { setCapturedFile } = useAuth();
  const imgContainer = useRef();
  const frontCamera = useRef();
  const rearCamera = useRef();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    img,
    faceImg,
    toggle,
    webcamRef,
    handleSetState,
    webcam,
    loaderToggle,
    displayedModes,
  } = doubleWebcamProps;

  const details = navigator?.userAgent;

  const regexp = /android|iphone|kindle|ipad/i;

  const isMobileDevice = regexp.test(details);

  // switch camera from front to rear for mobile view
  const switchCameraToRear = (webcam, handleSetState, webcamRef) => {
    const webcamStatus = webcam === "user" ? "environment" : "user";
    handleSetState({ webcam: webcamStatus });
    webcamRef.current.switchCamera();
  };

  useEffect(() => {
    if (img && webcamRef.current) {
      handleSetState({
        loaderToggle: true,
      });
      setTimeout(() => {
        handleSetState({
          loaderToggle: false,
        });
        const imageSrc = webcamRef.current.takePhoto();

        handleSetState({ faceImg: imageSrc });
      }, 5000);
    }
  }, [img]);

  const takePicture = () => {
    const imageSrc = webcamRef.current.takePhoto();

    handleSetState({ img: imageSrc });
    switchCameraToRear(webcam, handleSetState, webcamRef);
  };

  const continueToMint = (image) => {
    const fileArray = [];
    const name = "image.png";
    const result = getFileFromBase64(image, name, "image/png");
    setCapturedFile(result);
    fileArray.push(result);
    sessionStorage.setItem("file", URL.createObjectURL(result));
    Promise.all(Array.prototype.map.call(fileArray, getBase64)).then((urls) => {
      const newMinterFields = { urls };
      sessionStorage.setItem("minter", JSON.stringify(newMinterFields));
    });
    navigate(`${ENV.nav.urls.vibesMap}/${id}?tab=capture`);
  };

  const combineImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img1 = new Image();
    const img2 = new Image();

    img1.onload = function () {
      canvas.width = rearCamera.current.clientWidth;
      canvas.height = rearCamera.current.clientHeight;
      img2.src = faceImg;
    };
    img2.onload = function () {
      context.drawImage(
        img1,
        0,
        0,
        rearCamera.current.clientWidth,
        rearCamera.current.clientHeight
      );
      context.drawImage(
        img2,
        16,
        16,
        frontCamera.current.clientWidth,
        frontCamera.current.clientHeight
      );
      continueToMint(canvas.toDataURL());
    };

    img1.src = img;
  };

  return img && faceImg ? (
    <div className="cameraWrapper">
      <div ref={imgContainer} className="cameraShot">
        <div
          className="closeBtn"
          onClick={() => navigate(`${ENV.nav.urls.vibesMap}/${id}?tab=capture`)}
        >
          <CloseIcon />
        </div>
        <img
          src={faceImg}
          className="faceImg"
          alt="camera-shot"
          ref={frontCamera}
        />
        <img ref={rearCamera} src={img} alt="camera-shot" />
      </div>
      <div className="imgBtn">
        <div onClick={combineImage} className="mintBtn">
          Continue
        </div>
        <p
          className="mintBtn"
          onClick={() => {
            handleSetState({
              img: "",
              faceImg: "",
            });
          }}
        >
          Retake
        </p>
      </div>
    </div>
  ) : (
    <div className="videoContainer">
      <div className={`videoWrapper ${img ? "frontCamera" : ""}`}>
        {toggle && (
          <Camera
            ref={webcamRef}
            aspectRatio="cover"
            errorMessages={{
              noCameraAccessible:
                "No camera device accessible. Please connect your camera or try a different browser.",
              permissionDenied:
                "Permission denied. Please refresh and give camera permission.",
              switchCamera:
                "It is not possible to switch camera to different one because there is only one video device accessible.",
              canvas: "Canvas is not supported.",
            }}
          />
        )}
        {loaderToggle && (
          <div className="loader">
            <Hypnosis width="4rem" height="4rem" />
            <p>Don't move and keep smiling</p>
          </div>
        )}
        {img && (
          <img
            className="rearImg"
            src={img}
            alt="camera-shot"
            ref={rearCamera}
          />
        )}
        <div className={`videoOFF ${toggle ? "disabled" : ""}`} />
      </div>

      <div
        className="closeBtn"
        onClick={() => navigate("/vibesMap?tab=capture")}
      >
        <CloseIcon />
      </div>
      {isMobileDevice && (
        <div
          className="sideSwitch"
          onClick={() => switchCameraToRear(webcam, handleSetState, webcamRef)}
        >
          <CameraSwitch />
        </div>
      )}
      {!img && (
        <div className="btnWrapper">
          {/* main button */}
          <div
            onClick={() => takePicture(webcamRef, handleSetState)}
            className="mainBtn"
          >
            <IconCapture className="captureBtn" />
          </div>
        </div>
      )}
    </div>
  );
}
