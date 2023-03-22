import React from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix } from "src/core/utility/common-utils";
import { Backdrop, CircularProgress } from "@mui/material";
import { OverlayLoadingParams, useOverlayLoading } from "src/contexts/OverlayLoadingContext";

export default function OverlayLoading() {
  const classPrefix = generateClassPrefix("OverlayLoading");
  const {
    overlayLoadingParams
  } = useOverlayLoading()


  return (
    <div className="OverlayLoading">
      <div className={classPrefix("MainPod")}>
        <div className={classPrefix("Pod0")}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={overlayLoadingParams.isPresent}

        >
          <CircularProgress color="inherit" />
        </Backdrop>
        </div>
      </div>
    </div>
  );
}
