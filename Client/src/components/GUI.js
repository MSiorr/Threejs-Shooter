export default class GUI{
    constructor(container){
        this.mainDiv = document.getElementById("GUIInterface");
        this.mainDiv.style.display = "none";

        this.container = container;
        this.GUIInterface = null;

        this.cameraHeightVal = 30;
        this.cameraXAngleVal = 0;
        this.cameraCharacterDistanceVal = 50;
        this.cameraViewYAngleVal = 0;
        this.cameraFOVVal = 75;
        this.lightsPowerVal = 2;
        this.shadowVal = false;
        this.aboveViewVal = false;
        this.cameraAfterPlayerVal = false;
        this.fireplaceSizeVal = 1;
        this.fireplaceWidthXVal = 2;
        this.fireplaceWidthZVal = 2;
        this.laserDispersionVal = 0;
        this.laserScaleVal = 10;

        this.Start();
    }

    Start(){
        let cameraHeightInput = document.querySelector("#cameraHeight");
        let cameraXAngleInput = document.querySelector("#cameraXAngle");
        let cameraCharacterDistanceInput = document.querySelector("#cameraCharacterDistance");
        let cameraViewYAngleInput = document.querySelector("#cameraViewYAngle");
        let cameraFOVInput = document.querySelector("#cameraFOV");
        let lightsPowerInput = document.querySelector("#lightsPower");
        let shadowsInput = document.querySelector("#shadows");
        let aboveViewInput = document.querySelector("#aboveView");
        let cameraAfterPlayerInput = document.querySelector("#cameraAfterPlayer");
        let fireplaceSizeInput = document.querySelector("#fireplaceSize");
        let fireplaceWidthXInput = document.querySelector("#fireplaceWidthX");
        let fireplaceWidthZInput = document.querySelector("#fireplaceWidthZ");
        let laserDispersionInput = document.querySelector("#laserDispersion");
        let laserScaleInput = document.querySelector("#laserScale");

        cameraHeightInput.value = this.cameraHeightVal;
        cameraXAngleInput.value = this.cameraXAngleVal;
        cameraCharacterDistanceInput.value = this.cameraCharacterDistanceVal;
        cameraViewYAngleInput.value = this.cameraViewYAngleVal;
        cameraFOVInput.value = this.cameraFOVVal;
        lightsPowerInput.value = this.lightsPowerVal;
        shadowsInput.checked = this.shadowVal;
        aboveViewInput.checked = this.aboveViewVal;
        cameraAfterPlayerInput.checked = this.cameraAfterPlayerVal;
        fireplaceSizeInput.value = this.fireplaceSizeVal;
        fireplaceWidthXInput.value = this.fireplaceWidthXVal;
        fireplaceWidthZInput.value = this.fireplaceWidthZVal;
        laserDispersionInput.value = this.laserDispersionVal;
        laserScaleInput.value = this.laserScaleVal;


        cameraHeightInput.oninput = () => {
            this.cameraHeightVal = parseInt(cameraHeightInput.value);
        }

        cameraXAngleInput.oninput = () => {
            this.cameraXAngleVal = parseFloat(cameraXAngleInput.value * (Math.PI / 180)); 
        }

        cameraCharacterDistanceInput.oninput = () => {
            this.cameraCharacterDistanceVal = parseInt(cameraCharacterDistanceInput.value);
        }

        cameraViewYAngleInput.oninput = () => {
            this.cameraViewYAngleVal = parseFloat(-cameraViewYAngleInput.value * (Math.PI / 180))
        }

        cameraFOVInput.oninput = () => {
            this.cameraFOVVal = parseInt(cameraFOVInput.value);
        }

        lightsPowerInput.oninput = () => {
            this.lightsPowerVal = parseFloat(lightsPowerInput.value);
        }

        shadowsInput.oninput = () => {
            this.shadowVal = shadowsInput.checked;
        }

        aboveViewInput.oninput = () => {
            this.aboveViewVal = aboveViewInput.checked;
        }

        cameraAfterPlayerInput.oninput = () => {
            this.cameraAfterPlayerVal = cameraAfterPlayerInput.checked;
        }

        fireplaceSizeInput.oninput = () => {
            this.fireplaceSizeVal = fireplaceSizeInput.value;
        }

        fireplaceWidthXInput.oninput = () => {
            this.fireplaceWidthXVal = fireplaceWidthXInput.value;
        }

        fireplaceWidthZInput.oninput = () => {
            this.fireplaceWidthZVal = fireplaceWidthZInput.value;
        }

        laserDispersionInput.oninput = () => {
            this.laserDispersionVal = laserDispersionInput.value;
        }

        laserScaleInput.oninput = () => {
            this.laserScaleVal = laserScaleInput.value;
        }
    }
}