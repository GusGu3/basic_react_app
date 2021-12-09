import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, VERIFY_MFA, API_KEY } from "./constants";
import { getUser, removeUserSession } from './Utils/Common';



function MFA(props) {
  const [loading, setLoading] = useState(false);
  const code = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  async function handleFactor() {
    setError(null);
    setLoading(true);

    let user = JSON.parse(getUser());

    var config = {
      method: 'post',
      url: API_URL + VERIFY_MFA.replace('{userId}', user.id),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'SSWS ' + API_KEY
      },
      data: JSON.stringify(createMFARequest(code.value))
    };

    const mfaResp = await axios(config).then(
      response => response
    ).catch(error => {
        setLoading(false);
        console.log(error.response);
        removeUserSession();
        props.history.push('/login');
      });

      if (mfaResp){
        props.history.push('/dashboard');
      }
  }

  const createMFARequest = (code) => {
    return {
      "passCode": code
    };
  }

  return (
    <div className="col-md-12">
      <div className="card card-container card-body text-center">

        <div className="form-group m-auto">
          <label className="m-auto p-1">Code</label>
          <input type="text" {...code} autoComplete="new-password" className="form-control" />
        </div>
        <div className="form-group m-auto p-1">
          {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
          <input className="btn btn-primary btn-block" type="button" value={loading ? 'Loading...' : 'Check Code'}
            onClick={handleFactor} disabled={loading} /><br />
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

export default MFA;