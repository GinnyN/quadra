import React from "react";
import style from "./style.module.css";

const Cell = ({ onClick, onMove, onAttack, x, y, player, activated, usable }) => {

    const toggleDot = () => {
        if(!usable) return;
        if(activated && player) {
            onAttack({x,y});
            return
        }
        if(player) {
            onClick({x, y});
            return
        }
        if(activated) {
            onMove({x, y});
            return
        }
        return
    }
    return <div className={`${style.cell} ${usable && activated && style.activated} ${!usable && style.noUsable}`} onClick={toggleDot}>
                { player && player.currentHP > 0 && <img className={style.dot} src={require('./../../img/dot.png')} />}
           </div>
}

export default Cell;