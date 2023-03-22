import axios from "axios";
import { ENV } from "src/environments/environment";


//pinata keys
const pinataApiKey =  ENV.pinataKeys.POV_PINATA_API_KEY;
const pinataApiSecret = ENV.pinataKeys.POV_PINATA_API_SECRET_KEY;



export const getAllNFTsByEventIds = async (eventId,pageOffset=0,pageLimit=1000,status="pinned",events=[])=>{
  const url = ENV.pinata.getNFTByEventIds.url(
    eventId,
    pageOffset.toString(),
    pageLimit.toString()
  );
  let result = await(await fetch(url,{
    headers: {
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataApiSecret
    }
  })).json()
  events.push(...result.rows)
  if(result.rows.length === pageLimit){
    return getAllNFTsByEventIds(eventId,pageOffset++,pageLimit,status,events);
  }
  else {
    return events
  }
}

export const pinFileToIPFS = async (file, metadata, notification) => {
  const metadataUpload = {
    name: metadata.name,
    description: metadata.description
  }
  const stringifiedData = JSON.stringify(metadataUpload)

  const formData = new FormData();
  formData.append('file', file)
  formData.append("pinataMetadata", stringifiedData)
  const options = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', options);

  const url= 'https://api.pinata.cloud/pinning/pinFileToIPFS'

  return axios.post(url, formData,{
    maxBodyLength: "Infinity",
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataApiSecret
    },
  })
      .then(response => {
        return response.data
      })
      .catch(error => notification(true, "error", "Something went wrong while uploading the file"))
}

export const uploadJSONToPinata = async (uploadProps, id, notification) => {

  const ipfsImageLink = await pinFileToIPFS(uploadProps.file, uploadProps, notification)
  sessionStorage.setItem("file", `https://ipfs.io/ipfs/${ipfsImageLink.IpfsHash}`)
  const data = JSON.stringify({
    image: `ipfs://${ipfsImageLink.IpfsHash}`,
    name: uploadProps.name,
    description: uploadProps.description,
    metadata: {
      attributes: uploadProps.attributes,
      NFTVibeScore: uploadProps.vibeProps,
      eventId: id
    }
  })

  const config = {
    method: "post",
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataApiSecret
    },
    data
  }
  const ipfsJSONLink = await  axios(config)
  .then(response => response.data)
  .catch(error => notification(true, "error", "Something went wrong while uploading the file"));
  return {
    ipfsJSONLink,
    ipfsImageLink
  }
}


export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve({ name: file.name, url: fr.result });
    };
    fr.readAsDataURL(file);
  });
}

export function getFileFromBase64(string64, fileName, type) {
  const trimmedString = string64.split(",")[1];
  const imageContent = atob(trimmedString);
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);
  for (let n = 0; n < imageContent.length; n += 1) {
    view[n] = imageContent.charCodeAt(n);
  }
  const blob = new Blob([buffer], { type });
  return new File([blob], fileName, {
    lastModified: new Date().getTime(),
    type,
  });
}
