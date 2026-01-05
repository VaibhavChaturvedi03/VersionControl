import React, {useEffect} from 'react';
import {useNavigate, useRoutes} from 'react-router-dom';

import Dashboard from './components/Dashboard.jsx';
import Profile from './components/Profile.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';  

import {useAuth} from './authContext.jsx';

const ProjectRoutes = () => {
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem('userId');

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && !['/auth','/signup'].includes(window.location.pathname)){
            navigate('/auth');
        }

        if(userIdFromStorage && window.location.pathname === '/auth'){
            navigate('/');
        }
    },[currentUser, navigate, setCurrentUser]);

    const element = useRoutes([
        { path: '/auth', element: <Login /> },
        { path: '/signup', element: <Signup /> },
        { path:'/', element:<Dashboard />},
        { path: '/profile', element: <Profile /> },
    ]);

    return element;
}

export default ProjectRoutes;