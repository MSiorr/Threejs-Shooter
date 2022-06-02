let left = document.querySelector("#left");
let center = document.querySelector("#center");
let right = document.querySelector("#right");

let arenaSize = 10;
let arenaData = [];
let arenaFields = [];
let outputData = [];
let testLevel = '[{"id":12,"x":1,"y":0,"z":2,"type":"wall"},{"id":13,"x":1,"y":0,"z":3,"type":"wall"},{"id":14,"x":1,"y":0,"z":4,"type":"wall"},{"id":15,"x":1,"y":0,"z":5,"type":"wall"},{"id":16,"x":1,"y":0,"z":6,"type":"wall"},{"id":17,"x":1,"y":0,"z":7,"type":"wall"},{"id":21,"x":2,"y":0,"z":1,"type":"wall"},{"id":22,"x":2,"y":0,"z":2,"type":"light"},{"id":23,"x":2,"y":0,"z":3,"type":"enemy"},{"id":27,"x":2,"y":0,"z":7,"type":"light"},{"id":28,"x":2,"y":0,"z":8,"type":"wall"},{"id":31,"x":3,"y":0,"z":1,"type":"wall"},{"id":32,"x":3,"y":0,"z":2,"type":"treasure"},{"id":33,"x":3,"y":0,"z":3,"type":"enemy"},{"id":36,"x":3,"y":0,"z":6,"type":"enemy"},{"id":38,"x":3,"y":0,"z":8,"type":"wall"},{"id":41,"x":4,"y":0,"z":1,"type":"wall"},{"id":42,"x":4,"y":0,"z":2,"type":"light"},{"id":44,"x":4,"y":0,"z":4,"type":"treasure"},{"id":45,"x":4,"y":0,"z":5,"type":"treasure"},{"id":48,"x":4,"y":0,"z":8,"type":"wall"},{"id":51,"x":5,"y":0,"z":1,"type":"wall"},{"id":52,"x":5,"y":0,"z":2,"type":"light"},{"id":54,"x":5,"y":0,"z":4,"type":"treasure"},{"id":55,"x":5,"y":0,"z":5,"type":"treasure"},{"id":58,"x":5,"y":0,"z":8,"type":"wall"},{"id":61,"x":6,"y":0,"z":1,"type":"wall"},{"id":62,"x":6,"y":0,"z":2,"type":"treasure"},{"id":63,"x":6,"y":0,"z":3,"type":"enemy"},{"id":66,"x":6,"y":0,"z":6,"type":"enemy"},{"id":71,"x":7,"y":0,"z":1,"type":"wall"},{"id":72,"x":7,"y":0,"z":2,"type":"light"},{"id":73,"x":7,"y":0,"z":3,"type":"enemy"},{"id":77,"x":7,"y":0,"z":7,"type":"light"},{"id":78,"x":7,"y":0,"z":8,"type":"wall"},{"id":82,"x":8,"y":0,"z":2,"type":"wall"},{"id":83,"x":8,"y":0,"z":3,"type":"wall"},{"id":84,"x":8,"y":0,"z":4,"type":"wall"},{"id":85,"x":8,"y":0,"z":5,"type":"wall"},{"id":86,"x":8,"y":0,"z":6,"type":"wall"},{"id":87,"x":8,"y":0,"z":7,"type":"wall"}]';

let colors = {
    "wall": "#21ae21",
    "enemy": "#c42121",
    "treasure":  "#2346d0",
    "light": "#e2e225",
    "delete": "white",
    "save": "black",
    "saveTest": "black",
    "load": "black"
}

let currentItem = null;

let outputTextArea = null;
let buttonsList = [
    {name: "Save level on server", type: "action", value: "save"},
    {name: "Save test level on server", type: "action", value: "saveTest"},
    {name: "Load level from server", type: "action", value: "load"},
    {name: "Wall", type: "item", clicked: false, value: "wall"},
    {name: "Enemy", type: "item", clicked: false, value: "enemy"},
    {name: "Tresure", type: "item", clicked: false, value: "treasure"},
    {name: "Light", type: "item", clicked: false, value: "light"},
    {name: "Delete", type: "item", clicked: false, value: "delete"}
]

createArena();
createMenuButtons();
createOutputData();

function createArena() {
    let arena = document.createElement("div");
    arena.id = "arena";
    for(let i = 0; i < arenaSize; i++){
        let arenaColumn = document.createElement("div");
        arenaColumn.classList.add("arenaColumn");
        arenaData.push([]);
        arenaFields.push([]);
        for(let j = 0; j < arenaSize; j++){
            let field = document.createElement("div");
            field.classList.add("field");

            field.onclick = (e) => {
                if(currentItem != null){
                    if(currentItem.item != "delete"){
                        e.target.style.backgroundColor = currentItem.color;
                        arenaData[i][j] = {
                            id: (arenaSize * i) + j,
                            x: i,
                            y: 0,
                            z: j,
                            type: currentItem.item
                        }
                    } else {
                        e.target.style.backgroundColor = "transparent";
                        arenaData[i][j] = null;
                    }
                    outputData = [];
                    arenaData.forEach( e => {
                        e.forEach( k => {
                            if(k != null){
                                outputData.push(k);
                            }
                        })
                    })
                    outputTextArea.value = JSON.stringify(outputData,null,4)
                } else {
                    alert("Choose item first!")
                }
            }
            arenaData[i][j] = null;
            arenaFields[i][j] = field;
            arenaColumn.appendChild(field);
        }
        arena.appendChild(arenaColumn);
    }
    center.appendChild(arena);
}

function createMenuButtons() {
    let moveToItem = false;
    console.log("BG")
    let btnTable = [];
    let menu = document.createElement("div");
    menu.id = "menu";
    buttonsList.forEach( e => {
        let button = document.createElement("div");
        button.classList.add("menuButton");
        button.innerText = e.name;
        button.style.border = `4px solid ${colors[e.value]}`
        if(e.type == "item" && moveToItem == false){
            moveToItem = true;
            button.style.margin = "50px 0 0 0";
        }

        button.onmouseover = (el) => {
            el.target.style.backgroundColor = colors[e.value];
            if(colors[e.value] == "white" || colors[e.value] == "#e2e225"){
                el.target.style.color = "black";
            }
        }
        button.onmouseout = (el) => {
            if(e.clicked == false || e.clicked == undefined){
                el.target.style.backgroundColor = "transparent";
                if(colors[e.value] == "white" || colors[e.value] == "#e2e225"){
                    el.target.style.color = "white";
                }
            }
        }
        button.onclick = (el) => {
            if(e.type == "item"){
                btnTable.forEach( i => {
                    i.style.backgroundColor = "transparent";
                    i.style.color = "white";
                })
                buttonsList.forEach( i => {
                    i.clicked = false;
                })
                e.clicked = !e.clicked;
                currentItem = {item: e.value, color: colors[e.value]};
                el.target.style.backgroundColor = colors[e.value];
                if(colors[e.value] == "white" || colors[e.value] == "#e2e225"){
                    el.target.style.color = "black";
                }
            } else {
                switch(e.value){
                    case "save": {
                        let json = JSON.stringify({
                            size: arenaSize,
                            list: outputData
                        })
                        saveFetch(json)
                        break;
                    }
                    case "saveTest": {
                        let json = JSON.stringify({
                            size: arenaSize,
                            list: JSON.parse(testLevel)
                        })
                        saveFetch(json)
                        break;
                    }
                    case "load": {
                        fetch("/load", {method: "POST"})
                            .then(response => response.json())
                            .then(data => {
                                readLoadedData(data.list)
                            })
                        break;
                    }
                }
                function saveFetch(data){
                    fetch("/add", {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: data
                    })
                        .then(response => response.json())
                        .then(data => {
                            alert(data)
                        })
                }

                function readLoadedData(data){
                    arenaFields.forEach( e => {
                        e.forEach( i => {
                            i.removeAttribute("style");
                        })
                    })
                    for(let i = 0; i < arenaData.length; i++){
                        for(let j = 0; j < arenaData[i].length; j++){
                            arenaData[i][j] = null;
                        }
                    }
                    data.forEach( e => {
                        arenaFields[e.x][e.z].style.backgroundColor = colors[e.type];
                        arenaData[e.x][e.z] = {
                            id: e.id,
                            x: e.x,
                            y: e.y,
                            z: e.z,
                            type: e.type
                        }
                    })
                    outputData = [];
                    arenaData.forEach( e => {
                        e.forEach( k => {
                            if(k != null){
                                outputData.push(k);
                            }
                        })
                    })
                    outputTextArea.value = JSON.stringify(outputData,null,4)
                }
            }
        }

        menu.appendChild(button);
        btnTable.push(button);
    })
    right.appendChild(menu);

}

function createOutputData() {
    outputTextArea = document.createElement("textarea");
    outputTextArea.id = "outputTextArea";
    outputTextArea.readOnly = true;
    outputTextArea.value = JSON.stringify(outputData, null, 4)
    left.appendChild(outputTextArea);
}

/*
TODO
- Klient WebGL
*/