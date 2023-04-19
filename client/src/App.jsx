import { useState, useEffect } from "react";
import "./App.css";

const CLIENT_ID = "Fc1601f0619678de1c6d";

function App() {
  const [userData, setUserData] = useState([]);
  const [rerender, setRerender] = useState(false);

  //Forward the user to the github login screen ( we  pass the client ID)
  //User is now on the github side and logs in (github.com/login)
  //When the user decides to login, they get forwared back to localhost:3000
  //But localhost:3000/?code=ADFIODFODFFXFU
  //use the code to get the access token (code can be used once)

  useEffect(() => {
    //But localhost:3000/?code=ADFIODFODFFXFU
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    //using localstorage
    //because leaving our webpage for a while, still be logged in with the GITHUB

    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            console.log(data.access_token);
            if (data.access_token) {
              localStorage.setItem("access_token", data.access_token);
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
  }, []);

  async function getUserData() {
    await fetch("http://localhost:4000/getUserData", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"), //Bearer accesstoken
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        console.log(data);
      });
  }

  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }

  return (
    <div className="App">
      {localStorage.getItem("access_token") ? (
        <>
          <h1>We have access Token</h1>
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              setRerender(!rerender);
            }}
          >
            Logout
          </button>
          <h3>Get data from GITHUB api</h3>
          {Object.keys(userData).length !== 0 ? (
            <>
              <img src={userData.avatar_url} width={100} height={100}></img>
              <h2>{userData.name}</h2>
            </>
          ) : (
            <>
              <button onClick={getUserData}>Get user data</button>
            </>
          )}
        </>
      ) : (
        <>
          <h3>User is not logged in</h3>
          <button onClick={loginWithGithub}>Login with github</button>
        </>
      )}
    </div>
  );
}

export default App;
