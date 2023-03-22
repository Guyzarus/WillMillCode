// react
import React from "react";
import { Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";

// styles
import "./ProfileLogin.scss";
// import "./tablet.scss";
// import "./mobile.scss";

// auth context
import { useAuth } from "src/contexts/AuthContext";
import { useNotify } from "src/contexts/NotifyContext";
import { useTranslation } from "react-i18next";


export default function ProfileLogin () {

    // Hook to navigate:
    const navigate = useNavigate();

    // User Data:
    const [name, setName] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [language, setLanguage] = useState("");
    const [website, setWebsite] = useState("");
    const [twitter, setTwitter] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        notificationPopup
    } =useNotify()
    const {t,i18n} = useTranslation("common")

    // User Context:

    // Handles user editting their profile, updates db with their data:
    async function handleFormSubmit(e){
        e.preventDefault();

        // Invoking a function that will register the user:
        try {
            setLoading(true);

            // Update Database:

            // Update User Profile:

            // Navigate to Profile Page:
            navigate("/profile")
            setLoading(false);
        } catch (error) {
            
            notificationPopup(true,t("global.updateFail"), error);
        }
        setLoading(false);
    }

    return (
        <div className="ProfileLogin">
            <div className="column">
                {/* Side 1: Contains profile settings navigation */}
                <div className="left">
                    <div className="leftBorder">
                        <div className="">
                            <div className="dataWrapperSettings">
                                <svg className="icons" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                <Link to="/settings" className="navButton">
                                    <p className="navigation">Personal Info</p>
                                </Link>
                            </div>
                            <div className="dataWrapperSettings">
                                <svg className="icons" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                <Link to="/security" className="navButton">
                                    <p className="navigation">Login & Security</p>
                                </Link>
                            </div>
                            <div className="dataWrapperSettings">
                                <svg className="icons" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
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

                        {/* Header: */}
                        <h2 className="">Login and Security</h2>
                        <div className="strike"/>

                        {/* Social Accounts */}
                        <h3 className="">Social Accounts</h3>
                        <div className="grid grid-cols-2 gap-6">

                            {/* Facebook */}
                            <div className="flex row">

                                <div className="mr-20">
                                    <h4>Facebook</h4>
                                    <h5>Not Connected</h5>
                                </div>

                                <button className="px-5 h-10 font-bold">
                                    Connect
                                </button>

                            </div>

                            {/* Instagram */}
                            <div className="flex row">

                                <div className="mr-20">
                                    <h4>Instagram</h4>
                                    <h5>Not Connected</h5>
                                </div>

                                <button className="px-5 h-10 font-bold">
                                    Connect
                                </button>
                            </div>

                            {/* Twitter */}
                            <div className="flex row">

                                <div className="mr-20">
                                    <h4>Twitter</h4>
                                    <h5>Not Connected</h5>
                                </div>

                                <button className="px-5 h-10 font-bold">
                                    Connect
                                </button>
                            </div>

                            {/* LinkedIn */}
                            <div className="flex row">

                                <div className="mr-20">
                                    <h4>LinkedIn</h4>
                                    <h5>Not Connected</h5>
                                </div>

                                <button className="px-5 h-10 font-bold">
                                    Connect
                                </button>
                            </div>
                        </div>

                        <div className="strike"/>
                        {/* Device History */}
                        <h3 className="">Device History</h3>
                        <div className="grid grid-cols-1">
                            {/* Facebook */}
                            <div className="flex row">

                                <div className="mr-20">
                                    <h4>Facebook</h4>
                                    <h5>Not Connected</h5>
                                </div>

                                <button className="px-5 h-10 font-bold">
                                    Log out device
                                </button>

                            </div>
                            <div className="strike2"/>

                            {/* Instagram */}
                            <div className="flex row">

                                <div className="mr-20">
                                    <h4>Instagram</h4>
                                    <h5>Not Connected</h5>
                                </div>

                                <button className="px-5 h-10 font-bold">
                                    Log out device
                                </button>
                            </div>
                            <div className="strike2"/>

                            {/* Twitter */}
                            <div className="flex row">

                                <div className="mr-20">
                                    <h4>Twitter</h4>
                                    <h5>Not Connected</h5>
                                </div>

                                <button className="px-5 h-10 font-bold">
                                    Log out device
                                </button>
                            </div>
                        </div>

                    </div>
                    {/* End of Column Right */}
                </div>
            </div>
        </div>
    );
}
