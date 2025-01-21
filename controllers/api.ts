import igstalks from '../lib/igstalk';
import {success, fieldMissing, customError} from '../src/util';
import {FastifyRequest, FastifyReply} from 'fastify';
const child = require('child_process');
const gm = require('gm');
const concat = require('concat-stream');

export const igstalk = async (
	request: FastifyRequest,
	reply: FastifyReply
): Promise<any> => {
	try {
		const {username} = <any>request.query;
		if (!username) return fieldMissing(reply, 'Username');
		igstalks(username)
			.then(res => success(reply, res))
			.catch(() =>
				customError(reply, 'Username', 'Username instagram tidak valid!')
			);
	} catch (err) {
		customError(reply, 'EXCEPTION', 'terjadi error, hubungi owner');
	}
};

export const inspect = async (
	request: FastifyRequest,
	reply: FastifyReply
): Promise<any> => {
	try {
		if (!request.isMultipart()) customError(reply, 'Form', 'Error tidak ada form-encoded');
		request
			.file()
			.then(mp => {
				if (!['image/png', 'image/jpeg', 'image/jpg'].includes(mp.mimetype))
					return customError(reply, 'Invalid', 'Invalid image type');
				mp.toBuffer().then(buffer => {
					const asu = child.fork('../lib/inspect.js', ['--no-warnings'], {silent:true});
					asu.send(buffer);
					asu.on('message', async (out: any) => {
						success(reply, out);
					});
				});
			})
			.catch(err => {
				if (err.code === 'FST_REQ_FILE_TOO_LARGE')
					return customError(reply, 'Error', 'Maaf, maksimal file size 2mb');
				if (err) return customError(reply, 'Error', err);
			});
	} catch (err) {
		customError(reply, 'EXCEPTION', 'terjadi error, hubungi owner');
	}
};
export const harta = async (
	request: FastifyRequest,
	reply: FastifyReply
): Promise<any> => {
	try {
		const {text} = <any>request.query;
		gm()
		.rawSize(512, 512)
		.out('xc:black')
		.pointSize(90)
		.font('../fonts/harta.ttf')
		.tile('../image/rainbow.jpg')
		.drawText(0, 0, 'HARTA\nTAHTA\n' + text.toUpperCase(), 'center')
		.wave(4.5, 64)
		.stream('jpeg')
		.pipe(concat((buffer: Buffer) => reply.type('image/jpeg').send(buffer)));
	} catch (err) {
		console.log(err);
		customError(reply, 'EXCEPTION', 'terjadi error, hubungi owner');
	}
};
