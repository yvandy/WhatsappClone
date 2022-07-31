import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from "./Chat";
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Login from './Login';
import { useStateValue } from './StateProvider';
// import { Route, Routes } from "react-router";

function App() {

  const [{ user }, dispatch] = useStateValue();
  
  return (
    <div className="app">
      {!user ? (<Login />) :
        (
          <div className='app__body'>
            <Router>
              <Sidebar />
              <Switch>

                <Route exact path='/rooms/:roomId'>
                  <Chat />
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