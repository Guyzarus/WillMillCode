// react
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// styles
import "./ProfileSettings.scss";
// import "./tablet.scss";
import "./mobile.scss";

// auth context
import { useAuth } from "src/contexts/AuthContext";
import { ENV } from "src/environments/environment";
import {
  NotifyParams,
  NotifyParamsSeverityEnum,
  useNotify,
} from "src/contexts/NotifyContext";
import { generateClassPrefix, InputTypes, WMLAPIError } from "src/core/utility/common-utils";
import LogoImg from "src/shared/components/logoImg/logoImg";

export default function ProfileSettings() {

  const myClass= "ProfileSettings"
  const classPrefix = generateClassPrefix(myClass);
  // Hook to navigate:
  const navigate = useNavigate();
  const routerLocation = useLocation();

  // User Context:
  const {
    login,
    nearAccount,
    nearConnector,
    setNearConnector,
    setNearAccount,
    profileData,
    updateUserProfile,
  } = useAuth();
  const { setNotifyParams, notificationPopup } = useNotify();

  // User Data:
  const [name, setName] = useState(profileData.firstName);
  const [lastName, setLastName] = useState(profileData.lastName);
  const [phoneNum, setPhoneNum] = useState(profileData.phoneNum);
  const [email, setEmail] = useState(profileData.email);
  const [bio, setBio] = useState(profileData.biography);
  const [location, setLocation] = useState(profileData.location);
  const [language, setLanguage] = useState(profileData.language);
  const [website, setWebsite] = useState(profileData.socialWebsite);
  const [twitter, setTwitter] = useState(profileData.socialTwitter);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileData.isUserInfoLoaded || !(profileData.userLoginStatus === "")) {
      setName(profileData.firstName);
      setLastName(profileData.lastName);
      setPhoneNum(profileData.phoneNum);
      setEmail(profileData.email);
      setBio(profileData.biography);
      setLocation(profileData.location);
      setLanguage(profileData.language);
      setWebsite(profileData.socialWebsite);
      setTwitter(profileData.socialTwitter);
    }
    if (
      profileData.isUserInfoLoaded &&
      routerLocation?.state?.prevPath?.pathname === ENV.nav.urls.login
    ) {
      navigate(ENV.nav.urls.profile);
    }
  }, [profileData]);

  // Handles user editting their profile, updates db with their data:
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Invoking a function that will register the user:

      let notifyResult = new NotifyParams({
        autoHide: true,
        isPresent:true,
      })

      // Update Database:
      let result = await updateUserProfile(
        name,
        lastName,
        phoneNum,
        email,
        bio,
        location,
        language,
        website,
        twitter
      );
      if (result instanceof WMLAPIError) {
        notifyResult.text = result.msg,
        notifyResult.severity = NotifyParamsSeverityEnum.ERROR
        setNotifyParams(notifyResult);
      }
      else{
        notifyResult.text = result,
        notifyResult.severity = NotifyParamsSeverityEnum.SUCCESS
        setNotifyParams(notifyResult);
        navigate(ENV.nav.urls.profile);
      }

      setLoading(false);

  }

  return (
    <div className="ProfileSettings">
      <div className="column">
        {/* Side 1: Contains profile settings navigation */}
        <div className="left">
          <div className="leftBorder">
            <div className="">
              <div className="dataWrapperSettings">
                <svg
                  className="icons"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <Link to="/settings" className="navButton">
                  <p className="navigation">Personal Info</p>
                </Link>
              </div>
              <div className="dataWrapperSettings">
                <svg
                  className="icons"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <Link to="/security" className="navButton">
                  <p className="navigation">Login & Security</p>
                </Link>
              </div>
              <div className="dataWrapperSettings">
                <svg
                  className="icons"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                  />
                </svg>
                <Link to="/wallet" className="navButton">
                  <p className="navigation">Wallet</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Side 2: Contains all sign on buttons & stuff */}
        <div className="right">
          {/* Profile Settings */}
          <div className="rightBorder">
            <div className={classPrefix("Pod1Item0")}>
              <h2 className="">Personal Info</h2>
              <LogoImg/>
            </div>
            <h3 className="">Account Info</h3>
            <form className="" onSubmit={handleFormSubmit}>
              <div className="dataWrapper">
                <div className="dataBox">
                  {/* First name */}
                  <h4 className="">FIRST NAME</h4>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete={InputTypes.firstName}
                    required
                    className="h4"
                    placeholder="Enter your first name"
                    defaultValue={profileData.firstName}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="">
                  {/* Last Name */}
                  <h4 className="">LAST NAME</h4>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete={InputTypes.lastName}
                    required
                    className="h4"
                    placeholder="Enter your last name"
                    defaultValue={profileData.lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="dataWrapper">
                <div className="dataBox">
                  {/* Phone Number */}
                  <h4 className="">PHONE</h4>
                  <input
                    id="phone"
                    name="phone"
                    type="phone"
                    autoComplete="phone"
                    required
                    className=""
                    placeholder="Phone number"
                    defaultValue={profileData.phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                  />
                </div>

                <div className="">
                  {/* Email */}
                  <h4 className="">EMAIL</h4>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className=""
                    placeholder="Email address"
                    defaultValue={profileData.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Bio */}
              <h4 className="">BIO</h4>
              <textarea
                id="bio"
                name="bio"
                autoComplete="bio"
                required
                className=""
                placeholder="About yourself in a few words"
                defaultValue={profileData.biography}
                onChange={(e) => setBio(e.target.value)}
              />

              <div className="dataWrapper">
                <div className="dataBox">
                  {/* Location */}
                  <h4 className="">LOCATION</h4>
                  <input
                    id="location"
                    name="location"
                    type="location"
                    autoComplete="location"
                    required
                    className=""
                    placeholder="Location"
                    defaultValue={profileData.location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="">
                  {/* Language */}
                  <h4 className="">SPEAK</h4>
                  <input
                    id="language"
                    name="language"
                    type="language"
                    autoComplete="language"
                    required
                    className=""
                    placeholder="English (United States)"
                    defaultValue={profileData.language}
                    onChange={(e) => setLanguage(e.target.value)}
                  />
                </div>
              </div>

              <h3 className="">Social</h3>
              <div className="dataWrapper">
                <div className="dataBox">
                  {/* Website */}
                  <h4 className="">WEBSITE</h4>
                  <input
                    id="website"
                    name="website"
                    type="website"
                    autoComplete="website"
                    required
                    className=""
                    placeholder="Your site URL"
                    defaultValue={profileData.socialWebsite}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="">
                  {/* Language */}
                  <h4 className="">TWITTER</h4>
                  <input
                    id="twitter"
                    name="twitter"
                    type="twitter"
                    autoComplete="twitter"
                    className=""
                    placeholder="@twitter username"
                    defaultValue={profileData.socialTwitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
              </div>

              {/* Strike */}
              <div className="strike"></div>

              <div className="dataWrapperUpdates">
                <button className="updateButton">Update Profile</button>
              </div>
            </form>
          </div>
          {/* End of Column Right */}
        </div>
      </div>
    </div>
  );
}
