import React from "react";
import { SvgIcon } from "@mui/material";
import { useNavigate } from "react-router-dom";

//icons
import { ReactComponent as CameraIcon } from "../../../../assets/media/shared/icon-camera-solid.svg";

// styles
import "./styles.scss";
import PrimaryBtn from "src/shared/components/primaryBtn/primaryBtn";
import { WMLOptionsButton } from "src/core/utility/common-utils";
import { useTranslation } from "react-i18next";
import { ENV } from "src/environments/environment";
import SecondaryBtn from "src/shared/components/secondaryBtn/SecondaryBtn";

export default function EnableCapture({
  cameraPermission,
  enableAccess,
  toggle,
}) {
  const navigate = useNavigate();
  const {t, i18n} = useTranslation('common');

  const allowAccessBtn = new WMLOptionsButton({
    text:t("EnableCapture.allowAccessBtn")
  })

  const denyAccessBtn = new WMLOptionsButton({
    text:t("EnableCapture.denyAccessBtn"),
    click:()=>{
      navigate(ENV.nav.urls.vibesMap)
    }
  })

  return (
    <>
      {!cameraPermission ? (
        <div className={`contents ${toggle && "deactive"}`}>
          <div className="popupWrapper">
            <div className="card">
              <div className="heading">
                {/* <CameraIcon /> */}
                <SvgIcon component={CameraIcon} />
                <h3>Allow camera access</h3>
                <p>Please allow us to access your web cam to take pictures</p>
              </div>

              <div className="wrapper">
                <SecondaryBtn params={denyAccessBtn} />
                <PrimaryBtn params={allowAccessBtn} onClick={enableAccess}/>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
