import { ConeGeometry, MeshBasicMaterial, Mesh, MeshPhongMaterial, TextureLoader, Box3, LoadingManager, Ray, Raycaster, AxesHelper, Euler, Vector3, SphereGeometry, BoxGeometry } from 'three';
import { MD2Loader } from './loader/MD2Loader';

import Animation from './Animation';
import Keyboard from './Keyboard';

import settings from './Settings';
import config from './Config';

import Wall from './Wall';
import Collider from './Collider';

export default class Player {
    constructor(levelContainer, manager) {
        this.levelContainer = levelContainer;
        this.geometry = null;
        this.mesh = null;
        this.manager = manager;
        this.MeshBox = null;

        this.playerAnim = null;
        this.playerKeyboard = null;

        this.maxHP = 1000;
        this.HP = this.maxHP;
        this.maxAmmo = 1000;
        this.ammo = this.maxAmmo;
        this.bulletDMG = 1;

        this.score = 0;

        this.alive = true;

        this.manager = new LoadingManager();
        this.manager.onLoad = () => {
            this.playerAnim = new Animation(this.mesh, true)
            this.playerAnim.PlayAnim("run")

            this.collider = new Collider();

            this.playerKeyboard = new Keyboard(window, this.levelContainer, this.playerAnim, this.mesh, this.MeshBox, this.collider, this);
        };

        this.raycaster = new Raycaster();

        this.squareSize = settings.squareSize;

        // this.CreatePlayer();
    }

    CreatePlayer() {
        const geometry = new ConeGeometry(this.squareSize / 10, this.squareSize / 2, 20);
        const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        this.mesh = new Mesh(geometry, material);

        this.mesh.position.set(150, this.squareSize / 4, 50);

        this.levelContainer.add(this.mesh);
    }

    Load() {
        return new Promise((resolve, reject) => {
            new MD2Loader(this.manager).load(
                config.playerSource.model,
                geometry => {
                    this.geometry = geometry;
                    this.mesh = new Mesh(geometry, new MeshPhongMaterial({
                        map: new TextureLoader().load(config.playerSource.img),
                        morphTargets: true
                    }))
    
                    this.mesh['objectParent'] = this;
    
                    // this.mesh.scale.set(0.1, 0.1, 0.1);
    
                    this.MeshBox = new Box3().setFromObject(this.mesh);
                    let playerBoxSizeY = this.MeshBox.getSize(new Vector3()).y - (this.MeshBox.getSize(new Vector3()).y * (30/100));
    
                    this.mesh.position.set(150, playerBoxSizeY / 2, 450);
                    this.mesh.rotation.y = Math.PI / 2;
                    this.mesh.castShadow = true;
    
                    // this.axesHelper = new AxesHelper(1000);
                    // this.mesh.add(this.axesHelper);
    
                    // this.spehere = new Mesh(new SphereGeometry(20, 10, 10), new MeshBasicMaterial({color: 0xff0000, wireframe: true}));
                    // this.mesh.add(this.spehere);
    
                    // this.box = new Mesh(
                    //     new BoxGeometry(this.MeshBox.getSize().x - 30, this.MeshBox.getSize().y - 20, this.MeshBox.getSize().z - 30),
                    //     new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
                    // )
                    // this.mesh.add(this.box);
    
                    this.levelContainer.add(this.mesh);
                    resolve();
                }
            )
        })
    }

    Unload() {
        this.playerAnim.PlayAnim("death");
        setTimeout( () => {
            this.levelContainer.remove(this.mesh);
        }, 500);
    }
}