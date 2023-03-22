import React from "react";

// styles
import "./styles.scss";

import { ReactComponent as povIconSvgOption } from "../../../assets/media/shared/pov_icon_option.svg";
import { ReactComponent as povIconSvgSelect } from "../../../assets/media/shared/pov_icon_select.svg";
import {ReactComponent as povLogoIcon} from "../../../assets/media/shared/logo_icon.svg";

import { SvgIcon } from "@mui/material";

export default function PovIcon(props) {
  return (
    <>
      {[undefined, null, "default"].includes(props.type) && (
        <SvgIcon
          component={
            props.color === "primary" ? povIconSvgSelect : povIconSvgOption
          }
          inheritViewBox
        />
      )}
      {["type_1"].includes(props.type) && (
        <SvgIcon
          component={povLogoIcon}
          inheritViewBox
        />
      )}
    </>
  );
}
