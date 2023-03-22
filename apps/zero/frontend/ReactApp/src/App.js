
// react
import React,{useEffect,useState} from "react";
import { useLocation, useNavigate } from 'react-router-dom';

// scss
import './App.scss';

// layouts
import Landing from './layouts/Onboarding/landing/Landing';
import Register from './layouts/Onboarding/register/Register';
import Login from './layouts/Onboarding/login/Login';
import VibesMap from './layouts/VibesMap/vibes-map-layout/vibesMapLayout'
import VibesCapture from "./layouts/VibesMap/vibes-map-upload-popup/vibes-capture/VibesCapture";

import ProfileSettings from './layouts/Profile/profile-settings/ProfileSettings'
import ProfileLogin from './layouts/Profile/profile-login/ProfileLogin'
import ProfileWallet from './layouts/Profile/profile-wallet/ProfileWallet'

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import {mapBoxAccessToken} from "src/api/mapbox";

// router
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { usePOVEvents } from "./contexts/POVEventsContext";
import {ENV, EnvAppSiteUnavailableEnum} from "src/environments/environment";
import AdminPanelLayout from "./pages/admin-panel/AdminPanel";

// notify
import Notify from "./shared/components/notify/notify";
import { NotifyParams, NotifyParamsSeverityEnum, useNotify } from "src/contexts/NotifyContext";

// near wallet
// import { WalletSelectorContextProvider } from "./contexts/WalletSelectorContext";

// misc
import { WMLAPIError } from "./core/utility/common-utils";

// auth
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// i18n
import {useTranslation} from "react-i18next";

// dayjs
import dayjs from "dayjs";
import OverlayLoading from "./shared/components/overlayLoading/overlayLoading";
import { useOverlayLoading } from "./contexts/OverlayLoadingContext";
import UploadToIPFS from "./layouts/VibesMap/vibes-map-upload-preview-page/UploadToIPFS";
import { auth } from "./api/firebase";
import { modifyPOVEvents, removeAllFilesFromPinata } from "./core/utility/automate/scratchPad";
import ManageEvents, { ManageEventsParams } from "./pages/manage-events/manage-events";
import SiteUnavailable from "./pages/site-unavailable/site-unavailable";
let utc = require('dayjs/plugin/utc')
let customParseFormat = require('dayjs/plugin/customParseFormat')
let duration = require('dayjs/plugin/duration')
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(duration)




function App() {


  const{
    toggleOverlayLoading
  } =useOverlayLoading()
  const {
    setNotifyParams
  } = useNotify()
  const {
    getUserProfileData,
    getUsersNFTs,
    profileData
  } = useAuth()
  mapboxgl.accessToken = mapBoxAccessToken
  const location = useLocation();
  const navigate = useNavigate();
  const {
    getListOfEvents,
    getGenreList,
    getTimesOfDay,
    getProvisions
  }=usePOVEvents()
  const {t, i18n} = useTranslation('common');


  const [areEventsLoaded,setareEventsLoaded] = useState(false)

  useEffect(() => {
    if(ENV.app.siteUnavailable === EnvAppSiteUnavailableEnum.true && location.pathname !== ENV.nav.urls.siteUnavailable ){
      navigate(ENV.nav.urls.siteUnavailable)
    }
    else if(ENV.app.siteUnavailable === EnvAppSiteUnavailableEnum.false && location.pathname === ENV.nav.urls.siteUnavailable){
      navigate(ENV.nav.urls.home)
    }
  },[location])

  useEffect(()=>{
    if(areEventsLoaded) return

    determineWhetherToLoadEvents();
  },[location])


  useEffect(()=>{
    if(profileData.isUserInfoLoaded || profileData.userLoginStatus ==="isNotLoggedIn"){
      if(navigateToHomeIfUserIsNotAnAdmin()){
        return
      };
    }


  },[profileData,location])

  useEffect(() => {

    let currentRoute = Object.entries(ENV.nav.urls)
    .filter((entry)=>{
      let [key,val]=entry
      return val ===location.pathname
    })
    document.title = t("global.pageTitles."+(currentRoute?.[0]?.[0] ?? "home"));
  }, [location]);


  // useEffect(()=>{
  //   removeAllFilesFromPinata()
  // },[])



  let createEventParams = new ManageEventsParams({
    type:"create",
    title:t("ManageEvents.create.title"),
    submit:t("ManageEvents.create.title"),
  })

  let editEventParams = new ManageEventsParams({
    type:"edit",
    title:t("ManageEvents.edit.title"),
    submit:t("ManageEvents.edit.title")
  })

  return (
    <>
      <Notify />
      <OverlayLoading/>
      <Routes>
        {/* Landing */}
        <Route path="/" exact element={<Landing/>} />

        {/* Admin Panel */}
        <Route path={ENV.nav.urls.admin} exact element={<AdminPanelLayout/>} />
        <Route path={`${ENV.nav.urls.editEvent}/:id`} exact element={<ManageEvents params={editEventParams}/>} />
        <Route path={`${ENV.nav.urls.createEvent}`} exact element={<ManageEvents params={createEventParams}/>}  />

        {/* Vibe Map */}
        <Route path={ENV.nav.urls.vibesMap}  element={<VibesMap/>} />
        <Route path={`${ENV.nav.urls.vibesMap}/:id`}  element={<VibesMap/>} />

        {/* Register */}
        <Route path="/register" exact element={<Register/>} />

        {/* Login */}
        <Route title="Proof Of Vibes Login" path="/login" exact element={<Login/>} />

        {/* Capture */}
        <Route path={`${ENV.nav.urls.capture}/:id`} exact element={<VibesCapture />} />
        <Route
          path={`${ENV.nav.urls.previewUpload}/:id`} exact element={<UploadToIPFS/>} />

        {/* Profile */}
        <Route path={ENV.nav.urls.profile} exact element={<VibesMap/>} />

        {/* Edit Profile */}
        <Route path={ENV.nav.urls.settings} exact element={<ProfileSettings/>} />

        {/* Login & Security */}
        <Route path="/security" exact element={<ProfileLogin/>} />

        {/* Wallet */}
        <Route path="/wallet" exact element={<ProfileWallet/>} />
        <Route path ={ENV.nav.urls.siteUnavailable} exact element={<SiteUnavailable/>} />
      </Routes>
    </>
);

  function navigateToHomeIfUserIsNotAnAdmin() {
    let adminProtected = [ENV.nav.urls.admin]
      .some((val) => {
        return location.pathname.match(val);
      });
    if (adminProtected) {
      if (!profileData.isAdmin) {
        navigate(`${ENV.nav.urls.home}`);
        return true
      }
    }
    return false

  }

  function determineWhetherToLoadEvents() {
    let shouldLoadEventInfo = [ENV.nav.urls.vibesMap, ENV.nav.urls.admin,ENV.nav.urls.previewUpload]
      .some((val) => {
        return location.pathname.match(val);
      });
    if (shouldLoadEventInfo) {
      setareEventsLoaded(true);
      (async () => {
        toggleOverlayLoading(true);
        await getGenreList();
        let result = await getListOfEvents();
        if (result instanceof WMLAPIError) {
          toggleOverlayLoading(false);
          setNotifyParams(new NotifyParams({
            isPresent: true,
            severity:NotifyParamsSeverityEnum.ERROR,
            text: "There has been an issue while trying to start the application please try again later or contact support if the issue persists"
          }));
        }
        await getTimesOfDay();
        await getProvisions();
        toggleOverlayLoading(false);
      })();
    }
  }
}

export default App;

