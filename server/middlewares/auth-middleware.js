const ApiError = require('../exeptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function(req, res, next) {
	try {
		const authorizationHeader = req.headers.authorization;
		console.log("authorizationHeader" + authorizationHeader);
		if(!authorizationHeader) {
			return next(ApiError.UnauthorizedError());
		}
		const accesToken = authorizationHeader.split(' ')[1];
		if(!accesToken) {
			return next(ApiError.UnauthorizedError());
		}
		const userData = tokenService.validateAccesToken(accesToken);
		if(!userData) {
			return next(ApiError.UnauthorizedError());
		}
		req.user = userData;
		next();
	} catch(e) {
		return next(ApiError.UnauthorizedError());
	}
}