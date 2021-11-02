const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');

class UserService {
	async registration (email, password) {
		const canditate = await userModel.findOne({email});
		if(canditate) {
			throw new Error(`User with this email: ${email} is already exist!`);
		}
		//create user and save in DB
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuid.v4();
		const user = await userModel.create({email, password: hashPassword, activationLink});
		await mailService.sendActivationMail(email, activationLink);
	}
}

module.exports = new UserService();