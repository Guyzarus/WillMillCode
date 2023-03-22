import React, { useState } from "react";

// styles
import "./styles.scss";

// utils
import {
  generateClassPrefix,
  WMLImage,
  WMLButton,
  WMLUIProperty,
} from "../../../core/utility/common-utils";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import PovIcon from "src/shared/components/povIcon";
import VibesMapBody from "../vibes-map-body/vibesMapBody";
import VibesMapSearch from "../vibes-map-search/vibesMapSearch";




export default function VibesMapMain() {
  const classPrefix = generateClassPrefix("VibesMapMain");


  return (
    <div className="VibesMapMain">
      <div className={classPrefix("MainPod")}>
        <div className={classPrefix("Pod1Item0")}>
          <h1>Vibes Near You</h1>
        </div>
        <div className={classPrefix("Pod1Strike0")}></div>
        <div className={classPrefix("Pod1Item1")}>
          <div className={classPrefix("Pod1Item2")}>
            <VibesMapSearch />
          </div>
          <div className={classPrefix("Pod1Item3")}>
            <VibesMapBody />
          </div>
        </div>

      </div>
    </div>
  );
}
