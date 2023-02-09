import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import IsLogin from './components/IsLogin/IsLogin';
import Navbar from './components/Navbar/Navbar';
import Home from './page/Home/Home';
import Login from './page/Login/Login';
import Profile from './page/Profile/Profile';
import ProfileOfPeople from './page/ProfileOfPeople/ProfileOfPeople';
import SignUpVerification from './page/SignUpVerification/SignUpVerification';

function App() {
  return (
    <div className="App">
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<IsLogin />}>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/:profileUser' element={<Profile />} />
              <Route exact path='/profile/id/:id' element={<ProfileOfPeople />} />
            </Route>
            <Route exact path='/login' element={<Login />} />
            <Route path='/create-new-account/registration-verification/:token' element={<SignUpVerification />} />
          </Routes>
        </Fragment>
      </Router>
    </div>
  );
}

export default App;
