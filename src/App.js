import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import LayerSelection from './components/LayerSelection';
import MultiplexMap from './components/MultiplexMap';

function App() {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [edges, setEdges] = useState({});

  useEffect(() => {
    fetch(`/multiplex/layer-${currentLayer.toString()}.json`)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        setEdges(data)
      })
  }, [currentLayer])

  return (
    <div className="App">
      <header className="App-header" style={{
        padding: 16,
        position: "absolute"
      }}>
        <span>Multiplex</span>
      </header>

      <MultiplexMap edges={edges} />

      <LayerSelection 
        value={currentLayer}
        setValue={setCurrentLayer}
      />
    </div>
  );
}

export default App;
