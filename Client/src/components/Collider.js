import { Raycaster, Ray, Vector3, Euler, Points } from "three";
import Enemy from "./Enemy";
import EnemyLaser from "./EnemyLaser";
import Player from "./Player";

export default class Collider {
    constructor() {
        this.raycaster = new Raycaster();
    }

    CreateEnemyRay(origin, playerTarget, actionDistance, wallList) {
        let dir = playerTarget.position.clone().sub(origin.position).normalize()
        let ray = new Ray(origin.position, dir)
        this.raycaster.ray = ray

        let triggerObjects = [playerTarget, ...wallList]

        let intersects = this.raycaster.intersectObjects(triggerObjects);

        if (intersects[0]) {
            if (intersects[0].object.uuid == playerTarget.uuid) {
                if (intersects[0].distance <= actionDistance) {
                    return "attack";
                } else {
                    return "stand";
                }
            } else {
                return "stand";
            }
        } else {
            return "stand";
        }
    }

    CreateMovementRays(origin, targets, actionDistance, raysCount) {
        let canMoveForward = true;
        let canMoveBackward = true;
        for (let i = 0; i < raysCount; i++) {
            let x = Math.sin(i / (raysCount / 2) * Math.PI)
            let z = Math.cos(i / (raysCount / 2) * Math.PI)

            let ray = new Ray(origin.position, new Vector3(x, 0, z))
            this.raycaster.ray = ray

            let intersects = this.raycaster.intersectObjects(targets);

            if (intersects[0]) {
                intersects.forEach(e => {
                    if (e.distance <= actionDistance) {
                        if (origin.getWorldDirection().applyEuler(new Euler(0, Math.PI / 2, 0)).dot(new Vector3(x, 0, z)) > 0) {
                            if (canMoveForward == true) {
                                canMoveForward = false;
                            }
                        } else if (origin.getWorldDirection().applyEuler(new Euler(0, Math.PI / 2, 0)).dot(new Vector3(x, 0, z)) < 0) {
                            if (canMoveBackward == true) {
                                canMoveBackward = false;
                            }
                        }
                    }
                })
            }
        }

        return { forward: canMoveForward, backward: canMoveBackward };
    }

    /**
     * @param {Points} bullet
     * @param {Vector3} target
     * @param {Player} player
     * @param {Enemy} enemy
     * @param {import("./Wall").default[]} wallList
     * @param {Number} length
     */
    CreateEnemyBulletRay(bullet, target, player, enemy, wallList, length) {
        let dir = target.normalize();
        let ray = new Ray(bullet.position, dir)
        this.raycaster.ray = ray

        let triggerObjects = [player.mesh, ...wallList]

        let intersects = this.raycaster.intersectObjects(triggerObjects);

        if (intersects[0]) {
            if (intersects[0].object.uuid == player.mesh.uuid) {
                if (intersects[0].distance <= length && player.alive == true) {
                    player.HP -= enemy.bulletDMG;
                    if (player.HP <= 0) {
                        player.HP = 0;
                        player.alive = false;
                        player.Unload();
                    }
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        return false;
    }

    /**
     * @param {Vector3} start
     * @param {Vector3} target
     * @param {Player} player
     * @param {Enemy[]} enemyList
     * @param {import("./Wall").default[]} wallList
     * @param {number} length
     */
    CreatePlayerRay(start, target, player, enemyList, wallList, length) {
        target.y = start.y;
        let dir = target.normalize();
        let ray = new Ray(start, dir);
        this.raycaster.ray = ray;

        let enemyMeshList = []
        enemyList.forEach(e => {
            if (e.alive) {
                enemyMeshList.push(e.mesh);
            }
        })

        let triggerElements = [...enemyMeshList, ...wallList]

        let wallsUUIDList = [];
        wallList.forEach( e => {
            wallsUUIDList.push(e.uuid);
        })

        let intesects = this.raycaster.intersectObjects(triggerElements);

        if (player.ammo > 0) {
            if (intesects[0] && wallsUUIDList.includes(intesects[0].object.uuid) == false) {
                intesects.forEach(e => {
                    if (e.distance <= length) {
                        for (let i = 0; i < enemyList.length; i++) {
                            if (enemyList[i].mesh.uuid == e.object.uuid) {
                                enemyList[i].HP -= player.bulletDMG;
                                if (enemyList[i].HP <= 0) {
                                    enemyList[i].HP = 0;
                                    enemyList[i].Unload();
                                    player.score += enemyList[i].points;
                                }
                                break;
                            }
                        }
                    }
                })
            }
        }
    }
}