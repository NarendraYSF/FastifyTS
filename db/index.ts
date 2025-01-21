import config from '../environment';
import mongo from 'mongoose';
import bcrypt from 'bcrypt';
const {
	MONGO_USERNAME,
	MONGO_PASSWORD,
	MONGO_HOST,
	MONGO_DATABASE,
	DEV_MODE,
} = config;

mongo.set('debug', DEV_MODE);
mongo.set('useFindAndModify', false);
mongo.connect(
	`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=true&w=majority`,
	{
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);
const dbs = mongo.connection;
dbs.on('error', console.error.bind(console, 'connection error:'));
dbs.once('open', () => {
	console.log('[INFO] Connect to DB success!');
});
export const db: mongo.Connection = dbs;

export type user = {
	email: string;
	password: string;
	username: string;
	req_times: number;
	timestamp: Date;
};
export const user = mongo.model(
	'user',
	new mongo.Schema(
		{
			email: {type: String},
			password: {type: String},
			username: {type: String},
			req_times: {type: Number},
			timestamp: {type: Date, default: Date.now},
		},
		{versionKey: false}
	)
);

export const addTimes = async (username: string) => {
	user.findOne({username: username}).then(async (res: any) => {
		if (!res) return;
		await user.findOneAndUpdate(
			{username: username},
			{$set: {req_times: res.req_times++}}
		);
	});
};
