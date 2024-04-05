import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SideBar from './SideBar';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
ReactDOM.render(
  <Router>
    <SideBar/>
  </Router>,
  document.getElementById('root')
);

reportWebVitals();
