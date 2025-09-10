import { useState } from "react";
import menu from '../assets/menu.png';
import close from '../assets/close.png';
import {navLinks} from '../constants';
import './Navbar.css';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className="navbar">
      {/* desktop */}
      <ul>
        {navLinks.map((nav,index)=> (
          <li
            key={nav.id}>
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>

      {/* small devices */}
      <div className="mobile-menu">
        <img 
        src={toggle ? close : menu} 
        alt="menu"
        className="menu-icon"
        onClick={()=> setToggle((prev)=> !prev)}
        />

        {/* menu */}
        {toggle && (
        <div className= "sidebar">
        <ul>
        {navLinks.map((nav,id)=> (
          <li
            key={nav.id}>
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>
      </div>
    )}
      </div>
    </nav>
  );
};

export default Navbar
