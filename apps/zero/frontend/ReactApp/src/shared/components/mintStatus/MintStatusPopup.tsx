import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

//icons
import { ReactComponent as CloseIcon } from "../../../assets/media/shared/icon-close.svg";
import { ReactComponent as SuccessIcon } from "../../../assets/media/shared/icon-success_2.svg";
import { ReactComponent as ErrorIcon } from "../../../assets/media/shared/icon-error_2.svg";

//styles
import "./styles.scss";
import { ENV } from "src/environments/environment";
import { generateClassPrefix } from "src/core/utility/common-utils";

export const NearErrorPop = (props) => {
  const { handleSetState, popupProps } = props;
  const classPrefix = generateClassPrefix("MintStatusPopup");
  const navigate = useNavigate();

  const handleResetPopup = () => {
    handleSetState({
      popupProps: {
        isError: null,
        url: null,
        Popup: false,
      },
    });
    navigate(`${ENV.nav.urls.vibesMap}`);
  };

  return (
    <div className={classPrefix("")}>
      <div className={`container ${popupProps?.Popup && "active"}`}>
        <div className="popupContainer">
          <CloseIcon onClick={handleResetPopup} className="closeIcon" />
          <div className="imgContainer">
            <ErrorIcon />
          </div>
          <h3 className={`heading error`}>Mint Failed</h3>
          <p className="errorMsg">
            Something went wrong while minting, Please try again
          </p>
          <div className="actionBtnContainer">
            <button onClick={handleResetPopup} className={`actionBtn errorBtn`}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NearSuccessPopup = (props) => {
  const clipboardRef = useRef(null);
  const [clipboardState, setClipboardState] = useState("Copy");
  const navigate = useNavigate();
  const classPrefix = generateClassPrefix("MintStatusPopup");

  const {
    handleSetState,
    popupProps: { url },
  } = props;

  const handleCopy = (clipProps) => {
    const { navigator, clipboard } = clipProps;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    setClipboardState("Copied");
    setTimeout(() => {
      setClipboardState("Copy");
    }, 650);
  };

  const handleResetPopup = () => {
    handleSetState({
      popupProps: {
        isError: null,
        url: null,
        Popup: false,
      },
    });
    navigate(`${ENV.nav.urls.profile}`);
  };
  return (
    <div className={classPrefix("")}>
      <div className={`container active`}>
        <div className="popupContainer">
          <CloseIcon onClick={handleResetPopup} className="closeIcon" />
          <div className="imgContainer">
            <SuccessIcon />
          </div>
          <h3 className={`heading success`}>Mint Successful</h3>
          <div className="actionBtnContainer">
            <button
              onClick={() => navigate(`${ENV.nav.urls.profile}`)}
              type="button"
              className={`actionBtn _1`}
            >
              Go to Profile
            </button>
            <button className={`actionBtn _2`} type="button">
              <a
                href={`https://explorer.near.org/transactions/${url}`}
                target="_blank"
                rel="noreferrer"
              >
                Block Explorer
              </a>
            </button>
          </div>
          <div className={"detailsContainer"}>
            <div
              className={"url"}
            >{`https://explorer.near.org/transactions/${url}`}</div>
            <button
              onClick={() =>
                handleCopy({ navigator, clipboard: clipboardRef.current })
              }
              className={"copyBtn"}
              type="button"
            >
              {clipboardState}
            </button>
            <input
              style={{ display: "none" }}
              ref={clipboardRef}
              type="text"
              defaultValue={`https://explorer.near.org/transactions/${url}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
