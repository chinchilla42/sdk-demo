import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  createClient,
  Environment,
  KameleoonProvider,
} from '@kameleoon/react-sdk';

//----------------------------------------------
// -- Optional configuration --

const configuration = {
  dataFileRefreshInterval: 1, //default is 60 minutes
  environment: Environment.Production
};
//----------------------------------------------

// ----------------------------------------------
// -- Create KameleoonClient --

const client = createClient({
  siteCode: 'l5glir8pwu', // change siteCode here
  configuration
});
// ----------------------------------------------

// ----------------------------------------------
// -- Wrap the application in the Kameleoon Provider --
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <KameleoonProvider client={client}>
      <App />
    </KameleoonProvider>
  </React.StrictMode>
);
// ----------------------------------------------

// -- Pass a function to log results (for example: reportWebVitals(console.log)) --
reportWebVitals();
