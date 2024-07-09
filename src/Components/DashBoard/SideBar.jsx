import React from "react";
import "./SideBar.css"
import {Link} from "react-router-dom";

function SideBar() {
    return(
        <div className='fullbar'>
            <div className="sidebar">
                <ul>
                    <li><Link>Dashboard</Link></li>
                    <li><Link>Projects</Link></li>
                    <li><Link>Community</Link></li>
                    <li><Link>History</Link></li>
                </ul>
            </div>
            <div className='topbar'>
                <h1>Welcome to Your <span>MeanAs</span> Dashboard</h1>
                <p>Select where you need more clarity and accuracy.</p>
            </div>
            <div className="select">
                <div id="box">
                    <Link>1</Link>
                </div>
                <div id="box">
                    <Link>2</Link>
                </div>
                <div id="box">
                    <Link>3</Link>
                </div>
            </div>
        </div>
    )
}

export default SideBar;