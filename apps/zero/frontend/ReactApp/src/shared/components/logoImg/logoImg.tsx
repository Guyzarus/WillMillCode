import React,{ useState,useEffect } from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix, WMLImage } from "src/core/utility/common-utils";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// media
import logo from "../../../assets/media/shared/logo.png";

export default function LogoImg() {
  const myClass= "LogoImg"
  const classPrefix = generateClassPrefix(myClass);
  const {t,i18n}=useTranslation("common");

  const logoImg = new WMLImage({
    src: logo,
    alt: "POV logo",
  });

  return (
    <Link className={classPrefix("Pod0Img0")} to="/">
      <img src={logoImg.src} alt={logoImg.alt} />
    </Link>
  );
}
