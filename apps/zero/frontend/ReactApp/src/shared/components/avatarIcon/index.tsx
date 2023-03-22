import React  from "react";


// styles
import "./styles.scss";


import {ReactComponent as avatarIcon} from "../../../assets/media/shared/avatar_img.svg"


import { SvgIcon } from "@mui/material";


export default function PovAvatarIcon(props) {


  return (
      <SvgIcon sx={{
        fontSize: props.fontSize ?? 30,
        margin:props.margin ?? 0,
      }}  component={avatarIcon } inheritViewBox />
  );
}
