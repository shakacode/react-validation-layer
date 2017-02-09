import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from 'react-router-dom'

import Main from './pages/Main';
import Docs from './docs';
import Examples from './examples';

import './index.css';


const App = () => (
  <HashRouter>
    <div className="root">
      <div className="nav">
        <Link to="/" className="nav-link">
          Main
        </Link>
        {/*
          <Link to="/docs" className="nav-link">
            Docs
          </Link>
        */}
        <div className="nav-section-title">
          Examples
        </div>
        <Link to="/examples/login-form" className="nav-link">
          Login Form
        </Link>
        <Link to="/examples/signup-form" className="nav-link">
          Signup Form
        </Link>
      </div>
      <div className="container">
        <Route path="/" exact component={Main} />
        <Route path="/docs" component={Docs} />
        <Route path="/examples" component={Examples} />

        {/* <Miss component={NotFound}/> */}
      </div>
    </div>
  </HashRouter>
);

ReactDOM.render(<App />, document.getElementById('app'));
