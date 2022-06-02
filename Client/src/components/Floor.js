import { PlaneGeometry, TextureLoader, RepeatWrapping, MeshPhongMaterial, DoubleSide, Mesh } from 'three';

import settings from './Settings';
import floorTexture from '../materials/floor.png';
import floorColor from '../materials/floor_color.png';
import floorNormal from '../materials/floor_normal.png';
import floorRoughness from '../materials/floor_roughness.png';
import floorDisplacement from '../materials/floor_displacement.png';
import floorAmbientOcclusion from '../materials/floor_ambientOcclusion.png';

export default class Floor{
    constructor(levelContainer){
        this.levelContainer = levelContainer;
        this.floor = null;

        this.squareSize = settings.squareSize;
    }

    CreateFloor(mapSize = 10){
        let planeWidth = mapSize * this.squareSize;
        let planeHeight = mapSize * this.squareSize;
        let planeGeometry = new PlaneGeometry(planeWidth, planeHeight, this.squareSize, this.squareSize);
        let material = new MeshPhongMaterial( {
            shininess: 100, 
            side: DoubleSide, 
            map: new TextureLoader().load(floorColor),
            // displacementMap: new TextureLoader().load(floorDisplacement),
            normalMap: new TextureLoader().load(floorNormal),
            aoMap: new TextureLoader().load(floorAmbientOcclusion),
            bumpMap: new TextureLoader().load(floorRoughness),
        })
        let mapList = [material.normalMap, material.aoMap, material.bumpMap, material.map]
        mapList.forEach( e => {
            e.wrapS = RepeatWrapping;
            e.wrapT = RepeatWrapping;
            e.repeat.set( mapSize, mapSize );
        })
        // let material = new MeshPhongMaterial( {
        //     // color: 0xffffff, 
        //     // specular: 0x777777, 
        //     shininess: 5, 
        //     side: DoubleSide, 
        //     map: texture
        // })
        this.floor = new Mesh(planeGeometry, material);
        this.floor.receiveShadow = true;
        this.floor.rotation.x = Math.PI / 2;
        this.levelContainer.add(this.floor);
    }
}