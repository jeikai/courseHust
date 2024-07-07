const jwt = require('jsonwebtoken');
const userModel = require('../models/User');
const tokenModel = require('../models/Token');

exports.auth = async function (req, res) {
	const { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN } = process.env;
	const token =
		req.headers.authorization && req.headers.authorization.split(' ')[1];

	if (token && req.headers.authorization.startsWith('Bearer')) {
		try {
			const decoded = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN);
			const now = Math.floor(Date.now() / 1000);
			if (decoded.exp < now) {
				return res.status(403).json({ message: 'Token expired' });
			}
			const user = await userModel.get({ id: decoded._id });
			
			return res.status(200).json({
				account: user,
				authenticated: token,
			});
		} catch (error) {
			if (error.name == 'TokenExpiredError') {
				return res.status(403).json({ message: 'refreshError' });
			}
		}
	}

	return res.status(401).json({ message: 'Not authorized, no token' });
};

exports.logout = async function (req, res) {
	try {
		const userId = req.params.userId;
		const result = await tokenModel.delete(userId);
		if (result)
			return res.status(200).json({
				message: 'Logout successfully',
				data: result,
			});
		return res.status(500).json({ message: 'Failed to logout' });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

exports.refresh = async function (req, res) {
	const {
		JWT_SECRET_REFRESH_TOKEN,
		JWT_SECRET_ACCESS_TOKEN,
		JWT_EXPRIRE_ACCESS_TOKEN,
	} = process.env;
	const refreshToken = await req.body.refreshToken;

	if (!refreshToken) {
		return res.status(401).json({ message: 'No refresh token provided' });
	}

	try {
		const decodedRefreshToken = jwt.verify(
			refreshToken,
			JWT_SECRET_REFRESH_TOKEN
		);
		const user = await userModel.get({ id: decodedRefreshToken._id });
		if (!user) {
			return res.status(403).json({ message: 'User is not authenticated' });
		}
		const newAccessToken = jwt.sign(
			{
				_id: user._id,
				email: user.email,
				password: user.password,
				role: user.role,
			},
			JWT_SECRET_ACCESS_TOKEN,
			{
				expiresIn: JWT_EXPRIRE_ACCESS_TOKEN,
			}
		);

		return res.status(200).json({
			authenticated: newAccessToken,
		});
	} catch (error) {
		return res.status(403).json(error);
	}
};
