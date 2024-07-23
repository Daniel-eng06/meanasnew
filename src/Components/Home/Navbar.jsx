import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; 
import "./Navbar.css";
import { auth, signOut } from '../../firebase'; 


function Navbar() {
    const image ={
        MeanAsLogo : "NobgLogo.png",
        user: "user.png",
    };

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);

    const handleDropdownClick = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const handleUserDropdownClick = () => {
        setIsUserDropdownVisible(!isUserDropdownVisible);
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            console.log("User signed out");
            // Redirect to login page or show a message
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    };
    return (
        <div className="nav">
            <Link to ="/"  className='logo'>
                <img src={image.MeanAsLogo} alt="MeanAsLogo"/>
            </Link>
           <ul className="menu">
               <li><Link id="l1" to="/About">About</Link></li>
               <li><Link id="l1" to="/Features">Features</Link></li>
               <li><Link to="/FreeAuth" id="l1">Dashboard</Link></li>
           </ul>
            <ul className="try">
                 <li><Link id="try" to="/FreeAuth">Try For Free</Link></li>
            </ul>
            {/* For Logout*/}
            <div id="besides">
                    <div className="allicons">
                        <img id="dass" src={image.user} alt="#" onClick={handleUserDropdownClick} />
                        {isUserDropdownVisible && (
                            <div className="dropdown-menuz">
                                <Link to="/profile" className="dropdown-itemz">View Profile</Link>
                                <div className="dropdown-itemz" onClick={handleLogout}>Logout</div>
                            </div>
                        )}
                    </div>
            </div>
            <ul className='dropdown'>
                <li>
                    <div className='dropbar' onClick={handleDropdownClick}>
                        <FaBars size={25} /> {/* Use the icon here */}
                    </div>
                </li>
                {isDropdownVisible && (
                    <ul className='dropdown-list'>
                        <li><Link id="l1" to="/About">About</Link></li>
                        <li><Link id="l1" to="/Features">Features</Link></li>
                        <li><Link to="/FreeAuth" id="l1">Dashboard</Link></li>
                        <li><Link id="try" to="/FreeAuth">Try For Free</Link></li>
                    </ul>
                )}
            </ul>
        </div>
        )
}

export default Navbar;

