import React from 'react'
import HybridSolarCalculator from './components/HybridSolarCalculator'
import Logo from "/logo.png";

const App = () => {
  return (
    <div>
      <div className="logo w-72  mx-auto">
        <a href="https://solaraenergyltd.com/">
        <img src={Logo} alt="solaraLogo" />
        </a>
      </div>
      <HybridSolarCalculator/>
    </div>
  )
}

export default App
