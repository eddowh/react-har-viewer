/**
 * Entry point
 */


// React
import React from 'react';
import ReactDOM from 'react-dom';

// Stylesheets
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/css/bootstrap-theme.css');
require('./app.scss');

// Local
require('./samples.js');

// Subcomponents
import HarViewer from './components/HarViewer.jsx';


ReactDOM.render(
  <HarViewer />,
  document.body
);
