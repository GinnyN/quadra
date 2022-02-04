import React, {useEffect, useState, useRef} from "react"
import Cell from "./cell"
import style  from "./style.module.css"
import { square } from "./selection";
import { activeOnArea } from "./ai";

const STYLES_GRID = {
    SQUARE: "square",
    STAR: "star"
}

const tiredObj = {
    'movement': false,
    'attack': false
}
const character = {
    "maxHP": 100,
    "currentHP": 100,
    "strength": 2,
    "active": false,
    "suceptible": false,
    "movement": {
        "amount": 2,
        "style": STYLES_GRID.SQUARE
    },
    "attack": {
        "amount": 1,
        "style": STYLES_GRID.SQUARE
    },
    "tiredObj": {

    }
}

const Grid = ({ map } ) => {

    const [cells, setCells] = useState([]);
    const playerActive = useRef({});
    const [showMenu, setShowMenu] = useState(false);
    const [teamRed, setTeamRed] = useState([]);
    const [teamBlue, setTeamBlue] = useState([]);
    const [turn, setTurn] = useState('red');

    useEffect (() => {
        const cells = [];
        const teamRed = [];
        const teamBlue = [];
        for(let x = 0; x < 10; x++) {
            cells[x] = [];
            for(let y = 0; y < 10; y++) {
                if(map[`${x}${y}`]) {
                    if(map[`${x}${y}`].player){
                        const newChar = {...character, ...map[`${x}${y}`].player, "tiredObj": {...tiredObj}} ;
                        cells[x].push({x, y, activated: false, ...map[`${x}${y}`], player: newChar });
                        if(newChar.team === "blue") teamBlue.push(newChar);
                        else teamRed.push(newChar);
                    } else cells[x].push({x, y, activated: false, ...map[`${x}${y}`], player: false});
                }
                else cells[x].push({x, y, player: false, activated: false, usable: true, onCross: false });
            }
        }
        setCells(cells);
        setTeamRed(teamRed);
        setTeamBlue(teamBlue);
    }, []);

    const movePlayer = (item, playerCurrent = false) => {
        if(!playerCurrent) playerCurrent = playerActive.current;
        const {x, y} = item;
        const temp = [...cells];
        temp[x][y].player = playerCurrent.player;
        temp[x][y].player.tiredObj.movement = true;
        temp[x][y].player.tired = (temp[x][y].player.tiredObj.movement && temp[x][y].player.tiredObj.attack);
        playerCurrent.player = false;
        setCells(temp);
        setShowMenu(false);
        resetBoard(temp[x][y].player);
    }

    const underAttack = ({x , y}, playerCurrent = false) => {
        if(!playerCurrent) playerCurrent = playerActive.current;
        const temp = [...cells];
        temp[x][y].player.currentHP -= temp[playerCurrent.x][playerCurrent.y].player.strength;
        temp[playerCurrent.x][playerCurrent.y].player.tiredObj.attack = true;
        temp[playerCurrent.x][playerCurrent.y].player.tired = (temp[playerCurrent.x][playerCurrent.y].player.tiredObj.attack && temp[playerCurrent.x][playerCurrent.y].player.tiredObj.movement);
        setCells(temp);
        setShowMenu(false);
        resetBoard(playerCurrent.player);
    }

    const changeTurn = () => {
        if(turn==='red'){
            const teamRedT = teamRed.map((item) => {
                item.tired = false;
                item.tiredObj = {...tiredObj};
                return item;
            });
            setTeamRed(teamRedT);
            setTurn('blue');
            const temp = [...cells];
            for(let i = 0; i < cells.length; i+=1){
                for(let z= 0; cells[i] && (z < cells[i].length); z+=1) {
                    if(cells[i][z].player && cells[i][z].player.team === 'blue') {
                        playerActive.current = cells[i][z];
                        if(!playerActive.current.player.tiredObj.attack) {
                            activateAttack(cells[i][z]);
                            const amount = cells[i][z].player.attack.amount;
                            for(let moveI = amount * -1 ; moveI <= amount; moveI+=1) {
                                for(let moveZ = amount * -1; moveZ <= amount; moveZ+=1) {
                                    if(cells[i+moveI] && cells[i+moveI][z+moveZ] && 
                                        cells[i+moveI][z+moveZ].onCross && 
                                        cells[i+moveI][z+moveZ].player && 
                                        cells[i+moveI][z+moveZ].player.team === 'red') {
                                        underAttack(cells[i+moveI][z+moveZ]);
                                        moveZ = moveI = z = 10000000000;
                                        i = -1;
                                    }
                                }
                            }
                            resetBoard(playerActive.current.player);
                        }
                    }
                }
            }
            for(let i = 0; i < cells.length; i+=1){
                for(let z= 0; cells[i] && (z < cells[i].length); z+=1) {
                    if(cells[i][z].player && cells[i][z].player.team === 'blue') {
                        playerActive.current = cells[i][z];
                        if(!playerActive.current.player.tiredObj.movement) {
                            const maxMov = activeOnArea(cells, cells[i][z]);
                            console.log(maxMov);
                            if(maxMov){
                                activateMove(cells[i][z]);
                                const amount = cells[i][z].player.movement.amount;
                                const signs = {x: maxMov.x < 0 ? -1:1, y: maxMov.y < 0 ? -1:1}

                                if(maxMov.x < 0) maxMov.x *= -1;
                                if(maxMov.y < 0) maxMov.y *= -1;
                                if(maxMov.x > amount) maxMov.x = amount;
                                if(maxMov.y > amount) maxMov.y = amount;
                                console.log(maxMov, signs);
                                for(let moveI = maxMov.x; moveI >= 0 ; moveI-=1) {
                                    for(let moveZ = maxMov.y; moveZ >= 0; moveZ-=1) {
                                        console.log(cells[i+(moveI*signs.x)] && cells[i+(moveI*signs.x)][z+(moveZ*signs.y)] && 
                                        (cells[i+(moveI*signs.x)][z+(moveZ*signs.y)].x !== cells[i][z].x &&
                                        cells[i+(moveI*signs.x)][z+(moveZ*signs.y)].y !== cells[i][z].y) &&
                                        cells[i+(moveI*signs.x)][z+(moveZ*signs.y)].activated &&
                                        !cells[i+(moveI*signs.x)][z+(moveZ*signs.y)].player);
                                        console.log(!cells[i+(moveI*signs.x)][z+(moveZ*signs.y)].player)
                                        if(cells[i+(moveI*signs.x)] && cells[i+(moveI*signs.x)][z+(moveZ*signs.y)] &&
                                            cells[i+(moveI*signs.x)][z+(moveZ*signs.y)].activated &&
                                            !cells[i+(moveI*signs.x)][z+(moveZ*signs.y)].player) {
                                            movePlayer(cells[i+(moveI*signs.x)][z+(moveZ*signs.y)], playerActive.current);
                                            moveZ = moveI = -1000;
                                            z = 10000000000;
                                            i = -1;
                                        } 
                                    }
                                }
                                if(playerActive.current.player) resetBoard(playerActive.current.player);
                            }
                        }
                    }
                }
            }
            const teamBlueT = teamBlue.map((item) => {
                item.tired = false;
                item.tiredObj = {...tiredObj};
                return item;
            });
            setTeamBlue(teamBlueT);
            setTurn('red');        
        } else {
            const teamBlueT = teamBlue.map((item) => {
                item.tired = false;
                item.tiredObj = {...tiredObj};
                return item;
            });
            setTeamBlue(teamBlueT);
            setTurn('red');
        }
    }

    const activateAttack = (item) => {
        resetBoard(item.player);
        if(item.player.tiredObj.attack) return;
        let temp = [...cells];  
        temp = square(item, temp, "onCross", true, ["player", "suceptible"], true);
        setCells(temp);
    }

    const activateMove = (item) => {
        resetBoard(item.player);
        if(item.player.tiredObj.movement) return;
        const temp = [...cells];
        const {x, y} = item;
        setCells(square(item, temp, "activated", true));
    }

    const resetBoard = (player) => {
        const {x, y} = playerActive.current;
        let temp = [...cells];
        temp = square({x, y, player}, temp, "activated", false);
        temp = square({x, y, player}, temp, "onCross", false, ["player", "suceptible"], false);
        setCells(temp);
    }

    const openMenu = (item) => {
        if(playerActive.current.x){
            playerActive.current ={};
        }
        playerActive.current = item;
        setShowMenu(true);
    }

    return <div className={style.playboard}>
        <div className={style.gridSetting}>
        {cells.map((arrayX) => arrayX.map((item) => <Cell 
                onMove={movePlayer}
                x={item.x} 
                y={item.y} 
                player={item.player}
                activated={item.activated}
                usable={item.usable}
                onCross={item.onCross}
                turn={turn}
                underAttack={() => underAttack(item)}
                openMenu={() => openMenu(item)}
            />))}   
        </div>
        <div>
            <p>Turn {turn}</p>
            <button onClick={changeTurn}>End Turn</button>
            <ul>
                <li>Team Red</li>
                {teamRed.map((item, index)=> <li>{index}: {item.currentHP}/{item.maxHP}</li>)}
                <li>Team Blue</li>
                {teamBlue.map((item, index)=> <li>{index}: {item.currentHP}/{item.maxHP}</li>)}
            </ul>
            {showMenu && <div className={style.menu}>
                <ul>
                    <li onClick={() => activateMove(playerActive.current)}>Move</li>
                    <li onClick={() => activateAttack(playerActive.current)}>Attack</li>
                </ul>
            </div> }
        </div>
    </div>;
}

export default Grid;