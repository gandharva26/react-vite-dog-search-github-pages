import { useState, useEffect } from "react";
import axios from "axios";
import setCookie from "set-cookie-parser";
import { useNavigate } from "react-router-dom";



export const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();
    setSubmit(true);
    onSubmit(username, email);
    setUsername("");
    setemail("");
    setIsDisabled(true);
  }

  function handleChangeUsername(event) {
    setUsername(event.target.value.toLowerCase());
  }

  function handleChangeemail(event) {
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
        name: "abc",
        email: "def@gmail.com",
      });
      const res = axios
        .post("https://frontend-take-home-service.fetch.com/auth/login", json, {
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
          var cookies = setCookie.parse(response, {
            decodeValues: true, // default: true
          });

          cookies.forEach(console.log);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    setSubmit(false);
  }, [submit]);

  return (
    <form style={{ display: "table-caption" }} onSubmit={handleSubmit}>
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
          }, 2500);
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
