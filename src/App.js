import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import LayerSelection from './components/LayerSelection';
import MultiplexMap from './components/MultiplexMap';

function App() {
  const [currentLayer, setCurrentLayer] = useState(0);


  return (
    <div className="App">
      <header className="App-header" style={{
        padding: 16,
        position: "absolute"
      }}>
        <span>Multiplex</span>
      </header>

      <MultiplexMap />

      <LayerSelection 
        value={currentLayer}
        setValue={setCurrentLayer}
      />
    </div>
  );
}

export default App;
