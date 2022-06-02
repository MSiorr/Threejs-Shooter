import { Sprite } from "three"

export default class Particle extends Sprite {
    constructor(material) {
        super()

        this.material = material.clone()

        this.size = Math.random() + 2;
        this.scale.set(this.size, this.size, this.size)

        this.position.y = Math.random() * 4;

        this.counter = 0;
    }

    update(gui) {
        this.scale.set(
            Math.random() + (2 * gui.fireplaceSizeVal),
            Math.random() + (2 * gui.fireplaceSizeVal),
            Math.random() + (2 * gui.fireplaceSizeVal)
        )

        if (this.material.opacity < 0) {
            this.position.x = (Math.random() * gui.fireplaceWidthXVal - (gui.fireplaceWidthXVal/2)) * gui.fireplaceSizeVal;
            this.position.z = (Math.random() * gui.fireplaceWidthZVal - (gui.fireplaceWidthZVal/2)) * gui.fireplaceSizeVal;
            this.position.y = Math.random();
            this.material.opacity = 1;
        }

        this.material.opacity -= Math.random() * 0.2;
        this.position.y += Math.random() * gui.fireplaceSizeVal
    }
}