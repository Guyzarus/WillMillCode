import React,{ useState,useEffect } from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix, whiteColor } from "src/core/utility/common-utils";

// i18n
import { useTranslation } from "react-i18next";
import ShrikhandText, { ShrikhandTextParams, ShrikhandTextParamsTypeEnum } from "src/shared/components/ShrikhandText/Shrikhand";

export default function SiteUnavailable() {
  const classPrefix = generateClassPrefix("SiteUnavailable");
  const {t, i18n} = useTranslation('common');

  let title = new ShrikhandTextParams({
    text:t("SiteUnavailable.title"),
    type:ShrikhandTextParamsTypeEnum.h1,
    style:{
      fontSize:"5vw",
    }
  })

  return (
    <div className="SiteUnavailable">
      <div className={classPrefix("MainPod")}>
        <div className={classPrefix("Pod0")}>
          <ShrikhandText params={title} />
          <p>{t("SiteUnavailable.desc")}</p>
        </div>
      </div>
    </div>
  );
}
