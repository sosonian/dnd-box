import * as React from "react";

const DnDBackgroundComponent = (props) =>{
    let boxStyle = {
        width:'100%',
        height:'100%',
    }
    
    return (
        <React.Fragment>   
            <div style={boxStyle}>{props.children}</div>
        </React.Fragment>
    ) 
}



export default DnDBackgroundComponent