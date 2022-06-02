import { AnimationMixer } from 'three';

export default class Animation extends AnimationMixer {
    constructor(mesh, player = false) {
        super(mesh)
        this.mesh = mesh;
        this.player = player;
        this.playedAnim = null;

    }

    PlayAnim(animName) {
        if(this.player == true && this.animName == 'death'){
            return
        } else {
            this.animName = animName
            if(this.playedAnim != this.animName){
                if(this.animName == "runBack"){
                    this.playedAnim = "run";
                    this.timeScale = -0.5;
                } else {
                    this.playedAnim = animName;
                    this.timeScale = 1;
                }
                this.uncacheRoot(this.mesh)
                this.animateAction = this.clipAction(this.playedAnim).play()
                // console.log(this.animateAction.time);
            }
        }
    }

    // update mixer
    Update(delta) {
        if (this) {
            this.update(delta);
        }
    }
}