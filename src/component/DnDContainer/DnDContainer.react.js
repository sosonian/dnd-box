import * as React from "react";

const DnDContainer = (props) =>{
    let boxStyle = {
        width:'100%',
        height:'100%',
        overflow:'auto'
    }
    return (
        <React.Fragment>      
            <div style={boxStyle}>{props.children}</div>
        </React.Fragment>
    )
}



export default DnDContainer