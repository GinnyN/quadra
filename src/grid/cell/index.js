import React from "react";
import style from "./style.module.css";
import Character from "./character";

const Cell = ({ onMove,
                activateAttack, underAttack, onCross,
                activateMove, x, y, player, activated, usable, turn, openMenu }) => {

    const toggleDot = () => {

        if(!usable) return;
        if(activated && !player) {
            onMove({x, y});
            return
        }
        return
    }

    return <div className={`${style.cell} 
                ${player.team === 'blue' && player.team === turn && style.blue} 
                ${player.team === 'red' &&  player.team === turn && style.red} 
                ${usable && activated && style.activated} 
                ${usable && onCross && style.onCross} 
                ${!usable && style.noUsable}`}
                onClick={toggleDot} 
            >
                { player && player.currentHP > 0 && 
                    <Character player={player} turn={turn} 
                        onAttack={activateAttack}
                        onMove={activateMove}
                        underAttack={underAttack}
                        openMenu={openMenu}
                    />}
           </div>
}

export default Cell;