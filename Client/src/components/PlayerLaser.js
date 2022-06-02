import { Euler, Vector3, BufferGeometry, PointsMaterial, TextureLoader, AdditiveBlending, BufferAttribute, Points, Mesh } from "three";

//@ts-ignore
import fireTex from '../assets/fire.png';
import Collider from "./Collider";
import Enemy from "./Enemy";
import GUI from "./GUI";
import Player from "./Player";
import Wall from "./Wall";

export default class PlayerLaser{
    /**
     * @param {any} levelContainer
     * @param {Mesh} modelMesh
     * @param {Player} player
     */
    constructor(levelContainer, modelMesh, player){
        this.levelContainer = levelContainer;
        this.modelMesh = modelMesh;
        this.player= player;
        this.laserObject = null;

        this.laserParticlesCount = 100;
        this.laserLength = 300;

        this.collider = new Collider();

        this.particlesGeometry = new BufferGeometry();
        this.verticesArray = new Float32Array(this.laserParticlesCount * 3);
        this.particleMaterial = new PointsMaterial({
            color: 0x0091ea,
            depthWrite: false,
            transparent: true,
            size: 10,
            map: new TextureLoader().load(fireTex),
            blending: AdditiveBlending
        })
    }

    /**
     * @param {GUI} GUI
     */
    GenerateLaser(GUI){
        let startVector = new Vector3(this.modelMesh.position.x, this.modelMesh.position.y, this.modelMesh.position.z);
        let targetVector = this.modelMesh.position.clone().add(this.modelMesh.getWorldDirection(new Vector3()).applyEuler(new Euler(0, Math.PI / 2, 0)).normalize().multiplyScalar(this.laserLength));
        let subVector = targetVector.clone().sub(startVector.clone());
        let stepVector = subVector.clone().divideScalar(this.laserParticlesCount)
        
        for(let i = 0; i < this.laserParticlesCount * 3; i+=3){
            this.verticesArray[i] = startVector.x + (stepVector.x * i / 3);
            this.verticesArray[i+1] = startVector.y + (stepVector.y * i / 3);
            this.verticesArray[i+2] = startVector.z + (stepVector.z * i / 3);
        }

        this.particleMaterial.size = GUI.laserScaleVal;

        this.particlesGeometry.setAttribute("position", new BufferAttribute(this.verticesArray, 3));

        this.laserObject = new Points(this.particlesGeometry, this.particleMaterial);
        this.levelContainer.add(this.laserObject);

        // console.log(this.laserObject.position.x, this.laserObject.position.y, this.laserObject.position.z,)

        // console.log(targetVector);
    }

    /**
     * @param {GUI} GUI
     * @param {Enemy[]} enemyList
     * @param {Wall[]} [wallList]
     */
    UpdateLaser(GUI, enemyList, wallList){
        let startVector = new Vector3(this.modelMesh.position.x, this.modelMesh.position.y, this.modelMesh.position.z);
        let targetVector = this.modelMesh.position.clone().add(this.modelMesh.getWorldDirection(new Vector3()).applyEuler(new Euler(0, Math.PI / 2, 0)).normalize().multiplyScalar(this.laserLength));
        let subVector = targetVector.clone().sub(startVector.clone());
        let stepVector = subVector.clone().divideScalar(this.laserParticlesCount)
        
        let positions = this.particlesGeometry.attributes.position.array;
        for(let i = 0; i < positions.length; i+=3){
            //@ts-ignore
            positions[i] = startVector.x + (stepVector.x * i / 3) + (Math.random() * GUI.laserDispersionVal) - GUI.laserDispersionVal / 2;
            //@ts-ignore
            positions[i+1] = startVector.y + (stepVector.y * i / 3) + (Math.random() * GUI.laserDispersionVal) - GUI.laserDispersionVal / 2;
            //@ts-ignore
            positions[i+2] = startVector.z + (stepVector.z * i / 3) + (Math.random() * GUI.laserDispersionVal) - GUI.laserDispersionVal / 2;
        }
        this.laserObject.material.size = GUI.laserScaleVal;

        if(positions.length > 0){
            this.collider.CreatePlayerRay(startVector, subVector, this.player, enemyList, wallList, this.laserLength);
        }

        this.particlesGeometry.computeBoundingSphere();
        this.particlesGeometry.attributes.position.needsUpdate = true;

        this.player.ammo--;
    }

    RemoveLaser(){
        this.levelContainer.remove(this.laserObject);
        this.laserObject = null;
    }
}