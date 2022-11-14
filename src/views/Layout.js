import React, { useEffect, useState } from 'react' 
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation'
import { useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation()
    const [pathName, setPathName] = useState(null)

    useEffect(() => {
        setPathName(location.pathname)
     },[location, pathName]) 

    return (
        <div className="layout">
            <Navigation path={pathName}/>
            <Outlet />
        </div>
    );
}

export default Layout;
