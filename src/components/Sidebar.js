import React, { useCallback, useEffect, useRef, useState } from "react";
import "../components/sidebar.css";
import Home from '../assets/images/home.png'
import Notebook from '../assets/images/notebook_fill.svg'
import UserIcon from '../assets/images/user.png'
const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const callbackMouseEnter = useCallback(() => {
    console.log("mouse eneter");
    setIsHovered(true);
  });

  const callbackMouseLeave = useCallback(() => {
    setIsHovered(false);
  });

  console.log("ishover", isHovered);

  const closeSidebar = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={
       "sidebar sidebar-closed"
      }
      onMouseEnter={callbackMouseEnter}
      onMouseLeave={callbackMouseLeave}
    >
      <div className="sidebar-container">
         <div className="header">
             <div>
            <img width="18" height="18" src={Home} alt="add--v1"/>
            </div>
            {isHovered && <div className="label">
                Vijay Traders
            </div>}
         </div>
         <div className="link-wrapper">
          <div className="single-option">
            <div className="left-icon">
            <img width="18" height="18" src={Notebook} alt="add--v1"/>
            </div>
            {isHovered && <div className="label">
                Add Button
            </div>}
          </div>
          <div className="single-option">
            <div className="left-icon">
            <img width="18" height="18" className="image-color" src={UserIcon} alt="add--v1"/>
            </div>
            {isHovered && <div className="label">
                Add Button
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
