import { useState, useEffect } from "react";
import axios from "axios";
import { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axiosRetry from "axios-retry"


export const LoginForm = ({ onSubmit }:any) => {
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();
  function handleSubmit(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setSubmit(true);
    onSubmit(username, email);
    setUsername("");
    setemail("");
    setIsDisabled(true);
  }

  function handleChangeUsername(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value.toLowerCase());
  }

  function handleChangeemail(event:  ChangeEvent<HTMLInputElement>) {
    setemail(event.target.value.toLowerCase());
  }

  useEffect(() => {
    if (email !== "" && username !== "") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [username, email]);


  useEffect(() => {
    if (submit === true) {
      const json = JSON.stringify({
        name: username,
        email: email,
      });

      axiosRetry(axios, {
        retries: 3, // number of retries
        retryDelay: (retryCount) => {
            console.log(`retry attempt: ${retryCount}`);
            return retryCount * 2000; // time interval between retries
        },
        retryCondition: (error) => {
            // if retry condition is not specified, by default idempotent requests are retried
            return error.response.status === 503;
        },
    });

      const res = axios
        .post("https://frontend-take-home-service.fetch.com/auth/login",  json, {
          headers: {
            // Overwrite Axios's automatically set Content-Type
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then(function (response) {
          console.log(response);
          var authCookie = response.headers;
          console.log(authCookie);
      
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    setSubmit(false);
  }, [submit]);

  return (
    <form style={{ display: "table-caption" }} onSubmit={handleSubmit as any}>
      <div>
        <label htmlFor="username-input">Name</label>
        <input
          id="username-input"
          type="text"
          onChange={handleChangeUsername}
          value={username}
        />
      </div>
      <div
        style={{
          marginTop: "10%",
        }}
      >
        <label htmlFor="email-input">Email</label>
        <input id="email-input" onChange={handleChangeemail} value={email} />
      </div>

      <button
        style={{
          marginTop: "10%",
        }}
        onClick={() => {
          setTimeout(() => {
          
            navigate( "/search");
          }, 3500);
        }}
        id="login-button"
        type="submit"
        disabled={isDisabled}
      >
        Submit
      </button>
    </form>
  );
};

export default LoginForm;