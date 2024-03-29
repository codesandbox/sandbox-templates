import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import FarmLogo from "./assets/farm-fe.png";
import "./App.css";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://farm-fe.github.io/" target="_blank">
          <img src={FarmLogo} className="logo" alt="Farm logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Farm + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Farm and React logos to learn more
      </p>
    </>
  );
}

export default App;
