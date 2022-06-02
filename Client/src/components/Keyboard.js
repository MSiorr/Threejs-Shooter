import { Box3, Mesh, Object3D, Raycaster, Vector3 } from "three";
import Animation from "./Animation"
import Collider from "./Collider";
import Config from "./Config";
import Player from "./Player";
import PlayerLaser from "./PlayerLaser";

const KEYS = {
    "left": 65,
    "up": 87,
    "right": 68,
    "down": 83,
    "space": 32
};

export default class Keyboard {
    /**
     * @param {Window} domElement
     * @param {Animation} animation
     * @param {Mesh} modelMesh
     * @param {Box3} meshBox
     * @param {Collider} collider
     * @param {Object3D} levelContainer
     * @param {Player} player
     */
    constructor(domElement, levelContainer, animation, modelMesh, meshBox, collider, player) {

        this.domElement = domElement;
        this.levelContainer = levelContainer;
        this.animation = animation;
        this.modelMesh = modelMesh;
        this.meshBox = meshBox;
        this.collider = collider;
        this.player = player;

        this.playerLaser = new PlayerLaser(this.levelContainer, this.modelMesh, this.player);

        this.rayActionDistance = Math.max(this.meshBox.getSize(new Vector3()).x * (58 / 100), this.meshBox.getSize(new Vector3()).z * (55 / 100)) / 2;

        this.raycaster = new Raycaster();

        // events
        this.domElement.addEventListener('keydown', event => this.OnKeyDown(event), false);
        this.domElement.addEventListener('keyup', event => this.OnKeyUp(event), false);


    }

    OnKeyUp(event) {
        switch (event.keyCode) {
            case KEYS.up:
                Config.moveForward = false;
                break;
            case KEYS.left:
                Config.rotateLeft = false;
                break;
            case KEYS.right:
                Config.rotateRight = false;
                break;
            case KEYS.down:
                Config.moveBackward = false;
                break;
            case KEYS.space:
                Config.spaceAttack = false;
                break;


        }
    }

    OnKeyDown(event) {
        switch (event.keyCode) {
            case KEYS.up:
                Config.moveForward = true;
                break;
            case KEYS.left:
                Config.rotateLeft = true;
                break;
            case KEYS.right:
                Config.rotateRight = true;
                break;
            case KEYS.down:
                Config.moveBackward = true;
                break;
            case KEYS.space:
                Config.spaceAttack = true;
                break;
        }

    }

    UpdateAnim(wallList, GUI, enemyList) {
        if (this.modelMesh && this.player.alive) {

            let movePermission = this.collider.CreateMovementRays(this.modelMesh, wallList, this.rayActionDistance, 10);

            if (Config.rotateLeft) {
                this.modelMesh.rotation.y += 0.03;
            }
            if (Config.rotateRight) {
                this.modelMesh.rotation.y -= 0.03;
            }
            if (Config.moveForward && movePermission.forward) {
                this.modelMesh.translateX(3);
            }
            if (Config.moveBackward && movePermission.backward) {
                this.modelMesh.translateX(-1);
            }
            if (this.animation) {
                let otherAnim = false;

                if (Config.moveForward) {
                    otherAnim = true;
                    if (this.animation.animName != "run") {
                        this.animation.PlayAnim("run");
                    }
                } else if (Config.moveBackward) {
                    otherAnim = true;
                    if (this.animation.animName != "runBack") {
                        this.animation.PlayAnim("runBack");
                    }
                } else if(Config.spaceAttack && this.player.ammo > 0) {
                    otherAnim = true;
                    if (this.animation.animName != "attack") {
                        this.animation.PlayAnim("attack")
                    }
                } 

                if(otherAnim == false) {
                    if (this.animation.animName != "stand") {
                        this.animation.PlayAnim("stand");
                    }
                }
            }
            if (Config.spaceAttack && this.player.ammo > 0) {
                if (this.playerLaser.laserObject == null) {
                    this.playerLaser.GenerateLaser(GUI);
                } else {
                    this.playerLaser.UpdateLaser(GUI, enemyList, wallList);
                }
            } else {
                if (this.playerLaser.laserObject != null) {
                    this.playerLaser.RemoveLaser();
                }
            }
        }
    }


}