import { Euler, Vector3, BufferGeometry, PointsMaterial, TextureLoader, AdditiveBlending, BufferAttribute, Points, Mesh, Quaternion, Box3 } from "three";

//@ts-ignore
import fireTex from '../assets/fire.png';
import Collider from "./Collider";
import Enemy from "./Enemy";
import Wall from "./Wall";

export default class EnemyLaser {
    /**
     * @param {any} levelContainer
     * @param {Enemy} enemy
     * @param {import("./Player").default} player
     * @param {String} gun
     */
    constructor(levelContainer, enemy, player, gun) {
        this.levelContainer = levelContainer;
        this.enemy = enemy;
        this.player = player;
        this.gun = gun;
        this.laserObject = null;

        this.laserParticlesCount = 50;
        this.laserLength = 20;
        this.laserVelocity = 10;

        this.traveledFrame = 0;

        this.collider = new Collider();

        this.particlesGeometry = new BufferGeometry();
        this.verticesArray = new Float32Array(this.laserParticlesCount * 3);
        this.particleMaterial = new PointsMaterial({
            color: 0xFA8072,
            depthWrite: false,
            transparent: true,
            size: 2,
            map: new TextureLoader().load(fireTex),
            blending: AdditiveBlending
        })

        this.leftGun = { x: 11.5, y: 11, z: 30 }
        this.rightGun = { x: -8, y: 11, z: 10 }
    }

    GenerateLaser() {
        if (this.gun == "left") {
            this.startVector = new Vector3(this.enemy.mesh.position.x + this.leftGun.x, this.enemy.mesh.position.y + this.leftGun.y, this.enemy.mesh.position.z + this.leftGun.z);
        } else {
            this.startVector = new Vector3(this.enemy.mesh.position.x + this.rightGun.x, this.enemy.mesh.position.y + this.rightGun.y, this.enemy.mesh.position.z + this.rightGun.z);
        }

        let newStartVector = new Vector3().copy(this.startVector);
        newStartVector.sub(this.enemy.mesh.position);
        let r = this.enemy.mesh.rotation.clone();
        newStartVector.applyEuler(r);
        newStartVector.applyEuler(new Euler(0, Math.PI / 2, 0));
        newStartVector.add(this.enemy.mesh.position);
        this.startVector.copy(newStartVector);

        let playerPosition = this.player.mesh.position.clone();
        playerPosition.y = this.startVector.y;

        this.distanceToLastTarget = this.startVector.distanceTo(playerPosition);

        this.targetSubVector = playerPosition.clone().sub(this.startVector.clone()).normalize()

        for (let i = 0; i < this.laserParticlesCount * 3; i += 3) {
            this.verticesArray[i] = (i / 3) * (this.laserLength / this.laserParticlesCount)
            this.verticesArray[i + 1] = 0
            this.verticesArray[i + 2] = 0
        }

        this.particlesGeometry.setAttribute("position", new BufferAttribute(this.verticesArray, 3));
        this.particlesGeometry.computeBoundingSphere();

        this.laserObject = new Points(this.particlesGeometry, this.particleMaterial);
        this.laserObject.position.copy(this.startVector);

        let quaternionRotation = new Quaternion()
        quaternionRotation.setFromUnitVectors(new Vector3(1, 0, 0), this.targetSubVector.clone());
        let eulerRotation = new Euler();
        eulerRotation.setFromQuaternion(quaternionRotation);
        this.laserObject.rotation.copy(eulerRotation);

        this.levelContainer.add(this.laserObject);
    }

    /**
     * @param {Wall[]} [wallList]
     */
    UpdateLaser(wallList) {
        this.laserObject.translateX(this.laserVelocity);

        this.particlesGeometry.computeBoundingSphere();

        let collide = this.collider.CreateEnemyBulletRay(this.laserObject, this.targetSubVector, this.player, this.enemy, wallList, this.laserLength / 2)

        this.traveledFrame++;
        if (this.traveledFrame >= this.distanceToLastTarget / this.laserVelocity || collide == true) {
            this.RemoveLaser();
        }
    }

    RemoveLaser() {
        this.levelContainer.remove(this.laserObject);
        this.laserObject = null;
        this.traveledFrame = 0;
    }
}