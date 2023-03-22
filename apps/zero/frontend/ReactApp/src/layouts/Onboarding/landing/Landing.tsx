// react
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

// media
import logo from '../../../assets/media/shared/logo-white.png';
import heroBackground from '../../../assets/media/shared/hero-background.png';
import phoneGradient1 from '../../../assets/media/shared/phone-bg-gradient-1.png';
import phoneGradient2 from '../../../assets/media/shared/phone-bg-gradient-2.png';
import phone1 from '../../../assets/media/shared/phone-1.png';
import phone2 from '../../../assets/media/shared/phone-2.png';

// scss
import './Landing.scss';
import './mobile.scss';

import { ENV } from "src/environments/environment";

// auth provider
import { useAuth } from "src/contexts/AuthContext"
import { CSSVARS, generateClassPrefix, whiteColor, WMLImage, WMLOptionsButton } from "src/core/utility/common-utils";
import SecondaryBtn from "src/shared/components/secondaryBtn/SecondaryBtn";
import PrimaryBtn from "src/shared/components/primaryBtn/primaryBtn";

function Landing() {


  const navigate = useNavigate();
  const myClass = "Landing"
  const classPrefix = generateClassPrefix(myClass);

  const {
    profileData,
    handleLogout
  } = useAuth()

  let mainBackgroundImg = new WMLImage({
    src:heroBackground,
    alt:"Hero Background"
  })

  let loginStyles  ={
    color:whiteColor,
    padding:`${CSSVARS.spacing2} ${CSSVARS.spacing6}`,
    margin:`${CSSVARS.spacing3} ${CSSVARS.spacing5} 0 0`
  }
  let signUpBtn = new WMLOptionsButton({
    text:"Sign Up",
    id:classPrefix("signUp"),
    style:loginStyles,
    click:()=>{
      navigate(ENV.nav.urls.register)
    }
  })

  const [signInBtn,setsignInBtn] = useState(
    new WMLOptionsButton({
      text:"Sign In",
      id:classPrefix("signIn"),
      style:loginStyles,
      click:()=>{
        navigate(ENV.nav.urls.login)
      }
    })
  )

  const [signOutBtn,setsignOutBtn] = useState(
    new WMLOptionsButton({
      text:"Sign Out",
      id:classPrefix("signOut"),
      style:loginStyles,
      click:()=>{
        handleLogout()
      }
    })
  )



  useEffect(()=>{
    setsignInBtn((old)=>{
      let myNew = new WMLOptionsButton(old)
      myNew.isPresent = profileData.userLoginStatus !=="isLoggedIn"
      return myNew
    })
    setsignOutBtn((old)=>{
      let myNew = new WMLOptionsButton(old)
      myNew.isPresent = profileData.userLoginStatus ==="isLoggedIn"
      return myNew
    })

  },[profileData])


  return (
    <>
    <div className={myClass}>
      {/*** start ***/}

      {/* Navbar */}
      <section
        className="w-full px-8 bg-black">
        <div className="flex flex-col flex-wrap items-center justify-between py-6 mx-auto md:flex-row max-w-7xl">
          {/* Logo */}
          <div className="relative flex flex-col md:flex-row">
            <a
              href="#_"
              className="flex items-center mb-5 font-medium lg:w-auto lg:items-center lg:justify-center md:mb-0">
              <img src={logo} alt="POV Logo" className="w-auto h-12 fill-current"
              // @ts-ignore
              viewBox="0 0 125 100"></img>
            </a>
          </div>

          {/* Navigation Links & Sign In Button */}
          <div className="inline-flex flex-col items-center sm:flex-row sm:ml-5 lg:justify-end">
            <nav className="flex flex-wrap items-center space-x-4 text-s font-semibold tracking-wide sm:space-x-6">
              {profileData.isAdmin  &&
              <Link  className="text-white hover:text-blue-400" to={ENV.nav.urls.admin}>
              Admin Panel
              </Link>
              }
              {(profileData.userLoginStatus ==="isLoggedIn" || ENV.constructor.name === "DevEnv") &&
              <Link  className="text-white hover:text-blue-400" to={ENV.nav.urls.vibesMap}>
              Vibes Map
              </Link>
              }
              <a href={ENV.nav.urls.about}
                id={classPrefix("About")}
                className="text-white hover:text-blue-400">About Us</a>
              {(profileData.userLoginStatus ==="isLoggedIn" || ENV.constructor.name === "DevEnv")  &&
              <Link  className="text-white hover:text-blue-400" to={ENV.nav.urls.profile}>
              Profile
              </Link>
              }
              <PrimaryBtn params={signInBtn}/>
              <PrimaryBtn params={signOutBtn}/>
            </nav>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className={classPrefix("Pod0")}>
        <img className={classPrefix("Pod0Img0")} src={mainBackgroundImg.src} alt={mainBackgroundImg.alt} />
        <div className={classPrefix("Pod0Item0")}>
          <h5 className={classPrefix("Pod0Text0")}>Rewarding You for Good Vibes</h5>
          <p>Sign up below and start earning now.</p>
          <div className={classPrefix("Pod0Item1")}>
            <SecondaryBtn params={signUpBtn}/>
            <PrimaryBtn params={signInBtn}/>
            <PrimaryBtn params={signOutBtn}/>
          </div>
        </div>
      </section>



      {/* Explore Section */}
      <section
        className="flex flex-col w-full overflow-hidden bg-black lg:flex-row sm:mx-auto xl:h-48 xl:bg-black lg:h-5">
        <div className="flex justify-end p-8 bg-black lg:py-32 lg:px-16 lg:pl-10 lg:w-1/2 xl:bg-black">
          <div className="flex flex-col items-start justify-center w-full lg:max-w-lg">
            <h5 className="mb-3 text-2xl font-extrabold leading-none  sm:text-2xl lg:text-5xl xl:italic xl:text-white lg:italic">
              Explore
            </h5>
            <p className="py-3 mb-5 text-white  lg:text-lg xl:text-white">
              Learn more about Proof of Vibes & what we're about.
            </p>
          </div>
        </div>
        <div className="flex justify-end p-8 bg-black lg:py-32 lg:px-16 lg:pl-10 lg:w-1/2 xl:bg-black">
          <div className="flex flex-col items-end justify-center w-full lg:max-w-lg">
            <div className="flex items-end">
              <button
                className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white bg-pov-orange rounded-xl hover:bg-pov-orange xl:h-12 2xl:h-12 xl:bg-pov-orange lg:bg-black 2xl:font-semibold">
                About Us
              </button>
              <button
                onClick={()=> {navigate("/")}}
                className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white bg-black rounded-xl hover:bg-pov-orange xl:h-12 2xl:h-12 2xl:font-semibold">
                Vibe Paper
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Render Section 1 */}
      <div
        style={{ backgroundImage: `url(${phoneGradient1})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
        className="overflow-hidden component_block">
        <section className="bg-transparent 2xl:bg-transparent">
          <div className="mt-20 mb-20 flex flex-col-reverse items-center justify-center rounded-3xl max-w-5xl px-10 pt-16 mx-auto md:flex-row md:space-x-20 lg:space-x-32 md:pt-24 2xl:bg-pov-minty">
            <div className="flex flex-col items-start w-full h-96 max-w-xs pb-10 space-y-7 md:pb-0 md:max-w-none">
              <p
                className="inline-block font-medium tracking-wider text-black uppercase text-xxs">
                FEATURE 01
              </p>
              <h5
                className="text-left text-5xl font-black text-gray-900 2xl:italic"
                >
                Find Your Tribe
              </h5>
              <p
                className="text-left text-lg"
                >
                With PoV you can now connect with those who have<br></br>the same vibe as you!
              </p>
            </div>
            <div
              style={{ backgroundImage: `url(${phone1})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
              className="box-content relative flex items-start justify-center flex-shrink-0 pb-16 border-2 border-b-0 border-gray-900 w-80 rounded-t-3xl h-96" data-primary="gray-900">
            </div>
          </div>
        </section>
      </div>

      {/* Phone Render Section 2 */}
      <div
        style={{ backgroundImage: `url(${phoneGradient2})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
        className="overflow-hidden component_block">
        <section className="bg-transparent 2xl:bg-transparent">
          <div className="mt-20 mb-20 flex flex-col-reverse items-center justify-center rounded-3xl max-w-5xl px-10 pt-16 mx-auto md:flex-row md:space-x-20 lg:space-x-32 md:pt-24 2xl:bg-pov-peach">
            <div
              style={{ backgroundImage: `url(${phone2})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
              className="box-content relative flex items-start justify-center flex-shrink-0 pb-16 border-2 border-b-0 border-gray-900 w-80 rounded-t-3xl h-96" data-primary="gray-900">
            </div>
            <div className="flex flex-col items-start w-full h-96 max-w-xs pb-10 space-y-7 md:pb-0 md:max-w-none">
              <p
                className="inline-block font-medium tracking-wider text-black uppercase text-xxs"
                >
                FEATURE 02
              </p>
              <h5
                className="text-left text-5xl font-black text-gray-900 2xl:italic"
                >
                Tap In
              </h5>
              <p
                className="text-left text-lg"
                >
                If you want solution, you've come to the right place. <br></br> POV is ready to offer a full dedication to your needs!
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="">
        <div className="flex grid row p-20 gap-6 justify-center align-items-center bg-pov-skyblue">
          <h5 className="text-white text-4xl">
            What Vibe Seekers are Saying
          </h5>
          <h2 className="text-white text-xl text-center">
            If you want solution, you've come to the right place.<br></br> Our company POV can offer you a full dedication to your needs!
          </h2>
        </div>
      </div>
    </div>
    {/*** end ***/}
    </>
  );
}

export default Landing;
