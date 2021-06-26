import React from 'react';
import Greeting from './components/Greeting';

const App: React.FC = () => {
  return (
    <div className="App">
      <Greeting name="World" />
    </div>
  );
};

export default App;
