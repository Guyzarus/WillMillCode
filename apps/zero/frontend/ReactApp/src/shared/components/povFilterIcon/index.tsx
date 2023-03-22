import React  from "react";


// styles
import "./styles.scss";

import {ReactComponent as povFilterIcon} from "../../../assets/media/shared/pov_filter_icon.svg"


import { SvgIcon } from "@mui/material";


export default function PovFilterIcon(props) {

  return (
      <SvgIcon   component={povFilterIcon } inheritViewBox />
  );
}
