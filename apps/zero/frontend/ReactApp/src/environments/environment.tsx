import { WMLE2ETarget, WMLEndpoint } from "src/core/utility/common-utils";

// @ts-ignore
export const environment:"dev"|"preview"|"prod" = process.env.REACT_APP_REACT_ENVIRONMENT ?? "dev";
// export const environment = "prod"

export enum EnvAppSiteUnavailableEnum  {
  true = "true",
  false = "false",
}
let siteUnavailable:EnvAppSiteUnavailableEnum= process.env.REACT_APP_SITE_UNAVAILABLE as any

export let traverseClassAndRemoveAutomationForProduction = (
  obj,
  stack = []
) => {

  Object.entries(obj).forEach((entry) => {
    let [key, value] = entry;
    if (value instanceof Object) {
      stack.push(obj[key]);
      traverseClassAndRemoveAutomationForProduction(value, stack);
      stack = [];
    } else {
      if (key === "automate") {
        stack[stack.length - 1].automate = false;
      }
    }
  });
};

let silenceAllConsoleLogs = () => {
  let isLocalhost = /(localhost|127\.0\.0\.1)/i
  if(isLocalhost.test(window.location.origin)){
    return
  }
  Object.entries(console).forEach((x, i) => {
    let [key, val] = x;
    if (typeof val === "function") {
      (console as any)[key] = () => {};
    }
  });
};

export class DevEnv {
  app = {
    siteUnavailable
  };
  auth = {
    adminRoles: ["admin"],
  };

  e2e={
    tribeBtnHover: new WMLE2ETarget({})
  }

  frontendDomain0 = window.location.origin;

  nav = {
    urls: {
      createEvent: "/admin/create-event",
      editEvent: "/admin/edit-event",
      admin: "/admin",
      siteUnavailable:"/site-unavailable",
      home: "/",
      about:
        "https://proofofvibes.xyz/?fbclid=IwAR14TbHC7J3abSPkgZj4-ngkAjqWwAMCiaSxiTPArUnSYCx3ik5po87tQCU",
      vibesMap: "/vibesMap",
      profile: "/profile",
      settings: "/settings",
      register: "/register",
      login: "/login",
      capture: "/capture",
      previewUpload: "/upload-preview-page",
      privacyPolicy: "legal/privacy-policy",
      membershipProtection: "legal/member-protection",
      initialURL: "",
    },
  };

  firebase = {
    apiKey: "AIzaSyB3-5V13e4PJxBKjtLDJaWeI8MuzpE9wKI",
    authDomain:"",
    databaseURL: "http://127.0.0.1:9000/?ns=proof-of-vibes",
    projectId: "proof-of-vibes",
    storageBucket: "proof-of-vibes.appspot.com",
    messagingSenderId: "964148002360",
    appId: "1:964148002360:web:7440d590dbd7a11cfab0cd",
    measurementId: "G-SY8SXRPK6W",
    realtimeDatabase:{
      endpoints:{
        povEvents:"POVVEvents/data",
        /**
         * @deprecated use povEvents instead
        */
       firebaseEvents:"POVEvents/data",
       povUsers:"POVUsers/data",
        genreList:"GenreList/data",
        eventProvisionsList:"EventProvisionsList/data",
        povEventsProvisions:"POVEventsProvisions/data",
        partsOfDayList:"PartsOfDayList/data",
        userEvents:"UserEvents/data",
        userEventNfts:`UserEventNFTs/data`
      }
    },
    storage:{
      getImage:new WMLEndpoint({
        url:(fullPath:string)=>{
          return `http://127.0.0.1:9199/v0/b/proof-of-vibes.appspot.com/o/${encodeURIComponent(fullPath)}?alt=media`
        }
      })
    }

  };

  pinata = {
    getNFTByEventIds: new WMLEndpoint({
      automate: false,
      url: (
        eventId,
        pageOffset = "0",
        pageLimit = "1000",
        status = "pinned"
      ) => {
        let params = new URLSearchParams({
          includesCount: "false",
          status,
          pageOffset,
          pageLimit,
          "metadata[eventId]": eventId,
        }).toString();
        return "https://api.pinata.cloud/data/pinList?" + params;
      },
    }),
  };

  pinataKeys = {
    POV_PINATA_API_KEY: process.env.REACT_APP_DEV_POV_PINATA_API_KEY,
    POV_PINATA_API_SECRET_KEY:
      process.env.REACT_APP_DEV_POV_PINATA_API_SECRET_KEY,
    POV_PINATA_API_JWT: process.env.REACT_APP_DEV_POV_PINATA_API_JWT,
  };

  nearContractAddress = {
    contract: "proofofvibes.near",
    // contract: "genadrop.0xprometheus.near",  // Test Near Contract
  };

  mapbox = {
    getLntLngBasedOnLocationTextEndpoint: new WMLEndpoint({
      automate: false,
      url: (location: string, params: string) => {
        return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
          location
        )}.json?${params}`;
      },
    }),
  };

  eventbrite = {
    apiKey: process.env.REACT_APP_DEV_EVENTBRITE_APIKEY,
    orgId: process.env.REACT_APP_DEV_EVENTBRITE_ORGID,
  };

  povEvents = {
    getEventbriteEvents: new WMLEndpoint({
      automate: false,
      url: (params = "", orgId = this.eventbrite.orgId) =>
        `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?expand=ticket_classes${params}`,
    }),
    updateEventbriteEvent: new WMLEndpoint({
      url: (id) => {
        return `https://www.eventbriteapi.com/v3/events/${id}/`;
      },
    }),
    getEventbriteImageUploadToken: new WMLEndpoint({
      url: () => {
        let MEDIA_UPLOAD_URL = "https://www.eventbriteapi.com/v3/media/upload/";
        let instructions_url =
          MEDIA_UPLOAD_URL +
          "?" +
          new URLSearchParams({
            type: "image-structured-content",
            token: this.eventbrite.apiKey,
          }).toString();
        return instructions_url;
      },
    }),
    notifyEventbriteOfImageUpload: new WMLEndpoint({
      url: () => {
        let MEDIA_UPLOAD_URL = "https://www.eventbriteapi.com/v3/media/upload/";
        let notifyUrl =
          MEDIA_UPLOAD_URL +
          "?" +
          new URLSearchParams({
            token: this.eventbrite.apiKey,
          });
        return notifyUrl;
      },
    }),
    attachImageToEventbriteEvent: new WMLEndpoint({
      url: (eventId, versionNumber) => {
        return `https://www.eventbriteapi.com/v3/events/${eventId}/structured_content/${versionNumber}/`;
      },
    }),
    getEventbriteEventStructuredContent: new WMLEndpoint({
      automate: true,
      url: (eventId) => {
        return `https://www.eventbriteapi.com/v3/events/${eventId}/structured_content/?purpose=listing`;
      },
    }),
  };

  constructor() {
    ;(window as any).javaTestNGSeleniumE2E = this.e2e
    traverseClassAndRemoveAutomationForProduction(this)
  }
}

export class PreviewEnv extends DevEnv {
  constructor() {
    super();
    traverseClassAndRemoveAutomationForProduction(this);
    silenceAllConsoleLogs();
    this.frontendDomain0 = "https://proof-of-vibes-preview.web.app";
    this.firebase = {
      ...this.firebase,
      apiKey: "AIzaSyD8xVDYt6UF_vNZ9UK0Z--wMeiWy83ikXI",
      authDomain:"proof-of-vibes-preview.firebaseapp.com",
      databaseURL :"https://proof-of-vibes-preview-default-rtdb.firebaseio.com",
      projectId: "proof-of-vibes-preview",
      storageBucket: "proof-of-vibes-preview.appspot.com",
      messagingSenderId: "335081393744",
      appId: "1:335081393744:web:506cd76c39e5d0ed79cb55",
      measurementId: "G-6G5PKW5HXS"

    }

    this.pinataKeys.POV_PINATA_API_KEY =
      process.env.REACT_APP_PREVIEW_POV_PINATA_API_KEY;
    this.pinataKeys.POV_PINATA_API_SECRET_KEY =
      process.env.REACT_APP_PREVIEW_POV_PINATA_API_SECRET_KEY;
    this.pinataKeys.POV_PINATA_API_JWT =
      process.env.REACT_APP_PREVIEW_POV_PINATA_API_JWT;

    this.firebase.storage.getImage.url = (fullPath:string)=>{
      return `https://firebasestorage.googleapis.com/v0/b/proof-of-vibes-preview.appspot.com/o/${encodeURIComponent(fullPath)}?alt=media`
    }
  }
}

export class ProdEnv extends DevEnv {
  constructor() {
    super();
    traverseClassAndRemoveAutomationForProduction(this);
    silenceAllConsoleLogs();
    this.frontendDomain0 = "https://proof-of-vibes.web.app";
    this.firebase.authDomain = "proof-of-vibes.firebaseapp.com";
    this.firebase.databaseURL =
      "https://proof-of-vibes-default-rtdb.firebaseio.com";
    this.eventbrite.apiKey = process.env.REACT_APP_PROD_EVENTBRITE_APIKEY;
    this.eventbrite.orgId = process.env.REACT_APP_PROD_EVENTBRITE_ORGID;

    this.pinataKeys.POV_PINATA_API_KEY =
      process.env.REACT_APP_PROD_POV_PINATA_API_KEY;
    this.pinataKeys.POV_PINATA_API_SECRET_KEY =
      process.env.REACT_APP_PROD_POV_PINATA_API_SECRET_KEY;
    this.pinataKeys.POV_PINATA_API_JWT =
      process.env.REACT_APP_PROD_POV_PINATA_API_JWT;

    this.firebase.storage.getImage.url = (fullPath:string)=>{
      return `https://firebasestorage.googleapis.com/v0/b/proof-of-vibes.appspot.com/o/${encodeURIComponent(fullPath)}?alt=media`
    }
  }
}

export let ENV: DevEnv = {
  dev: () => new DevEnv(),
  preview: () => new PreviewEnv(),
  prod: () => new ProdEnv(),
}[environment]();
