import React from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix, WMLRoute, WMLUIProperty } from "src/core/utility/common-utils";
import { useAuth } from "src/contexts/AuthContext";
import PovAvatarIcon from "../avatarIcon";

// material ui
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import MoodIcon from '@mui/icons-material/Mood';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// misc
import Keys, { KeysParams } from "../Keys/keys";
import StrikeThru from "../strike-thru/strike-thru";
import { ENV } from "src/environments/environment";




export default function ProfileCardZero() {


  const {
    profileData
  } = useAuth()
  const iconFontSize=20
  const myId = "Profile"
  const idPrefix = generateClassPrefix(myId)

  const keysParams0 = new KeysParams({
    keys:["tribe","location"]
    .map((text,index0)=>{
      return{
        icon:new WMLUIProperty({
          value:[
          <CloudOutlinedIcon sx={{fontSize:iconFontSize}}/>,
          <RoomOutlinedIcon sx={{fontSize:iconFontSize}}/>
        ][index0]
        }),
        text:new WMLRoute({
          text:profileData[text]
        })
      }
    })
  })

  const keysParams1 = new KeysParams({
    keys:["displayVibeChecks","displayTapIns"]
    .map((text,index0)=>{
      return{
        icon:new WMLUIProperty({
          value:[
          <MoodIcon sx={{fontSize:iconFontSize}}/>,
          <AutoAwesomeOutlinedIcon sx={{fontSize:iconFontSize}}/>
        ][index0]
        }),
        text:new WMLRoute({
          text:profileData[text]
        })
      }
    })
  })

  const keysParams2 = new KeysParams({
    keys:["socialWebsite"]
    .map((text,index0)=>{
      return{
        icon:new WMLUIProperty({
          value:[<LanguageOutlinedIcon sx={{fontSize:iconFontSize}}/>][index0]
        }),
        text:new WMLRoute({
          type:"link",
          text:profileData[text],
          route:profileData[text]
        })
      }
    })
  })

  const keysParams3 = new KeysParams({
    container:new WMLUIProperty({
      style:{
        flexDirection:"column",
        alignContent:"center",
      }
    }),
    keys:["Edit Profile","Report this profile"]
    .map((text,index0)=>{
      return{
        container:new WMLUIProperty({
          style:{justifyContent:"center"}
        }),
        icon:new WMLUIProperty({
          value:[
          <EditOutlinedIcon sx={{fontSize:iconFontSize}}/>,
          <FlagOutlinedIcon sx={{fontSize:iconFontSize}}/>
        ][index0]
        }),
        text:new WMLRoute({
          text,
          id:[idPrefix("Edit"),idPrefix("Report")][index0],
          type:"link",
          route:[
            ENV.nav.urls.settings,
            ENV.nav.urls.home
          ][index0]
        })
      }
    })
  })

  const classPrefix = generateClassPrefix("ProfileCardZero");
  return (
    <div className="ProfileCardZero">
      <div className={classPrefix("MainPod")}>
        <section className={classPrefix("Pod0")}>
          <PovAvatarIcon fontSize={80} />
          <h2 className={classPrefix("Pod0Text0")}>{profileData.firstName} {profileData.lastName}</h2>
          <div className={classPrefix("Pod0Item0")}>
            <Keys params={keysParams0}/>
          </div>
        </section>
        <section className={classPrefix("Pod1")}>
          <div className={classPrefix("Pod1Item0")}>
            <Keys params={keysParams1}/>
          </div>
          <p className={classPrefix("Pod1Text0")}>{profileData.biography}</p>
          <Keys params={keysParams2}/>
        </section>
        <section className={classPrefix("Pod2")}>
          <div className={classPrefix("Pod2Item0")}>
            {
              React.Children.toArray([
                <FileUploadOutlinedIcon sx={{fontSize:iconFontSize}}/>,
                <MonetizationOnOutlinedIcon sx={{fontSize:iconFontSize}}/>
              ]
              .map((jsx)=>{
                return(
                  <div className={classPrefix("Pod2Item1")}>
                    {jsx}
                  </div>
                )
              })
              )
            }
          </div>
          <div className={classPrefix("Pod2Item2")}>
            {
              React.Children.toArray([
                <TwitterIcon  sx={{fontSize:iconFontSize}} />,
                <InstagramIcon sx={{fontSize:iconFontSize}} />,
                <FacebookIcon sx={{fontSize:iconFontSize}} />,
                <LinkedInIcon sx={{fontSize:iconFontSize}} />,
              ]
              .map((jsx,index0)=>{
                return <a
                id={idPrefix("Twitter")}
                href={
                  profileData[
                    [
                      "socialTwitter",
                      "socialInstagram",
                      "socialFacebook",
                      "socialLinkedin",
                    ][index0]
                  ]
                }
                >{jsx}</a>
              })
              )
            }
          </div>
          <StrikeThru/>
          <Keys params={keysParams3}/>
        </section>
      </div>
    </div>
  );
}
