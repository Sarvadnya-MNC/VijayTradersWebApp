import React from "react";
import iconStore from "./iconsStore";
import styles from './_icon.scss'

const Icon = (props) =>{

    const {icon,className=''} = props;

    return <span className={`iconclass ${className}`}>
        {iconStore[icon]}
    </span>
}

export default Icon;