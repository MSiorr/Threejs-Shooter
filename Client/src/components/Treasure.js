import { TorusGeometry, MeshBasicMaterial, Mesh } from 'three';

import settings from './Settings';

export default class Treasure extends Mesh {
    constructor(levelContainer){
        super(
            new TorusGeometry( settings.squareSize / 16, settings.squareSize / 64, 16, 60),
            new MeshBasicMaterial( { color: 0xaaaa00, wireframe: true} )
        )
        this.levelContainer = levelContainer;
        this.castShadow = true;
        this.receiveShadow = true;

        this.squareSize = settings.squareSize;
    }

    CreateTreasure(x,y,z,centerOffset){

        let xPos = x * this.squareSize - centerOffset + (this.squareSize / 2);
        let yPos = (y * this.squareSize) + this.squareSize / 2;
        let zPos = z * this.squareSize - centerOffset + (this.squareSize / 2);

        this.position.set(xPos, yPos, zPos)

        this.levelContainer.add( this );
    }

    Update(){
        this.rotation.y -= 0.01;
    }
}