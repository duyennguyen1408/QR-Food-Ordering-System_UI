import React from 'react'
import "../Navbar/Navbar.scss"
import logo from "../../../assets/logo.png"
function Navbar() {
  return (
    <nav className='nav-menu'>
      <div className='nav-container'>
        <img src={logo} alt="Coffee Shop"/>
      </div>
    </nav>
  )
}

export default Navbar