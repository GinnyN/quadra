import logo from './logo.svg';
import Grid from "./grid";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Grid map={require("./maps/init.json")}></Grid>
      </header>
    </div>
  );
}

export default App;
