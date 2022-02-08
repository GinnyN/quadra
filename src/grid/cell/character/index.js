import React, { useState } from "react";
import style from "./style.module.css";
import 'animate.css';

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

    return <div className={style.innerCell}>
       <div className={style.menu}>

            <div style={{'background-color': 'green', 'height': '100%', 'width': `${player.currentHP * 100 / player.maxHP}%` }}>
                </div>
        </div> 

         <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            height="100%"
            width="100%"
            onClick={toggleShowMenu}
            className={`${style.dot} ${player.tired && style.tired} 
            animate__animated ${player.attacked && 'animate__headShake'}
            animate__animated  ${player.currentHP <= 0 && 'animate__fadeOut'}`} >

            {player.class === 'scout' && <circle r="30"  cx="50" cy="50"
                stroke-width="2" stroke={`${player.team}`}
                fill={`${turn === player.team ? '#fff' : (player.team === 'red' ? '#faa' : '#aaf')}`} />}

            {player.class === 'soldier' && 
                <rect width="60" height="60" stroke={`${player.team}`} x="20" y="20"
                fill={`${turn === player.team ? '#fff' : (player.team === 'red' ? '#faa' : '#aaf')}`} stroke-width="2"/> }

        </svg>
    </div>
}

export default Character;