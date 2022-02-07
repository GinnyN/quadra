import { useState } from 'react';
import Grid from "./grid";
import SelectMap from './selectMap';
import './App.css';

const gridMaps = {
  "stage1": 'init',
  "stage2": 'stage1',
  "stage3": 'stage2',
  "stage4": 'stage4'
}

function App() {
  const [gridFile, setGridFile] = useState("");
  const [winner, setInnerWinner] = useState("");
  return (
    <div className="App">
      <header className="App-header">
        {winner === 'red' ? "You Win" : (winner === 'blue' ? "Too Bad" : '')}
        { gridFile.length === 0 ? <SelectMap onSelect={(text) => {
          setGridFile(text);
          setInnerWinner('');
        }}/> :
        <Grid map={require(`./maps/${gridMaps[gridFile]}.json`)} setWinner={(winner) => {
          setGridFile('');
          setInnerWinner(winner);
        }}></Grid> }
      </header>
    </div>
  );
}

export default App;
