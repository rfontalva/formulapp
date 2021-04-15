import React from 'react';
import '../index.css'

const Navbar = () =>{
    return(
        <div className='topnav'>
            <nav>
                <ul>
                    <li>
                        <a href='/'>Home</a>
                    </li>
                    <li>
                        <a href='/add'>Add</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;