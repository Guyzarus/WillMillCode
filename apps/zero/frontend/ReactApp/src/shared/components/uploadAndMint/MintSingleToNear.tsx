import { utils } from "near-api-js";
import { ENV } from "src/environments/environment";

// buffer:
import { Buffer } from 'buffer';
import { WMLAPIError, WMLError } from "src/core/utility/common-utils";

export const MintSingleToNear = async (nearMintProps) => {

  // @ts-ignore
  window.Buffer = Buffer;


  const { title, description, ipfsLink, notificationPopup } = nearMintProps;
  // @ts-ignore
  if(!window.selector){
    return new WMLError({
      msg:"Wallet Not Connected"
    })
  }

  try{
    const {
      contract: { contractId },
      accounts,
      // @ts-ignore
    } = window.selector.store.getState()
    const accountId = accounts[0]

    notificationPopup(true, "warning", "Minting in Progress, Please wait...")

    if(accountId) {
      //  notification: uploading to ipfs
        let response;
        let smartContractParams = {
          methodName: "nft_mint",
          args: {
            token_id: `vibes-${Date.now()}`,
            metadata: {
              title,
              description,
              media: `https://ipfs.io/ipfs/${ipfsLink}`,
              reference: ipfsLink,
            },
            receiver_id: accountId,
          },
          gas: utils.format.parseNearAmount("0.0000000003"),
          deposit: utils.format.parseNearAmount("0.01"),
        }
          //check if the user is connected to the sender near wallet
            // @ts-ignore
          if (window?.near?.accountId) {
            response = await window?.near?.signAndSendTransaction({
              receiverId: contractId,
              actions: [
                smartContractParams
              ],
            });
          }else {
              // @ts-ignore
              const wallet = await window.selector.wallet();
              response = await wallet.signAndSendTransaction({
                signerId: accountId,
                receiverId: contractId,
                // callbackUrl: `http://${window.location.host}/${ENV.nav.urls.previewUpload}/`,
                actions: [
                  {
                    type: "FunctionCall",
                    params: smartContractParams,
                  },
                ],
              });
            }
            notificationPopup(true, "success", "Successfully Minted")
            return response;

    }
    else{
      return new WMLError({
        msg:"Wallet Not Connected"
      })
    }
  }
  catch(e){
    return new WMLError({
      msg:"Wallet Not Connected"
    })
  }

}
