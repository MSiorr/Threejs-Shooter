import { Object3D, LoadingManager } from 'three';

import settings from './Settings';

import Wall from './Wall';
import Floor from './Floor';
import Ceiling from './Ceiling';
import Light from './Light';
import Enemy from './Enemy';
import Treasure from './Treasure';
import Player from './Player';

export default class MapCreator {
    constructor(scene, main) {

        this.scene = scene;
        this.levelObjectContainer = new Object3D();
        this.mapData = null;

        this.main = main;
        
        this.squareSize = settings.squareSize;
        this.centerPositionOffset = 0;

        
        this.wallList = [];
        this.lightsList = [];
        this.enemyList = [];
        this.treasureList = [];
    }
    
    LoadData(data) {
        return new Promise((resolve, reject) => {
            this.mapData = data;
            this.centerPositionOffset = (this.mapData.size / 2) * this.squareSize;
            this.Build()
                .then( () => {
                    this.scene.add(this.levelObjectContainer);
                    resolve();
                })
        })
    }
    
    Build(){
        return new Promise( (resolve, reject) => {
            let buildingsCount = this.mapData.list.length + 1;

            this.player = new Player(this.levelObjectContainer);
            this.player.Load()
                .then(() => {
                    if(--buildingsCount == 0) {
                        resolve();
                    }
                })

            let floor = new Floor(this.levelObjectContainer);
            floor.CreateFloor(this.mapData.size);
            let ceil = new Ceiling(this.levelObjectContainer);
            ceil.CreateFloor(this.mapData.size);

            this.mapData.list.forEach( e => {
                switch(e.type){
                    case 'wall': {
                        let wall = new Wall(this.levelObjectContainer);
                        wall.CreateWall(e.x, e.y, e.z, this.centerPositionOffset);
                        this.wallList.push(wall);

                        if(--buildingsCount == 0) {
                            resolve();
                        }

                        break;
                    }
                    case 'light': {
                        let light = new Light(this.levelObjectContainer);
                        light.CreateLight(e.x, e.y, e.z, this.centerPositionOffset);
                        this.lightsList.push(light);

                        if(--buildingsCount == 0) {
                            resolve();
                        }

                        break;
                    }
                    case 'enemy': {
                        let enemy = new Enemy(this.levelObjectContainer, this.player);
                        enemy.Load(e.x, e.y, e.z, this.centerPositionOffset)
                            .then(() => {
                                if(--buildingsCount == 0) {
                                    resolve();
                                }
                            })
                        this.enemyList.push(enemy);
                        break;
                    }
                    case 'treasure': {
                        let treasure = new Treasure(this.levelObjectContainer);
                        treasure.CreateTreasure(e.x, e.y, e.z, this.centerPositionOffset);
                        this.treasureList.push(treasure);

                        if(--buildingsCount == 0) {
                            resolve();
                        }

                        break;
                    }
                    default: {
                        break;
                    }
                }
            })
        })

    }

    GenerateLvlObjects(){
        
    }
}