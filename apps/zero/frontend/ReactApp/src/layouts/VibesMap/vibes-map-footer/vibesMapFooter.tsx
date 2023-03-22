// react
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// styles
import "./styles.scss";

// utils
import {
  generateClassPrefix,
  WMLImage,
  WMLButton,
  WMLUIProperty,
  whiteColor,
  displayFont,
  borderRadius0,
} from "../../../core/utility/common-utils";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Modal,
} from "@mui/material";

// mui
import PovIcon from "src/shared/components/povIcon";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HomeIcon from "@mui/icons-material/Home";
import { usePOVEvents } from "src/contexts/POVEventsContext";
import { useVibesMapNavBackToMap } from "../vibes-map-layout/vibesMapLayout";
import ThreeSixtyRoundedIcon from "@mui/icons-material/ThreeSixtyRounded";

// misc
// import QrReader from 'react-qr-scanner'
import ShrikhandText, {
  ShrikhandTextParams,
} from "src/shared/components/ShrikhandText/Shrikhand";
import { useAuth } from "src/contexts/AuthContext";
import { ENV } from "src/environments/environment";
import { NotifyParams, NotifyParamsSeverityEnum, useNotify } from "src/contexts/NotifyContext";
import { useOverlayLoading } from "src/contexts/OverlayLoadingContext";
import { QrReader } from "react-qr-reader";
import { useTranslation } from "react-i18next";

class VibesMapFooterBottomNav extends WMLUIProperty {
  constructor(params: Partial<VibesMapFooterBottomNav> = {}) {
    super();
    Object.assign(this, {
      ...params,
    });
  }
  color: string;
}
export default function VibesMapFooter() {
  const navigate = useNavigate();
  const {t,i18n}= useTranslation("common")
  const { setCurrentEvent, events } = usePOVEvents();
  const { setNotifyParams,notificationPopup } = useNotify();
  const { toggleOverlayLoading } = useOverlayLoading();
  const { checkInUserToAnEvent, profileData,handleLogout } = useAuth();
  const [landingBottom, homeBottom, qrCodeBottom, profileBottom,logoutBtn] =
    ["landing", "home", "qrcode", "profile","logout"].map((value, index0) => {
      return new VibesMapFooterBottomNav({
        value,
      });
    });
  const [bottomNavs, setBottomNavs] = useState([
    landingBottom,
    homeBottom,
    qrCodeBottom,
    profileBottom,
    logoutBtn
  ]);
  const [toggleNav, setToggleNav] = useState({ value: null });

  useVibesMapNavBackToMap(toggleNav, setCurrentEvent, navigate);
  let bottomNavsOnChange = (event, newValue) => {
    setBottomNavs(() => {
      const myBottomNavs = [
        landingBottom,
        homeBottom,
        qrCodeBottom,
        profileBottom,
        logoutBtn
      ];
      const toUpdate = myBottomNavs.find((nav) => nav.value === newValue);
      toUpdate.color = toUpdate.color === "primary" ? "" : "primary";
      return myBottomNavs;
    });
    if (newValue === "home") {
      setToggleNav({ value: 0 });
    } else if (newValue === "landing") {
      navigate("/");
    } else if (newValue === "qrcode") {
      if(!profileData.isUserInfoLoaded){
        setNotifyParams(new NotifyParams({
          isPresent:true,
          text:"Please log in before attempting check-in",
          severity:NotifyParamsSeverityEnum.ERROR
        }))
      }
      else{
        setQrScannerIsOpen(true);
      }
    }
    else if (newValue === "profile") {
      navigate(ENV.nav.urls.profile)
    }
    else if (newValue === "logout") {
      handleLogout()
    }
  };

  const [qrScannerIsOpen, setQrScannerIsOpen] = useState(false);
  const [qrScannerFacingMode, setQrScannerFacingMode] =
    useState<MediaTrackConstraints>({ facingMode: "environment" });
  let qrScanner = new VibesMapFooterQrCode({
    qrReader: new WMLUIProperty({
      style: {
        height: "50%",
        alignSelf: "center",
      },
    }),
    qrReaderBox: new WMLUIProperty({
      style: {
        display: "flex",
        padding: "0 calc(16/16* 1rem)",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: whiteColor,
        height: "80%",
        borderRadius: borderRadius0,
        width: "calc(320/16 * 1rem)",
      },
    }),
    qrReaderModal: new WMLUIProperty({
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    }),
    title: new ShrikhandTextParams({
      text: "Scan Your Code",
      style: {
        textAlign: "center",
        fontSize: displayFont,
      },
    }),
  });
  let handleQrCodeError = ()=>{}
  let handleQrCodeScan = async (result)=>{

    if(result){
      let correctUrl = result.text.match(`${ENV.frontendDomain0}${ENV.nav.urls.vibesMap}/`)


      if(!correctUrl){
        setNotifyParams(new NotifyParams({
          isPresent:true,
          text:"Invalid  QRCode please try again later or contact support if the issue persists",
          severity:NotifyParamsSeverityEnum.ERROR
        }))

      }
      else{
        let eventId
        try{
          eventId =result.text.match(/-N.+/)[0]
        }
        catch{
          notificationPopup(true,NotifyParamsSeverityEnum.ERROR,t("global.error"))
        }
        let isEventReal = events.find(e=>e.id===eventId)
        if(!isEventReal){
          setNotifyParams(new NotifyParams({
            isPresent:true,
            text:t("VibesCapture.wmlNotify.invalidEvent"),
            severity:NotifyParamsSeverityEnum.ERROR
          }))
        }
        toggleOverlayLoading(true);
        let checkInUserResult = await checkInUserToAnEvent(eventId);
        toggleOverlayLoading(false);
        setNotifyParams(
          new NotifyParams({
            isPresent: true,
            text: checkInUserResult,
            severity:NotifyParamsSeverityEnum.INFO,
          })
        );
        navigate(`${ENV.nav.urls.vibesMap}/${eventId}`);
      }

      setQrScannerIsOpen(false);
    }
  };
  let handleQrScannerClose = () => {
    setQrScannerIsOpen(false);
  };

  // useEffect(() => {
  //   handleQrCodeScan({
  //     text:"https://localhost:3000/vibesMap/492767971267"
  //   })
  // },[])

  let toggleQrScannerFacingMode = () => {
    setQrScannerFacingMode((old) => {
      let myNew = { ...old };

      if (myNew.facingMode === "environment") {
        myNew.facingMode = {exact:"user"};
      } else {
        myNew.facingMode = "environment";
      }
      return myNew;
    });
  };

  const classPrefix = generateClassPrefix("VibesMapFooter");
  return (
    <div className="VibesMapFooter">
      <div className={classPrefix("MainPod")}>
        <BottomNavigation onChange={bottomNavsOnChange}>
          {
          React.Children.toArray(
          bottomNavs.map((btn, index0) => {
            return (
              <BottomNavigationAction

                value={btn.value}
                icon={
                  [
                    <PovIcon  color={btn.color} />,
                    // @ts-ignore
                    <HomeIcon  color={btn.color} />,
                    // @ts-ignore
                    <QrCodeScannerIcon  color={btn.color} />,
                    // @ts-ignore
                    <PersonOutlineOutlinedIcon color={btn.color}/>,
                    // @ts-ignore
                    <LogoutOutlinedIcon  color={btn.color}/>
                  ][index0]
                }
              />
            );
          }))}
        </BottomNavigation>
        <Modal
          // @ts-ignore
          sx={qrScanner.qrReaderModal.style}
          open={qrScannerIsOpen}
          onClose={handleQrScannerClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >

          <Box
            // @ts-ignore
            sx={qrScanner.qrReaderBox.style}
          >
            <ShrikhandText params={qrScanner.title} />

            <QrReader
              constraints={qrScannerFacingMode}
              scanDelay={100}
              // @ts-ignore
              style={qrScanner.qrReader.style}
              onError={handleQrCodeError}
              onResult={handleQrCodeScan}
            />
            <div
              onClick={toggleQrScannerFacingMode}
              className={classPrefix("Pod0Item0")}
            >
              <ThreeSixtyRoundedIcon />
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

class VibesMapFooterQrCode {
  constructor(params: Partial<VibesMapFooterQrCode> = {}) {
    Object.assign(this, {
      ...params,
    });
  }

  qrReader: WMLUIProperty;
  qrReaderBox: WMLUIProperty;
  qrReaderModal: WMLUIProperty;
  title: ShrikhandTextParams;
}
