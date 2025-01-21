import {RouteOptions} from 'fastify';
import * as authController from '../controllers/auth';
import * as apiController from '../controllers/api';

const login: RouteOptions = {
	method: 'GET',
	url: '/api/login',
	handler: authController.login,
};
const auth: RouteOptions = {
	method: 'GET',
	url: '/api/auth',
	handler: authController.apikey,
};
const create: RouteOptions = {
	method: 'GET',
	url: '/api/create',
	handler: authController.createUser,
};
const igstalk: RouteOptions = {
	method: 'GET',
	url: '/api/igstalk',
	preValidation: authController.auth,
	handler: apiController.igstalk,
};
const inspect: RouteOptions = {
	method: 'POST',
	url: '/api/inspect',
	preValidation: authController.auth,
	handler: apiController.inspect,
};
const harta: RouteOptions = {
	method: 'GET',
	url: '/api/harta',
	preValidation: authController.auth,
	handler: apiController.harta,
}

const routes = [auth, login, create, igstalk, inspect, harta];
export default routes;
