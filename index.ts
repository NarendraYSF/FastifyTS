import {config} from 'dotenv';
config({path: '../.env'});
import {db} from './db';
const cfonts = require('cfonts');
import {App} from './src';

const client = async () => {
	const main = new App();
	await main.listen();
	cfonts.say(
		'-----------------------------------------------------------------------',
		{font: 'console', gradient: ['green', '#f80']}
	);
	cfonts.say('XYZ API', {
		font: 'block',
		background: 'transparent',
		gradient: ['green', '#f80'],
	});
	cfonts.say(
		'-----------------------------------------------------------------------',
		{font: 'console', gradient: ['green', '#f80']}
	);
	process
		.on('SIGINT', () => {
			db.close();
			main.fastify.close();
			process.exit(0);
		})
		.on('SIGTERM', () => {
			db.close();
			main.fastify.close();
			process.exit(0);
		})
		.on('uncaughtException', err => {
			console.error(err.stack);
			process.exit(1);
		})
		.on('unhandledRejection', (reason, promise) => {
			console.error(reason, `Unhandled rejection at Promise: ${promise}`);
		});
};
client();
