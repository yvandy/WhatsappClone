import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from "./Chat";
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Login from './Login';
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';
import { signInWithPopup, getAuth } from 'firebase/auth';
import { authProvider } from "./firebase";

function App() {

  const [{ user }, dispatch] = useStateValue();
  const auth = getAuth();  

  useEffect(() => {
    // console.log(user);
    auth.onAuthStateChanged((userLoggedin) => {
      // console.log(userLoggedin);
      if (userLoggedin) {
        dispatch({
          type: actionTypes.SET_USER,
          user: userLoggedin,
        })
      } else {
        dispatch({
          type: actionTypes.RESET_USER,
          user: null,
        })
      }
    })
  }, [])

  return (
    <div className="app">
      {(!user) ? (<Login />) :
        (
          <div className='app__body'>
            <Router>

              <Sidebar />
              <Switch>

                <Route exact path='/rooms/:roomId'>
                  <Chat  />
                </Route>
                <Route exact path="/signOut">
                  <Login />
                </Route>
                <Route path='/' >
                  <Chat />
                </Route>

              </Switch>
            </Router>


          </div>
        )
      }

    </div>
  );
}

export default App;
