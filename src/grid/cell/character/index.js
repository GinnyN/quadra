import React, { useState } from "react";
import style from "./style.module.css";

const STATUS = {
    WAIT: 0,
    ATTACKING: 1,
    MOVING: 2
}

const Character = ({ player, turn, onAttack, onMove, underAttack, openMenu }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [charStatus, setCharStatus] = useState(STATUS.WAIT);

    const toggleShowMenu = (event) => {
        event.stopPropagation();
        console.log(player.suceptible);
        if(player.suceptible) underAttack();
        if(player.tired) return;
        if(turn === player.team) openMenu();
    }

    const innerOnMove = (event) => {
        event.stopPropagation();
        setShowMenu(!showMenu);
        onMove();
    }

    const innerOnAttack = (event) => {
        event.stopPropagation();
        setShowMenu(!showMenu);
        onAttack();
    }

    return <React.Fragment>
        { showMenu && <div className={style.menu}>
            <ul>
                <li onClick={innerOnMove}>Move</li>
                <li onClick={innerOnAttack}>Attack</li>
                <li onClick={toggleShowMenu}>Close</li>
            </ul>
        </div> }
        <img 
            onClick={toggleShowMenu}
            className={`${style.dot} ${player.tired && style.tired} `} 
            src={require('./../../../img/dot.png')}
        />
    </React.Fragment>
}

export default Character;