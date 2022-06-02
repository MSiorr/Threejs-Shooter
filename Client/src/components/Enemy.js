import { ConeGeometry, MeshBasicMaterial, Mesh, MeshPhongMaterial, TextureLoader, Box3, LoadingManager, MeshStandardMaterial, Vector3, AxesHelper, Euler, Raycaster, Ray, Line, BufferGeometry, LineBasicMaterial } from 'three';
import { MD2Loader } from './loader/MD2Loader';

import settings from './Settings';
import config from './Config';

import Animation from './Animation';
import Collider from './Collider';
import EnemyLaser from './EnemyLaser';
import Player from './Player';
import Wall from './Wall';

export default class Enemy extends Mesh {
    /**
     * @param {import("three").Object3D} levelContainer
     * @param {Player} player
     */
    constructor(levelContainer, player) {
        super()
        this.levelContainer = levelContainer;
        this.geometry = null;
        this.mesh = null;
        this.player = player;

        this.animation = null;
        this.manager = new LoadingManager();

        this.enemyRayTrigger = 200;

        this.boxSize = null;

        this.collider = new Collider();

        this.maxHP = 100;
        this.HP = this.maxHP;
        this.points = 100;
        this.bulletDMG = 10;

        this.alive = true;

        this.squareSize = settings.squareSize;
    }

    CreateEnemy(x, y, z, centerOffset) {
        const geometry = new ConeGeometry(this.squareSize / 10, this.squareSize / 2, 20);
        const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        this.mesh = new Mesh(geometry, material);

        let xPos = x * this.squareSize - centerOffset + (this.squareSize / 2);
        let yPos = (y * this.squareSize) + this.squareSize / 4;
        let zPos = z * this.squareSize - centerOffset + (this.squareSize / 2);

        this.mesh.position.set(xPos, yPos, zPos)

        this.levelContainer.add(this.mesh);
    }

    Load(x, y, z, centerOffset) {
        return new Promise((resolve, reject) => {
            new MD2Loader(this.manager).load(
                config.enemySource.model,
                geometry => {
                    this.geometry = geometry;
                    this.mesh = new Mesh(geometry, new MeshPhongMaterial({
                        map: new TextureLoader().load(config.enemySource.img),
                        morphTargets: true
                    }))
    
                    var box = new Box3().setFromObject(this.mesh);
                    //@ts-ignore
                    this.boxSize = box.getSize().y - 42;
    
                    let xPos = x * this.squareSize - centerOffset + (this.squareSize / 2);
                    let yPos = (y * this.squareSize) + this.boxSize / 2;
                    let zPos = z * this.squareSize - centerOffset + (this.squareSize / 2);
    
                    this.mesh.position.set(xPos, yPos, zPos)
                    this.mesh.rotation.y = -Math.PI / 2;
                    this.mesh.castShadow = true;
                    // this.mesh.receiveShadow = true;
    
                    this.levelContainer.add(this.mesh);
    
                    this.enemyLaser = new EnemyLaser(this.levelContainer, this, this.player, "right")
                    this.enemyLaser2 = new EnemyLaser(this.levelContainer, this, this.player, "left")
    
                    this.animation = new Animation(this.mesh);
    
                    this.animation.addEventListener("loop", (e) => {
                        if(this.alive){
                            this.ShootLaser();
                        }
                    })

                    resolve();
                }
            )
        })
    }

    /**
     * @param {Wall[]} wallList
     */
    Update(wallList) {
        if(this.player.mesh && this.alive){
            this.mesh.lookAt(new Vector3(this.player.mesh.position.x, this.mesh.position.y, this.player.mesh.position.z))
            this.mesh.rotateOnWorldAxis(new Vector3(0, -1, 0), Math.PI / 2)

            if(this.player.alive){
                this.anim = this.collider.CreateEnemyRay(this.mesh, this.player.mesh, this.enemyRayTrigger, wallList)
            } else {
                this.anim = "stand";
            }
            if (this.animation.animName != this.anim) {
                this.animation.PlayAnim(this.anim);
                this.ShootLaser();
            }
        }


        if(this.enemyLaser.laserObject != null){
            this.enemyLaser.UpdateLaser(wallList);
        }
        if(this.enemyLaser2.laserObject != null){
            this.enemyLaser2.UpdateLaser(wallList);
        }
    }

    ShootLaser(){
        if (this.enemyLaser && this.enemyLaser2 && this.player.mesh) {
            if (this.anim == "attack") {
                if(this.enemyLaser.laserObject != null){
                    this.enemyLaser.RemoveLaser();
                }
                if(this.enemyLaser2.laserObject != null){
                    this.enemyLaser2.RemoveLaser();
                }
                this.enemyLaser.GenerateLaser();
                this.enemyLaser2.GenerateLaser();
            }
        }
    }

    Unload(){
        this.alive = false;
        this.animation.PlayAnim("death")
        setTimeout(() => {
            this.levelContainer.remove(this.mesh);
        }, 500)
    }


}