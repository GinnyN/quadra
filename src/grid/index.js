import React, {useEffect, useState, useRef, useMemo} from "react"
import Cell from "./cell"
import style  from "./style.module.css"
import { square } from "./selection";
import { activeOnArea } from "./ai";
import 'animate.css';

const STYLES_GRID = {
    SQUARE: "square",
    STAR: "star"
}

const tiredObj = {
    'movement': false,
    'attack': false
}

const crit = 3;

const characterClasses = {
    "scout": {
        "maxHP": 20,
        "currentHP": 20,
        "strength": 4,
        "luck": 2,
        "active": false,
        "suceptible": false,
        "movement": {
            "amount": 4,
            "style": STYLES_GRID.SQUARE
        },
        "attack": {
            "amount": 1,
            "style": STYLES_GRID.SQUARE
        },
    },
    "soldier": {
        "maxHP": 30,
        "currentHP": 30,
        "strength": 4,
        "luck": 3,
        "active": false,
        "suceptible": false,
        "movement": {
            "amount": 2,
            "style": STYLES_GRID.SQUARE
        },
        "attack": {
            "amount": 3,
            "style": STYLES_GRID.SQUARE
        },
    }
}

const Grid = ({ map, setWinner } ) => {

    const [cells, setCells] = useState([]);
    const playerActive = useRef({});
    const [showMenu, setShowMenu] = useState(false);
    const [teamRed, setTeamRed] = useState([]);
    const [teamBlue, setTeamBlue] = useState([]);
    const [turn, setTurn] = useState('red');

    const pieceOn = useMemo(() => new Audio(require('./../audio/pieceOn.mp3')), []);
    const pieceSlide = useMemo(() => new Audio(require('./../audio/pieceSlide.mp3')), []);
    const punch = useMemo(() => new Audio(require('./../audio/punch.mp3')), []);
    const buttonClick = useMemo(() => new Audio(require('./../audio/buttonClick.mp3')), []);
    const explosion = useMemo(() => new Audio(require('./../audio/explosion.mp3')), []);

    useEffect (() => {
        const cells = [];
        const teamRed = [];
        const teamBlue = [];
        for(let x = 0; x < 10; x++) {
            cells[x] = [];
            for(let y = 0; y < 10; y++) {
                if(map[`${x}${y}`]) {
                    if(map[`${x}${y}`].player){
                        const newChar = {...characterClasses[map[`${x}${y}`].player.class], ...map[`${x}${y}`].player} ;
                        newChar.tiredObj = {...tiredObj};
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

    const checkWinner = () => {
        if(teamBlue.reduce((sum, item) => {
            const temp = sum + item.currentHP;
            return temp;
        }, 0) <= 0) {
            setWinner('red');
        } else if(teamRed.reduce((sum, item) => {
            const temp = sum + item.currentHP;
            return temp;
        }, 0) <= 0) {
            setWinner('blue');
        }
    };

    const movePlayer = (item, playerCurrent = false) => {
        if(!playerCurrent) playerCurrent = playerActive.current;
        const {x, y} = item;
        const temp = [...cells];
        temp[x][y].player = playerCurrent.player;
        temp[x][y].player.tiredObj.movement = true;
        temp[x][y].player.tired = (temp[x][y].player.tiredObj.movement && temp[x][y].player.tiredObj.attack);
        playerCurrent.player = false;
        setCells(temp);
        pieceSlide.play();
        setShowMenu(false);
        resetBoard(temp[x][y].player);
    }

    const underAttack = async ({x , y}, playerCurrent = false) => {
        if(!playerCurrent) playerCurrent = playerActive.current;
        const temp = [...cells];
        const innerCrit = (Math.random() * 20) < temp[playerCurrent.x][playerCurrent.y].player.luck;
        if(innerCrit) {
            temp[x][y].player.currentHP -= temp[playerCurrent.x][playerCurrent.y].player.strength * crit; 
        } else {
            temp[x][y].player.currentHP -= temp[playerCurrent.x][playerCurrent.y].player.strength;
        }
        temp[playerCurrent.x][playerCurrent.y].player.tiredObj.attack = true;
        temp[playerCurrent.x][playerCurrent.y].player.tired = (temp[playerCurrent.x][playerCurrent.y].player.tiredObj.attack && temp[playerCurrent.x][playerCurrent.y].player.tiredObj.movement);
        if(temp[x][y].player.currentHP > 0) temp[x][y].player.attacked = true;
        setCells(temp);
        if(innerCrit) explosion.play();
        else punch.play();

        await new Promise((resolve) => setTimeout(resolve, 500));
        if(temp[x][y].player.currentHP <= 0) temp[x][y].player = false;
        else temp[x][y].player.attacked = false;
        setCells(temp);
        setShowMenu(false);
        resetBoard(playerCurrent.player);
        checkWinner();
    }

    const changeTurn = async () => {

        if(playerActive.current.player) resetBoard(playerActive.current.player);
        playerActive.current = {};
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
                            await new Promise((resolve) => setTimeout(resolve, 200));
                            activateAttack(cells[i][z]);
                            pieceOn.play();
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
                            if(maxMov){
                                activateMove(cells[i][z]);
                                const amount = cells[i][z].player.movement.amount;
                                const signs = {x: maxMov.x < 0 ? -1:1, y: maxMov.y < 0 ? -1:1}

                                if(maxMov.x < 0) maxMov.x *= -1;
                                if(maxMov.y < 0) maxMov.y *= -1;
                                if(maxMov.x > amount) maxMov.x = amount;
                                if(maxMov.y > amount) maxMov.y = amount;
                                pieceOn.play();
                                await new Promise((resolve) => setTimeout(resolve, 900));
                                for(let moveI = maxMov.x; moveI >= 0 ; moveI-=1) {
                                    for(let moveZ = maxMov.y; moveZ >= 0; moveZ-=1) {
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
            if(playerActive.current.player) resetBoard(playerActive.current.player);
            playerActive.current ={};
        }
        playerActive.current = item;
        setShowMenu(true);
        pieceOn.play();
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
            <h1>Quadra</h1>
            <p>Turn {turn}</p>
            <button onClick={changeTurn}>End Turn</button>
            {showMenu && <div className={style.menu}>
                <ul>
                    {playerActive.current && 
                    !(playerActive.current.player.tiredObj.movement) && 
                    <li><button onClick={() => {
                        buttonClick.play();
                        activateMove(playerActive.current);
                    }}>Move</button></li>}
                    {playerActive.current && 
                    !(playerActive.current.player.tiredObj.attack) && 
                    <li><button onClick={() => {
                        buttonClick.play();
                        activateAttack(playerActive.current);
                    }}>Attack</button></li>}
                </ul>
            </div> }
        </div>
    </div>;
}

export default Grid;