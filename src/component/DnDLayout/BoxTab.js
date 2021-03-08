import React, { Component } from 'react';
import './BoxTab.css'

class BoxTab extends Component{
    constructor(props) {
        super(props)
        this.state = {
            tabHover:false
        } 
    }

    componentDidMount(){
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.otherTabDragging || nextProps.tabDragging)
        {
            return true
        }
        else
        {
            return false
        }
    }

    tabMouseDown=(e)=>{
        let tabPos ={
            x:this.refDom.offsetLeft,
            y:this.refDom.offsetTop
        }
        e.stopPropagation()
        let tabMsg = {
            containerID:this.props.containerID,
            tabTitle:this.props.tabTitle,
            sequenceNumber:this.props.sequenceNumber,
            refPos:{
                x:e.clientX,
                y:e.clientY
            },
            tabPos:tabPos,
            refDom:this.refDom,
            tabDragging:true
        }
        this.props.tabDragging(tabMsg)  
    }

    tabShowingToggle = (property) =>{
        if(property==='backgroundColor')
        {
            if(this.state.tabHover)
            {
                return this.props.boxCssSetting.boxTabHoverColor
            }
            else
            {
                if(this.props.showing)
                {
                    return this.props.boxCssSetting.boxTabSelectedColor
                }
                else
                {
                    return this.props.boxCssSetting.boxTabColor
                }
            }
        }
        // else if(property==='borderBottom')
        // {
        //     if(this.state.tabHover)
        //     {
        //         return '1px solid #42ff32'
        //     }
        //     else
        //     {
        //         if(this.props.showing)
        //         {
        //             return '1px solid #9fe8df'
        //         }
        //         else
        //         {
        //             return '1px solid #9FC5E8'
        //         }
        //     }
        // }    
    }

    tabMouseUP=(e)=>{
        e.stopPropagation()
        let tabMsg = {
            containerID:this.props.containerID,
            tabDragging:false
        }
        this.props.tabDragging(tabMsg)
    }

    onDragEnter=(e)=>{
        e.stopPropagation()
        e.preventDefault()
        
        if(this.props.otherTabDragging)
        {
            this.setState({
                tabHover:true
            })
            let msg = {
                tabChangeSequence : true,
                containerID:this.props.containerID,
                sequenceNumber:this.props.sequenceNumber,
            }
            this.props.getTabNewSequenceNumber(msg)  
        }
    }

    onDragLeave=(e)=>{
        e.stopPropagation()
        e.preventDefault()

        if(this.props.otherTabDragging)
        {
            this.setState({
                tabHover:false
            })
            let msg = {
                tabChangeSequence : false,
                containerID:this.props.containerID,
                sequenceNumber:-1,
            }
            this.props.getTabNewSequenceNumber(msg) 
        }
    }

    onDragOver=(e)=>{
        e.preventDefault()
    }

    onDrop=()=>{
        this.setState({
            tabHover:false
        })
    }

    transWidth=()=>{
        if(this.state.tabHover)
        {
            return this.props.boxTabHeight+'px'
        }
        else
        {
            return '0px'
        }
    }

    paddingHorizon=()=>{
        let output = Math.floor(this.props.boxTabHeight/8)
        if( output === 0)
        {
            return 1
        }
        else
        {
            return output
        }
    }

    render() {
        //console.log("BoxTab containerID : ", this.props.containerID)
        const tabContainerStyle = {
            float:'left',
            display:'flex',
            overflow: 'hidden',
            height:'100%',
        }
        
        const tabStyle = {
            borderRadius:this.props.boxCssSetting.boxTabRadius,
            borderRight:'1px solid',
            borderLeft:'1px solid',
            borderTop:'1px solid',
            //borderBottom:this.tabShowingToggle('borderBottom'),
            borderColor:'gray',
            backgroundColor:this.tabShowingToggle('backgroundColor'),
            //padding:'1px',
            paddingRight:this.paddingHorizon()+'px',
            paddingLeft:this.paddingHorizon()+'px',
            float:'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents:'none',
            height:this.props.boxTabHeight+'px',
            lineHeight:this.props.boxTabHeight+'px'       
        }
         
        const emptyTabStyle ={
            transition:'width 0.5s',
            width:this.transWidth(),
            //width:0,
            float:'left',
            pointerEvents:'none',
            height:'100%'
            //animationFillMode:'forwards'
        }

        const compartmentArea = {
            float:'left',
            display:'flex',
            overflow: 'hidden',
            height:'100%'
        }

        return(
            <div style={compartmentArea}>
                <div style={tabContainerStyle} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop} onMouseDown={this.tabMouseDown} onMouseUp={this.tabMouseUP}>
                    <div style={emptyTabStyle}></div>
                    <div style={tabStyle}  ref={(refDom)=>{this.refDom=refDom}}>
                        {this.props.tabTitle}
                    </div>
                </div>
            </div>
        )
    }
}

export default BoxTab