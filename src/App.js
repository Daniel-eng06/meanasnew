import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Main.jsx";
import Dashboard from "./Components/DashBoard/Dashboard";
//import Auth from "./components/Auth";
// import Subscription from "./components/Subscription";
// import Upload from "./components/Upload";

function MeanAsApp() {
  return (<div className='App'>
                <Router>
                    <Routes>
                      <Route index path="/" element={<Home/>}/>
                      <Route index path="/Dashboard" element={<Dashboard/>}/>
                      {/*<Route path="/auth" component={Auth} />*/}
                      {/*<Route path="/subscribe" component={Subscription} />*/}
                      {/*<Route path="/upload" component={Upload} />*/}
                    </Routes>
                </Router>
           </div>)
}

export default MeanAsApp;
