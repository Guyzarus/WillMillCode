import {ENV} from "src/environments/environment"

console.log(ENV)
module.exports = {
    pinataApiKey:ENV.pinataKeys.POV_PINATA_API_KEY,
    pinataApiSecret: ENV.pinataKeys.POV_PINATA_API_SECRET_KEY,
    pinataFileUrl: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    pinataJSONUrl: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    ipfsNode: "http://localhost:5002",
    arc3MetadataJSON: {
      name: "",
      description: "",
      image: "ipfs://",
      image_integrity: "sha256-",
      image_mimetype: "image/png",
      animation_url: "",
      animation_url_integrity: "sha256-",
      animation_url_mimetype: "",
    },
  };
