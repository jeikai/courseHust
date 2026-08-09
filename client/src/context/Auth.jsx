import { createContext, useEffect, useState } from 'react';
import { useAPI } from '../hooks/api';
import axios from 'axios';
import permissions from '../config/permission.json';
import Loader from '../components/Loader';

export const AuthContext = createContext();

export function AuthProvider(props) {
	const cache = JSON.parse(localStorage.getItem('user'));
	const [user, setUser] = useState(cache);

	// The global axios interceptor (see helpers/axiosInterceptor.js) already
	// attempts a silent refresh-and-retry on any 401/403 caused by an expired
	// access token, for every API call in the app - not just this one.
	// Reaching this callback means that already failed (refresh token missing,
	// invalid, or expired), so the only thing left to do is sign the user out.
	const auth = useAPI(user ? '/api/auth' : null, null, () => {
		signout();
	});

	useEffect(() => {
		// update the auth status
		if (!auth.loading && auth.data) {
			auth.data.authenticated ? update(auth.data) : signout();
		}
	}, [auth]);

	function signin(res) {
		if (res.data) {
			localStorage.setItem('user', JSON.stringify(res.data));

			localStorage.setItem('refreshToken', res.data.refreshToken);
			axios.defaults.headers.common['Authorization'] =
				'Bearer ' + res.data.authenticated;

			return (window.location =
				res.data.permission === 'admin' ? '/admin_main' : '/');
		}
	}

	async function signout() {
		localStorage.clear();
		return (window.location = '/login');
	}

	function update(data) {
		if (localStorage.getItem('user')) {
			let user = JSON.parse(localStorage.getItem('user'));
			for (let key in data) {
				if (Array.isArray(data[key])) {
					user[key] = data[key];
				} else if (typeof data[key] === 'object') {
					for (let innerKey in data[key]) {
						user[key][innerKey] = data[key][innerKey];
					}
				} else {
					user[key] = data[key];
				}
			}
			localStorage.setItem('user', JSON.stringify(user));
			setUser(user);
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user: user,
				signin,
				signout,
				update,
				permission: permissions[user?.permission],
			}}
			{...props}>
			{auth.loading && <Loader fullScreen />}
			{props.children}
		</AuthContext.Provider>
	);
}
