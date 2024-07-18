import React, { useState } from 'react';
import "./Defaultbars.css";
import { Link } from "react-router-dom";
import { FaBars } from 'react-icons/fa';

function Defaultbars(){
    const dashimg ={
        not:"notification.png",
        user:"user.png",
        over:"window.png",
        proj:"layers.png",
        team:"group.png",
        assis:"assistant.png",
        upgrad:"clean.png"
    }

    const [isDropdownVisibles, setIsDropdownVisibles] = useState(false);

    const handleDropdownClicks = () => {
        setIsDropdownVisibles(!isDropdownVisibles);
    };

    return(
        <div classname="defaultbars">
            <div className="flatbars">
                <div id="rights">
                    <div className="allicons"><img id="dass" src={dashimg.not} alt="#"/></div>
                </div>
                <div id="besides">
                    <div className="allicons"><img id="dass" src={dashimg.user} alt="#"/></div>
                </div>
            </div>
            <div className="sidebars">
                <Link className="compilogos" to="/">
                    <img src="NobgLogo.png"/>
                </Link>
                <ul className="dashys">
                    <Link className="dashlis" to="/Dashboard"><div className="dashs"><img id="dass" src={dashimg.over}/></div>Overview</Link>
                    <Link className="dashlis"><div className="dashs"><img id="dass" src={dashimg.proj}/></div>Projects</Link>
                    <Link className="dashlis"><div className="dashs"><img id="dass" src={dashimg.team}/></div>Team Connect</Link>
                    <Link className="dashlis"><div className="dashs"><img id="dass" src={dashimg.assis}/></div>AI Assistant</Link>
                </ul>
                <Link id="upgras">
                    <div>
                        <div className="allicons">
                            <img id="dass" src={dashimg.upgrad} alt="#"/>
                        </div>
                        <h3>Upgrade to Unlimited Plan</h3>
                    </div>
                    <p>Access unlimited clarity and accuracy for your analysis.</p>
                </Link>
            </div>

            <div className='phoneversion'>
                <ul className='dropdowns'>
                    <li>
                        <div className='dropbarps' onClick={handleDropdownClicks}>
                            <FaBars size={25} /> {/* Use the icon here */}
                        </div>
                    </li>
                    {isDropdownVisibles && (
                        <ul className='dropdown-lists'>
                            <li><Link className="dashlis" to="/Dashboard"><div className="dashs"><img id="dass" src={dashimg.over} alt="Overview" /></div>Overview</Link></li>
                            <li><Link className="dashlis" to="#"><div className="dashs"><img id="dass" src={dashimg.proj} alt="Projects" /></div>Projects</Link></li>
                            <li><Link className="dashlis" to="#"><div className="dashs"><img id="dass" src={dashimg.team} alt="Team Connect" /></div>Team Connect</Link></li>
                            <li><Link className="dashlis" to="#"><div className="dashs"><img id="dass" src={dashimg.assis} alt="AI Assistant" /></div>AI Assistant</Link></li>
                            <li>
                                <Link id="upgrap" to="/Pricing">
                                    <div>
                                        <div className="alliconp">
                                            <img id="dass" src={dashimg.upgrad} alt="Upgrade to Unlimited Plan" />
                                        </div>
                                        <h3>Upgrade to Unlimited Plan</h3>
                                    </div>
                                    <p>Access unlimited clarity and accuracy for your analysis.</p>
                                </Link>
                            </li>
                        </ul>
                    )}
                </ul>
                <Link className="compilogop" to="/">
                        <img src="NobgLogo.png"/>
                </Link>
                <div className="flatbarp">
                    <div id="rightp">
                        <div className="alliconp"><img id="dass" src={dashimg.not} alt="#"/></div>
                    </div>
                    <div id="besidep">
                        <div className="alliconp"><img id="dass" src={dashimg.user} alt="#"/></div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default Defaultbars;