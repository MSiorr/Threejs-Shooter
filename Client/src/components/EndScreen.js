import Enemy from "./Enemy";

export default class EndScreen{
    /**
     * @param {HTMLElement} domElement
     */
    constructor(domElement){
        this.domElement = domElement;

        this.created = false;

        this.mainDiv = document.createElement("div");
        this.mainDiv.id = "endScreenMainDiv";
        this.mainDiv.style.opacity = '0';
        this.domElement.appendChild(this.mainDiv);
    }

    /**
     * @param {number} time
     * @param {number} score
     * @param {Enemy[]} enemyList
     * @param {any} mapData
     */
    CreateVictoryScreen(time, score, enemyList, mapData){
        console.log(mapData);

        let victoryDiv = document.createElement("div");
        victoryDiv.id = "victoryDiv";
        this.mainDiv.appendChild(victoryDiv);

        let title = document.createElement("div");
        title.id = "endTitle";
        title.innerText = "!!! Congratulations !!!"
        victoryDiv.appendChild(title);

        let scoreTable = document.createElement("div");
        scoreTable.id = "endScoreTable";
        victoryDiv.appendChild(scoreTable);
        
        let scoreSpan = document.createElement("div");
        scoreSpan.id = "endScoreSpan";
        scoreSpan.innerHTML = `<span class='endLeft'>SCORE:</span> <span>${score}</span>`;
        scoreTable.appendChild(scoreSpan);

        let timeSpan = document.createElement("div");
        timeSpan.id = "endTimeSpan";

        let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        let secunds = Math.round((time % (1000 * 60)) / 1000);

        let strHours = `${hours}`
        let strMinutes = `${minutes}`
        let strSecunds = `${secunds}`

        if(hours <= 9){
            strHours = `0${hours}`
        }
        if(minutes <= 9){
            strMinutes = `0${minutes}`
        }
        if(secunds <= 9){
            strSecunds = `0${secunds}`;
        }

        timeSpan.innerHTML = `<span class='endLeft'>TIME:</span> <span>${strHours}:${strMinutes}:${strSecunds}</span>`;
        scoreTable.appendChild(timeSpan);

        let killsSpan = document.createElement("div");
        killsSpan.id = "endKillsSpan";
        killsSpan.innerHTML = `<span class='endLeft'>KILLS:</span> <span>${enemyList.length}</span>`;
        scoreTable.appendChild(killsSpan);

        let inputDiv = document.createElement("div");
        inputDiv.id = "endInputDiv";
        victoryDiv.appendChild(inputDiv);

        let inputLabel = document.createElement("label");
        inputLabel.id = "endInputLabel";
        inputLabel.innerText = "Podaj nick: "
        inputDiv.appendChild(inputLabel)

        let nickInput = document.createElement("input");
        nickInput.id = "endNickInput";
        inputDiv.appendChild(nickInput);

        let confirmBtn = document.createElement("button");
        confirmBtn.id = "endConfirmBtn";
        confirmBtn.innerText = "Save";
        victoryDiv.appendChild(confirmBtn);

        this.mainDiv.style.transition = 'opacity 4s';
        this.mainDiv.style.opacity = '1';   

        confirmBtn.onclick = () => {
            if(nickInput.value != ''){
                this.AddRecordToDatabase(nickInput.value, score, time, mapData)
            }
        }
    }

    CreateLoseScreen(){
        let loseDiv = document.createElement("div");
        loseDiv.id = "loseDiv";
        this.mainDiv.appendChild(loseDiv);

        let title = document.createElement("div");
        title.id = "endLoseTitle";
        title.innerText = "!!! YOU LOSE !!!"
        loseDiv.appendChild(title);

        let refreshBtn = document.createElement("btn");
        refreshBtn.id = "endRefreshBtn";
        refreshBtn.innerText = "Try one more time";
        loseDiv.appendChild(refreshBtn);

        this.mainDiv.style.transition = 'opacity 4s';
        this.mainDiv.style.opacity = '1'; 

        refreshBtn.onclick = () => {
            location.reload();
        }
    }

    AddRecordToDatabase(nick, score, time, level){
        let data = JSON.stringify({
            nick: nick,
            score: score,
            time: time,
            level: JSON.stringify(level)
        })

        fetch("http://localhost:5000/addRecord", {
            method: "POST",
            body: data
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                location.reload();
            })
    }
}