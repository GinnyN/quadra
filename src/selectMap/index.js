import React from "react";
import style from './style.module.css';

const SelectMap = ({ onSelect }) => {
    return <div> 
        <h1>Quadra</h1>
        <h2>Select Stage</h2>
        <div className={style.grid}>
            <div><button onClick={() => onSelect('stage1')}>Stage 1</button></div>
            <div><button onClick={() => onSelect('stage2')}>Stage 2</button></div>
            <div><button onClick={() => onSelect('stage3')}>Stage 3</button></div>
            <div><button onClick={() => onSelect('stage4')}>Stage 4</button></div>
        </div>
    </div>
}

export default SelectMap; 