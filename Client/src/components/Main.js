import { Scene, Vector3, Clock, AmbientLight, AxesHelper } from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import MapCreator from './MapCreator';
import GUI from './GUI';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import HUD from './HUD';
import EndScreen from './EndScreen';

console.warn = () => { };

export default class Main {
    constructor(container) {
        // właściwości klasy
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(this.scene, container);
        this.camera = new Camera(this.renderer);
        this.mapCreator = new MapCreator(this.scene, this);
        this.GUI = new GUI(this.container);

        this.loadingScreen = document.getElementById("loadingScreen");

        // @ts-ignore
        this.stats = new Stats();
        this.stats.showPanel(0);

        this.ambientLight = new AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);

        this.HUD = new HUD(document.body);
        this.endScreen = new EndScreen(document.body);
        // setTimeout( () => {
        //     // this.endScreen.CreateVictoryScreen('11:11:11', 111, [1,1,1]);
        //     this.endScreen.CreateLoseScreen();
        //     document.body.removeChild(this.stats.dom);
        // }, 5)

        this.stopRender = false;

        this.oneUpdate = false;

        this.clock = new Clock();
        this.startTime = Date.now();

        this.mapData = null;
        this.getMapData();

        this.showCard();
    }

    render() {
        if (this.mapCreator.player.alive == false && this.endScreen.created == false) {
            this.endScreen.created = true;
            this.GUI.mainDiv.style.zIndex = '1';
            setTimeout(() => {
                this.endScreen.CreateLoseScreen();
                document.body.removeChild(this.stats.dom);
                setTimeout(() => {
                    this.stopRender = true;
                }, 4000)
            }, 1000)
        }
        let allEnemyDeath = false;
        if (this.mapCreator.enemyList.length > 0) {
            allEnemyDeath = true;
            this.mapCreator.enemyList.forEach(e => {
                if (e.alive == true) {
                    allEnemyDeath = false;
                }
            })
        }

        if (allEnemyDeath == true && this.endScreen.created == false) {
            this.endScreen.created = true;
            this.GUI.mainDiv.style.zIndex = '1';
            setTimeout(() => {
                this.endScreen.CreateVictoryScreen(Date.now() - this.startTime, this.mapCreator.player.score, this.mapCreator.enemyList, this.mapData);
                document.body.removeChild(this.stats.dom);
                setTimeout(() => {
                    this.stopRender = true;
                }, 4000)
            }, 1000)
        }

        if (this.stopRender == false) {
            this.stats.begin();

            this.renderer.render(this.scene, this.camera);

            if (this.GUI.aboveViewVal == false) {

                if (this.mapCreator.player.mesh != null) {
                    const camVect = new Vector3(-this.GUI.cameraCharacterDistanceVal, this.GUI.cameraHeightVal, 0)
                    const camPos = camVect.applyMatrix4(this.mapCreator.player.mesh.matrixWorld);
                    this.camera.position.x = camPos.x
                    this.camera.position.y = camPos.y
                    this.camera.position.z = camPos.z
                    this.camera.lookAt(this.mapCreator.player.mesh.position)

                    if (this.GUI.cameraAfterPlayerVal == false) {
                        this.camera.rotateOnWorldAxis(new Vector3(0, 1, 0), this.GUI.cameraViewYAngleVal);
                        this.camera.rotateOnAxis(new Vector3(1, 0, 0), this.GUI.cameraXAngleVal);
                    }
                }

            } else {
                this.camera.position.set(0, 1000, 0);
                if (this.GUI.cameraAfterPlayerVal == false) {
                    this.camera.lookAt(new Vector3(0, 0, 0))
                }
            }

            if (this.GUI.cameraAfterPlayerVal == true) {
                this.camera.lookAt(this.mapCreator.player.mesh.position);
            }

            this.camera.fov = this.GUI.cameraFOVVal;
            this.camera.updateProjectionMatrix();

            this.mapCreator.lightsList.forEach(e => {
                e.ChangeLightPower(this.GUI.lightsPowerVal);
                e.ChangeShadowDisplay(this.GUI.shadowVal);
                e.update(this.GUI);
            })

            var delta = this.clock.getDelta();
            if (this.mapCreator.player.playerAnim != null) {
                this.mapCreator.player.playerAnim.Update(delta);
            }

            this.mapCreator.enemyList.forEach(e => {
                if (e.animation != null) {
                    e.animation.Update(delta)
                    if (this.mapCreator.player.mesh != null) {
                        e.Update(this.mapCreator.wallList);
                    }
                }
            })

            if (this.mapCreator.player.playerKeyboard != null) {
                this.mapCreator.player.playerKeyboard.UpdateAnim(this.mapCreator.wallList, this.GUI, this.mapCreator.enemyList);
            }

            this.mapCreator.treasureList.forEach(e => {
                e.Update();
            })

            if (this.mapCreator.enemyList.length > 0 && this.mapCreator.player) {
                this.HUD.Update(this.mapCreator.enemyList, this.mapCreator.player);
            }

            this.stats.end()

            requestAnimationFrame(this.render.bind(this));
        }
    }

    async getMapData() {
        let resp = await fetch("http://localhost:5000/load", { method: "POST" })
        /**
         * @type {Object}
         */
        let mapJson = await resp.json();
        this.mapCreator.LoadData(mapJson)
            .then(() => {
                setTimeout(() => {
                    this.GUI.mainDiv.style.zIndex = '10000';
                    this.GUI.mainDiv.style.display = 'flex';
                    document.body.appendChild(this.stats.dom);
                    this.loadingScreen.style.display = "none";
                    this.startTime = Date.now();
                    this.render();
                }, 1000)
            })
        console.log(mapJson);
        this.mapData = mapJson;
    }

    extractValue(reg, str) {
        const matches = str.match(reg);
        return matches && matches[0];
    }


    showCard() {

        // WebGL Context Setup
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl");
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        // Full card description and webGL layer (if present)
        const layer = this.extractValue(/(ANGLE)/g, renderer);
        const card = this.extractValue(/((NVIDIA|AMD|Intel)[^\d]*[^\s]+)/, renderer);

        const tokens = card.split(' ');
        tokens.shift();

        // Split the card description up into pieces
        // with brand, manufacturer, card version
        const manufacturer = this.extractValue(/(NVIDIA|AMD|Intel)/g, card);
        const cardVersion = tokens.pop();
        const brand = tokens.join(' ');
        const integrated = manufacturer === 'Intel';

        console.log({
            card,
            manufacturer,
            cardVersion,
            brand,
            integrated,
            vendor,
            renderer
        });
    }
}