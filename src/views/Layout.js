import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation'
import { useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation()
    const [pathName, setPathName] = useState(null)
    const setVh = () => {
        // 手機版100vh問題
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    useEffect(() => {
        setPathName(location.pathname)
    }, [location, pathName])

    useEffect(() => {
        setVh()
    }, [])

    return (
        <div className="layout">
            <Navigation path={pathName} />
            <Outlet />
        </div>
    );
}

export default Layout;
