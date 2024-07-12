import React from "react";
import "./Post-process.css"
import {Link} from "react-router-dom";
import Footer from "../Home/Footer";
import Grid from "../../Grid";
import Defaultbars from "./Defaultbars";


function Postprocess(){
    const vid ={
        vid1:"Gradient 2.mp4",
        post:"post-process.png",
        
    }
    return(
        <div>
            <video id="background-video"
                  src={vid.vid1} controls loop autoPlay muted>
           </video>
            <Grid/>
            <Defaultbars/>
            <div className='current'>
                <div><img src={vid.post} alt="Post-process" /></div>
                <h2>Clarity & Accuracy For Post-Processing</h2>
            </div>
            <div className="postprocess">
                Hi
            </div>
            <Footer/>
        </div>
    )
}


export default Postprocess;