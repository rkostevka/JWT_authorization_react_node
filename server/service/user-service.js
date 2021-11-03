const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exeptions/api-error');

class UserService {
	async registration (email, password) {
		const canditate = await userModel.findOne({email});
		if(canditate) {
			throw ApiError.BadRequest(`User with this email: ${email} is already exist!`);
		}
		//create user and save in DB
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuid.v4();
		const user = await userModel.create({email, password: hashPassword, activationLink});
		//send activayionLink
		await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/activate/${activationLink}`
		);
		//generate tokens
		const userDto = new UserDto(user); //id, email, isActivated
		const tokens = tokenService.generateTokens({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto
		}
	}

	async activate(activationLink) {
		const user = await userModel.findOne({ activationLink });
		if (!user) {
			throw ApiError.BadRequest(("Incorrect activation link"))
		}
		user.isActivated = true;
		await user.save();
	}

	async login(email, password) {
		const user = await userModel.findOne({email});
		if(!user) {
			throw ApiError.BadRequest('User with this email not found!');
		}
		const isPassEquals = await bcrypt.compare(password, user.password);
		if(!isPassEquals) {
			throw ApiError.BadRequest('Invalid password');
		}
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}
}

module.exports = new UserService();