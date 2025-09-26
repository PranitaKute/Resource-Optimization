import { useEffect, useState } from "react";
import menu from '../../assets/menu.png';
import close from '../../assets/close.png';
import './Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(()=>{
    const handler = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handler);
    handler();
    return ()=> window.removeEventListener('scroll', handler);
  },[]);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      {/* desktop */}
      <ul>
        <li><NavLink to="/" className={({isActive})=> isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/features" className={({isActive})=> isActive ? 'active' : ''}>Features</NavLink></li>
        <li><NavLink to="/how-it-works" className={({isActive})=> isActive ? 'active' : ''}>How it works</NavLink></li>
        <li><NavLink to="/faq" className={({isActive})=> isActive ? 'active' : ''}>FAQ</NavLink></li>
        <li><NavLink to="/login" className={({isActive})=> isActive ? 'active' : ''}>Login</NavLink></li>
        <li><NavLink to="/register" className={({isActive})=> isActive ? 'active' : ''}>Register</NavLink></li>
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
        <li><NavLink to="/" className={({isActive})=> isActive ? 'active' : ''} onClick={()=>setToggle(false)}>Home</NavLink></li>
        <li><NavLink to="/features" className={({isActive})=> isActive ? 'active' : ''} onClick={()=>setToggle(false)}>Features</NavLink></li>
        <li><NavLink to="/how-it-works" className={({isActive})=> isActive ? 'active' : ''} onClick={()=>setToggle(false)}>How it works</NavLink></li>
        <li><NavLink to="/faq" className={({isActive})=> isActive ? 'active' : ''} onClick={()=>setToggle(false)}>FAQ</NavLink></li>
        <li><NavLink to="/login" className={({isActive})=> isActive ? 'active' : ''} onClick={()=>setToggle(false)}>Login</NavLink></li>
        <li><NavLink to="/register" className={({isActive})=> isActive ? 'active' : ''} onClick={()=>setToggle(false)}>Register</NavLink></li>
      </ul>
      </div>
    )}
      </div>
    </nav>
  );
};

export default Navbar
