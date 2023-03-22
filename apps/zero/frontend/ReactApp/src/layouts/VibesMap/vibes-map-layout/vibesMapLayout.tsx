// react
import React,{ useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams} from "react-router-dom";

// media
import logo from "../../../assets/media/shared/logo.png";

// styles
import "./styles.scss";
import "./tablet.scss";
import "./mobile.scss";

// utils
import { generateClassPrefix, WMLImage, WMLButton } from "../../../core/utility/common-utils";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// firebase
import { useAuth } from "../../../contexts/AuthContext";
import VibesMapMain from "../vibes-map-main";
import EventDetailMain from "src/pages/event-detail/event-detail-main/eventDetailMain";
import { usePOVEvents } from "src/contexts/POVEventsContext";
import PovAvatarIcon from "src/shared/components/avatarIcon";
import VibesMapFooter from "../vibes-map-footer/vibesMapFooter";


import { ENV } from "src/environments/environment";
import ProfilePage from "../../../pages/ProfilePage/ProfilePage";
import LogoImg from "src/shared/components/logoImg/logoImg";
export class VibesMapLayoutProfile {
  constructor(params = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  get displayName() {
    return `${this.firstName} ${this.lastName.charAt(0)}`;
  }
  tapIns: number = 65;
  avatar: WMLImage;
  firstName: string;
  lastName: string;
  title: string;
}

export function useVibesMapNavBackToMap(target, setCurrentEvent, navigate) {
  useEffect(() => {
    if (target.value === 0) {
      navigate(ENV.nav.urls.vibesMap);
      setCurrentEvent(null);
    }
  }, [target]);
}

export default function VibesMapLayout() {
  const { currentEvent, setCurrentEvent,events } = usePOVEvents();
  const params = useParams();
  const location = useLocation();

  const myClass = "VibesMapLayout"
  const classPrefix = generateClassPrefix(myClass);
  const myId = "VibesMap"
  const idPrefix = generateClassPrefix(myId)
  const logoImg = new WMLImage({
    src: logo,
    alt: "POV logo",
  });


  const [homeBtn, profileBtn, logoutBtn] = ["Home", "Profile", "Logout"]
    .map((text, index0) => {
      const btn = new WMLButton({
        text,
        id:[idPrefix("Home"),idPrefix("Profile"),idPrefix("Logout")][index0]
      });
      btn.updateClassString("GlobalBtn0");
      btn.updateClassString(classPrefix("Pod0Btn0"));
      if (index0 === 0 && determineWhetherToShowVibesMapPage()) {
        btn.updateClassString(classPrefix("Pod0Btn1"));
      }
      else if(index0 ===1 && determineWhetherToShowProfilePage()){
        btn.updateClassString(classPrefix("Pod0Btn1"))
      }

      btn.updateIconClassString("fa-solid");
      btn.updateIconClassString(["fa-home", "fa-user", "fa-plus"][index0]);

      return btn;
    });
  const [navBtns, setNavBtns] = useState([
    homeBtn,
    profileBtn,
    logoutBtn,
  ]);
  const [toggleNavBtn, setToggleNavBtn] = useState({ value: null });

  // Auth provider:
  const {   profileData,handleLogout } = useAuth();

  // Hook to navigate:
  const navigate = useNavigate();




  useVibesMapNavBackToMap(toggleNavBtn, setCurrentEvent, navigate);
  function clickNavBtn(index: number) {
    setNavBtns(() => {
      const myBtns = [homeBtn, profileBtn, logoutBtn];
      const toUpdate = myBtns[index];
      myBtns.forEach((myBtn) => {
        myBtn.updateClassString(classPrefix("Pod0Btn1"), "remove");
      });
      toUpdate.updateClassString(classPrefix("Pod0Btn1"));

      // Take user to back to home - Vibes Map:
      if(index === 0){
        navigate(ENV.nav.urls.vibesMap);
      }

      // Navigates to Profile:
      if(index === 1){
        navigate(ENV.nav.urls.profile);
      }

      // Handle user logout:
      if(index === 2){
        handleLogout();
      }

      return myBtns;
    });
    setToggleNavBtn({ value: index });
  }



  return (
    <div id="VibesMapLayout">
      <div className={classPrefix("MainPod")}>
        <aside className={classPrefix("Pod0")}>
          <LogoImg/>
          <section className={classPrefix("Pod0Item0")}>
            {React.Children.toArray(  navBtns.map((btn, index0) => {
              return (
                <button
                  id={btn.id}
                  onClick={() => clickNavBtn(index0)}
                  className={btn.class}
                >
                  <div className={classPrefix("Pod0Item4")}>
                    {
                      [
                        <HomeIcon />,
                        <PersonIcon />,
                        <LogoutOutlinedIcon />,
                      ][index0]
                    }
                  </div>
                  <label>{btn.text}</label>
                </button>
              );
            }))}
          </section>
          <div className={classPrefix("Pod0StrikeThru0")}></div>
          <div className={classPrefix("Pod0Item1")}>
            <div className={classPrefix("Pod0Img1")}>
              <PovAvatarIcon fontSize={50} />
            </div>
            <div className={classPrefix("Pod0Item2")}>
              <p className="GlobalText0">{`${profileData?.firstName} `}</p>
              <p>{profileData.title}</p>
            </div>
            <div className={classPrefix("Pod0Item3")}>
              <KeyboardArrowUpIcon/>
              <KeyboardArrowDownIcon/>
            </div>
          </div>
        </aside>

        <main className={classPrefix("Pod1")}>
          <div className={classPrefix("Pod1Item0")}>
            {determineWhetherToShowVibesMapPage() && <VibesMapMain />}
            {determineWhetherToShowEventDetailPage() && <EventDetailMain />}
            {determineWhetherToShowProfilePage() && <ProfilePage />}
          </div>
          <div className={classPrefix("Pod1Item1")}>
            <VibesMapFooter />
          </div>
        </main>
      </div>
    </div>
  );

  function determineWhetherToShowProfilePage() {
    return location.pathname === ENV.nav.urls.profile;
  }

  function determineWhetherToShowEventDetailPage() {
    return params.id && location.pathname.includes(`${ENV.nav.urls.vibesMap}`);
  }

  function determineWhetherToShowVibesMapPage() {
    return !params.id && location.pathname === `${ENV.nav.urls.vibesMap}`;
  }
}
