import React, { useCallback, useEffect, useRef, useState } from "react";
import "../components/sidebar.css";

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sideBarRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const callbackMouseEnter = useCallback(() => {
    console.log("mouse eneter");
    setIsHovered(true);
  });

  const callbackMouseLeave = useCallback(() => {
    setIsHovered(false);
  });

  console.log("ishover", isHovered);

  const handleTouchOutside = useCallback((event) => {
    console.log("touchoutside", sideBarRef);
    const sideBarElem = sideBarRef.current;
    if (sideBarElem && !sideBarElem.contains(event.target)) {
      closeSidebar();
    }
  });

  const handleTouchStart = useCallback(() => {
    console.log("touch start", sideBarRef);
    if (!isHovered) {
      setIsHovered(true);
    }
    document.addEventListener("touchend", handleTouchOutside);
  }, [sideBarRef]);

  const closeSidebar = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const sideBar = sideBarRef?.current;
    console.log("base", sideBarRef?.current);
    if (sideBarRef?.current) {
      console.log("added event listener");
      sideBar.addEventListener("mouseenter", callbackMouseEnter);
      sideBar.addEventListener("mouseleave", callbackMouseLeave);
      sideBar.addEventListener("touchstart", handleTouchStart);

      return () => {
        sideBar.removeEventListener("mouseenter", callbackMouseEnter);
        sideBar.removeEventListener("mouseleave", callbackMouseLeave);
        sideBar.removeEventListener("touchstart", handleTouchStart);
      };
    }
  }, [isHovered, callbackMouseEnter, callbackMouseLeave, sideBarRef]);

  return (
    <div
      className={
        true ? "sidebar sidebar-expanded" : "sidebar sidebar-closed"
      }
      ref={sideBarRef}
    >
      <div className="sidebar-container">
         <div className="header">
             <div>
            <img width="18" height="18" src="https://img.icons8.com/ios/50/add--v1.png" alt="add--v1"/>
            </div>
            {isHovered && <div className="label">
                Vijay Traders
            </div>}
         </div>
         <div className="link-wrapper">
          <div className="single-option">
            <div className="left-icon">
            <img width="18" height="18" src="https://img.icons8.com/ios/50/add--v1.png" alt="add--v1"/>
            </div>
            {isHovered && <div className="label">
                Add Button
            </div>}
          </div>
          <div className="single-option">
            <div className="left-icon">
            <img width="18" height="18" src="https://img.icons8.com/ios/50/add--v1.png" alt="add--v1"/>
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
