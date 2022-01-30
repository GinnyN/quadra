import React, {useEffect, useState} from "react"
import Cell from "./cell"
import style  from "./style.module.css"

const character = {
    "maxHP": 100,
    "currentHP": 100,
    "strength": 2,
    "active": false,
    "suceptible": false,
}

const Grid = ({ map } ) => {

    const [cells, setCells] = useState([]);
    const [playerActive, setPlayerActive] = useState({});
    const [teamRed, setTeamRed] = useState([]);
    const [teamBlue, setTeamBlue] = useState([]);
    const [turn, setTurn] = useState('red');

    useEffect (() => {
        const cells = [];
        const teamRed = [];
        const teamBlue = [];
        for(let x = 0; x < 10; x++) {
            for(let y = 0; y < 10; y++) {
                if(map[`${x}${y}`]) {
                    if(map[`${x}${y}`].player){
                        const newChar = {...character, ...map[`${x}${y}`].player} ;
                        cells.push({x, y, activated: false, ...map[`${x}${y}`], player: newChar });
                        if(newChar.team === "blue") teamBlue.push(newChar);
                        else teamRed.push(newChar);
                    } else cells.push({x, y, activated: false, ...map[`${x}${y}`], player: false});
                }
                else cells.push({x, y, player: false, activated: false, usable: true, onCross: false });
            }
        }
        setCells(cells);
        setTeamRed(teamRed);
        setTeamBlue(teamBlue);
    }, []);

    const inactivateCurrentPlayer = ({x,y}) => {
        const temp = [...cells];
        temp[10*x + y].player.tired = true;
        if(temp[(10*playerActive.x)-1+playerActive.y]) temp[(10*playerActive.x)-1+playerActive.y].activated = false;
        if(temp[(10*playerActive.x)+1+playerActive.y]) temp[(10*playerActive.x)+1+playerActive.y].activated = false;
        if(temp[(10*(playerActive.x-1))+playerActive.y]) temp[(10*(playerActive.x-1))+playerActive.y].activated = false;
        if(temp[(10*(playerActive.x+1))+playerActive.y]) temp[(10*(playerActive.x+1))+playerActive.y].activated = false;
        setCells(temp);
    }

    const removeCrossCurrentPlayer = ({x,y}) => {
        const temp = [...cells];
        temp[10*x + y].player.tired = true;
        if(temp[(10*playerActive.x)-1+playerActive.y]) temp[(10*playerActive.x)-1+playerActive.y].onCross = false;
        if(temp[(10*playerActive.x)+1+playerActive.y]) temp[(10*playerActive.x)+1+playerActive.y].onCross = false;
        if(temp[(10*(playerActive.x-1))+playerActive.y]) temp[(10*(playerActive.x-1))+playerActive.y].onCross = false;
        if(temp[(10*(playerActive.x+1))+playerActive.y]) temp[(10*(playerActive.x+1))+playerActive.y].onCross = false;
        setCells(temp);
    }

    const movePlayer = ({x, y}) => {
        const temp = [...cells];
        temp[10*x + y].player = temp[10*playerActive.x + playerActive.y].player;
        if(temp[10*playerActive.x + playerActive.y]) temp[10*playerActive.x + playerActive.y].player = false;
        setCells(temp);
        inactivateCurrentPlayer({x, y});
    }

    const underAttack = ({x , y}) => {
        const temp = [...cells];
        temp[10*x + y].player.currentHP -= temp[10*playerActive.x + playerActive.y].player.strength;
        setCells(temp);
        removeCrossCurrentPlayer(playerActive);
    }

    const changeTurn = () => {
        if(turn==='red'){
            const teamRedT = teamRed.map((item) => {
                item.tired = false;
                return item;
            });
            setTeamRed(teamRedT);
            setTurn('blue');
        } else {
            const teamBlueT = teamBlue.map((item) => {
                item.tired = false;
                return item;
            });
            setTeamBlue(teamBlueT);
            setTurn('red');
        }
    }

    const activateAttack = ({x, y}) => {
        const temp = [...cells];
        if(playerActive.x === x && playerActive.y === y) {
            if(temp[(10*x)-1+y]) {
                if(temp[(10*x)-1+y].player) temp[(10*x)-1+y].player.suceptible = false; 
                temp[(10*x)-1+y].onCross = false;
            }
            if(temp[(10*x)+1+y]){
                if(temp[(10*x)+1+y].player) temp[(10*x)+1+y].player.suceptible = false; 
                temp[(10*x)+1+y].onCross = false;
            }
            if(temp[(10*(x-1))+y]){ 
                if(temp[(10*(x-1))+y].player) temp[(10*(x-1))+y].player.suceptible = false; 
                temp[(10*(x-1))+y].onCross = false;
            }
            if(temp[(10*(x+1))+y]) {
                if(temp[(10*(x+1))+y].player) temp[(10*(x+1))+y].player.suceptible = false; 
                temp[(10*(x+1))+y].onCross = false;
            }
            setPlayerActive({});
        } else {
            if(playerActive.x) {
                const {x, y} = playerActive;
                if(temp[(10*x)-1+y]) {
                    if(temp[(10*x)-1+y].player) temp[(10*x)-1+y].player.suceptible = false; 
                    temp[(10*x)-1+y].onCross = false;
                }
                if(temp[(10*x)+1+y]){
                    if(temp[(10*x)+1+y].player) temp[(10*x)+1+y].player.suceptible = false; 
                    temp[(10*x)+1+y].onCross = false;
                }
                if(temp[(10*(x-1))+y]){ 
                    if(temp[(10*(x-1))+y].player) temp[(10*(x-1))+y].player.suceptible = false; 
                    temp[(10*(x-1))+y].onCross = false;
                }
                if(temp[(10*(x+1))+y]) {
                    if(temp[(10*(x+1))+y].player) temp[(10*(x+1))+y].player.suceptible = false; 
                    temp[(10*(x+1))+y].onCross = false;
                }
            }
            if(temp[(10*x)-1+y]) {
                if(temp[(10*x)-1+y].player) temp[(10*x)-1+y].player.suceptible = true; 
                temp[(10*x)-1+y].onCross = true;
            }
            if(temp[(10*x)+1+y]){
                if(temp[(10*x)+1+y].player) temp[(10*x)+1+y].player.suceptible = true; 
                temp[(10*x)+1+y].onCross = true;
            }
            if(temp[(10*(x-1))+y]){ 
                if(temp[(10*(x-1))+y].player) temp[(10*(x-1))+y].player.suceptible = true; 
                temp[(10*(x-1))+y].onCross = true;
            }
            if(temp[(10*(x+1))+y]) {
                if(temp[(10*(x+1))+y].player) temp[(10*(x+1))+y].player.suceptible = true; 
                temp[(10*(x+1))+y].onCross = true;
            }
            setPlayerActive({x, y});
        }
        setCells(temp);
    }

    const activateMove = ({x, y}) => {
        const temp = [...cells];
        if(playerActive.x === x && playerActive.y === y) {
            if(temp[(10*x)-1+y]) temp[(10*x)-1+y].activated = false;
            if(temp[(10*x)+1+y]) temp[(10*x)+1+y].activated = false;
            if(temp[(10*(x-1))+y]) temp[(10*(x-1))+y].activated = false;
            if(temp[(10*(x+1))+y]) temp[(10*(x+1))+y].activated = false;
            setPlayerActive({});
        } else {
            if(playerActive.x) {
                const {x, y} = playerActive;
                if(temp[(10*x)-1+y]) temp[(10*x)-1+y].activated = false;
                if(temp[(10*x)+1+y]) temp[(10*x)+1+y].activated = false;
                if(temp[(10*(x-1))+y]) temp[(10*(x-1))+y].activated = false;
                if(temp[(10*(x+1))+y]) temp[(10*(x+1))+y].activated = false;
            }
            if(temp[(10*x)-1+y]) temp[(10*x)-1+y].activated = true;
            if(temp[(10*x)+1+y]) temp[(10*x)+1+y].activated = true;
            if(temp[(10*(x-1))+y])temp[(10*(x-1))+y].activated = true;
            if(temp[(10*(x+1))+y]) temp[(10*(x+1))+y].activated = true;
            setPlayerActive({x, y});
        }
        setCells(temp);
    }

    return <div className={style.playboard}>
        <div className={style.gridSetting}>
        {cells.map((item) => <Cell 
                onMove={movePlayer}
                x={item.x} 
                y={item.y} 
                player={item.player}
                activated={item.activated}
                usable={item.usable}
                onCross={item.onCross}
                turn={turn}
                activateAttack={() => activateAttack(item)}
                activateMove={() => activateMove(item)}
                underAttack={() => underAttack(item)}
            />)}   
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
        </div>
    </div>;
}

export default Grid;