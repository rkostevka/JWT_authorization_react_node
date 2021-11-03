const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exeptions/api-error');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

class UserController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req);
			if(!errors.isEmpty()){
				return(next(ApiError.BadRequest('Error of validation', errors.array())))
			};
			const {email, password} = req.body;
			const userData = await userService.registration(email, password);
			localStorage.setItem("refreshToken", userData.refreshToken);
			return res.json(userData);
		} catch(e) {
			next(e);
		}
	}

	async login(req, res, next) {
		try {
			const {email, password} = req.body;
			const userData = await userService.login(email, password);
			localStorage.setItem("refreshToken", userData.refreshToken);
			return res.json(userData);
		} catch (e) {
			next(e);
		}
	}

	async logout(req, res, next) {
		try {
			const refreshToken = localStorage.getItem("refreshToken");
			const token = userService.logout(refreshToken);
			localStorage.clear();
			return res.json(token);
		} catch (e) {
			next(e);
		}
	}

	async activate(req, res, next) {
		try {
			const activationLink = req.params.link;
			await userService.activate(activationLink);
			return res.redirect(process.env.CLIENT_URL);
		} catch (e) {
			next(e);
		}
	}

	async refresh(req, res, next) {
		try {
		} catch (e) {
			next(e);
		}
	}

	async getUsers(req, res, next) {
		try {
			res.json(['123', '456']);
		} catch (e) {
			next(e);
		}
	}
}

module.exports = new UserController();