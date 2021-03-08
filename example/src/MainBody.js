import React,{Component} from "react";
import { DnDContainer, DnDBackgroundComponent, DnDLayout } from 'dnd-box'
import './MainBody.css'

class MainBody extends Component {
    constructor(props){
        super(props)
        this.state={
            showContainer:null,
            testToggle:false,
            testAreaToggle:false,
            scrollPosition:{
                x:0,
                y:0
            }
        }
    }

    componentDidMount(){
        
    }

    showContainerClick=()=>{
        console.log("click event !")
        this.setState({
            showContainer:[1,2,3,4,5]
        },()=>{
            this.setState({
                showContainer:null
            })
        })
    }

    toggleDnDLayoutClick=()=>{
        console.log("click event !")
        this.setState({
            testToggle:!this.state.testToggle
        })
    }

    getTestCountNumber=(m)=>{
        console.log('MainBody get Count Number : ',m.x,':',m.y)
    }

    resetOpenBox=()=>{
        this.setState({
            showContainer:null
        })
    }

    getBoxesState=(msg)=>{
        console.log(msg)
    }

    onScroll=()=>{
        this.setState({
            scrollPosition:{
                x:this.refDom.scrollLeft,
                y:this.refDom.scrollTop
            }
        })
    }

    testOnClick=()=>{
        this.setState({
            testAreaToggle:!this.state.testAreaToggle
        })
    }

    render(){
        let boxesSetting=[
            {
                boxID:'A',
                width:'200px',
                height:200,
                x:0,
                y:100
            },
            {
                boxID:'B',
                width:200,
                height:200,
                x:200,
                y:100
            },
            {
                boxID:'C',
                width:200,
                height:200,
                x:400,
                y:100
            },
            {
                boxID:'D',
                width:200,
                height:200,
                x:600,
                y:100
            },
            {
                boxID:'D',
                width:200,
                height:200,
                x:800,
                y:100
            }
        ]

        let outsideAreaStyle = {
            display:'flex',
            width:'100%',
            
        }

        return(
            <div >
                <div style={outsideAreaStyle}>
                    <button style={{margin:20 ,widht:100,height:50,backgroundColor:"gray"}} onClick={this.showContainerClick}>{"Show All DnDContainer"}</button>
                    <button style={{margin:20, widht:100,height:50,backgroundColor:"gray"}} onClick={this.toggleDnDLayoutClick}>{"Toggle DnDLayout"}</button>
                </div>
                {
                    this.state.testToggle?
                    <div style={{display:'flex', width:1900, height:800}} ref={(refDom)=>{this.refDom = refDom}}>
                    
                    <DnDLayout backgroundColor={'pink'} width={1900} height={800} boxColor={''} boxHeaderColor={''} boxTabColor={''} boxHeaderHoverColor={''} boxTabHoverColor={''} boxTabSelectedColor={''} iconHoverColor={''} boxTabRadius={'0px 10px 0px 0px'} boxesSetting={boxesSetting} openContainer={this.state.showContainer} getBoxesState={this.getBoxesState} tabHeight={25}>
                        <DnDBackgroundComponent>
                            <div style={{width:400, height:200, backgroundColor:this.state.testAreaToggle?"yellow":"blue"}} onClick={this.testOnClick}>
                                {"Test Area"}
                            </div>
                        </DnDBackgroundComponent>
                        <DnDContainer containerTabTitle={"TabA"} containerID={1} boxID={'A'}>
                            {"TEST A Container"}
                        </DnDContainer>
                        <DnDContainer containerTabTitle={"TabB"} containerID={2} >
                            <div className="temp1">
                                {"GrandChildrenB"}
                            </div>
                        </DnDContainer>
                        <DnDContainer containerTabTitle={"TabC"} containerID={3} >
                            <div className="temp1">
                                {"GrandChildrenC"}
                            </div>
                        </DnDContainer>
                        <DnDContainer containerTabTitle={"TabDeluxEdition"} containerID={4} boxID={'C'}>
                            <div className="temp1">
                                {"GrandChildrenD"}
                            </div>
                        </DnDContainer>
                        <DnDContainer containerTabTitle={"TabE"} containerID={5} boxID={'B'}>
                            <div className="temp1">
                                {"GrandChildrenE"}
                            </div>
                        </DnDContainer>
                    </DnDLayout>
                    
                    </div>
                    :null
                }
            </div>
        )
    }
}

export default MainBody