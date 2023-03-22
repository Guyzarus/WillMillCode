import React, { useEffect, useRef, useState } from "react";
import { AuthAddNFT, AuthUser, useAuth } from "src/contexts/AuthContext";
import Attribute from "./Attribute/Attribute";
import { useNavigate, useParams } from "react-router-dom";
import { ENV } from "src/environments/environment";
import { Box, Modal } from "@mui/material";
import {
  borderRadius0,
  getHashMapFromFirebaseRealtimeDatabase,
  whiteColor,
  WMLAPIError,
  WMLError,
  WMLImage,
  WMLUIProperty,
} from "src/core/utility/common-utils";
import { NotifyParams, NotifyParamsSeverityEnum, useNotify } from "src/contexts/NotifyContext";
import VibesScoreSlider from "src/shared/components/vibesScore/VibesScoreSlider";
import SliderInput from "./slider/SliderInput";
import { MintSingleToNear } from "src/shared/components/uploadAndMint/MintSingleToNear";
import { NearWalletPopup } from "src/shared/components/walletPopup/NearWalletPopup";

import {
  getBase64,
  getFileFromBase64,
  uploadJSONToPinata,
} from "src/shared/components/uploadAndMint/UploadFileToStorage";

//icons
import { ReactComponent as NearIcon } from "../../../assets/media/shared/near-icon.svg";

//styles
import "./styles.scss";
import "./mobile.scss";
import "./tablet.scss";
import {
  NearErrorPop,
  NearSuccessPopup,
} from "src/shared/components/mintStatus/MintStatusPopup";
import { usePOVEvents } from "src/contexts/POVEventsContext";
import { ref, set, update } from "@firebase/database";
import { firebaseDB, firebaseDBRef } from "src/api/firebase";

// buffer:
import { Buffer } from "buffer";
import NearMintStatus, { NearMintStatusParams } from "src/shared/components/NearMintStatus/NearMintStatus";
import { useNFT } from "src/contexts/NFTContext";
import { get, child } from "firebase/database";

const UploadToIPFS = () => {
  // @ts-ignore
  window.Buffer = Buffer;

  const {
    currentEvent,
    getFirebaseEventsTable,
    useSetCurrentPOVEvent,
    setCurrentEvent,
    events,
  } = usePOVEvents();
  const { addNFTToUserEventNFTTable, profileData } = useAuth();
  const { notificationPopup,setNotifyParams } = useNotify();
  const { nearAccount, nearConnector, setNearConnector, setNearAccount } =
    useAuth();
  const navigate = useNavigate();
  const clipboardRef = useRef();
  const loadedMinter = JSON.parse(sessionStorage.getItem("minter"));

  const { id } = useParams();
  const [state, setState] = useState({
    image: sessionStorage.getItem("file"),
    file: "",
    title: "",
    description: "",
    uploadedLink: "",
    modal: false,
    clipboardState: "Copy",
    vibeProps: {
      friendliness: 0,
      energy: 0,
      density: 0,
      diversity: 0,
    },
    notificationShow: false,
    attributes: {},
  });
  const [ipfsUrl,setIpfsUrl] = useState("")
  const {
    image,
    title,
    description,
    attributes,
    vibeProps,
    clipboardState,
    modal,
    file,
    uploadedLink,
  } = state;
  const nearMintStatusParams = new NearMintStatusParams()
  const params = useParams();
  const {
    mintNft,
    connectToNear
  } = useNFT()

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const uploadImg = new WMLImage({
    src: image,
    alt: "Image Logo",
  });

  useSetCurrentPOVEvent(navigate, params);
  useEffect(() => {
    //@ts-ignore
  }, [window.selector]);



  useEffect(() => {
    const file = loadedMinter.urls.map((base64File) => {
      return getFileFromBase64(base64File.url, base64File.name, "image/png");
    });

    handleSetState({
      image: URL.createObjectURL(file[0]),
      file,
    });
  }, []);

  let uploadPopup = new VibesStorageUpload({
    uploadModal: new WMLUIProperty({
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    }),
    uploadModalBox: new WMLUIProperty({
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: whiteColor,
        height: "76%",
        minHeight: "550px",
        maxHeight: "800px",
        borderRadius: borderRadius0,
        width: "50%",
        minWidth: "350px",
        maxWidth: "550px",
      },
    }),
  });

  const handleAddAttribute = () => {
    handleSetState({
      attributes: {
        ...attributes,
        [Date.now()]: { trait_type: "", value: "" },
      },
    });
  };

  const handleRemoveAttribute = (id) => {
    const newAttributes = {};

    for (const key in attributes) {
      if (Number.parseInt(key) != id) {
        newAttributes[key] = attributes[key];
      }
    }

    handleSetState({ attributes: newAttributes });
  };

  const handleChangeAttribute = (arg) => {
    const {
      event: {
        target: { name, value },
      },
      id,
    } = arg;
    handleSetState({
      attributes: { ...attributes, [id]: { ...attributes[id], [name]: value } },
    });
  };

  const calculateVibeScore = async (vibeScore) => {
    currentEvent.vibeScore.amountOfRatings += 1;
    Object.entries(vibeScore).forEach((entry) => {
      // @ts-ignore
      let [key, value]: [string, number] = entry;
      currentEvent.vibeScore[key] =
        (currentEvent.vibeScore[key] *
          (currentEvent.vibeScore.amountOfRatings - 1) +
          value) /
        currentEvent.vibeScore.amountOfRatings;
    });
  };

  const updateFBEventVibeScore = async (prevVibeScore) => {
    return getHashMapFromFirebaseRealtimeDatabase(get(child(firebaseDBRef,ENV.firebase.realtimeDatabase.endpoints.povEvents )))
      .then((firebaseEvents) => {
        let fbTarget = Object.entries(firebaseEvents).find(
          ([id,val]) => currentEvent.id === id
        )[1];
        fbTarget.id = currentEvent.id
        fbTarget.vibeScore = currentEvent.vibeScore;

        console.log("currentevent.vibescore ", currentEvent.vibeScore);
        // @ts-ignore
        delete fbTarget.vibeScore.total;
        return update(ref(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.povEvents+"/"+fbTarget.id+"/"+"vibeScore"), fbTarget.vibeScore);
      })
      .catch((error) => {
        currentEvent.vibeScore = prevVibeScore;
        notificationPopup(
          true,
          "error",
          "There was an error while updating the vibeScore of the event, please try again later or contact support if the issue persists"
        );
        console.log("error in update:", error);
        return new WMLAPIError({});
      });
  };

  const handleUpload = async () => {
    const uploadProps = {
      file: file[0],
      name: title,
      description,
      vibeProps,
      id,
      attributes,
    };
    handleSetState({ notificationShow: true });
    if (!title || !description) {
      const message =
        "Please make sure to input details in all required fields";
      notificationPopup(true, "error", message);
      setTimeout(() => {
        notificationPopup(false, "error", message);
      }, 3000);
      return;
    }

    notificationPopup(true, "warning", "Uploading in Progress...");
    let prevVibeScore = currentEvent.vibeScore;
    calculateVibeScore(vibeProps);
    let updateFBEventVibeScoreResult = await updateFBEventVibeScore(
      prevVibeScore
    );
    if (updateFBEventVibeScoreResult instanceof WMLAPIError) {
      return;
    }

    await uploadJSONToPinata(uploadProps, id, notificationPopup).then(
      (pinataLink) => {
        notificationPopup(true, "success", "Uploaded Successfully...");

        let ipfsURL = "https://ipfs.io/ipfs/" + pinataLink.ipfsJSONLink.IpfsHash
        setIpfsUrl(ipfsURL)
        return addNFTToUserEventNFTTable(
          new AuthAddNFT({
            title,
            description,
            eventId: currentEvent.id,
            userId: profileData.userId,
            vibeScore: vibeProps,
            attributes,
            ipfsURL,
            eventPhotoURL:
              "https://ipfs.io/ipfs/" + pinataLink.ipfsImageLink.IpfsHash,
          })
        )
          .catch((error) => {
            notificationPopup(
              true,
              "warning",
              "There was an error while uploading your nft information please contact customer support for further assitance"
            );
          })
          .finally(() => {
            handleSetState({
              uploadedLink: pinataLink.ipfsJSONLink.IpfsHash,
              modal: true,
            });
          });
      }
    );
  };

  const handleCopy = (props) => {
    const { navigator, clipboard } = props;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(`ipfs://${uploadedLink}`);
    handleSetState({ clipboardState: "Copied" });
    setTimeout(() => {
      handleSetState({ clipboardState: "Copy" });
    }, 850);
  };



  function mintNftFromMedia(){

    (async()=>{
      let mintNftParams = {
        title:title,
        description:description,
        ipfsLink: ipfsUrl
      }
      let mintedHash = await mintNft(mintNftParams)
      if(mintedHash instanceof WMLError){
        let result =await connectToNear()
        if(result instanceof WMLError){
          setNotifyParams(new NotifyParams({
            isPresent:true,
            autoHide:true,
            severity:NotifyParamsSeverityEnum.ERROR,
            text:"There was an issue while trying to mint your nft please contact support if the issue persists"
          }))
        }
        else{
          await mintNft(mintNftParams)
        }
      }
    })()
  }

  return (
    <div className="upload-container-wrapper">
      <NearMintStatus params={nearMintStatusParams} />
      <div className="header-section">
        <h1 className="header">Upload to Storage</h1>
      </div>
      <div className="image">
        {image && <img src={uploadImg.src} alt={uploadImg.alt} />}
      </div>
      <div className="input-fields">
        <div className="inputWrapper">
          <label>
            {" "}
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            value={title}
            className="input"
            onChange={(event) => {
              handleSetState({ title: event.target.value });
            }}
          />
        </div>
        <div className="inputWrapper">
          <label>
            {" "}
            Description <span className="required">*</span>
          </label>
          <textarea
            value={description}
            rows={5}
            className="input"
            onChange={(event) => {
              handleSetState({ description: event.target.value });
            }}
          />
        </div>
        <div className="inputWrapper">
          <VibesScoreSlider
            handleSetState={handleSetState}
            vibeProps={vibeProps}
          />
        </div>
        <div className="inputWrapper">
          <h1 className="attr-title">Attributes</h1>
          {Object.keys(attributes).map((key) => (
            <Attribute
              key={key}
              attribute={attributes[key]}
              id={key}
              index={key}
              removeAttribute={handleRemoveAttribute}
              changeAttribute={handleChangeAttribute}
            />
          ))}
          <div className="attr-button">
            <button type="button" onClick={handleAddAttribute}>
              + Add Attribute
            </button>
          </div>
        </div>
      </div>
      <div className="upload-buttons">
        <button onClick={handleUpload}>Upload</button>
        <button
          onClick={() => {
            sessionStorage.removeItem("file");
            navigate(ENV.nav.urls.vibesMap);
          }}
        >
          Cancel
        </button>
      </div>
      <Modal
        open={modal}
        sx={uploadPopup.uploadModal.style}
        onClose={() => {
          handleSetState({ modal: false });
          navigate(`${ENV.nav.urls.vibesMap}/${currentEvent.id}`);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={uploadPopup.uploadModalBox.style}>
          <div className="upload-modal-container">
            <div className="header">
              <h1>Upload Successful</h1>
              <span>Your Image has been uploaded successfully</span>
            </div>
            <div className="image-section">
              {image && <img src={image} alt="" />}
            </div>
            <div className="upload-button">
              <span>
                {uploadedLink
                  ? `https://ipfs.io/ipfs/${uploadedLink.substring(1, 20)}...`
                  : ""}
              </span>
              <button
                type="button"
                className="copy-button"
                onClick={() =>
                  handleCopy({ navigator, clipboard: clipboardRef.current })
                }
              >
                {clipboardState}
              </button>
              <input
                style={{ display: "none" }}
                ref={clipboardRef}
                type="text"
              />
            </div>
            <div className="upload-submit-button">
              <button
                onClick={() => {
                  window.location.href = ENV.nav.urls.profile;
                }}
              >
                Profile
              </button>
              <button onClick={mintNftFromMedia}>Mint Now</button>
            </div>
            <div>
              <div className="near-details">
                {nearAccount ? (
                  <div>
                    <span> Connected wallet </span>
                    <div className="near-connect">
                      <NearIcon />
                      <span className="account">{nearAccount}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="near-connect">
                      <span onClick={connectToNear} className="connect">
                        Not Connected? Setup your near wallet
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {/* <div onClick={handleNearLogout}>
                <span>logout</span>
              </div> */}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

class VibesStorageUpload {
  constructor(params: Partial<VibesStorageUpload> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  uploadModal: WMLUIProperty;
  uploadModalBox: WMLUIProperty;
}

export default UploadToIPFS;
