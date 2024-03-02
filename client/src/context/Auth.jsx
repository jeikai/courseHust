import { createContext, useEffect, useState } from "react";
import { useAPI } from "../hooks/api";
import axios from "axios";
import permissions from '../config/permission.json'
import Loader from "../components/Loader";

export const AuthContext = createContext();

export function AuthProvider(props) {
    const cache = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(cache);
    const auth = useAPI(user ? '/api/auth' : null);

    console.log(auth);
    useEffect(() => {

        // update the auth status
        if (!auth.loading && auth.data) {

            auth.data.authenticated ?
                update(auth.data) : signout();

        }
    }, [auth]);

    function signin(res) {
        debugger
        if (res.data) {

            localStorage.setItem('user', JSON.stringify(res.data));
            res.data.token = "eyJhbGciOiJIUz"
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;

            // if (!res.data.verified)
            //     return window.location = '/signup/verify';
            res.data.permission = "user"
            return window.location = res.data.permission === "admin" ? '/dashboard' : '/';

        }
    }

    async function signout() {

        axios({ method: 'delete', url: '/api/auth' });
        localStorage.clear();
        return window.location = '/login'

    }

    function update(data) {

        if (localStorage.getItem('user')) {

            let user = JSON.parse(localStorage.getItem('user'));
            for (let key in data) {

                if (Array.isArray(data[key])) {

                    user[key] = data[key]

                }
                else if (typeof data[key] === 'object') {
                    for (let innerKey in data[key]) {

                        user[key][innerKey] = data[key][innerKey]

                    }
                }
                else {

                    user[key] = data[key];

                }
            }

            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

        }
    }
    return (
        <AuthContext.Provider value={{

            user: user,
            signin: signin,
            signout: signout,
            update: update,
            permission: permissions[user?.permission]

        }}

            {...props}>
                {auth.loading ?
                    <Loader /> :
                    {...props.children}
                }
        </AuthContext.Provider>
    );
}

