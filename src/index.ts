import helm from 'fastify-helmet';
import cors from 'fastify-cors';
import config from '../environment';
import multipart from 'fastify-multipart';
import swagger from 'fastify-swagger';
import allroutes from 'fastify-print-routes';
import fastify, {FastifyInstance} from 'fastify';
import icon from 'fastify-favicon';
import {IncomingMessage, Server, ServerResponse} from 'node:http';
import routes from '../routes';

export class App {
	public fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>;
	constructor() {
		this.fastify = fastify({
			bodyLimit: 1048576 * 2,
			logger: {
				level: config.LOG_LEVEL,
				prettyPrint: true,
			},
		});
		this.fastify.register(icon);
		this.fastify.register(helm, {
			contentSecurityPolicy: {
				directives: {
					baseUri: ["'self'"],
					defaultSrc: ["'self'"],
					scriptSrc: ["'unsafe-inline'", "'self'"],
					objectSrc: ["'self'"],
					workerSrc: ["'self'", 'blob:'],
					frameSrc: ["'self'"],
					formAction: ["'self'"],
					imgSrc: ["'self'", 'data:'],
					styleSrc: ["'unsafe-inline'", "'self'"],
					upgradeInsecureRequests: [],
				},
			},
		});
		this.fastify.register(swagger, {
			mode: 'static',
			specification: {
				path: '../swagger.yaml',
				baseDir: __dirname,
			},
			exposeRoute: true,
			routePrefix: '/docs',
		});
		this.fastify.register(multipart, {
			limits: {
				fieldNameSize: 100, // Max field name size in bytes
				fieldSize: 1000000, // Max field value size in bytes
				fileSize: 2145728, // For multipart forms, the max file size
				files: 1, // Max number of file fields
			},
		});
		this.fastify.register(allroutes);
		this.fastify.register(cors, {origin: '*'});
		this.fastify.setNotFoundHandler((request, reply) => {
			this.fastify.log.debug(
				`Route not found: ${request.method}:${request.raw.url}`
			);
			reply.status(404).send({
				statusCode: 404,
				error: 'Not Found',
				message: `Route ${request.method}:${request.raw.url} not found`,
			});
		});
		this.fastify.setErrorHandler((err, request, reply) => {
			this.fastify.log.debug(`Request url: ${request.raw.url}`);
			this.fastify.log.debug(`Payload: ${request.body}`);
			this.fastify.log.error(`Error occurred: ${err}`);
			const code = err.statusCode ?? 500;
			reply.status(code).send({
				statusCode: code,
				error: err.name ?? 'Internal server error',
				message: err.message ?? err,
			});
		});
		routes.forEach(routes => {
			this.fastify.route(routes);
		});
	}
	async listen(): Promise<unknown> {
		try {
			return this.fastify.listen(config.SERVER_PORT, '0.0.0.0');
		} catch (error) {
			this.fastify.log.error(error);
			process.exit(1);
		}
	}
}
