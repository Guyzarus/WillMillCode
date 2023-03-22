import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { EventsProvider } from "src/contexts/POVEventsContext";
import { MapboxProvider } from './contexts/MapboxContext';
import { NotifyProvider } from './contexts/NotifyContext';
import {BrowserRouter} from 'react-router-dom';

// date-fns
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

// misc
import { OverlayLoadingProvider } from './contexts/OverlayLoadingContext';
import { AuthProvider } from './contexts/AuthContext';
import { NFTProvider } from './contexts/NFTContext';

// i18n
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import common_en from "./assets/i18n/en/common.json";
import common_es from "./assets/i18n/es/common.json";

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
      en: {
          common: common_en
      },
      es: {
          common: common_es
      },

  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <I18nextProvider i18n={i18next}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <OverlayLoadingProvider>
        <NotifyProvider>
          <MapboxProvider>
            <EventsProvider>
            <BrowserRouter className="App">
              <AuthProvider>
                <NFTProvider>
                  <App />
                </NFTProvider>
              </AuthProvider>
              </BrowserRouter>
            </EventsProvider>
          </MapboxProvider>
        </NotifyProvider>
      </OverlayLoadingProvider>
    </LocalizationProvider>
  </I18nextProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
