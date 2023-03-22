// react
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// auth context:
import { useAuth } from "src/contexts/AuthContext";

// scss
import "./Register.scss";
import "./mobile.scss";

// assets
import logo from "../../../assets/media/shared/logo.png";

// near wallet
import { NearWalletPopup } from "src/shared/components/walletPopup/NearWalletPopup";

// buffer:
import { Buffer } from "buffer";
import { ENV } from "src/environments/environment";
import { generateClassPrefix } from "src/core/utility/common-utils";
import { useTranslation } from "react-i18next";
import {
  NotifyParamsSeverityEnum,
  useNotify,
} from "src/contexts/NotifyContext";

export default function Register() {
  const { notificationPopup } = useNotify();
  const { t, i18n } = useTranslation("common");

  // @ts-ignore
  window.Buffer = Buffer;
  const myClass = "Register";
  const classPrefix = generateClassPrefix(myClass);

  // Hook to navigate:
  const navigate = useNavigate();
  const location = useLocation();

  // User Data:
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    loginAnonymously,
    nearAccount,
    nearConnector,
    setNearConnector,
    setNearAccount,
  } = useAuth();

  // Wallet Props:
  const walletProps = { setNearAccount, setNearConnector };
  const [state, setState] = useState();

  // Handles form submission:
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Getting form values:
    // Alert if password mismatched:
    if (password !== confirmPassword) {
      notificationPopup(
        true,
        NotifyParamsSeverityEnum.ERROR,
        t("Register.wmlNotify.passwordMismatch")
      );
      return;
    }

    // Invoking a function that will register the user:
    try {
      notificationPopup(false);
      setLoading(true);
      await register(email, password);
      setLoading(false);
      navigate(ENV.nav.urls.settings, { state: { prevPath: location } });
    } catch (error) {
      notificationPopup(
        true,
        NotifyParamsSeverityEnum.ERROR,
        t("global.error")
      );
    }
  }

  const handleSetState = (payload) => {
    // @ts-ignore
    setState((states) => ({ ...states, ...payload }));
  };

  const handleNearConnection = async (e) => {
    await NearWalletPopup(walletProps, e.target);
    if (e.target) {
      await loginAnonymously();
      handleSetState({ modal: false });
      navigate("/profile");
    }
  };

  useEffect(() => {
    handleNearConnection(walletProps);
    //@ts-ignore
  }, [window.selector]);

  return (
    <>
      <div className="Register">
        {/* Side 1: Contains images & Emojis */}
        <div className="column left">
          <div className="">
            <img src={logo} alt="pov logo"></img>
          </div>
        </div>

        {/* Side 2: Contains all register information: */}
        <div className="column right">
          {/* Web 2 Register: */}
          <div className="">
            <h2 className="">Enter Your Email to Get Started</h2>
            <form className="" onSubmit={handleFormSubmit}>
              {/* Email */}
              <input
                id={classPrefix("email-address")}
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter email"
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
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Confirm Password */}
              <input
                id={classPrefix("confirmPassword")}
                name="confirmPassword"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {/* Register Button  */}
              <button
                id={classPrefix("submit")}
                disabled={loading}
                type="submit"
                className=""
              >
                Register Now
              </button>
            </form>
            {/* Login instead Link */}
            <Link className={classPrefix("login")} id={classPrefix("login")} to="/login">
               All ready have an account? Login here!
            </Link>

            {/* Web 3 Login: */}
            <div className="wallet">
              <h2 className="">Register with wallet</h2>
              {/* Wallet Login Button  */}
              <button onClick={handleNearConnection} type="submit" className="">
                Connect Wallet
              </button>
            </div>
          </div>
          {/* End of Column Right */}
        </div>

        {/* End of Border */}
      </div>
    </>
  );
}
