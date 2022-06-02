import { BoxGeometry, MeshPhongMaterial, TextureLoader, DoubleSide, Mesh, FrontSide } from 'three';
import wallTexture from '../materials/wall.png';
import wallColor from '../materials/wall_color.png';
import wallNormal from '../materials/wall_normal.png';
import wallRoughness from '../materials/wall_roughness.png';
import wallDisplacement from '../materials/wall_displacement.png';
import wallAmbientOcclusion from '../materials/wall_ambientOcclusion.png';

import settings from './Settings';

export default class Wall extends Mesh {
    constructor(levelContainer) {
        super(
            new BoxGeometry(settings.squareSize, settings.squareSize, settings.squareSize),
            new MeshPhongMaterial({
                color: 0xaaaaaa,
                specular: 0x000000,
                shininess: 100,
                side: FrontSide,
                map: new TextureLoader().load(wallColor),
                // displacementMap: new TextureLoader().load(wallDisplacement),
                normalMap: new TextureLoader().load(wallNormal),
                aoMap: new TextureLoader().load(wallAmbientOcclusion),
                bumpMap: new TextureLoader().load(wallRoughness),
            })
        )
        // super(
        //     new BoxGeometry(settings.squareSize, settings.squareSize, settings.squareSize),
        //     new MeshPhongMaterial({
        //         color: 0xaaaaaa,
        //         specular: 0x000000,
        //         shininess: 15,
        //         side: FrontSide,
        //         map: new TextureLoader().load(wallTexture),
        //     })
        // )
        this.levelContainer = levelContainer;

        this.squareSize = settings.squareSize;
    }

    CreateWall(x, y, z, centerOffset) {

        let xPos = x * this.squareSize - centerOffset + (this.squareSize / 2);
        let yPos = (y * this.squareSize) + this.squareSize / 2;
        let zPos = z * this.squareSize - centerOffset + (this.squareSize / 2);

        this.position.set(xPos, yPos, zPos)
        this.castShadow = true;
        this.receiveShadow = true;
        this.levelContainer.add(this);
    }
}