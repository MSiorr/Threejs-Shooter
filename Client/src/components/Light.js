import { Object3D, PointLight, Mesh, SphereGeometry, MeshBasicMaterial, SpriteMaterial, TextureLoader, AdditiveBlending } from 'three';
import fireTex from '../assets/fire.png';

import Particle from './Particle';

import settings from './Settings';

export default class Light extends Object3D{
    constructor(levelContainer){
        super()
        this.levelContainer = levelContainer;
        this.particleMaterial = new SpriteMaterial({
            color: 0xb33d12,
            map: new TextureLoader().load(fireTex),
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: AdditiveBlending
        })

        this.lightPower = 0.5;
        this.light = new PointLight(0xff6b05, this.lightPower, 374);
        this.light.shadow.bias = 0.0001;
        // this.light = new PointLight(0xffc78a, this.lightPower, 400);
        this.light.castShadow = true

        this.scale.set(5,5,5);

        this.particlesCount = 100,
        this.particlesList = []

        this.squareSize = settings.squareSize;

        this.Init()
    }
    Init(){
        for(let i = 0; i < this.particlesCount; i++){
            let particle = new Particle(this.particleMaterial)
            this.add(particle)
            this.particlesList.push(particle);
        }
    }

    update(gui){
        this.particlesList.forEach( e => {
            e.update(gui);
        })
    }

    CreateLight(x, y, z, centerOffset){
        let xPos = x * this.squareSize - centerOffset + (this.squareSize / 2);
        let yPos = (y * this.squareSize) + (0.05 * this.squareSize);
        let zPos = z * this.squareSize - centerOffset + (this.squareSize / 2);

        this.position.set(xPos, yPos, zPos)
        
        this.light.position.set(0, 0.1 * this.squareSize, 0);

        // this.light.shadow.camera.near = 0.5;
        // this.light.shadow.camera.far = (10 * this.squareSize) * Math.sqrt(2);

        
        this.add(this.light);
        this.levelContainer.add(this);
    }

    ChangeLightPower(power){
        if(this.light != null){
            this.light.intensity = power;
        }
    }

    ChangeShadowDisplay(bool){
        if(this.light != null){
            this.light.castShadow = bool;
        }
    }
}