import { Container, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"

const Loader = ({text}) => {
    return (
        <Box>
            <Typography>
                {text}
            </Typography>
        </Box>
    )
       
    
}

export default Loader