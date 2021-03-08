import React, { Component } from 'react';

class RotationMenu extends Component{
    constructor(props) {
        super(props)
        this.state={
            rotationMesh1:{
                x:null,
                y:null,
                z:null
            },
            rotationMesh2:{
                x:null,
                y:null,
                z:null
            }
        }    
    }

    componentDidMount(){   
       
    }

    componentDidUpdate(preProps, preState){
        
    }

    componentWillUnmount() {
    }

    getRotate=(ID,axis,e)=>{
        let obj = {
            ID:ID
        }

        switch(ID){
            case 1:
                obj['values'] = {
                    x:axis==='x'?Number(e.target.value)/100:this.props.rotationMesh1.x,
                    y:axis==='y'?Number(e.target.value)/100:this.props.rotationMesh1.y,
                    z:axis==='z'?Number(e.target.value)/100:this.props.rotationMesh1.z
                }
                this.setState({
                    rotationMesh1:obj.values
                })
                break
            case 2:
                obj['values'] = {
                    x:axis==='x'?Number(e.target.value)/100:this.props.rotationMesh2.x,
                    y:axis==='y'?Number(e.target.value)/100:this.props.rotationMesh2.y,
                    z:axis==='z'?Number(e.target.value)/100:this.props.rotationMesh2.z
                }
                this.setState({
                    rotationMesh2:obj.values
                })
                break
        }

        this.props.returnRotation(obj)
    }

    render(){
        let mainDivStyle = {
            width:250,
            height:200
        }
      
        return(
            <div style={mainDivStyle}>
                <div style={{padding:10,backgroundColor:"#c1e6e8"}}>Plain1 Rotation Control</div>
                <div style={{display:"flex",backgroundColor:"#93d5d9"}}>
                    <div style={{padding:5}}>X</div>
                    <div style={{padding:5,width:40}}>{this.state.rotationMesh1.x?this.state.rotationMesh1.x:this.props.rotationMesh1.x}</div>
                    <input style={{padding:5}} type="range" step="1" min="0" max="100" onChange={(e)=>this.getRotate(1,'x',e)} defaultValue={this.props.rotationMesh1.x}  />
                </div>
                <div style={{display:"flex",backgroundColor:"#93d5d9"}}>
                    <div style={{padding:5}}>Y</div>
                    <div style={{padding:5,width:40}}>{this.state.rotationMesh1.y?this.state.rotationMesh1.y:this.props.rotationMesh1.y}</div>
                    <input style={{padding:5}} type="range" step="1" min="0" max="100" onChange={(e)=>this.getRotate(1,'y',e)} defaultValue={this.props.rotationMesh1.y}  />
                </div>
                <div style={{display:"flex",backgroundColor:"#93d5d9"}}>
                    <div style={{padding:5}}>Z</div>
                    <div style={{padding:5,width:40}}>{this.state.rotationMesh1.z?this.state.rotationMesh1.z:this.props.rotationMesh1.z}</div>
                    <input style={{padding:5}} type="range" step="1" min="0" max="100" onChange={(e)=>this.getRotate(1,'z',e)} defaultValue={this.props.rotationMesh1.z}  />
                </div>
                <div style={{padding:10,backgroundColor:"#c1e6e8"}}>Plain2 Rotation Control</div>
                <div style={{display:"flex",backgroundColor:"#93d5d9"}}>
                    <div style={{padding:5}}>X</div>
                    <div style={{padding:5,width:40}}>{this.state.rotationMesh2.x?this.state.rotationMesh2.x:this.props.rotationMesh2.x}</div>
                    <input style={{padding:5}} type="range" step="1" min="0" max="100" onChange={(e)=>this.getRotate(2,'x',e)} defaultValue={this.props.rotationMesh2.x}  />
                </div>
                <div style={{display:"flex",backgroundColor:"#93d5d9"}}>
                    <div style={{padding:5}}>Y</div>
                    <div style={{padding:5,width:40}}>{this.state.rotationMesh2.y?this.state.rotationMesh2.y:this.props.rotationMesh2.y}</div>
                    <input style={{padding:5}} type="range" step="1" min="0" max="100" onChange={(e)=>this.getRotate(2,'y',e)} defaultValue={this.props.rotationMesh2.y}  />
                </div>
                <div style={{display:"flex",backgroundColor:"#93d5d9"}}>
                    <div style={{padding:5}}>Z</div>
                    <div style={{padding:5,width:40}}>{this.state.rotationMesh2.z?this.state.rotationMesh2.z:this.props.rotationMesh2.z}</div>
                    <input style={{padding:5}} type="range" step="1" min="0" max="100" onChange={(e)=>this.getRotate(2,'z',e)} defaultValue={this.props.rotationMesh2.z}  />
                </div>
            </div>
        )
    }
}
export default RotationMenu