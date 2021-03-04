import React, { Component } from 'react';
import * as THREE from 'three';
import orbControls from './OrbitControls';
//import Stats from 'stats.js';
import {DnDContainer, DnDBackgroundComponent, DnDLayout} from 'dnd-box'
import OrbitControls from './OrbitControls';
import RotationMenu from './RotationMenu'
import SelectedObjInfo from './SelectedObjInfo'

class DemoApp extends Component{
    constructor(props) {
        super(props)
        this.state={
            frontViewSize:{
                w:null,
                h:null
            },
            sideViewSize:{
                w:null,
                h:null
            },
            topViewSize:{
                w:null,
                h:null
            },
            rotationMesh1:{
                x:0.01,
                y:0,
                z:0
            },
            rotationMesh2:{
                x:0,
                y:0.01,
                z:0
            },
            selectedObjInfo:{
                name:null,
                type:null,
                position:null,
                scale:null
            }
        }
    }

    componentDidMount(){     
        //this.deployState();
        const aspect = 1920 / 800;
		this.camera1 = new THREE.PerspectiveCamera( 
            100,
            aspect,
            0.1,
            1000 
        );	
		this.scene = new THREE.Scene();
        this.camera1.position.set( - 20, 20, 20 );
		this.scene.background = new THREE.Color( 0xf0f0f0 );
        this.createPlane(1, 20, 20,'chocolate',new THREE.Vector3( -20, 10, 0 ),new THREE.Euler( 0, - 90 * THREE.MathUtils.DEG2RAD, 0 ))
        this.createPlane(2, 10, 10,'chocolate',new THREE.Vector3( 20, 10, 0 ),new THREE.Euler( 0, - 90 * THREE.MathUtils.DEG2RAD, 0 ))
        this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( 1920, 800);
		this.mount.appendChild( this.renderer.domElement );
        this.sceneGrid = new THREE.GridHelper(50,50)
        this.scene.add(this.sceneGrid)

        

        this.camera2 = new THREE.PerspectiveCamera(
            70,
            200 /200,
            0.1,
            1000
        )
        this.camera2.position.z =20
        this.camera2.position.x =0
        this.camera2.position.y =1
        this.camera2.lookAt(0,0,0)
        this.renderer2 = new THREE.WebGLRenderer()
        this.renderer2.setClearColor(0xeeeeee, 1.0) 

        this.camera3 = new THREE.PerspectiveCamera(
            70,
            200 / 200,
            0.1,
            1000
        )
        this.camera3.position.z =0
        this.camera3.position.x =-20
        this.camera3.position.y =1
        this.camera3.lookAt(0,0,0)
        this.renderer3 = new THREE.WebGLRenderer()
        this.renderer3.setClearColor(0xeeeeee, 1.0)

        this.camera4 = new THREE.PerspectiveCamera(
            70,
            200 / 200,
            0.1,
            1000
        )
        this.camera4.position.z =0
        this.camera4.position.x =0
        this.camera4.position.y =20
        this.camera4.lookAt(0,0,0)
        this.renderer4 = new THREE.WebGLRenderer()
        this.renderer4.setClearColor(0xeeeeee, 1.0)

        this.cameraControl1 = new orbControls(this.camera1,this.renderer.domElement)
        this.animate()
    }

    componentDidUpdate(preProps, preState){
        if(preState.frontViewSize !== this.state.frontViewSize && this.frontView)
        {
            this.resizeFrontView()
        }

        if(preState.sideViewSize !== this.state.sideViewSize && this.sideView)
        {
            this.resizeSideView()
        }

        if(preState.topViewSize !== this.state.topViewSize && this.topView)
        {
            this.resizeTopView()
        }
    }

    componentWillUnmount() {
    }

    resizeFrontView=()=>{
        if(!this.cameraControl2)
        {
            this.cameraControl2 = new OrbitControls(this.camera2,this.renderer2.domElement)   
        }
        this.cameraControl2.enableRotate = false

        this.renderer2.setSize(this.state.frontViewSize.w-1, this.state.frontViewSize.h-1)
        this.frontView.appendChild( this.renderer2.domElement )

    }

    resizeSideView=()=>{
        if(!this.cameraControl3)
        {
            this.cameraControl3 = new OrbitControls(this.camera3,this.renderer3.domElement)   
        }
        this.cameraControl3.enableRotate = false
        this.renderer3.setSize(this.state.sideViewSize.w-1, this.state.sideViewSize.h-1)
        this.sideView.appendChild( this.renderer3.domElement )
    }

    resizeTopView=()=>{
        if(!this.cameraControl4)
        {
            this.cameraControl4 = new OrbitControls(this.camera4,this.renderer4.domElement)   
        }
        this.cameraControl4.enableRotate = false
        this.renderer4.setSize(this.state.topViewSize.w-1, this.state.topViewSize.h-1)
        this.topView.appendChild( this.renderer4.domElement )
    }

    // deployState = () => {
    //     this.stats = new Stats()
    //     this.stats.setMode(0)
    //     this.stats.domElement.style.position = 'absolute'  
    //     this.mainBody.appendChild(this.stats.domElement)
    // }

    animate=()=>{
        if(this.frontView)
        {
            if(this.frontView.clientWidth !== this.state.frontViewSize.w || this.frontView.clientHeight !== this.state.frontViewSize.h)
            {
                this.setState({
                    frontViewSize:{
                        w:this.frontView.clientWidth,
                        h:this.frontView.clientHeight
                    }
                })
            }
        }
        else
        {
            if(this.state.frontViewSize.w || this.state.frontViewSize.h)
            {
                this.setState({
                    frontViewSize:{
                        w:null,
                        h:null
                    }
                })
            }
        }

        if(this.sideView)
        {
            if(this.sideView.clientWidth !== this.state.sideViewSize.w || this.sideView.clientHeight !== this.state.sideViewSize.h)
            {
                this.setState({
                    sideViewSize:{
                        w:this.sideView.clientWidth,
                        h:this.sideView.clientHeight
                    }
                })
            }
        }
        else
        {
            if(this.state.sideViewSize.w || this.state.sideViewSize.h)
            {
                this.setState({
                    sideViewSize:{
                        w:null,
                        h:null
                    }
                })
            }
        }

        if(this.topView)
        {
            if(this.topView.clientWidth !== this.state.topViewSize.w || this.topView.clientHeight !== this.state.topViewSize.h)
            {
                this.setState({
                    topViewSize:{
                        w:this.topView.clientWidth,
                        h:this.topView.clientHeight
                    }
                })
            }
        }
        else
        {
            if(this.state.topViewSize.w || this.state.topViewSize.h)
            {
                this.setState({
                    topViewSize:{
                        w:null,
                        h:null
                    }
                })
            }
        }

        //this.stats.begin();
        this.renderer.render(this.scene, this.camera1)
        this.renderer2.render(this.scene, this.camera2)
        this.renderer3.render(this.scene, this.camera3)
        this.renderer4.render(this.scene, this.camera4)
        this.mesh1.rotation.x += this.state.rotationMesh1.x
        this.mesh1.rotation.y += this.state.rotationMesh1.y
        this.mesh1.rotation.z += this.state.rotationMesh1.z
        this.mesh2.rotation.x += this.state.rotationMesh2.x
        this.mesh2.rotation.y += this.state.rotationMesh2.y
        this.mesh2.rotation.z += this.state.rotationMesh2.z
        //this.stats.end();
        window.requestAnimationFrame(this.animate)
    }

    createPlane=(ID,width, height, cssColor, pos, rot)=>{   
        let material = new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide } );
        let geometry = new THREE.PlaneGeometry( width, height );
        switch(ID){
            case 1:
                this.mesh1 = new THREE.Mesh( geometry, material );
		        this.mesh1.position.copy( pos );
                this.mesh1.name = 'plain1'
		        this.scene.add( this.mesh1 );
                break
            case 2:
                this.mesh2 = new THREE.Mesh( geometry, material );
		        this.mesh2.position.copy( pos );
                this.mesh2.name = 'plain2'
		        this.scene.add( this.mesh2 );
                break
        }	
    }

    threeDLayerMouseDown=(e)=>{
        //e.preventDefault()
        //e.stopPropagation()
        let result = this.detectObjectSelectedOrNot(e)
        if(result && this.state.selectedObjInfo.name === result.name)
        {
            if(result.name === "plain1")
            {
                this.selectedObjectPaintedOrNot(this.mesh1,false)                
            }
            
        }
        else if(result && this.state.selectedObjInfo.name !== result.name)
        {
            if(result.name === "plain1")
            {
                this.selectedObjectPaintedOrNot(this.mesh1,true) 
                this.selectedObjectPaintedOrNot(this.mesh2,false)
            }
            else
            {
                this.selectedObjectPaintedOrNot(this.mesh1,false) 
                this.selectedObjectPaintedOrNot(this.mesh2,true)
            }

            let obj = {
                name:result.name,
                type:result.type,
                position:{
                    x:result.position.x,
                    y:result.position.y,
                    z:result.position.z
                },
                scale:{
                    width:result.geometry.parameters.width,
                    height:result.geometry.parameters.height,
                    depth:result.geometry.parameters.depth?result.geometry.parameters.depth:0
                }
            }
            
            this.setState({
                selectedObjInfo:obj
            })         
        }
        else
        {
            let obj = {
                name:null,
                type:null,
                position:null,
                scale:null
            }

            this.setState({
                selectedObjInfo:obj
            })
        }
        console.log(result)
    }

    detectObjectSelectedOrNot=(e)=>{
        const rayCaster = new THREE.Raycaster()
        const mouseToken = new THREE.Vector2()
        this.rect = this.mount.getBoundingClientRect()
        mouseToken.x = ((e.clientX-this.rect.left)/this.mount.clientWidth)*2-1
        mouseToken.y = -((e.clientY-this.rect.top)/this.mount.clientHeight)*2+1
        rayCaster.setFromCamera(mouseToken, this.camera1)
    
        let intersects = rayCaster.intersectObjects(this.scene.children)
        
        if(intersects.length>0)
        {
            for(var i =0; i <intersects.length; i++)
            {
                if(intersects[i].object.type == 'Mesh')
                {
                    return intersects[i].object
                }   
            }
        }
        else
        {
            return null
        }
    }

    selectedObjectPaintedOrNot(object3D,toggle)
    {
        if(toggle)
        {
            object3D.material.color.set(0x13D73F)
        }
        else
        {
            object3D.material.color.set(0x0000ff)
        }
    }

    sideOnClick=()=>{
        console.log("frontView be clicked !")
    }

    getBoxesState=(msg)=>{
        if(this.frontView)
        {
            this.resizeFrontView()
        }
    }

    returnRotation=(msg)=>{
        switch(msg.ID){
            case 1 :
                if(this.state.rotationMesh1 !== msg.values)
                {
                    this.setState({
                        rotationMesh1:msg.values
                    })
                }
                break
            case 2 :
                if(this.state.rotationMesh2 !== msg.values)
                {
                    this.setState({
                        rotationMesh2:msg.values
                    })
                }
                break
        }
    }

    render(){
       
        console.log("DemoApp render")
        console.log(this.state.selectedObjInfo)
        let boxesSetting=[
            {
                boxID:'A',
                width:200,
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
                boxID:'E',
                width:200,
                height:200,
                x:800,
                y:100
            }
        ]

        return(
            <div ref={(mainBody)=>{this.mainBody = mainBody}} style={{border:"1px solid black"}}  onMouseDown={this.threeDLayerMouseDown}>
                <DnDLayout backgroundColor={'pink'} width={1920} height={800} boxColor={''} boxHeaderColor={''} boxTabColor={''} boxHeaderHoverColor={''} boxTabHoverColor={''} boxTabSelectedColor={''} iconHoverColor={''} boxTabRadius={'0px 10px 0px 0px'} boxesSetting={boxesSetting} openContainer={this.state.showContainer}  tabHeight={25} getBoxesState={this.getBoxesState}>
                    <DnDBackgroundComponent>
                        <div ref={(mount) => { this.mount = mount }}>
                        </div>
                    </DnDBackgroundComponent>
                    <DnDContainer containerTabTitle={"Front View"} containerID={1} boxID={'A'}>
                        <div style={{width:'100%',height:'100%',overflow:'hidden'}} ref={(frontView) => { this.frontView = frontView }}>
                        </div>
                    </DnDContainer>
                    <DnDContainer containerTabTitle={"Side View"} containerID={2} boxID={'B'}>
                        <div style={{width:'100%',height:'100%',overflow:'hidden'}} ref={(sideView) => { this.sideView = sideView }}>                                 
                        </div>
                    </DnDContainer>
                    <DnDContainer containerTabTitle={"Top View"} containerID={3} boxID={'C'}>
                        <div style={{width:'100%',height:'100%',overflow:'hidden'}} ref={(topView) => { this.topView = topView }}>                                 
                        </div>
                    </DnDContainer>
                    <DnDContainer containerTabTitle={"Rotation Speed"} containerID={3} boxID={'D'}>             
                        <RotationMenu rotationMesh1={this.state.rotationMesh1} rotationMesh2={this.state.rotationMesh2} returnRotation={this.returnRotation}/>          
                    </DnDContainer>
                    <DnDContainer containerTabTitle={"Obj Info"} containerID={5} boxID={'D'}>
                        <SelectedObjInfo selectedObjInfo={this.state.selectedObjInfo}/>
                    </DnDContainer>       
                </DnDLayout>               
            </div>
        )
    }
}
export default DemoApp