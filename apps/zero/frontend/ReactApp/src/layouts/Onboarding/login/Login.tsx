// react
import React from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";

// auth context
import { useAuth } from "src/contexts/AuthContext";

// scss
import "./Login.scss"
import "./mobile.scss"

// assets
import logo from "../../../assets/media/shared/logo.png";

// near wallet
import {

  NearWalletPopup,
} from "src/shared/components/walletPopup/NearWalletPopup";

// buffer:
import { Buffer } from 'buffer';
import { ENV } from "src/environments/environment";
import { generateClassPrefix } from "src/core/utility/common-utils";
import { NotifyParamsSeverityEnum, useNotify } from "src/contexts/NotifyContext";
import { useTranslation } from "react-i18next";

export default function Login() {

  const {
    notificationPopup
  } = useNotify();
  const {t,i18n}=useTranslation("common");

  // @ts-ignore
  window.Buffer = Buffer;
  const myClass = "Login"
  const classPrefix = generateClassPrefix(myClass);

  // Hook to navigate:
  const navigate = useNavigate();
  const location = useLocation();


  // User Data:
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    currentUser,
    login,
    loginAnonymously,
    nearAccount,
    nearConnector,
    setNearConnector,
    setNearAccount } = useAuth();

  const walletProps = { setNearAccount, setNearConnector };
  const [state, setState] = useState();

  // Handles user login:
  async function handleFormSubmit(e){
    e.preventDefault();

    // Invoking a function that will register the user:
    try {
        setLoading(true);
        await login(email, password);
        notificationPopup(false)
        setLoading(false);
        navigate(ENV.nav.urls.settings,{state:{prevPath:location}});
    } catch (error) {
      let msg = t("global.error")
      if(/wrong-password|user-not-found/.test(error.message)){
        msg = t("Login.wmlNotify.wrongCredentials")
      }
      notificationPopup(
        true,
        NotifyParamsSeverityEnum.ERROR,
        msg
      );
    }
    setLoading(false);
  }

  const handleSetState = (payload) => {
    setState((states:any) => ({ ...states, ...payload }));
  };

  const handleNearConnection = async (e) => {
    await NearWalletPopup(walletProps, e.target);
    if (e.target) {

      await loginAnonymously();
      handleSetState({ modal: false });
      navigate(ENV.nav.urls.settings)
    }
  };

  useEffect(() => {
    handleNearConnection(walletProps);
    //@ts-ignore
  }, [window.selector]);

  return (
    <div className="Login">

      {/* Side 1: Contains images & Emojis */}
      <div className="column left">
        <div className="">
          <img
            src={logo}
            alt="pov logo">
          </img>
        </div>
      </div>

      {/* Side 2: Contains all sign on buttons & stuff */}
      <div className="column right">

        {/* Web 2 Login: */}
          <h2 className="">Welcome 👋</h2>
          <form className="" onSubmit={handleFormSubmit}>
            {/* Email */}
            <input
              id={classPrefix("email-address")}
              name="email"
              type="email"
              autoComplete="email"
              required
              className=""
              placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              id={classPrefix("password")}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className=""
              placeholder="Your Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Login Button  */}
            <button
              id={classPrefix("submit")}
              disabled={loading}
              type="submit"
              className=""
            >
              Login
            </button>
          </form>
          {/* Registration Link */}
          <Link
            id={classPrefix("register")}
            to="/register"
            >
            <h3 className="">
              Don't have an account? Sign up here!
            </h3>
          </Link>

          {/* Web 3 Login: */}
          <div className="wallet">
            <h2 className="">Login with wallet</h2>
            {/* Wallet Login Button  */}
            <button
              id={classPrefix("wallet-submit")}
              onClick={handleNearConnection}
              type="submit"
              className=""
            >
              Connect Wallet
            </button>
          </div>

      {/* End of Column Right */}
      </div>

    {/* End of border box */}
    </div>
  );
}
