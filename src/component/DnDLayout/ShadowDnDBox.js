import React, { Component } from 'react';

class ShadowDnDBox extends Component{
    constructor(props) {
        super(props)
        this.state = {
            onDrag:false
        } 
    }

    componentDidMount(){
    

    }

    sendTabDraggingComplete(){
        //console.log('ShadowContainer tabDragging complete !!')
    }

    onDragStart=(e)=>{
        e.dataTransfer.setDragImage(this.createGhostElement(), 10, 10);
        this.setState({
            onDrag:true
        })
    }

    onDragEnd=()=>{
        //console.log('ShadowContainer onDragEnd')
        let msg ={
            tabDragging:false,
            divSize:this.props.boxSize,
            pos:{
                x:this.props.mousePos.x+this.props.offset.x,
                y:this.props.mousePos.y+this.props.offset.y
            }
            
        }
        let ghost = document.getElementById("drag-shadow");
        if (ghost && ghost.parentNode) 
        {
            ghost.parentNode.removeChild(ghost);
        }
        this.props.draggingMsg(msg)
    }

    onMouseUp=()=>{
        //console.log('ShadowContainer onMouseUp')
        let msg ={
            tabDragging:false,
            divSize:this.props.boxSize
        }
        this.props.draggingMsg(msg)

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
    
    createGhostElement=()=>{
        let elem = document.createElement("div")
        elem.id = "drag-shadow";
        elem.style.position ="absolute"
        elem.style.width =this.props.boxSize.width+'px'
        elem.style.height =this.props.boxSize.height+'px'
        elem.style.top = this.props.initialPos.y+this.props.boxTabHeight+'px'
        elem.style.left = this.props.initialPos.x+'px'
        elem.style.zIndex = "-1"
        elem.style.border = '1px dotted'
        elem.style.borderColor = 'gray'
        elem.style.boxSizing = 'border-box'
        let childElement = document.createElement("div")
        childElement.style.borderRadius = this.props.boxCssSetting.boxTabRadius
        childElement.style.height = this.props.boxTabHeight+'px'
        childElement.style.lineHeight = this.props.boxTabHeight+'px'
        childElement.style.borderRight = '1px solid'
        childElement.style.borderLeft = '1px solid'
        childElement.style.borderTop = '1px solid'
        childElement.style.borderColor = 'gray'
        //childElement.style.backgroundColor = '#e8f3fc',
        childElement.style.paddingRight = this.paddingHorizon()+'px'
        childElement.style.paddingLeft = this.paddingHorizon()+'px'
        childElement.style.float = 'left'
        childElement.style.overflow = 'hidden'
        childElement.style.textOverflow = 'ellipsis'
        childElement.style.backgroundColor = '#e8f3fc'
        childElement.innerHTML = this.props.tabTitle
        elem.appendChild(childElement)
        document.body.appendChild(elem)
        
        return elem
    }

    render() {

        const shadowBoxStyle ={
            width:this.props.boxSize.width,
            height:this.props.boxSize.height-this.props.boxTabHeight,
            position:'absolute',
            left:this.props.initialPos.x,
            top:this.props.initialPos.y+this.props.boxTabHeight,
            zIndex:100,
            border:'1px dotted',
            borderColor:'gray',
            boxSizing:'border-box',
            opacity: this.state.onDrag?'0':'1'
        }

        const tapStyle = {
            top:-this.props.boxTabHeight+'px',
            height:this.props.boxTabHeight+'px',
            left:this.props.tabPos.x,
            position:'absolute',
            borderRadius:this.props.boxCssSetting.boxTabRadius,
            borderRight:'1px solid',
            borderLeft:'1px solid',
            borderTop:'1px solid',
            borderColor:'gray',
            backgroundColor:'#e8f3fc',
            paddingRight:this.paddingHorizon()+'px',
            paddingLeft:this.paddingHorizon()+'px',
            lineHeight:this.props.boxTabHeight+'px',
            float:'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis' 
        }


        return(
            <div ref={(refShadowBox)=>{this.refShadowBox =refShadowBox}} style={shadowBoxStyle} onDragStart={this.onDragStart} draggable={true} onDragEnd={this.onDragEnd} onMouseUp={this.onMouseUp} >            
                <div style={tapStyle}>
                    {this.props.tabTitle}
                </div>       
            </div>
        )
    }
}

export default ShadowDnDBox