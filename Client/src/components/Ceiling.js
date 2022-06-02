import { PlaneGeometry, TextureLoader, RepeatWrapping, MeshPhongMaterial, FrontSide, Mesh } from 'three';

import settings from './Settings';
import ceilTexture from '../materials/ceil.png';

export default class Floor{
    constructor(levelContainer){
        this.levelContainer = levelContainer;
        this.ceil = null;
        this.squareSize = settings.squareSize;
    }

    CreateFloor(mapSize = 10){
        let planeWidth = mapSize * this.squareSize;
        let planeHeight = mapSize * this.squareSize;
        let planeGeometry = new PlaneGeometry(planeWidth, planeHeight, this.squareSize, this.squareSize);
        let texture = new TextureLoader().load(ceilTexture);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set( mapSize, mapSize );
        let material = new MeshPhongMaterial( {
            color: 0xffffff, 
            specular: 0x777777, 
            shininess: 5, 
            side: FrontSide, 
            map: texture
        })
        this.ceil = new Mesh(planeGeometry, material);
        this.ceil.receiveShadow = true;
        this.ceil.rotation.x = Math.PI / 2;
        this.ceil.position.setY(this.squareSize);
        this.levelContainer.add(this.ceil);
    }
}