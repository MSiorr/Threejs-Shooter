//@ts-ignore
import enemyProfile from '../assets/enemyProfile.png';
//@ts-ignore
import playerProfile from '../assets/playerProfile.png';
import Enemy from './Enemy';

export default class HUD {
    /**
     * @param {HTMLElement} domElement
     */
    constructor(domElement){
        this.domElement = domElement;

        this.mainDIV = document.createElement("div");
        this.mainDIV.id = "hudMainDiv";
        this.domElement.appendChild(this.mainDIV);

        this.enemiesList = document.createElement("div");
        this.enemiesList.id = "hudEnemiesList";
        this.mainDIV.appendChild(this.enemiesList);

        this.playerInfo = document.createElement("div");
        this.playerInfo.id = "hudPlayerInfo";
        this.mainDIV.appendChild(this.playerInfo);
    }

    /**
     * @param {Enemy[]} enemiesList
     * @param {import("./Player").default} player
     */
    Update(enemiesList, player){
        this.enemiesList.innerHTML = "";
        enemiesList.forEach( e => {
            let enemyListItem = document.createElement("div");
            enemyListItem.classList.add("hudEnemyListItem");
            this.enemiesList.appendChild(enemyListItem);

            let profilePng = document.createElement('img')
            profilePng.src = enemyProfile;
            profilePng.classList.add("hudProfilePng");
            if(e.HP == 0){
                profilePng.classList.add("hudProfilePngDead");
            }
            enemyListItem.appendChild(profilePng);

            let HPBarContainer = document.createElement("div");
            HPBarContainer.classList.add("hudEnemyHPBarContainer");
            enemyListItem.appendChild(HPBarContainer);

            let HPBar = document.createElement("div");
            HPBar.classList.add("hudHPBar");
            HPBar.style.width = `${(e.HP / e.maxHP) * 100}%`;
            HPBarContainer.appendChild(HPBar);

            let HPInfo = document.createElement("div");
            HPInfo.classList.add("hudHPInfo");
            HPInfo.innerText = `HP: ${Math.ceil(e.HP)}`;
            HPBarContainer.appendChild(HPInfo);
        })

        this.playerInfo.innerHTML = '';

        let basePlayerInfo = document.createElement("div");
        basePlayerInfo.id = "hudBasePlayerInfo";
        this.playerInfo.appendChild(basePlayerInfo);

        let barsContainer = document.createElement("div");
        barsContainer.id = "hudBarsContainer";
        basePlayerInfo.appendChild(barsContainer);

        let playerHPBarContainer = document.createElement("div");
        playerHPBarContainer.classList.add('hudPlayerHPBarContainer');
        barsContainer.appendChild(playerHPBarContainer);

        let playerHPBar = document.createElement("div");
        playerHPBar.classList.add("hudHPBar");
        playerHPBar.style.width = `${(player.HP / player.maxHP) * 100}%`
        playerHPBarContainer.appendChild(playerHPBar);

        let playerHPInfo = document.createElement("div");
        playerHPInfo.classList.add("hudHPInfo");
        playerHPInfo.innerText = `HP: ${player.HP}`;
        playerHPBarContainer.appendChild(playerHPInfo);

        let playerAmmoBarContainer = document.createElement("div");
        playerAmmoBarContainer.id = "hudPlayerAmmoBarContainer"
        barsContainer.appendChild(playerAmmoBarContainer);

        let playerAmmoBar = document.createElement("div");
        playerAmmoBar.id = "hudPlayerAmmoBar";
        playerAmmoBar.style.width = `${(player.ammo / player.maxAmmo) * 100}%`
        playerAmmoBarContainer.appendChild(playerAmmoBar);

        let playerAmmoInfo = document.createElement("div");
        playerAmmoInfo.id = "hudPlayerAmmoInfo";
        playerAmmoInfo.innerText = `AMMO: ${player.ammo}/${player.maxAmmo}`
        playerAmmoBarContainer.appendChild(playerAmmoInfo);

        let playerProfilePng = document.createElement("img");
        playerProfilePng.src = playerProfile;
        playerProfilePng.id = "playerProfilePng";
        if(player.HP == 0){
            playerProfilePng.classList.add("hudProfilePngDead");
        }
        basePlayerInfo.appendChild(playerProfilePng)

        let scoreInfo = document.createElement("div");
        scoreInfo.id = "hudScoreInfo";
        scoreInfo.innerHTML = `<span class='infoLeft'>SCORE: </span><span class='infoRight'>${player.score}</span>`
        this.playerInfo.appendChild(scoreInfo);

    }
}