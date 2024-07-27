import React, { useEffect, useState } from 'react';
import "./SideBar.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, signOut, db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";
import { FaBars } from 'react-icons/fa';

function SideBar() {
  const dashimg = {
    not: "notification.png",
    user: "user.png",
    over: "window.png",
    proj: "layers.png",
    team: "group.png",
    assis: "assistant.png",
    pre: "pre-process.png",
    post: "post-process.png",
    error: "error.png",
    upgrad: "clean.png"
  };

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [isAccessAllowed, setIsAccessAllowed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser(user);
          setPlan(userData.plan);
          checkAccess(userData.plan, userData.signupDate.toDate());
        } else {
          console.error("No such document!");
        }
      } else {
        setUser(null);
        navigate('/Authentication');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const checkAccess = (plan, signupDate) => {
    const currentDate = new Date();
    let accessDuration;
    if (plan === 'Explorer Plan') {
      accessDuration = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
    } else if (plan === 'Standard Plan') {
      accessDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    } else {
      setIsAccessAllowed(true); // Unlimited plan
      return;
    }
    const expirationDate = new Date(signupDate.getTime() + accessDuration);
    setIsAccessAllowed(currentDate <= expirationDate);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleMenuClick = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleUserDropdownClick = () => {
    setIsUserDropdownVisible(!isUserDropdownVisible);
  };

  if (!isAccessAllowed) {
    return (
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>Your access period has expired. Please upgrade your plan to continue using the dashboard.</p>
        <Link to="/Pricing">Go to Pricing</Link>
      </div>
    );
  }

  return (
    <div className='fullbar'>
      <div className="flatbar">
        <div id="right">
          <div className="allicon"><img id="das" src={dashimg.not} alt="#" /></div>
        </div>
        <div id="besides">
          <div className="allicons">
            <img id="dass" src={dashimg.user} alt="#" onClick={handleUserDropdownClick} />
            {isUserDropdownVisible && (
              <div className="dropdown-menus">
                <Link to="/Profile" className="dropdown-items">View Profile</Link>
                <div className="dropdown-items" onClick={handleLogout}>Log out</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sidebar">
        <Link className="compilogo" to="/">
          <img src="NobgLogo.png" />
        </Link>
        <ul className="dashy">
          <Link className="dashli" to="/Dashboard"><div className="dash"><img id="das" src={dashimg.over} /></div>Overview</Link>
          <Link className="dashli" to="/Projects/:id"><div className="dash"><img id="das" src={dashimg.proj} /></div>Projects</Link>
          <Link className="dashli" to="#"><div className="dash"><img id="das" src={dashimg.team} /></div>Team Connect</Link>
          <Link className="dashli" to="#"><div className="dash"><img id="das" src={dashimg.assis} /></div>AI Assistant</Link>
        </ul>
        <Link id="upgra" to='/Pricing'>
          <div>
            <div className="allicon">
              <img id="das" src={dashimg.upgrad} alt="#" />
            </div>
            <h3>Upgrade to Unlimited Plan</h3>
          </div>
          <p>Access unlimited clarity and accuracy for your analysis.</p>
        </Link>
      </div>

      <div className='phoneversion'>
        <ul className='dropdowns'>
          <li>
            <div className='dropbarps' onClick={handleMenuClick}>
              <FaBars size={25} /> {/* Use the icon here */}
            </div>
          </li>
          {isMenuVisible && (
            <ul className='dropdown-lists'>
              <li><Link className="dashlis" to="/Dashboard"><div className="dashs"><img id="dass" src={dashimg.over} alt="Overview" /></div>Overview</Link></li>
              <li><Link className="dashlis" to="/Projects/:id"><div className="dashs"><img id="dass" src={dashimg.proj} alt="Projects" /></div>Projects</Link></li>
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
          <img src="NobgLogo.png" />
        </Link>
        <div className="flatbarp">
          <div id="rightp">
            <div className="alliconp"><img id="dass" src={dashimg.not} alt="#" /></div>
          </div>
          <div id="besides">
            <div className="allicons">
              <img id="dass" src={dashimg.user} alt="#" onClick={handleUserDropdownClick} />
              {isUserDropdownVisible && (
                <div className="dropdown-menus">
                  <Link to="/Profile" className="dropdown-items">View Profile</Link>
                  <div className="dropdown-items" onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='topbar'>
        <h1>Welcome to Your <span>MeanAs</span> Dashboard</h1>
        <p>Select where you need more clarity and accuracy for your FEA/CFD Analysis.</p>
      </div>
      <div className="select">
        <div id="box">
          <Link id="opt" to="/Preprocess">
            <div className="allbox"><img id="das" src={dashimg.pre} /></div>
            <p>Clarity & Accuracy For Pre-Processing</p>
          </Link>
        </div>
        <div id="box">
          <Link id="opt" to="/Errorchecker">
            <div className="allbox"><img id="das" src={dashimg.error} /></div>
            <p>FEA/CFD Analysis Error Solutions</p>
          </Link>
        </div>
        <div id="box">
          <Link id="opt" to="/Postprocess">
            <div className="allbox"><img id="das" src={dashimg.post} /></div>
            <p>Clarity & Accuracy For Post-Processing</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SideBar;
