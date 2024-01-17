import React from 'react';
import logo from './logo.svg';
import './App.css';
import MyClock from './components/clock'
import {ToastContainer} from "react-toastify";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <ToastContainer newestOnTop />
       <MyClock/>
      </header>
    </div>
  );
}

export default App;
