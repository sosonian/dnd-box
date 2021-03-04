import React, { Component } from 'react';
import BoxTab from './BoxTab'
import styles from '../../styles.module.css'

class DnDBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            position:{
                x:null,
                y:null,
            },
            mousePos:{
                x:null,
                y:null
            },
            refPos:{
                x:0,
                y:0
            },
            divSize:{
                width:null,
                height:null,
            },
            refDivSize:{
                width:0,
                height:0
            },
            //showingUnitID:0,
            boxDragging:false,
            boxExtending:false,
            tabDragging:false,
            showing:true,
            headerMergeSingnal:false,
            iconHover:null,
            tabChangeSequence:false,
            maxSizeToggle:false,
        }
    }

    componentDidMount() {
        this.loadBoxPosition()
        this.loadBoxSize()
    }

    shouldComponentUpdate(nextProps, nextState){
        //if(nextProps.containerShowing)
        //{
            if(nextState.boxDragging==false && nextProps.anyBoxDragging==true && this.props.zIndex == nextProps.zIndex)
            {
                return false
            }
            else if(nextState.boxExtending==false && nextProps.anyBoxExtending==true && this.props.zIndex == nextProps.zIndex)
            {
                return false
            }
            else
            {
                return true
            }
        //}
        //else
        //{
        //    return false
        //}
        
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log('ControllerUnitContainer componentDidUpdate conID ', this.props.conID)
         
        if(this.state.boxExtending == false && this.state.boxDragging == true)
        {
            if(prevProps.mousePos !== this.props.mousePos)
            {
                this.setNewBoxPosition()
            } 
        }
        else if(this.state.boxExtending == true && this.state.boxDragging == false)
        {
            if(prevProps.mousePos !== this.props.mousePos)
            {
                this.setNewBoxSize()
            } 
        }
        else if(prevProps.size !== this.props.size)
        {
            this.loadBoxSize()
        }
    }
    
    componentWillUnmount() {
        // console.log('ControllerUnitContainer componentWillUnmount')
    }

    

    setNewBoxPosition() {
        //console.log("setNewBoxPosition offset : ", this.props.offset)
     
        let boxX = this.props.mousePos.x-this.state.refPos.x
        let boxY = this.props.mousePos.y-this.state.refPos.y
        let stopActionToken = false

        if(boxX < this.props.offset.x)
        {
            boxX = this.props.offset.x
            stopActionToken = true
        }
        else if(boxX + this.state.divSize.width > this.props.layoutSize.width + this.props.offset.x)
        {        
            boxX = this.props.layoutSize.width+this.props.offset.x-this.state.divSize.width     
            stopActionToken = true
        }

        if(boxY < this.props.offset.y)
        {
            boxY = this.props.offset.y
            stopActionToken = true
        }
        else if(boxY+this.state.divSize.height > this.props.layoutSize.height +this.props.offset.y)
        {
            boxY = this.props.layoutSize.height+this.props.offset.y-this.state.divSize.height
            stopActionToken = true
        }

        let newPos = {
            x:boxX,
            y:boxY
        }

        if(stopActionToken)
        {
            this.setState({
                position:newPos
            },()=>{
                this.headerMouseUp()
            })
        }
        else
        {
            this.setState({
                position:newPos
            })
        }
    }

    loadBoxSize=()=>{
        this.setState({
            divSize:this.props.size
        })
    }

    loadBoxPosition(){
        this.setState({
            position:{
                x:this.props.initialPos.x,
                y:this.props.initialPos.y
            }
        })
    }

    loadControllerUnitState=()=>{
        let tempControllerUnitState = this.state.controllerUnitState
        let tempcontrollerUnitList = this.props.controllerUnitList

        let sequenceCount = 0
        let output = tempControllerUnitState.map(unitState=>{   
            let result =  tempcontrollerUnitList.find(e=>e.unitID===unitState.unitID)
            if(result.containerUnitContainerID === this.props.conID)
            {
                sequenceCount = sequenceCount + 1
                let showingToggle = false
                if(sequenceCount+unitState.sequenceNumber == 0)
                {
                    showingToggle = true
                }
                let unitStateObj = {
                    unitID:unitState.unitID,
                    name:unitState.name,
                    title:unitState.title,
                    sequenceNumber:unitState.sequenceNumber+ sequenceCount,
                    showing:showingToggle       
                }
                return unitStateObj
            }
            else
            {
                return unitState
            }
        })

        this.setState({
            controllerUnitState:output
        })   
    }

    setNewBoxSize=()=>{

        let width = this.state.refDivSize.width+(this.props.mousePos.x-this.state.refPos.x)
        let height = this.state.refDivSize.height+(this.props.mousePos.y-this.state.refPos.y)
        let stopActionToken = false

        if(width < 200)
        {
            width = 200
            stopActionToken = true
        }
        else if(width + this.state.position.x > this.props.layoutSize.width+this.props.offset.x)
        {
            width = this.props.layoutSize.width+this.props.offset.x-this.state.position.x-1
            stopActionToken = true
        }

        if(height < 100)
        {
            height = 100
            stopActionToken = true
        }
        else if(height + this.state.position.y > this.props.layoutSize.height+this.props.offset.y)
        {
            height = this.props.layoutSize.height+this.props.offset.y-this.state.position.y-1
            stopActionToken = true
        }
       
        let newSize = {
            width:width,
            height:height
        }
   
        if(stopActionToken)
        {
            this.setState({
                divSize:newSize
            },()=>{
                this.extendAreaMouseUp()
            })
        }
        else
        {
            this.setState({
                divSize:newSize
            })
        }
    }

    headerMouseDown=(e)=>{   
        e.stopPropagation()
        if(!this.state.maxSizeToggle)
        {
            this.setState({
                boxDragging:true,
                refPos:{
                    x:e.clientX-this.props.offset.x-this.state.position.x,
                    y:e.clientY-this.props.offset.y-this.state.position.y
                }
            })   
    
            let msg ={
                boxID:this.props.boxID,
                zIndex:this.props.zIndex,
                boxDragging:true,
            }
            this.props.boxDragging(msg)
        }
    }

    headerMouseUp=(e)=>{
        if(e)
        {
            e.stopPropagation()
        }
       
        if(!this.state.maxSizeToggle)
        {
            this.setState({
                boxDragging:false,
                refPos:{
                    x:0,
                    y:0
                },
            })  
    
            let msg ={
                boxID:this.props.boxID,
                zIndex:this.props.zIndex,
                boxDragging:false,
                position:this.state.position
            }
            this.props.boxDragging(msg)
        }
    }

    onMouseMove=(e)=>{
        if(!this.state.maxSizeToggle)
        {
            if(this.state.boxDragging)
            {
                this.setState({
                    position:{
                        x:e.clientX-this.state.refPos.x-this.props.offset.x,
                        y:e.clientY-this.state.refPos.y-this.props.offset.y
                    }
                })
            }
        }
    }

    onDragEnter=(e)=>{
        e.stopPropagation()
        e.preventDefault()

        this.setState({
            headerMergeSingnal:true
        })

        let msg = {
            enterHeader:true,
            newBoxID:this.props.boxID
        }
        this.props.tabNewBoxID(msg)     
    }

    onDragLeave=(e)=>{
        e.stopPropagation()
        e.preventDefault()
        //console.log('DnDBox onDragLeave : boxID ', this.props.boxID)
        //console.log(this.state.tabChangeSequence)

        if(this.props.tabDraggingBooling)
        {   
            if(this.state.tabChangeSequence == false)
            { 
                let msg = {
                    enterHeader:false,
                    newBoxID:this.props.boxID
                }
                this.props.tabNewBoxID(msg) 
            }
            this.setState({
                headerMergeSingnal:false
            })  
        }
    }

    onDragOver=(e)=>{
        e.preventDefault()
    }

    onDrop=()=>{
        //console.log('ControllerUnitContainer onDrop: conID ', this.props.conID)
        this.setState({
            headerMergeSingnal:false
        })
    }

    sendContainerZIndexUpdate=()=>{
        let msg ={
            conID:this.props.conID,
            zIndex:this.props.zIndex
        }
        
        this.props.getContainerZIndexUpdate(msg)
    }

    headerMouseOut=()=>{

    }

    getTabDraggingMsg=(msg)=>{
        //console.log('DnDBox getTabDraggingMsg')
        
        let tabDraggingMsg={
            containerID:msg.containerID,
            boxID:this.props.boxID,
            sequenceNumber:msg.sequenceNumber,
            tabDom:msg.refDom,
            tabTitle:msg.tabTitle,
            refPos:{
                x:this.state.position.x,
                y:this.state.position.y
            },
            tabPos:msg.tabPos,
            divSize:this.state.divSize,
            tabDragging:msg.tabDragging,
            zIndex:this.props.zIndex
        }

        if(msg.tabDragging)
        {
            this.setState({
                tabDragging:true,
            })
            this.props.onTabDragging(tabDraggingMsg)
        }
        else
        {
            this.setState({
                tabDragging:false,
            })
            this.props.onTabDragging(tabDraggingMsg)
        }
    }

    getTabNewSequenceNumber=(msg)=>{
        
        this.setState({
            tabChangeSequence:msg.tabChangeSequence,
        },()=>{
            let newMsg = {
                tabChangeSequence:msg.tabChangeSequence,
                containerID:msg.containerID,
                newBoxID:this.props.boxID,
                newSequenceNumber:msg.sequenceNumber,
            }
    
            this.props.getTabNewSequenceNumber(newMsg)
        })
    }

    iconHover =(msg)=> {
        //console.log("DnDBox cancelIconHover")
        if(msg !== this.state.iconHover)
        {
            this.setState({
                iconHover:msg
            })
        }
    }

    headerCursorChangeHandler=()=>{
        let cursorToken = ''
        if(this.state.containerDragging && !this.state.maxSizeToggle)
        {
            cursorToken = 'grabbing'
        }
        else if(!this.state.containerDragging && !this.state.maxSizeToggle)
        {
            cursorToken = 'grab'
        }
        
        return cursorToken
    }

    iconBackgroundColorChangeHandler=(name)=>{ 
        if(this.state.iconHover === name)
        {
            return this.props.boxCssSetting.iconHoverColor
        }
        else
        {
            return ''
        } 
    }

    headerBackgroundColorChangeHandler=()=>{
        let backgroundColorToken = this.props.boxCssSetting.boxHeaderColor
        if(this.state.headerMergeSingnal)
        {
            backgroundColorToken = this.props.boxCssSetting.boxHeaderHoverColor
        }
        return backgroundColorToken
    }

    containerChangeZIndex=()=>{
        return (50 + this.props.zIndex)
    }

    createTabJSX=(containerState, sNumber)=>{
        return(
            <BoxTab key={containerState.containerID} containerID={containerState.containerID} sequenceNumber={sNumber} tabTitle={containerState.tab} boxCssSetting={this.props.boxCssSetting} boxTabHeight={this.props.boxTabHeight} showing={sNumber === this.props.showingContainerSequence? true:false} otherTabDragging={this.props.tabDraggingBooling} tabDragging={this.getTabDraggingMsg} getTabNewSequenceNumber={this.getTabNewSequenceNumber}/>
        )
    }

    loadHeaderTabs=()=>{

        let containerStateArray = []
        if(this.props.containerList.head)
        {
            let tempList = this.props.containerList
            let currentNode = tempList.head
            let indexCount = 0

            while(currentNode)
            {
                containerStateArray.push(this.createTabJSX(currentNode.data, indexCount))  
                currentNode = currentNode.next
                indexCount ++
            }
   
            return containerStateArray
        }
        else
        {
            return null
        }
        
    }

    cancelIconMouseDown=(e)=>{
        e.stopPropagation()
        const msg = {
            boxID:this.props.boxID,
        }
        this.props.boxHiding(msg)
    }

    expandMaxIconClick=(e)=>{
        e.stopPropagation()
        this.setState({
            maxSizeToggle:!this.state.maxSizeToggle
        })
    }

    extendAreaMouseDown=(e)=>{
        e.stopPropagation()
        if(!this.state.maxSizeToggle)
        {
            this.setState({
                boxExtending:true,
                refPos:{
                    x:e.clientX-this.props.offset.x,
                    y:e.clientY-this.props.offset.y
                },
                refDivSize:this.state.divSize
            })   
    
            let msg ={
                boxID:this.props.boxID,
                sequenceNumber:this.props.sequenceNumber,
                zIndex:this.props.zIndex,
                boxExtending:true
            }
            this.props.boxExtending(msg)
        }
    }

    extendAreaMouseUp=(e)=>{
        if(e)
        { 
            e.stopPropagation()
        }

        if(!this.state.maxSizeToggle)
        {
            this.setState({
                boxExtending:false,
                refPos:{
                    x:0,
                    y:0
                },
            })  
    
            let msg ={
                boxID:this.props.boxID,
                sequenceNumber:this.props.sequenceNumber,
                zIndex:this.props.zIndex,
                boxExtending:false,
                size:this.state.divSize
            }
            this.props.boxExtending(msg)
        }
    }

    boxOnClick=(e)=>{
        e.stopPropagation()
        let msg = {
            boxID:this.props.boxID,
            zIndex:this.props.zIndex
        }
        this.props.boxOnClick(msg)
    }

    boxOnMouseDown=(e)=>{
        e.stopPropagation()
    }

    boxOnMouseUp=(e)=>{
        e.stopPropagation()
    }

    falseEvent=(e)=>{
        e.stopPropagation()
        e.preventDefault()
    }

    render() {    
        console.log('box render boxID  : ',this.props.boxID)
        //console.log(this.props.children)
        console.log(this.props.children.props.children)
        let containerWindow = {
            width:this.state.maxSizeToggle?this.props.layoutSize.width:this.state.divSize.width?this.state.divSize.width:this.props.size.width,
            height:this.state.maxSizeToggle?this.props.layoutSize.height:this.state.divSize.height?this.state.divSize.height:this.props.size.height,
            position:'absolute',
            left:this.state.maxSizeToggle?this.props.offset.x:this.state.position.x?this.state.position.x:this.props.initialPos.x,
            top:this.state.maxSizeToggle?this.props.offset.y:this.state.position.y?this.state.position.y:this.props.initialPos.y,
            zIndex:this.state.maxSizeToggle?100:this.props.zIndex,
            backgroundColor:this.props.boxCssSetting.boxColor,
            border:'2px solid',
            borderColor:'black',
            boxSizing:'border-box',
            display: 'flex',
            flexDirection: 'column',
        }
    
        let headerStyle = {
            width:'100%',
            height:this.props.boxTabHeight+'px',
            backgroundColor:this.headerBackgroundColorChangeHandler(),
            borderBottom:'1px solid',
            borderColor:'gray',
            cursor:this.headerCursorChangeHandler(),      
            userSelect:'none'    
        }

        let cancelIconStyle = {
            width:this.props.boxTabHeight+'px',
            height:this.props.boxTabHeight+'px',
            lineHeight:this.props.boxTabHeight+'px',
            position:'absolute',
            top:'0px',
            right:'0px',
            fontFamily:'Arial',
            cursor:'pointer',
            backgroundColor:this.iconBackgroundColorChangeHandler("cancel"),
            fontSize:'large',
            textAlign:'center'
        }

        let expandMaxIconStyle = {
            width:this.props.boxTabHeight+'px',
            height:this.props.boxTabHeight+'px',
            lineHeight:this.props.boxTabHeight+'px',
            position:'absolute',
            top:'0px',
            right:this.props.boxTabHeight+'px',
            fontFamily:'Arial',
            cursor:'pointer',
            backgroundColor:this.iconBackgroundColorChangeHandler("expandMax"),
            fontSize:'large',
            textAlign:'center'
        }

        let extendFunctionAreaStyle = {
            width:'40px',
            height:'40px',
            lineHeight:'40px',
            position:'absolute',
            right:'0px',
            bottom:'0px',
            userSelect:'none',
            cursor:this.state.maxSizeToggle?'not-allowed':'nw-resize',
            textAlign:'center'
        }

        return (
            <div style={containerWindow} ref={(refBox) => {this.refBox = refBox}} >  
                <div style={headerStyle} onMouseDown={this.headerMouseDown} onMouseUp={this.headerMouseUp} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop} onMouseOut={this.headerMouseOut}>
                    <div style={{display:'flex',paddingTop:'2px',paddingLeft:'2px',height:'100%',paddingRight:20+2*this.props.boxTabHeight+'px'}}>
                        {this.loadHeaderTabs()}
                    </div>
                    <div style={expandMaxIconStyle} onClick={this.expandMaxIconClick}  onMouseOver={()=>this.iconHover('expandMax')} onMouseOut={()=>this.iconHover(null)}
                    onDragEnter={this.falseEvent} onDragLeave={this.falseEvent} onDragOver={this.falseEvent} onDrop={this.falseEvent}>{this.state.maxSizeToggle?<span>&#8601;</span>:<span>&#8599;</span>}</div>
                    <div style={cancelIconStyle} onClick={this.cancelIconMouseDown}  onMouseOver={()=>this.iconHover('cancel')} onMouseOut={()=>this.iconHover(null)}
                    onDragEnter={this.falseEvent} onDragLeave={this.falseEvent} onDragOver={this.falseEvent} onDrop={this.falseEvent}>{'x'}</div>
                </div>              
                <div style={extendFunctionAreaStyle} onMouseDown={this.extendAreaMouseDown}  onMouseUp={this.extendAreaMouseUp}>
                    &#9499;
                </div>  
                <div style={{width:'100%', height:'100%', overflow:'auto'}} onMouseDown={this.boxOnMouseDown} onMouseUp={this.boxOnMouseUp} onClick={this.boxOnClick}>            
                    {this.props.children}
                </div>            
            </div>
        )
    }
}

export default DnDBox