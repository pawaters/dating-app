import React from "react"
import { BottomNavigation, BottomNavigationAction } from "@mui/material"

const Footer = () => {

    const [value, setValue] = React.useState(0);

    return (
        <BottomNavigation
            showLabels
            value={value}
            onchange={(event, newValue) => {
                setValue(newValue)
            }}
        >
            <BottomNavigationAction label="About" />
            <BottomNavigationAction label="Hive" />
            <BottomNavigationAction label="Contact" />

        </BottomNavigation>
    )
}

export default Footer