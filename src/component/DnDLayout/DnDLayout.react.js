import * as React from "react";
import DnDBox from './DnDBox'
import ShadowDnDBox from './ShadowDnDBox.js'
import styles from '../../styles.module.css'
import LinkedList from '../../Utilities/LinkedList'
import {v4 as uuidv4} from 'uuid'

class DnDLayout extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            boxesState:[],
            mousePos:{
                x:0,
                y:0
            },
            refPos:{
                x:0,
                y:0
            },
            scrollPos:{
                x:0,
                y:0
            },
            needMousePos:false,
            tabDragging:{
                status:false,
                targetContainerID:0,
                containerID:0,
                oldBoxID:0,
                newBoxID:0,
                oldSequenceNumber:-1,
                newSequenceNumber:-1,
            },
            tempToken:0,
            boxDragging:{
                status:false,
                boxID:0
            },
            boxExtending:{
                status:false,
                boxID:0,
            },
            shadowBox:{},
            unmountTest:'None',
            tabSetting:{
                boxHeaderColor:'#b6d9ea',
                boxHeaderHoverColor:'#FF3636',
                boxHeaderHeight:25,
                cancelIconHoverColor:'#cff5ff',
                tabFontFamily:'inherit',
                tabFontSize:'inherit',
            }
        }
    }

    componentDidMount(){
        this.loadContainerToBox(this.initialBoxesState())
    }

    componentDidUpdate(prevProps,prevState){
        if(this.props.openContainer)
        {
            this.containerShowing(this.props.openContainer)
        }
    }

    componentWillUnmount(){
        if(this.props.getBoxesState)
        {
            this.props.getBoxesState(this.outputBoxState())
        }
    }

    initialBoxesState=()=>{
        let output=[]
        if(this.props.boxesSetting  && this.props.boxesSetting.length > 0)
        {
            let boxIDUndefinedOrDuplicatedArray=[]
            let boxIDNumberUniqueArray=[]
            let boxIDUniqueArray=[]
            
            this.props.boxesSetting.forEach(box=>{
                if(!box.boxID)
                {
                    boxIDUndefinedOrDuplicatedArray.push(box)
                }
                else
                {
                    if(boxIDNumberUniqueArray.indexOf(box.boxID)===-1)
                    {
                        boxIDNumberUniqueArray.push(box.boxID)
                        boxIDUniqueArray.push(box)
                    }
                    else
                    {
                        boxIDUndefinedOrDuplicatedArray.push(box)
                    }
                }
            })

            boxIDUndefinedOrDuplicatedArray.forEach(box=>{
                let newID = uuidv4()
                box.boxID = newID
                boxIDUniqueArray.push(box)
            })
                     
            output = boxIDUniqueArray.map((box,index)=>{
                let notSortArray = []

                let outputObj = {
                    boxID : box.boxID,
                    size:
                    {
                        width : box.width && !isNaN(box.width) ? box.width : 200,
                        height : box.height && !isNaN(box.height) ? box.height : 200
                    },
                    position:
                    {
                        x:box.x && !isNaN(box.x) ? box.x+this.refLayout.getBoundingClientRect().left:box.x===0?0:200*index+this.refLayout.getBoundingClientRect().left,
                        y:box.y && !isNaN(box.y) ? box.y+this.refLayout.getBoundingClientRect().top:box.y===0?0:200*index+this.refLayout.getBoundingClientRect().top
                    },
                    zIndex:index+1,
                    showing:false,
                    showingContainerSequence:0,
                    containerList:notSortArray
                }
                return outputObj
            })
        }
        else
        {
            this.props.children.forEach((child,index)=>{
                let notSortArray = []
                let outputObj = {
                    boxID:index,
                    size:
                    {
                        width:200,
                        height:200
                    },
                    position:
                    {
                        x:200*index+this.refLayout.getBoundingClientRect().left,
                        y:0+this.refLayout.getBoundingClientRect().top
                    },
                    zIndex:index+1,
                    showing:false,
                    showingContainerSequence:0,
                    containerList:notSortArray
                }

                output.push(outputObj)
                
            })            
        }

        return output
    }

    initialContainerState=()=>{
        if(this.props.children && this.props.children.length >0)
        {
            let output = []
            let uniqueContainerIDArray = []
            this.props.children.forEach((child,index)=>{
                if(child.props.dndType !== "DnDContainer")
                {
                    let id
                    if(child.props.containerID)
                    {
                        if(uniqueContainerIDArray.indexOf(child.props.containerID) === -1)
                        {
                            uniqueContainerIDArray.push(child.props.containerID)
                            id = child.props.containerID
                        }
                        else
                        {
                            //id = uuidv4()
                            id = null
                        }
                    }
                    else
                    {
                        //id = uuidv4()
                        id = null
                    }
                
                    let outputObj = {
                        containerID: id,
                        tab:child.props.containerTabTitle?child.props.containerTabTitle:"Container",
                        boxID:child.props.boxID?child.props.boxID:null,
                        sequenceNumber:child.props.sequenceNumber?child.props.sequenceNumber:null,
                        //domObj:child
                    }

                    if(outputObj.containerID)
                    {
                        output.push(outputObj)
                    }               
                }
            })
            return output
        }
        else
        {
            return null
        }
    }

    loadContainerToBox=(boxesState)=>{
        let tempArray
        let tempContainerState = this.initialContainerState()
        let tempBoxesIDArray = boxesState.map(box=>{
            return box.boxID
        })
        let undefinedBoxIDContainerGroup = []

        let finalOutput = []

        if(tempContainerState && boxesState)
        {
            tempContainerState.forEach((container,index)=>{
                if(container.boxID)
                {
                    let boxIndex = tempBoxesIDArray.indexOf(container.boxID)
                    if(boxIndex === -1)
                    {
                        undefinedBoxIDContainerGroup.push(container)
                    }
                    else
                    {
                        boxesState[boxIndex].containerList.push(container)
                    }
                }
                else
                {
                    undefinedBoxIDContainerGroup.push(container)
                }
            })
            
            boxesState.forEach((box,bIndex)=>{
                let tempLinkList = new LinkedList()
                if(box.containerList && box.containerList.length >0)
                {
                    let undefinedSequenceContainer = []
                    let definedSequenceContainer = []
                    box.containerList.forEach(container=>{
                        if(container.sequenceNumber)
                        {
                            definedSequenceContainer.push(container)
                        }
                        else
                        {
                            undefinedSequenceContainer.push(container)
                        }
                    })

                    definedSequenceContainer.sort((a,b)=>{
                        return a.sequenceNumber - b.sequenceNumber
                    })

                    let tempContainerList = definedSequenceContainer.concat(undefinedSequenceContainer)

                    tempContainerList.forEach((container,cIndex)=>{
                        container.sequenceNumber = cIndex
                        tempLinkList.insertLast(container)
                    })     
                    
                    box.showing = true
                }

                if(bIndex === 0)
                {
                    if(undefinedBoxIDContainerGroup.length >0 )
                    {
                        undefinedBoxIDContainerGroup.forEach((ucontainer,uIndex)=>{
                            ucontainer.boxID = box.boxID
                            ucontainer.sequenceNumber = box.containerList.length + uIndex
                            tempLinkList.insertLast(ucontainer)
                        })
                    }

                    if(tempContainerState.length === undefinedBoxIDContainerGroup.length)
                    {
                        box.showing = true
                    }
                }

                box.containerList = tempLinkList


            })

            

            finalOutput=boxesState
        }

        this.setState({
            boxesState: finalOutput
        })
    }

    verifyTabHeight=()=>{
        if(this.props.tabHeight && !isNaN(this.props.tabHeight))
        {
            return this.props.tabHeight
        }
        else
        {
            return 20
        }
    }

    verifyBoxCss=()=>{
        let boxColor = this.props.boxColor ? this.props.boxColor : '#5f9ea0'
        let boxHeaderColor = this.props.boxHeaderColor ? this.props.boxHeaderColor : '#b6d9ea'
        let boxTabColor = this.props.boxTabColor ? this.props.boxTabColor : '#9fc5e8'
        let boxHeaderHoverColor = this.props.boxHeaderHoverColor ? this.props.boxHeaderHoverColor : '#ff0000'
        let boxTabHoverColor = this.props.boxTabHoverColor ? this.props.boxTabHoverColor : '#00ff03'
        let boxTabSelectedColor = this.props.boxTabSelectedColor ? this.props.boxTabSelectedColor : '#9fe8df'
        let iconHoverColor = this.props.iconHoverColor ? this.props.iconHoverColor : '#cff5ff'
        let boxTabRadius = this.props.boxTabRadius ? this.props.boxTabRadius : '0px 10px 0px 0px'

        let BoxCssSetting={
            boxColor : boxColor,
            boxHeaderColor : boxHeaderColor,
            boxTabColor : boxTabColor,
            boxHeaderHoverColor : boxHeaderHoverColor,
            boxTabHoverColor : boxTabHoverColor,
            boxTabSelectedColor : boxTabSelectedColor,
            iconHoverColor : iconHoverColor,
            boxTabRadius : boxTabRadius
        }

        return BoxCssSetting
    }

    onBoxDragging = (msg) => {
        //console.log('ControllerUnitLayout onContainerDragging')
        //console.log('conID : ',msg.conID, 'booling : ',msg.containerDragging)
        //console.log(msg.position)
        let boxIDToken = 0 
        if(msg.boxDragging)
        {
            boxIDToken = msg.boxID
            this.setState({
                boxDragging:{
                    status:msg.boxDragging,
                    boxID:boxIDToken
                },
                needMousePos:true,
                boxesState:this.setNewBoxZIndex(msg)
            })
        }
        else
        {
            //console.log('onContainerDragging false')
            let temp = this.state.boxesState
            let output = temp.map((boxState)=>{
                let stateObj={}
                if(boxState.boxID===msg.boxID)
                {
                    stateObj = {
                        boxID:boxState.boxID,
                        size:boxState.size,
                        position:msg.position,
                        zIndex:boxState.zIndex,
                        showing:true,
                        showingContainerSequence:boxState.showingContainerSequence,
                        containerList: boxState.containerList
                    }
                    return stateObj
                }
                else
                {
                    return boxState
                }
            })

            //console.log('containerStateArray :')
            //console.log(output)

            this.setState({
                boxDragging:{
                    status:false,
                    boxID:boxIDToken
                },
                needMousePos:false,
                mousePos:{
                    x:0,
                    y:0
                },
                boxesState:output
            })
        }
    }

    onBoxExtending = (msg)=>{
        //console.log('ControllerUnitLayout onContainerExtending')
        if(msg.boxExtending)
        {
            this.setState({
                boxExtending:{
                    status:msg.boxExtending,
                    boxID:msg.boxID,
                },
                needMousePos:true,
                boxesState:this.setNewBoxZIndex(msg)
                //refPos:msg.refPos
            })
        }
        else
        {
            this.setState({
                boxExtending:{
                    status:false,
                    boxID:0,
                },
                needMousePos:false,
                mousePos:{
                    x:0,
                    y:0
                },

                boxesState:this.getBoxNewSize(msg.boxID,msg.size,this.setNewBoxZIndex(msg))
                //refPos:msg.refPos
            })
        }
        
        //this.setNewContainerZIndex(msg)

    }

    getBoxNewSize=(boxID,newSize,boxesState)=>{
        let output = boxesState.map(box=>{
            if(boxID === box.boxID)
            {
                box.size = newSize
            }
            return box
        })
        return output
    }

    setNewBoxZIndex = (msg) =>{
        let boxesStateToken =[]
        let arrayToken = this.state.boxesState
        let stateLength = arrayToken.length
        this.state.boxesState.forEach(boxState=>{
            let stateObj = {...boxState}
            if(stateObj.boxID===msg.boxID)
            {
                stateObj.zIndex = stateLength
                if(msg.sequenceNumber || msg.sequenceNumber === 0)
                {
                    stateObj.showingContainerSequence = msg.sequenceNumber
                }
            }
            else
            {
                if(stateObj.zIndex > msg.zIndex)
                {
                    stateObj.zIndex = stateObj.zIndex -1
                }
            }
            boxesStateToken.push(stateObj)
        })
        //console.log(boxesStateToken)
        return boxesStateToken
    }

    onTabDragging =(msg)=>{
        //console.log("onTabDragging")
        //console.log(msg)

        if(msg.tabDragging)
        {
            this.setState({
                tabDragging:
                {
                    status:true,
                    containerID:msg.containerID,
                    targetContainerID:0,
                    oldBoxID:msg.boxID,
                    newBoxID:msg.boxID,
                    oldSequenceNumber:msg.sequenceNumber,
                    newSequenceNumber:msg.sequenceNumber,
                    //newBoxPosition:null
                },
                needMousePos:true,
                shadowBox:msg,
                boxesState:this.setNewBoxZIndex(msg)
            })
        }
        else
        {
            // change the status of unit sequnce, possible scenarios:
            //
            // 1.no change : oldConID === newConID && oldSeqNum === newSeqNum
            // 2.the same container, shift to the last : oldConID === newConID && newSeqNum === -1
            // 3.the same container, shift with other unit : oldConID === newConID && oldSeqNum !== newSeqNum
            // 4.different container, place to the last : oldConID !== newConID && newSeqNum === -1
            // 5.different container, replace the place of other unit : oldConID !== newConID && newSeqNum !== -1
            // 6.place to an all new container (default is no show, toggle to showing) : newConID === -1
            //
            let output =[]

            if(this.state.tabDragging.oldBoxID === this.state.tabDragging.newBoxID && this.state.tabDragging.oldSequenceNumber === this.state.tabDragging.newSequenceNumber)
            {
                output = this.state.boxesState
            } 
            else if(this.state.tabDragging.oldBoxID === this.state.tabDragging.newBoxID && this.state.tabDragging.newSequenceNumber === -1)
            {

                //let index = this.state.tabDragging.oldBoxID-1
                let originContainerList = this.state.boxesState.find(box=>box.boxID === this.state.tabDragging.oldBoxID).containerList.cloneList()
                let containerIndex = this.state.tabDragging.oldSequenceNumber    
                originContainerList.shiftToLast(containerIndex)        

                let tempBoxArray = []
                this.state.boxesState.forEach(state=>{
                    if(state.boxID==this.state.tabDragging.oldBoxID)
                    {
                        let tempStateObj = {
                            boxID:state.boxID,
                            size:state.size,
                            position:state.position,
                            zIndex:state.zIndex,
                            showing:state.showing,
                            showingContainerSequence:originContainerList.length-1,
                            containerList:originContainerList
                        }
                        tempBoxArray.push(tempStateObj)
                    }
                    else
                    {
                        tempBoxArray.push(state)
                    }        
                })
                output = tempBoxArray
            }
            else if(this.state.tabDragging.oldBoxID === this.state.tabDragging.newBoxID && this.state.tabDragging.newSequenceNumber !== this.state.tabDragging.oldSequenceNumber && this.state.tabDragging.newSequenceNumber !== -1)
            {
                //console.log("drag CASE 3")
                let originContainerList = this.state.boxesState.find(box=>box.boxID === this.state.tabDragging.oldBoxID).containerList.cloneList()
                let showingContainerSequence
                //if(this.state.tabDragging.newSequenceNumber !== this.state.tabDragging.oldSequenceNumber +1)
                //{
                    let tempObj = originContainerList.getAt(this.state.tabDragging.oldSequenceNumber)
                    originContainerList.removeAt(this.state.tabDragging.oldSequenceNumber)
                    if(this.state.tabDragging.oldSequenceNumber>this.state.tabDragging.newSequenceNumber)
                    {
                        originContainerList.insertAt(tempObj,this.state.tabDragging.newSequenceNumber===0?0:this.state.tabDragging.newSequenceNumber)
                        showingContainerSequence = this.state.tabDragging.newSequenceNumber
                    }
                    else
                    {
                        originContainerList.insertAt(tempObj,this.state.tabDragging.newSequenceNumber-1<0?0:this.state.tabDragging.newSequenceNumber-1)
                        showingContainerSequence = this.state.tabDragging.newSequenceNumber-1
                    }

                    //originContainerList.shiftTo(this.state.tabDragging.oldSequenceNumber,this.state.tabDragging.newSequenceNumber-1 <0?0:this.state.tabDragging.newSequenceNumber-1)
                    //showingContainerSequence = this.state.tabDragging.newSequenceNumber
                //}
               
                
                let tempBoxArray = []
                this.state.boxesState.forEach(state=>{
                    if(state.boxID==this.state.tabDragging.oldBoxID)
                    {
                        let tempStateObj = {
                            boxID:state.boxID,
                            size:state.size,
                            position:state.position,
                            zIndex:state.zIndex,
                            showing:state.showing,
                            showingContainerSequence:showingContainerSequence,
                            containerList:originContainerList
                        }
                        tempBoxArray.push(tempStateObj)
                    }
                    else
                    {
                        tempBoxArray.push(state)
                    }        
                })

                output = tempBoxArray

            }
            else if(this.state.tabDragging.oldBoxID !== this.state.tabDragging.newBoxID && this.state.tabDragging.newBoxID !== -1 && this.state.tabDragging.newSequenceNumber === -1)
            {
                let originContainerList = this.state.boxesState.find(box=>box.boxID === this.state.tabDragging.oldBoxID).containerList.cloneList()
                let newContainerList = this.state.boxesState.find(box=>box.boxID === this.state.tabDragging.newBoxID).containerList.cloneList()
                
                let newBoxZIndex = this.state.boxesState.find(box=>box.boxID === this.state.tabDragging.newBoxID).zIndex

                let tempData = originContainerList.getAt(this.state.tabDragging.oldSequenceNumber)
                originContainerList.removeAt(this.state.tabDragging.oldSequenceNumber)
                newContainerList.insertLast(tempData)

                let tempBoxArray = []
                this.state.boxesState.forEach(state=>{
                    if(state.boxID==this.state.tabDragging.oldBoxID)
                    {
                        let tempStateObj = {
                            boxID:state.boxID,
                            size:state.size,
                            position:state.position,
                            zIndex:state.zIndex-1,
                            showing:originContainerList.head?true:false,
                            showingContainerSequence:this.state.tabDragging.oldSequenceNumber>originContainerList.length-1?this.state.tabDragging.oldSequenceNumber-1:this.state.tabDragging.oldSequenceNumber,
                            containerList:originContainerList
                        }
                        tempBoxArray.push(tempStateObj)
                    }
                    else if(state.boxID==this.state.tabDragging.newBoxID)
                    {
                        let tempStateObj = {
                            boxID:state.boxID,
                            size:state.size,
                            position:state.position,
                            zIndex:this.state.boxesState.length,
                            showing:state.showing,
                            showingContainerSequence:newContainerList.length-1,
                            containerList:newContainerList
                        }
                        tempBoxArray.push(tempStateObj)
                    }       
                    else
                    {
                        let tempStateObj = {}
                        if(state.zIndex > newBoxZIndex )
                        {
                            tempStateObj = {
                                boxID:state.boxID,
                                size:state.size,
                                position:state.position,
                                zIndex:state.zIndex-1,
                                showing:state.showing,
                                showingContainerSequence:state.showingContainerSequence,
                                containerList:state.containerList
                            }
                        }
                        else
                        {
                            tempStateObj = state
                        }
                        tempBoxArray.push(tempStateObj)
                    }        
                })
                output = tempBoxArray
            }
            else if(this.state.tabDragging.oldBoxID !== this.state.tabDragging.newBoxID && this.state.tabDragging.newBoxID !== -1 && this.state.tabDragging.newSequenceNumber !== -1)
            {
                let originContainerList = this.state.boxesState.find(box=>box.boxID === this.state.tabDragging.oldBoxID).containerList.cloneList()
                let newContainerList = this.state.boxesState.find(box=>box.boxID === this.state.tabDragging.newBoxID).containerList.cloneList()

                let newBoxZIndex = this.state.boxesState.find(box=>box.boxID === this.state.tabDragging.newBoxID)

                let tempData = originContainerList.getAt(this.state.tabDragging.oldSequenceNumber)
                originContainerList.removeAt(this.state.tabDragging.oldSequenceNumber)

                newContainerList.insertAt(tempData,this.state.tabDragging.newSequenceNumber)

                let tempBoxArray = []
                this.state.boxesState.forEach(state=>{
                    if(state.boxID==this.state.tabDragging.oldBoxID)
                    { 
                        let tempStateObj = {
                            boxID:state.boxID,
                            size:state.size,
                            position:state.position,
                            zIndex:state.zIndex-1,
                            showing:originContainerList.head?true:false,
                            showingContainerSequence:this.state.tabDragging.oldSequenceNumber>originContainerList.length-1?this.state.tabDragging.oldSequenceNumber-1:this.state.tabDragging.oldSequenceNumber,
                            containerList:originContainerList
                        }
                        tempBoxArray.push(tempStateObj)
                    }
                    else if(state.boxID==this.state.tabDragging.newBoxID)
                    {
                        
                        let tempStateObj = {
                            boxID:state.boxID,
                            size:state.size,
                            position:state.position,
                            zIndex:this.state.boxesState.length,
                            showing:true,
                            showingContainerSequence:this.state.tabDragging.newSequenceNumber,
                            containerList:newContainerList
                        }
                        tempBoxArray.push(tempStateObj)
                    }       
                    else
                    {
                        let tempStateObj = {}
                        if(state.zIndex > newBoxZIndex )
                        {
                            tempStateObj = {
                                boxID:state.boxID,
                                size:state.size,
                                position:state.position,
                                zIndex:state.zIndex-1,
                                showing:state.showing,
                                showingContainerSequence:state.showingContainerSequence,
                                containerList:state.containerList
                            }
                        }
                        else
                        {
                            tempStateObj = state
                        }
                        tempBoxArray.push(tempStateObj)
                    }        
                })
                output = tempBoxArray
            }
            else if(this.state.tabDragging.newBoxID === -1)
            {       
                //console.log('open new container')
                let validBox
                let resultFirst = this.state.boxesState.find(state=>state.showing === false && state.containerList.length === 0)
                let resultSecond = this.state.boxesState.find(state=>state.showing === false)
                //console.log(validBox)
                if(resultSecond === undefined || resultSecond === null)
                {                 
                    output = this.state.boxesState
                }
                else
                { 
                    if(resultFirst === undefined || resultFirst === null)
                    {
                        validBox = resultSecond
                    }
                    else
                    {
                        validBox = resultFirst
                    }

                    let validBoxID = validBox.boxID
                    let originContainerList = this.state.boxesState.find(box=>box.boxID === this.state.tabDragging.oldBoxID).containerList.cloneList()
                    let newContainerList = validBox.containerList.cloneList()
                    
                    let newBoxZIndex = validBox.zIndex

                    let tempData = originContainerList.getAt(this.state.tabDragging.oldSequenceNumber)
                    originContainerList.removeAt(this.state.tabDragging.oldSequenceNumber)
                    newContainerList.insertLast(tempData)


                    if(originContainerList.head)
                    {

                        let tempBoxArray = []
                        this.state.boxesState.map(state=>{
                            if(state.boxID===this.state.tabDragging.oldBoxID)
                            { 

        
                                let tempStateObj = {
                                    boxID:state.boxID,
                                    size:state.size,
                                    position:state.position,
                                    zIndex:state.zIndex-1,
                                    showing:true,
                                    showingContainerSequence:this.state.tabDragging.oldSequenceNumber>originContainerList.length-1?this.state.tabDragging.oldSequenceNumber-1:this.state.tabDragging.oldSequenceNumber,
                                    containerList:originContainerList
                                }
                                tempBoxArray.push(tempStateObj)
                            }
                            else if(state.boxID===validBoxID)
                            {


                                let offset = {x:this.refLayout.getBoundingClientRect().left, y:this.refLayout.getBoundingClientRect().top}
                                let layoutSize = {width:this.refLayout.offsetWidth, height:this.refLayout.offsetHeight}
                                
                                let tempStateObj = {
                                    boxID:state.boxID,
                                    size:msg.divSize,
                                    position:this.verifyOpenBoxPos(msg.pos,msg.divSize,offset,layoutSize),
                                    zIndex:this.state.boxesState.length,
                                    showing:true,
                                    showingContainerSequence:newContainerList.length-1,
                                    containerList:newContainerList
                                }
                                tempBoxArray.push(tempStateObj)
                            }       
                            else
                            {
                                let tempStateObj = {}
                                if(state.zIndex > newBoxZIndex)
                                {
                                    tempStateObj = {
                                        boxID:state.boxID,
                                        size:state.size,
                                        position:state.position,
                                        zIndex:state.zIndex-1,
                                        showing:state.showing,
                                        showingContainerSequence:state.showingContainerSequence,
                                        containerList:state.containerList
                                    }
                                }
                                else
                                {
                                    tempStateObj = state
                                }
                                tempBoxArray.push(tempStateObj)
                            }        
                        })
                        output = tempBoxArray
                    }
                    else
                    {
                        output = this.state.boxesState
                    }
                }
            }

            else
            {
                output = this.state.boxesState
            }
          
            this.setState({
                tabDragging: {
                    status:false,
                    targetContainerID:0,
                    containerID:0,
                    oldBoxID:0,
                    newBoxID:0,
                    oldSequenceNumber:-1,
                    newSequenceNumber:-1,
                },
                needMousePos:false,
                shadowContainer:{},
                mousePos:{
                    x:0,
                    y:0
                },
                boxesState:output
            },()=>{
                if(this.props.getBoxesState)
                {
                    this.props.getBoxesState(this.outputBoxState())
                }
            })
        }
    }

    verifyOpenBoxPos = (msgPos,divSize,offset,layoutSize) => {
        let boxX = msgPos.x
        let boxY = msgPos.y
        
        if(boxX < offset.x)
        {
            boxX = offset.x    
        }
        else if(boxX + divSize.width > layoutSize.width + offset.x)
        {        
            boxX = layoutSize.width + offset.x - divSize.width      
        }

        if(boxY < offset.y)
        {
            boxY = offset.y
        }
        else if(boxY + divSize.height > layoutSize.height + offset.y)
        {
            boxY = layoutSize.height + offset.y - divSize.height
        }

        let newPos = {
            x:boxX,
            y:boxY
        }

        return newPos
    }

    tabNewBoxID = (msg) =>{
        //console.log('ControllerUnitLayout tabNewConID')
        //console.log(this.state.tabDragging.newSequenceNumber)
        let tempNewSeqNum = -1
        let tempNewBoxID = -1
        if(msg.enterHeader)
        {
            tempNewSeqNum = -1
            tempNewBoxID = msg.newBoxID
        }
        else
        {
            tempNewSeqNum = this.state.tabDragging.oldSequenceNumber
            tempNewBoxID = this.state.tabDragging.oldBoxID
        }

        this.setState({
            tabDragging: {
                status:true,
                targetContainerID:0,
                containerID:this.state.tabDragging.containerID,
                oldBoxID:this.state.tabDragging.oldBoxID,
                newBoxID:tempNewBoxID,
                oldSequenceNumber:this.state.tabDragging.oldSequenceNumber,
                newSequenceNumber:tempNewSeqNum,
            }
        }, ()=>{
            //console.log('ControllerUnitLayout tabNewConID setState Finished')
        })
    }

    getTabNewSequenceNumber=(msg)=>{
        //console.log('ControllerUnitLayout getTabNewSequenceNumber')
        //console.log(msg.newSequenceNumber)
        if(msg.tabChangeSequence)
        {
            this.setState({
                tabDragging: {
                    status:true,
                    targetContainerID:msg.containerID,
                    containerID:this.state.tabDragging.containerID,
                    oldBoxID:this.state.tabDragging.oldBoxID,
                    newBoxID:msg.newBoxID,
                    oldSequenceNumber:this.state.tabDragging.oldSequenceNumber,
                    newSequenceNumber:msg.newSequenceNumber,
                }
                },()=>{
            //console.log('ControllerUnitLayout getTabNewSequenceNumber setState Finished')
            })
        //console.log(this.state.tabDragging.newSequenceNumber)
        }
        else
        {
            if(msg.containerID===this.state.tabDragging.targetContainerID)
            {
                this.setState({
                    tabDragging: {
                        status:true,
                        targetContainerID:0,
                        containerID:this.state.tabDragging.containerID,
                        oldBoxID:this.state.tabDragging.oldBoxID,
                        newBoxID:this.state.tabDragging.oldBoxID,
                        //newConID:msg.newConID,
                        oldSequenceNumber:this.state.tabDragging.oldSequenceNumber,
                        newSequenceNumber:this.state.tabDragging.oldSequenceNumber
                        //newSequenceNumber:-1,
                    }
                    },()=>{
                //console.log('ControllerUnitLayout getTabNewSequenceNumber setState Finished')
                })
            }
        }
    }

    outputBoxState=()=>{
        let output = this.state.boxesState.map(box=>{
            let containerArray = box.containerList.turnArray()
            let outputBox = {
                boxID:box.boxID,
                position:box.position,
                size:box.size,
                zIndex:box.zIndex,
                showingContainerIndex:box.showingContainerSequence,
                showing:box.showing,
                containerArray:containerArray
            }

            return outputBox
        })
        return output
    }

    boxOnClick=(msg)=>{
        this.setState({
            boxesState:this.setNewBoxZIndex(msg)
        })   
    }

    openContainer=(containerIDArray)=>{
        //console.log("DnDLayout openContainer : ",containerIDArray)
        if(this.state.boxesState && this.state.boxesState.length >0 && Array.isArray(containerIDArray) && containerIDArray.length >0)
        {
            let targetSet = new Set(containerIDArray)
            let output = []
            this.state.boxesState.forEach(box=>{
               let token = false
               
            })

            this.setState({
                boxesState:output
            })
        }
    }

    createBox=()=>{
        //console.log("DnDLayout createBox")
        if(this.state.boxesState && this.state.boxesState.length >0)
        {
            let offset = {x:this.refLayout.getBoundingClientRect().left, y:this.refLayout.getBoundingClientRect().top}
            let layoutSize = {width:this.refLayout.offsetWidth, height:this.refLayout.offsetHeight}
            let boxCssSetting = this.verifyBoxCss()

            return (
                this.state.boxesState.map(box=>box.showing?
                    (<DnDBox key={box.boxID} boxID={box.boxID} initialPos={box.position} mousePos={this.state.mousePos} size={box.size} boxCssSetting={boxCssSetting} containerList={box.containerList} showingContainerSequence={box.showingContainerSequence} offset={offset} layoutSize={layoutSize} scrollPos={this.state.scrollPos} zIndex={box.zIndex} boxShowing={box.showing} anyBoxDragging={this.state.boxDragging.status && this.state.boxDragging.boxID !== box.boxID?true:false} boxDragging={this.onBoxDragging} boxExtending={this.onBoxExtending} onTabDragging={this.onTabDragging} tabDraggingBooling={this.state.tabDragging.status} getTabNewSequenceNumber={this.getTabNewSequenceNumber} tabNewBoxID={this.tabNewBoxID} boxOnClick={this.boxOnClick} boxHiding={this.boxHiding} boxTabHeight={this.verifyTabHeight()}>{this.updateChildren(box)}</DnDBox>)
                    :
                    null
                )
            )
        }
        else
        {
            return null
        }
    }

    updateChildren=(box)=>{
        let output = null
        let tempObj = box.containerList.getAt(box.showingContainerSequence)
        if(tempObj)
        {
            output = this.props.children.find(child=>
                child.type.name === "DnDContainer" && child.props.containerID === tempObj.containerID       
            )
        }
        else
        {
            output = null
        }
  
        return output
    }

    appendShadowDnDBox=()=>{
        if(this.state.tabDragging.status)
        {
            let boxCssSetting = this.verifyBoxCss()
            return(
                <ShadowDnDBox  boxSize={this.state.shadowBox.divSize} mousePos={this.state.mousePos} initialPos={this.state.shadowBox.refPos} tabPos={this.state.shadowBox.tabPos} offset={{'x':this.refLayout.getBoundingClientRect().left,'y':this.refLayout.getBoundingClientRect().top}} tabTitle={this.state.shadowBox.tabTitle} boxTabHeight={this.verifyTabHeight()} boxCssSetting={boxCssSetting} draggingMsg={this.onTabDragging}/>
            )
        }
        else
        {
            return("")
        }
    }

    getShowingContainer=(containerList, showingContainerSequence)=>{
        return containerList.getAt(showingContainerSequence)
    }

    boxHiding=(e)=>{
        let tempStateToken = []
        this.state.boxesState.forEach(box=>{
            let boxObj = box
            if(boxObj.boxID===e.boxID)
            {
                boxObj.showing = false
            }
            tempStateToken.push(boxObj)
        })

        this.setState({
            boxesState:tempStateToken
        })
    }

    containerShowing=(e)=>{
        //console.log("DnDLayout containerShowing")
        //console.log(e)
        let tempStateToken = this.state.boxesState
        let changeToken = false
        let boxesStateToken =[]

        
        if(typeof e === "string" || typeof e === "number")
        {
            this.state.boxesState.forEach(box=>{
                let boxObj = box
                //let result = box.containerList.findInList(container=>container.containerID===e)

                //console.log("result : ",result)
                if(box.containerList.findIndex(container=>container.containerID === e) !== -1)
                {
                    boxObj.showing = true
                    //boxObj.showing = e.showing
                }
                boxesStateToken.push(boxObj)
            })
                
        }
        else if(Array.isArray(e))
        {
            let set = new Set(e)
            this.state.boxesState.forEach(box=>{
                let boxObj = box
                if(box.containerList.findIndex(container=>set.has(container.containerID)) !== -1)
                {
                    boxObj.showing = true
                }
                boxesStateToken.push(boxObj)
            })   
        }
    }

    appendBackgroundDom=()=>{
        console.log(this.props.children)
        let dom = this.props.children.find(child=>child.props.dndType === "DnDBackground")
        if(dom)
        {
            console.log("A1")
            return <React.Fragment>{dom.props.children}</React.Fragment>
        }
        else
        {
            console.log("A2")
            return null
        }
    }

    //The reason that get mouse position (x,y) from mouseMove event of Layout but not from individual Box => to deal with the issue that moving mouse fast and big, the pointer may out the range of Box.
    //But beware of the unnecessary re-render of other Box element


    //取得滑鼠座標的事件放在 Layout 上而不是放在各個 Box 上，是因為當滑鼠大幅度快速滑動時，指標很有可能一下超出 Box 的範圍，而使拖曳動作不順。
    //放在 Layout 上，須注意非作用 Box 的無必要 re-render 問題。

    onMouseMove=(e)=>{
        if(this.state.needMousePos)
        {
            //console.log('x : ',e.clientX, ' y : ',e.clientY)
            let tempX = e.clientX-this.refLayout.getBoundingClientRect().left
            let tempY = e.clientY-this.refLayout.getBoundingClientRect().top
            
            this.setState({
                mousePos:{
                    x:tempX < 0 ? 0: tempX,
                    y:tempY < 0 ? 0: tempY
                }
            })
        }
    }

    onScroll=()=>{
        let scrollX = this.refScroll.scrollTop
        let scrollY = this.refScroll.scrollLeft

        this.setState({
            scrollPos:{
                x:scrollX,
                y:scrollY
            }
        })
    }

    onDragEnter=(e)=>{
        e.stopPropagation()
        e.preventDefault()
        //console.log('layer drag enter')
        
        if(this.state.tabDragging.status)
        {
            
            let newState = {
                status:true,
                targetContainerID:this.state.tabDragging.targetContainerID,
                containerID:this.state.tabDragging.containerID,
                oldBoxID:this.state.tabDragging.oldBoxID,
                newBoxID:-1,
                oldSequenceNumber:this.state.tabDragging.oldSequenceNumber,
                newSequenceNumber:this.state.tabDragging.newSequenceNumber,
            }

            this.setState({
                tabDragging:newState,
                tempToken:this.state.tempToken++
            })
        }
    }

    onDragLeave=(e)=>{
        e.stopPropagation()
        e.preventDefault()
        //console.log('layer drag leave')
       
        if(this.state.tabDragging.status)
        {
            
            let newState = {
                status:true,
                targetContainerID:this.state.tabDragging.targeContainerID,
                containerID:this.state.tabDragging.containerID,
                oldBoxID:this.state.tabDragging.oldBoxID,
                newBoxID:this.state.tempToken === 0?this.state.tabDragging.newBoxID:-1,
                oldSequenceNumber:this.state.tabDragging.oldSequenceNumber,
                newSequenceNumber:this.state.tabDragging.newSequenceNumber,
            }

            this.setState({
                tabDragging:newState,
                tempToken:this.state.tempToken--
            })
        }
    }

    onDragOver=(e)=>{
        e.preventDefault()
        if(this.state.needMousePos)
        {
            this.setState({
              mousePos:{
                x:e.clientX-this.refLayout.getBoundingClientRect().left,
                y:e.clientY-this.refLayout.getBoundingClientRect().top
              }
            })    
        }
    }

    onDrop=(e)=>{
    }

    render(){
        console.log("DnDLayout render")
        const layoutStyle = {
            width:this.props.width?this.props.width:'100%',
            height:this.props.height?this.props.height:'100%',
            backgroundColor:this.props.backgroundColor?this.props.backgroundColor:"white",
            overflow:'hidden',
            position:this.props.position?this.props.position:"static"
        }

        return(
           
                <div style={layoutStyle} ref={(refLayout)=>{this.refLayout = refLayout}} onMouseMove={this.onMouseMove} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop} >
                    {this.appendShadowDnDBox()}
                    {this.appendBackgroundDom()}
                    {this.createBox()}
                </div>
           
        )
    }
}

export default DnDLayout