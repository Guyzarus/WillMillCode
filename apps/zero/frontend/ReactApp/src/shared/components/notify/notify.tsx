import React from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix } from "src/core/utility/common-utils";
import { Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NotifyParams, useNotify } from "src/contexts/NotifyContext";

export default function Notify() {
  const { notifyParams, setNotifyParams } = useNotify();
  const myClass = "Notify";
  const classPrefix = generateClassPrefix(myClass);
  let closeNotify = () => {
    setNotifyParams((old) => {
      let myNew = new NotifyParams(old);
      myNew.isPresent = false;
      return myNew;
    });
  };

  return (
    <div className="Notify">
      <div className={classPrefix("MainPod")}>
        <Collapse in={notifyParams.isPresent}>
          <Alert
            id={classPrefix("Banner")}
            severity={notifyParams.severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={closeNotify}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {notifyParams.text}
          </Alert>
        </Collapse>
      </div>
    </div>
  );
}
