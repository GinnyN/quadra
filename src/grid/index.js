import React, {useEffect, useState} from "react"
import Cell from "./cell"
import style  from "./style.module.css"

const character = {
    "maxHP": 100,
    "currentHP": 100,
    "strength": 2,
    "active": false,
}

const Grid = ({ map } ) => {

    const [cells, setCells] = useState([]);
    const [playerActive, setPlayerActive] = useState({});
    const [currentChar, setCurrentChar] = useState([]);

    useEffect (() => {
        const cells = [];
        const currentChar = [];
        for(let x = 0; x < 10; x++) {
            for(let y = 0; y < 10; y++) {
                if(map[`${x}${y}`]) {
                    if(map[`${x}${y}`].player){
                        const newChar = {...character};
                        cells.push({x, y, activated: false, ...map[`${x}${y}`], player: newChar });
                        currentChar.push(newChar);
                    } else cells.push({x, y, activated: false, ...map[`${x}${y}`], player: false});
                }
                else cells.push({x, y, player: false, activated: false, usable: true });
            }
        }
        setCells(cells);
        setCurrentChar(currentChar);
    }, []);

    const toggleCells = ({x, y}) => {
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
    };

    const movePlayer = ({x, y}) => {
        const temp = [...cells];
        temp[10*x + y].player = temp[10*playerActive.x + playerActive.y].player;
        if(temp[10*playerActive.x + playerActive.y]) temp[10*playerActive.x + playerActive.y].player = false;
        if(temp[(10*playerActive.x)-1+playerActive.y]) temp[(10*playerActive.x)-1+playerActive.y].activated = false;
        if(temp[(10*playerActive.x)+1+playerActive.y]) temp[(10*playerActive.x)+1+playerActive.y].activated = false;
        if(temp[(10*(playerActive.x-1))+playerActive.y]) temp[(10*(playerActive.x-1))+playerActive.y].activated = false;
        if(temp[(10*(playerActive.x+1))+playerActive.y]) temp[(10*(playerActive.x+1))+playerActive.y].activated = false;
        setCells(temp);
    }

    const attackChar = ({x , y}) => {
        const temp = [...cells];
        temp[10*x + y].player.currentHP -= temp[10*playerActive.x + playerActive.y].player.strength;
        setCells(temp);
    }

    return <div className={style.playboard}>
        <div className={style.gridSetting}>
        {cells.map((item) => <Cell 
                onClick={toggleCells}
                onMove={movePlayer}
                onAttack={attackChar}
                x={item.x} 
                y={item.y} 
                player={item.player}
                activated={item.activated}
                usable={item.usable}
            />)}   
        </div>
        <div>
            <ul>
                {currentChar.map((item, index)=> <li>{index}: {item.currentHP}/{item.maxHP}</li>)}
            </ul>
        </div>
    </div>;
}

export default Grid;