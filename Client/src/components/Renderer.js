import { WebGLRenderer, PCFSoftShadowMap } from 'three';

export default class Renderer extends WebGLRenderer {
    constructor(scene, container) {
        super({ antialias: true })
        this.scene = scene;
        this.container = container;
        // this.setClearColor(0x777777);
        this.shadowMap.enabled = true
        this.shadowMap.type = PCFSoftShadowMap;
        this.container.appendChild(this.domElement);
        // this.physicallyCorrectLights = true;
        this.updateSize();

        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    updateSize() {
        this.setSize(window.innerWidth, window.innerHeight);
    }

    render(scene, camera) {
        this.render(scene, camera);
    }
}