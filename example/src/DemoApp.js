import React, { Component } from 'react';
import * as THREE from 'three';
import orbControls from './OrbitControls';
//import Stats from 'stats.js';
import {DnDContainer, DnDBackgroundComponent, DnDLayout} from 'dnd-box'

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
        this.createPlane(20, 20,'chocolate',new THREE.Vector3( 0, 10, 0 ),new THREE.Euler( 0, - 90 * THREE.MathUtils.DEG2RAD, 0 ))
        this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( 1920, 800);
		this.mount.appendChild( this.renderer.domElement );
        this.sceneGrid = new THREE.GridHelper(50,50)
        this.scene.add(this.sceneGrid)

        

        this.camera2 = new THREE.PerspectiveCamera(
            70,
            200 /200,
            //this.frontView.clientWidth / this.frontView.clientHeight,
            0.1,
            1000
        )
        this.camera2.position.z =20
        this.camera2.position.x =0
        this.camera2.position.y =1
        this.camera2.lookAt(0,0,0)
        this.renderer2 = new THREE.WebGLRenderer()
        this.renderer2.setClearColor(0xeeeeee, 1.0) 
        //this.renderer2.setSize(this.frontView.clientWidth, this.frontView.clientHeight);
        //this.frontView.appendChild( this.renderer2.domElement );


        //this.orbitControlSet()
        this.animate()
        
    }

    componentDidUpdate(preProps, preState){
        if(preState.frontViewSize !== this.state.frontViewSize && this.frontView)
        {
            //console.log(this.frontView.parentElement)
            //this.renderer2.setSize(this.state.frontViewSize.w-1, this.state.frontViewSize.h-1)
            //this.frontView.appendChild( this.renderer2.domElement )
            this.resizeFrontView()
        }
    }

    componentWillUnmount() {
    }

    // deployState = () => {
    //     this.stats = new Stats()
    //     this.stats.setMode(0)
    //     this.stats.domElement.style.position = 'absolute'  
    //     this.mainBody.appendChild(this.stats.domElement)     
    // }

    resizeFrontView=()=>{
        this.renderer2.setSize(this.state.frontViewSize.w-1, this.state.frontViewSize.h-1)
        this.frontView.appendChild( this.renderer2.domElement )
    }

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
            this.setState({
                frontViewSize:{
                    w:null,
                    h:null
                }
            })
        }

        //this.stats.begin();
        this.renderer.render(this.scene, this.camera1)
        this.renderer2.render(this.scene, this.camera2)
        this.mesh.rotation.x += 0.01
        //this.stats.end();
        window.requestAnimationFrame(this.animate)
    }

    orbitControlSet = () => {
        this.cameraControl = new orbControls(this.camera1)
    }

    createPlane=(width, height, cssColor, pos, rot)=>{   
        const material = new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide } );

		const geometry = new THREE.PlaneGeometry( width, height );
		this.mesh = new THREE.Mesh( geometry, material );
		this.mesh.position.copy( pos );
		this.scene.add( this.mesh );
    }

    onClick=()=>{
        console.log("THREE Scene be clicked !")
        this.setState({
            testCount:this.state.testCount + 1
        })
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

    render(){
        console.log("DemoApp render")
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
            <div ref={(mainBody)=>{this.mainBody = mainBody}} style={{border:"1px solid black"}}>
                <DnDLayout backgroundColor={'pink'} width={1920} height={800} boxColor={''} boxHeaderColor={''} boxTabColor={''} boxHeaderHoverColor={''} boxTabHoverColor={''} boxTabSelectedColor={''} iconHoverColor={''} boxTabRadius={'0px 10px 0px 0px'} boxesSetting={boxesSetting} openContainer={this.state.showContainer}  tabHeight={25} getBoxesState={this.getBoxesState}>
                    <DnDBackgroundComponent>
                        <div onClick={this.onClick} ref={(mount) => { this.mount = mount }}>
                        </div>
                    </DnDBackgroundComponent>
                    <DnDContainer containerTabTitle={"Front View"} containerID={1} boxID={'A'}>
                        <div style={{width:'100%',height:'100%',overflow:'hidden'}} ref={(frontView) => { this.frontView = frontView }}>
                        </div>
                    </DnDContainer>
                    <DnDContainer containerTabTitle={"Side View"} containerID={2} boxID={'B'}>
                        <div ref={(sideView) => { this.sideView = sideView }}>              
                            {"side view"}                   
                        </div>
                    </DnDContainer>
                    <DnDContainer containerTabTitle={"Top View"} containerID={3} boxID={'C'}>
                        <div>
                            {"top view"}
                        </div>
                    </DnDContainer>
                    <DnDContainer containerTabTitle={"Rotation Speed"} containerID={3} boxID={'D'}>
                        <div>
                            {"rotation speed"}
                        </div>
                    </DnDContainer>
                    <DnDContainer containerTabTitle={"Obj Info"} containerID={5} boxID={'D'}>
                        <div>
                            {"info"}
                        </div>
                    </DnDContainer>
                
                </DnDLayout>
            </div>
        )
    }
}
export default DemoApp