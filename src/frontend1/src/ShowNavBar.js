import React, { useEffect, useState } from 'react';
import './App.css';
import { useLocation } from 'react-router-dom';

const ShowNavBar = ({ children }) => {
    const location = useLocation();
    const [showNavBar, setShowNavBar] = useState(false);

    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/login'
            || location.pathname === '/create-account' || location.pathname === '/forgot-password'
            || location.pathname === '/teacher-login' || location.pathname === '/teacher-dashboard' || location.pathname === '/class') {
            setShowNavBar(false)
        } else {
            setShowNavBar(true)
        }
    }, [location])

    return (
        <div>{showNavBar && children}</div>
    )
}

export default ShowNavBar;