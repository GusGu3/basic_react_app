import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';
import MFA from './MFA';
import Register from './Register';

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, removeUserSession } from './Utils/Common';
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
        removeUserSession();
      
      return;
    }
    setAuthLoading(false);

  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header navbar navbar-expand navbar-dark">
            <NavLink to={"/"} className="navbar-brand text-black">
                FakeCo
            </NavLink>
            <NavLink exact activeClassName="active" to="/" className="nav-item">Home</NavLink>
            <NavLink activeClassName="active" to="/login" className="nav-item">Login</NavLink>
            <NavLink activeClassName="active" to="/register" className="nav-item">Register</NavLink>
            <NavLink activeClassName="active" to="/dashboard" className="nav-item">Dashboard</NavLink>
          </div>
          <div className="container mt-3 w-25">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PublicRoute path="/register" component={Register} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/mfa" component={MFA} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;