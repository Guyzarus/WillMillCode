import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import uploadIcon from "../../../assets/media/shared/Union.png";
import { useAuth } from "../../../contexts/AuthContext";

// styles
import "./styles.scss";
import "./mobile.scss";
import "./tablet.scss";

//utils
import {
  borderRadius0,
  displayFont,
  whiteColor,
  WMLImage,
  WMLUIProperty,
} from "src/core/utility/common-utils";

//misc
import ShrikhandText, {
  ShrikhandTextParams,
} from "src/shared/components/ShrikhandText/Shrikhand";
import { ENV } from "src/environments/environment";
import {
  getBase64,
  pinFileToIPFS,
} from "src/shared/components/uploadAndMint/UploadFileToStorage";

export default function ImageUploadPopup({
  modal,
  setModal,
  handleModalClose,
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { capturedFile, setCapturedFile } = useAuth();
  const { id } = useParams();

  const loadedFile = sessionStorage.getItem("file");

  const acceptedFileTypes = ".png";

  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile === null) return;

    sessionStorage.setItem("file", URL.createObjectURL(uploadedFile));
    setCapturedFile(uploadedFile);
    Promise.all(Array.prototype.map.call(event.target.files, getBase64)).then(
      (urls) => {
        const newMinterFields = { urls };
        sessionStorage.setItem("minter", JSON.stringify(newMinterFields));
      }
    );
  };

  const handleClose = () => {
    sessionStorage.removeItem("file");
    setCapturedFile(null);
    setModal(false);
  };

  const uploadImg = new WMLImage({
    src: uploadIcon,
    alt: "Image Logo",
  });

  let uploadPopup = new VibesImageUpload({
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
        height: "80%",
        borderRadius: borderRadius0,
        width: "45%",
        minWidth: "320px",
      },
    }),
    title: new ShrikhandTextParams({
      text: "Upload a file",
      style: {
        textAlign: "center",
        fontSize: displayFont,
      },
    }),
    subTitle: new ShrikhandTextParams({
      text: "File should be PNG or APNG",
      type: "p",
      style: {
        textAlign: "center",
      },
    }),
  });

  return (
    <div className="VibesMapUpload">
      <Modal
        open={modal}
        sx={uploadPopup.uploadModal.style}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={"popup-box"}>
          <ShrikhandText params={uploadPopup.title} />
          <div>
            <div className="title">
              <span className="subHeader">File should be PNG or APNG</span>
            </div>
            <div className="image-preview">
              {capturedFile ? (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img
                  className="uploaded-image"
                  src={URL.createObjectURL(capturedFile)}
                  alt="image"
                />
              ) : (
                <img src={uploadImg.src} alt={uploadImg.alt} />
              )}
            </div>
            <div className="upload-button">
              <span>Choose a file</span>
              <button type="button" onClick={() => fileRef.current.click()}>
                Browse
              </button>
              <input
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e)}
                ref={fileRef}
                type="file"
                accept={acceptedFileTypes}
              />
            </div>
          </div>
          {
            <div className="bereal-photo">
              <button onClick={handleClose}>Never Mind</button>
              <button
                className="capture-button"
                onClick={() => navigate(`${ENV.nav.urls.capture}/${id}`)}
              >
                Capture
              </button>
              <button
                className="upload-button"
                disabled={!capturedFile}
                onClick={() => navigate(`${ENV.nav.urls.previewUpload}/${id}`)}
              >
                Upload
              </button>
            </div>
          }
        </Box>
      </Modal>
    </div>
  );
}

class VibesImageUpload {
  constructor(params: Partial<VibesImageUpload> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  uploadModal: WMLUIProperty;
  uploadModalBox: WMLUIProperty;
  title: ShrikhandTextParams;
  subTitle: ShrikhandTextParams;
}
