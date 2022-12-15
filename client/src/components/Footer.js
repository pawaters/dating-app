import * as React from 'react';
import { BottomNavigation, BottomNavigationAction } from "@mui/material"

const Footer = () => {

    return (
        <BottomNavigation showLabels sx={{ width: '80%', position: 'absolute', bottom: 0, justifyContent: 'center' }}>
            <BottomNavigationAction label="Github" href='http://www.google.com' />
            <BottomNavigationAction label="Contact" href='mailto:pierre.alban.waters@gmail.com' />
        </BottomNavigation>
    )
}

export default Footer