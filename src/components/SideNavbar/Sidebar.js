import React, { useCallback, useEffect, useRef, useState } from "react";
import "./sidebar.scss";
import Icon from "../common/Icon/Icon";
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
            <Icon icon='home'/>
            </div>
            {isHovered && <div className="label">
                Vijay Traders
            </div>}
         </div>
         <div className="link-wrapper">
          <div className="single-option">
            <div className="left-icon">
            <Icon icon='notebook'/>
            </div>
            {isHovered && <div className="label">
                Add Button
            </div>}
          </div>
          <div className="single-option">
            <div className="left-icon">
            <Icon icon='user'/>
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
