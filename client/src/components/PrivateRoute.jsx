import React from 'react'
import { Navigate } from 'react-router-dom'
import permission from '../config/permission.json'
const PrivateRoute = (props) => {

    // check user exists
    const user = JSON.parse(localStorage.getItem('user'));
    const path = window.location.pathname;
    // console.log(user.permission);
    // console.log(permission[user.permission]);
    if(user?.authenticated) {
        debugger
        if(permission[user.permission][props.permission]) {
            
            // if(user.verified) {

            //     // hide verified view if user is verified
            //     if (path === '/signup/verify')  
            //     return <Navigate to='/' />

            // }else {

            //     // user is not verified
            //     if (path !== '/signup/verify')
            //     return <Navigate to='/signup/verify' />;

            // }

            // user is good
            return props.children;
            
        }
    }

    // user is not authenticated
    return <Navigate to='/login' />

}

export default PrivateRoute