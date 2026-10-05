import React from 'react';
import ForPc from './ForPc';
import ForMobile from './ForMobile';

const Navbar = () => {
    return (
        <div className=''>
            <ForPc/>
            <ForMobile/>
        </div>
    );
};

export default Navbar;