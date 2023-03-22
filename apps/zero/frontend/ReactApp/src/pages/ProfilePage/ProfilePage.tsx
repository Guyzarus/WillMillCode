import React, { useEffect, useState } from "react";

// styles
import "./styles.scss";
import "./mobile.scss";
import "./tablet.scss";
import userBackground from "../../assets/media/profile-page/profile-avatar-background.jpg";
// utils
import { generateClassPrefix, WMLImage } from "src/core/utility/common-utils";
import { Box } from "@mui/material";
import ProfileCardZero from "src/shared/components/profile-card-zero/profile-card-zero";
import UserEventNFTs from "src/shared/components/user-event-nfts/user-event-nfts";
import NearMintStatus, { NearMintStatusParams } from "src/shared/components/NearMintStatus/NearMintStatus";

const backgroundUserImage = new WMLImage({
  src: userBackground,
  alt: "User Backdrop",
});



export default function ProfilePage() {
  const classPrefix = generateClassPrefix("ProfilePage");
  const nearMintStatusParams = new NearMintStatusParams()


  /**
   * Call this function for mint - MintSingleToNear()
   * similar case happens in UploadTOIPFS File - Line 340
   * Expected PROPS :
   * - title
   * - description
   * - ipfsHashLink
   * - notificationPopup - this can be created.
   * you can look at the function to see how it works.
   * PS: Users must be connected to a valid address before the minting can take place
   */

  return (
    <div className="ProfilePage">
      <NearMintStatus params={nearMintStatusParams} />
      <div className={classPrefix("MainPod")}>
        <section className={classPrefix("Pod0")}>
          <img
            className={classPrefix("Pod0Img0")}
            src={backgroundUserImage.src}
            alt={backgroundUserImage.alt}
          />
          <div className={classPrefix("Pod0Item0")}>
            <ProfileCardZero />
          </div>
        </section>
        <section className={classPrefix("Pod1")}>
          <UserEventNFTs />
        </section>
      </div>
    </div>
  );
}
