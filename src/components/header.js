import React from 'react';


function Header() {

    return (
        <header className='w-full h-20 px-6 bg-black fixed top-0 flex items-center'>
            <div className='flex flex-col'>
                <div className='flex flex-row items-center'>
                    <img className='w-6 h-10 mr-1' src="aviso.png" alt="" />
                    <h2 className='text-white text-3xl mb-0 mt-0'>Aviso </h2>

                </div>
                <span className='text-xs text-white -mt-2'>Your Attendance Manager</span>
            </div>
        </header>
    );
  }
  
  export default Header;
  