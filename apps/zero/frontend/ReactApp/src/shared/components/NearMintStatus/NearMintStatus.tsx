import React, { useEffect, useState } from "react";
import { NearErrorPop, NearSuccessPopup } from "../mintStatus/MintStatusPopup";



export class NearMintStatusParams {
  constructor(params:Partial<NearMintStatusParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  modal = false
  popupProps= {
    isError: false,
    url: null,
    Popup: false,
  }
}

const NearMintStatus = (props:{params:NearMintStatusParams}) => {
  const [state, setState] = useState(props.params);
  const { popupProps } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  //Check if minting was a success or failure
  useEffect(() => {
    //@ts-ignore
    const search = new URL(document.location).searchParams;
    if (search.get("errorCode")) {
      handleSetState({
        modal: false,
        popupProps: {
          isError: true,
          Popup: true,
        },
      });
    }
    if (search.get("transactionHashes")) {
      handleSetState({
        modal: false,
        popupProps: {
          isError: false,
          Popup: true,
          url: search.get("transactionHashes"),
        },
      });
    }
  }, []);

  return (
    <div>
      {" "}
      {popupProps.isError && (
        <NearErrorPop handleSetState={handleSetState} popupProps={popupProps} />
      )}
      {!popupProps.isError && popupProps.Popup && (
        <NearSuccessPopup
          handleSetState={handleSetState}
          popupProps={popupProps}
        />
      )}
    </div>
  );
};

export default NearMintStatus;
