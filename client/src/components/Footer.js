import * as React from 'react';
import { BottomNavigation, BottomNavigationAction } from "@mui/material"

const Footer = () => {

    return (
        <BottomNavigation showLabels sx={{ width: '100%', position: 'absolute', bottom: 0  }}>
            <BottomNavigationAction label="Github" href='https://github.com/pawaters/matcha' />
            <BottomNavigationAction label="Contact" href='mailto:pierre.alban.waters@gmail.com' />
        </BottomNavigation>
    )
}

export default Footer