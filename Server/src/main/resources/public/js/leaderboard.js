/**
 * @typedef {{id: number, x: number, y: number, z: number, type: string}} levelDataList
 */

let table = document.getElementById("leadersTable");

let blockColors = {
    "wall": "#21ae21",
    "enemy": "#c42121",
    "treasure":  "#2346d0",
    "light": "#e2e225",
}

function start(){
    fetch('/getLeaderboard')
        .then(response => response.json())
        .then(dataFromServer => {
            let data = sortData(dataFromServer);
            for(let i in data){
                createRow(data[i])
            }
            for(let i = 0; i < table.children.length; i++){
                if(i % 2 == 0){
                    table.children[i].style.backgroundColor = "rgba(255,255,255,0.05)"
                }
            }
        })
}

function sortData(data){

    let arrayData = [];

    for(let i in data){
        arrayData.push(data[i]);
    }

    let newData = arrayData.sort((a,b) => {return a.time - b.time})
    console.log(newData);

    return newData;
}

/**
 * @param {{nick: string, score: number, time: number, level: string}} rowData
 */
function createRow(rowData){
    let tableRow = document.createElement("tr");

    let td1 = document.createElement("td");
    let mapMiniature = createMapMiniature(rowData.level);
    td1.appendChild(mapMiniature)
    tableRow.appendChild(td1);

    let td2 = document.createElement("td");
    let spanNick = createColorSpan(rowData.nick, 'white')
    td2.appendChild(spanNick)
    tableRow.appendChild(td2);

    let td3 = document.createElement("td");
    let spanScore = createColorSpan(rowData.score, 'rgb(248, 179, 127)')
    td3.appendChild(spanScore)
    tableRow.appendChild(td3);

    let td4 = document.createElement("td");

    let hours = Math.floor((rowData.time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((rowData.time % (1000 * 60 * 60)) / (1000 * 60));
    let secunds = Math.round((rowData.time % (1000 * 60)) / 1000);

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

    let newTime = `${strHours}:${strMinutes}:${strSecunds}`

    let spanTime = createColorSpan(newTime, 'rgb(206, 53, 53)')
    td4.appendChild(spanTime)
    tableRow.appendChild(td4);

    table.appendChild(tableRow);
}

/**
 * @param {string} data
 */
function createMapMiniature(data){
    /**
     * @type {{size: number, list: levelDataList[]}}
     */
    let mapData = JSON.parse(data);
    let mapMiniature = document.createElement("canvas");
    mapMiniature.classList.add("mapMiniature");
    mapMiniature.width = 100;
    mapMiniature.height = 100;

    let mapCTX = mapMiniature.getContext("2d");

    let standardBlockSize = (100 / mapData.size);
    let blockSize = standardBlockSize - 2;

    console.log(mapData)
    mapData.list.forEach( e => {
        mapCTX.beginPath();
        mapCTX.fillStyle = blockColors[e.type];
        mapCTX.rect((e.x * standardBlockSize) + 1, (e.z * standardBlockSize)+1, blockSize, blockSize);
        mapCTX.fill();
        mapCTX.closePath();

        console.log((e.x * standardBlockSize) + 1, (e.z * standardBlockSize)+1, blockSize, blockSize)
    })

    return mapMiniature;
}

function createColorSpan(text, color){
    let span = document.createElement("span");
    span.classList.add("rowSpan");
    span.style.color = color;
    span.innerText = text

    return span
}

start();