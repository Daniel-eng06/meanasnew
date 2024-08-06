import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Main.jsx";
import Dashboard from "./Components/DashBoard/Dashboard";
import Preprocess from './Components/DashBoard/Pre-process.jsx';
import Errorchecker from './Components/DashBoard/Errorchecker.jsx';
import Postprocess from './Components/DashBoard/Post-Process.jsx';
import Authentication from './Components/Home/Authentication.jsx';
import FreeAuth from './Components/Home/FreeAuth.jsx';
import Pricing from './Components/Home/Pricing.jsx';
import About from './Components/Home/About.jsx';
import Features from "./Components/Home/Features.jsx";
import Profile from "./Components/DashBoard/Profile.jsx";
import Projects from './Components/DashBoard/Projects.jsx';
import TeamConnect from './Components/DashBoard/TeamConnect.jsx';
import Assistant from './Components/DashBoard/AI-Assistant.jsx';
import HelpCenter from './Components/Home/HelpCenter.jsx';


function MeanAsApp() {
  return (<div className='App'>
                <Router>
                    <Routes>
                      <Route index path="/" element={<Home/>}/>
                      <Route index path="/Dashboard" element={<Dashboard/>}/>
                      <Route index path="/Preprocess" element={<Preprocess/>}/>
                      <Route index path="/Errorchecker" element={<Errorchecker/>}/>
                      <Route index path="/Postprocess" element={<Postprocess/>}/>
                      <Route index path="/Authentication" element={<Authentication/>}/>
                      <Route index path="/FreeAuth" element={<FreeAuth/>}/>
                      <Route index path="/Pricing" element={<Pricing/>}/>
                      <Route index path="/About" element={<About/>}/>
                      <Route index path="/Features" element={<Features/>}/>
                      <Route index path="/Profile" element={<Profile/>}/>
                      <Route path="/Projects/:id" element={<Projects/>} />
                      <Route index path="/TeamConnect" element={<TeamConnect/>}/>
                      <Route index path="/Assistant" element={<Assistant/>}/>
                      <Route index path="/HelpCenter" element={<HelpCenter/>}/>
                    </Routes>
                </Router>
           </div>)
}

export default MeanAsApp;
