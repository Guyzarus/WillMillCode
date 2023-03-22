import React, { useEffect, useState } from "react";

// styles
import "./styles.scss";

// utils
import { blackColor, darkGreyColor, generateClassPrefix, generateRandomNumber, makeLowerCase, povminty, povorange, selectRandomOptionFromArray, WMLButton, WMLError, WMLImage, WMLOptionsButton, WMLRoute, WMLUIProperty } from "src/core/utility/common-utils";

import OptionsButtonGroup, { OptionsButtonGroupBtn, OptionsButtonGroupParams } from "../options-button-group/options-button-group";
import { AuthUser, useAuth } from "src/contexts/AuthContext";
import DetailCard, { DetailCardParams } from "../detail-card/detail-card";

// material ui
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { KeysParams } from "../Keys/keys";
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import { NotifyParams, NotifyParamsSeverityEnum, useNotify } from "src/contexts/NotifyContext";
import { MintSingleToNear } from "../uploadAndMint/MintSingleToNear";
import { useNFT } from "src/contexts/NFTContext";



export default function UserEventNFTs() {


  const{
    profileData,
    updateUserNft
  }= useAuth()
  const classPrefix = generateClassPrefix("UserEventNFTs");
  const [toggleMedia,settoggleMedia] = useState<WMLUIProperty<AuthUser["usersNFTs"],"Photos"|"Videos">>(
    new WMLUIProperty({
      type:"Photos",
      value:[]
    })
  )
  const [areNFTMediaInit,setAreNFTMediaInit] = useState(false)
  const { notificationPopup,setNotifyParams } = useNotify();
  const {
    mintNft,
    connectToNear
  } = useNFT()
  const myId = "Profile"
  const idPrefix = generateClassPrefix(myId)


  /**
   * @todo figure out why this refueses to work properly
   */
  function mediaTypesOnClick(text,index0:number) {
    return function(){
      return
      console.log(profileData.usersNFTs)
      settoggleMedia(
        new WMLUIProperty({
          type:text,
          value:[profileData.usersNFTs,[]][index0]
        })
      )
    }
  }
  const mediaTypes = new OptionsButtonGroupParams({
    limit:1,
    options:["Photos","Videos"]
    .map((text,index0)=>{
      return new OptionsButtonGroupBtn({
        text,
        onClick: mediaTypesOnClick(text,index0),
        isChosen:[true,false][index0],
        value:{
          backgroundColor:[povminty,povorange][index0],
          color:blackColor
        }
      })
    })
  })

  function mintNftFromMedia(media:AuthUser["usersNFTs"][number]){

    return async()=>{
      let mintNftParams = {
        title:media.title,
        description:media.description,
        ipfsLink: media.ipfsURL
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
    }
  }




  useEffect(()=>{
    if(areNFTMediaInit ) return
    if(profileData.isUserInfoLoaded){
      setAreNFTMediaInit(true)
    }

    settoggleMedia(
      new WMLUIProperty({
        type:"photo",
        value:profileData.usersNFTs
      })
    )

  },[profileData])

  return (
    <div className="UserEventNFTs">
      <div className={classPrefix("MainPod")}>
        <div className={classPrefix("Pod0")}>
          <h2 className={classPrefix("Pod0Text0")}>My NFT's</h2>
          <OptionsButtonGroup params={mediaTypes}/>
          <div className={classPrefix("Pod0Item0")}>
            { toggleMedia.value.length !== 0 &&
            React.Children.toArray(
              toggleMedia
              .value
              .map((media,index0)=>{

                let detailCardParams = new DetailCardParams({
                  mainImg:new WMLImage({
                    src:media.eventPhotoURL,
                    alt:"NFT Image",
                    style:{
                      border:"calc(1/16 * 1rem) solid "+darkGreyColor
                    }
                  }),
                  subsections:[
                    new WMLUIProperty({
                      value:[
                        new WMLUIProperty({
                          type:"title",
                          value:media.title
                        }),
                        new WMLUIProperty({
                          type:"icon",
                          value:<FileUploadOutlinedIcon/>
                        })
                      ]
                    }),
                    new WMLUIProperty({
                      value:[
                        new WMLUIProperty({
                          type:"desc",
                          value:media.description
                          }),
                      ]
                    }),
                    new WMLUIProperty({
                      value:["Energy","Diversity"]
                        .map((value)=>{
                          return new WMLUIProperty({
                            type:"keys",
                            value:new KeysParams({
                              keys:[{
                                icon:new WMLUIProperty({
                                  value:<MoodOutlinedIcon/>
                                }),
                                text:new WMLRoute({
                                  text:`${media.vibeScore[makeLowerCase(value)]} ${value}`
                                })
                              }]
                            })
                          })
                        })

                    }),
                    new WMLUIProperty({
                      value:
                        ["Density","Friendliness"]
                        .map((value)=>{
                          return new WMLUIProperty({
                            type:"keys",
                            value:new KeysParams({
                              keys:[{
                                icon:new WMLUIProperty({
                                  value:<MoodOutlinedIcon/>
                                }),
                                text:new WMLRoute({
                                  text:`${media.vibeScore[makeLowerCase(value)]} ${value}`
                                })
                              }]
                            })
                          })
                        })
                    }),
                    new WMLUIProperty({
                      value:[
                        new WMLUIProperty({
                          type:"strikethru",
                        }),
                      ]
                    }),
                    new WMLUIProperty({
                      value:[
                        new WMLUIProperty({
                          type:"btn",
                          value:new WMLOptionsButton({
                            id:idPrefix("MintBtn"+index0),
                            text:"Mint Now",
                            isPresent:!media.isMftMinted,
                            click:mintNftFromMedia(media)
                          })
                        }),
                        // new WMLUIProperty({
                        //   type:"keys",
                        //   value:new KeysParams({
                        //     keys:[{
                        //       icon:new WMLUIProperty({
                        //         value:<CloudOutlinedIcon/>
                        //       }),
                        //       text:new WMLRoute({
                        //         text:media.isMftMinted ? "Minted" : "Not Minted"
                        //       })
                        //     }]
                        //   })
                        // })
                      ]
                    }),
                  ]
                })
                return (
                  <div className={classPrefix("Pod0Item1")}>
                    <DetailCard params={detailCardParams}/>
                  </div>
                )
              })
            )
          }
          {
            toggleMedia.value.length === 0 &&
            <p>You do not have any {makeLowerCase(toggleMedia.type)}'s to view at this time</p>
          }
          </div>
        </div>
      </div>
    </div>
  );
}
