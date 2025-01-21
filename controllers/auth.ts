import {addTimes, user} from '../db';
import {
	apiKeyError,
	apiKeyMissing,
	fieldMissing,
	userInvalid,
	loginSuccess,
	success,
	plainSuccess,
	customError,
} from '../src/util';
import jwt from 'fast-jwt';
import bcrypt from 'bcrypt';
import config from '../environment';
import {FastifyRequest, FastifyReply} from 'fastify';
const verifySync = jwt.createVerifier({key: config.SECRET});
const signSync = jwt.createSigner({key: config.SECRET, expiresIn: 2629800000});

export const apikey = async (
	request: FastifyRequest,
	reply: FastifyReply
): Promise<any> => {
	try {
		const {apikey} = <any>request.query;
		if (!apikey) return apiKeyMissing(reply);
		const res = await verifySync(apikey);
		if (!res) return apiKeyError(reply);
		success(reply, {valid: true});
		addTimes(res.username);
	} catch (err) {
		apiKeyError(reply);
	}
};
export const auth = (
	request: FastifyRequest,
	reply: FastifyReply,
	next: any
) => {
	try {
		const {apikey} = <any>request.query;
		if (!apikey) return apiKeyMissing(reply);
		const res: any = verifySync(apikey);
		if (!res) return apiKeyError(reply);
		next();
		addTimes(res.username);
	} catch (error) {
		apiKeyError(reply);
	}
};
export const login = async (
	request: FastifyRequest,
	reply: FastifyReply
): Promise<any> => {
	const {email, password} = <any>request.query;
	if (!email) return fieldMissing(reply, 'Email');
	if (!password) return fieldMissing(reply, 'Password');
	user.findOne({email: email}, async (err: any, res: any) => {
		if (err || !res) return userInvalid(reply);
		if (res && bcrypt.compareSync(password, res.password)) {
			return loginSuccess(reply, await signSync({username: res.username}));
		}
	});
};
export const createUser = async (
	request: FastifyRequest,
	reply: FastifyReply
): Promise<any> => {
	const {dbpass, email, password, username} = <any>request.query;
	if (!dbpass || dbpass !== 'asucok123') return fieldMissing(reply, 'dbpass');
	if (!email) return fieldMissing(reply, 'Email');
	if (!password) return fieldMissing(reply, 'Password');
	if (!username) return fieldMissing(reply, 'Username');
	const pwd = bcrypt.hashSync(password, 10);
	await user
		.create({email, password: pwd, username, req_times: 1})
		.catch(() => {
			return customError(reply, 'User', 'User exist');
		});
	plainSuccess(reply, 'User berhasil ditambahkan!');
};
