import React, { useState } from 'react';
import axios from 'axios';
import { removeUserSession, setUserSession } from './Utils/Common';

import { API_URL, GROUP_ID, CREATE_USER, PRIMARY_AUTH, API_KEY } from "./constants";
import okta from "./okta.png"
import logo from "./fakeCo.png";
import { data } from './data';

function Register(props) {
  const [loading, setLoading] = useState(false);
  const formMemberId = useFormInput('');
  const formLastName = useFormInput('');
  const [error, setError] = useState(null);  

  // handle button click of register form 
  async function handleRegistration() {
    setError(null);
    setLoading(true);

    let firstName = '';
    let lastName = '';
    let email = '';
    let memberId = '';
    let managerId = '';

    data.forEach(element => {
      if (formLastName.value === element.lastName && formMemberId.value === element.memberId) {
        firstName = element.firstName;
        lastName = element.lastName;
        email = element.email;
        memberId = element.memberId;
        managerId = element.managerId;
      }
    });

    if (memberId === '') {
      setLoading(false);
      setError("Registration failed. Please try again.");
    }
    else {
      var config = {
        method: 'post',
        url: API_URL + CREATE_USER,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'SSWS ' + API_KEY
        },
        data: JSON.stringify(createRegRequest(memberId, firstName, lastName, email, managerId))
      };

      //Register
      const userRegistration = await axios(config).then(
        response => response
      ).catch(error => {
        //Error thrown from login, would be an API issue
        setLoading(false);
        console.log(error.response);
        setError("Registration failed. Please try again.");
      });

      if (userRegistration) {
        //Login with primary auth api
        const userLogin = await axios.post(API_URL + PRIMARY_AUTH, createLoginRequest(email, "Default123")).then(
          response => response
        ).catch(error => {
          //Error thrown from login
          setLoading(false);
          console.log(error.response);
          setError("Something went wrong. Please try again.");
        });

        if (userLogin) {
          setLoading(false);
          removeUserSession();
          setUserSession(userLogin.data.sessionToken, userLogin.data._embedded.user);
          props.history.push('/Dashboard');
        }
      }
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }   
  }

  const createRegRequest = (memberId, firstName, lastName, email,managerId) => {
    return {
      "profile": {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "login": email,
        "memberId": memberId,
        "custAcctManagerId": Number(managerId)
      },
      "credentials": {
        "password": { "value": "Default123" }
      },
      "groupIds": [
        GROUP_ID
      ]
    };
  }

  const createLoginRequest = (username, password) => {
    return {
      'username': username,
      'password': password,
      'options': {}
    };
  }

  return (
    <div className="col-md-12">
      <div className="card card-container card-body text-center">

        <div>
          <img
            src={logo}
            alt="fake-co"
            className="profile-img-card"
            width="40%"
          />
        </div>

        <h4>Register</h4>

        <div className="form-group m-auto">
          <label className="m-auto p-1">Member ID</label>
          <input type="text" {...formMemberId} autoComplete="new-password" className="form-control" />
        </div>
        <div style={{ marginTop: 10 }} className="form-group m-auto">
          <label className="m-auto p-1">Last Name</label>
          <input type="text" {...formLastName} autoComplete="new-password" className="form-control" />
        </div>
        <div className="form-group m-auto p-1">
          {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
          <input className="btn btn-primary btn-block" type="button" value={loading ? 'Loading...' : 'Login'}
            onClick={handleRegistration} disabled={loading} /><br />
        </div>

        <div className="p-3">
          <img width="15%" style={{ float: 'right' }} src={okta} alt='okta' />
        </div>
      </div>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Register;