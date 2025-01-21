import {FastifyReply} from 'fastify';

export const apiKeyError = (reply: FastifyReply) => {
	return reply.status(401).send({
		statusCode: 401,
		error: 'ApiKey',
		message: 'ApiKey tidak valid',
	});
};
export const apiKeyMissing = (reply: FastifyReply) => {
	return reply.status(400).send({
		statusCode: 400,
		error: 'ApiKey',
		message: 'ApiKey Missing',
	});
};
export const fieldMissing = (reply: FastifyReply, field: string) => {
	return reply.status(400).send({
		statusCode: 400,
		error: field,
		message: field + ' Missing',
	});
};
export const userInvalid = (reply: FastifyReply) => {
	return reply.status(400).send({
		statusCode: 400,
		error: 'User',
		message: 'User tidak valid',
	});
};
export const plainSuccess = (reply: FastifyReply, message: string) => {
	return reply.status(200).send({
		statusCode: 200,
		message: message,
	});
};
export const success = (reply: FastifyReply, result: any) => {
	return reply.status(200).send({
		statusCode: 200,
		message: 'sukses',
		result: result,
	});
};
export const loginSuccess = (reply: FastifyReply, apikey: string) => {
	return reply.status(200).send({
		statusCode: 200,
		message: 'Login sukses!',
		apikey: apikey,
	});
};
export const customError = (
	reply: FastifyReply,
	error: string,
	message: string
) => {
	return reply.status(400).send({
		statusCode: 400,
		error: error,
		message: message,
	});
};
