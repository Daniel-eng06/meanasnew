import React from 'react';
import Navbar from "../Home/Navbar.jsx";
import Footer from "../Home/Footer";
import "./About.css";
import { Link } from 'react-router-dom';


function About() {
    const vid ={
        vid1:"Gradient 2.mp4"
    }
    return(
        <div className='about'>
            <video id="background-video"
                  src={vid.vid1} controls loop autoPlay muted>
            </video>
            <Navbar/>
            <div className="about-section">
                <h1>About MeanAs</h1>
                <p>
                On March 25th, 2024, I found myself in a situation that underscored the importance of reliable access to analysis resources. 
                As someone who enjoys assisting my colleagues with their model analysis, I created a detailed guideline video for a friend's CFD analysis project and sent it to her via email. However, due to storage constraints on my end, I had to delete the video and analysis data from my computer.
                A month later, the email files had also expired. When my friend needed the project guidelines and video again, it was too late. She also asked me to explain the meaning behind the results derived from the CFD analysis. This experience highlighted the crucial need for reliable access to accurate FEA/CFD analysis processes anytime tailored to specific FEA/CFD projects,
                along with clear interpretation of outcomes.
                </p>
                <p>
                    This led to the creation of MeanAs — an AI-powered platform designed to provide clarity and accuracy before and after your FEA/CFD analysis. MeanAs addresses the exact challenges I faced, ensuring that you never lose access to important analysis guideline data and always have a clear understanding of your pre/post-processing analysis.
                </p>
                <p>
                    MeanAs is easy to use for small-scale companies, researchers, university students, and designers who may or may not have advanced skills in CAE. By leveraging AI, MeanAs offers everyday tailored assistance for your specific projects, from material selection to results interpretation. It provides:
                </p>
                <ul>
                    <li>Clarity & Accuracy for Pre-Processing</li>
                    <li>FEA/CFD Analysis Error Solutions</li>
                    <li>Clarity & Accuracy for Post-Processing</li>
                </ul>
                <p>
                    With MeanAs, you can efficiently test and validate your models and understand the outcomes clearly. Discover how MeanAs can support your projects with the expertise and reliability you need anytime. <Link to="/Pricing">Click here to try MeanAs for free</Link>.
                </p>
            </div>
            <Footer/>
        </div>
    )
};

export default About;
