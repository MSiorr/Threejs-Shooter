import { PerspectiveCamera, Vector3 } from 'three';

export default class Camera extends PerspectiveCamera {
    constructor(renderer) {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        super(75, width / height, 0.1, 10000)

        this.position.set(0, 1000, 0);
        this.lookAt(new Vector3(0, 0, 0))

        this.startCamVect = new Vector3(-200, 50, 0)

        this.updateSize(renderer);

        window.addEventListener('resize', () => this.updateSize(renderer), false);
    }

    updateSize(renderer) {

        this.aspect = renderer.domElement.width / renderer.domElement.height;
        this.updateProjectionMatrix();
    }
}