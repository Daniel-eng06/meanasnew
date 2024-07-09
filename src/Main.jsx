import React from 'react';
import Navbar from "./Components/Home/Navbar.jsx";
import Section1 from "./Components/Home/Section1";
import Section2 from "./Components/Home/Section2";
import Section3 from "./Components/Home/Section3";
import Section4 from "./Components/Home/Section4";
import Section5 from "./Components/Home/Section5";
import Section6 from "./Components/Home/Section6";
import Footer from "./Components/Home/Footer";
import Grid from "./Grid";
import "./Main.css"

function Home(){
    const vid ={
        vid1:"Gradient 2.mp4"
    }
    return(
        <div className="background">
            <video id="background-video"
                   src={vid.vid1} controls loop autoPlay muted>
            </video>
            <Grid />
            <Navbar/>
            <Section1/>
            <Section2/>
            <Section3/>
            <Section4/>
            <Section5/>
            <Section6/>
            <Footer/>
        </div>
    )
}

export default Home;