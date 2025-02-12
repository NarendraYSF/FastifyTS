type config = {
	LOG_LEVEL: string;
	DEV_MODE: boolean;
	SERVER_PORT: number;
	SECRET: string;
	MONGO_HOST: string;
	MONGO_USERNAME: string;
	MONGO_PASSWORD: string;
	MONGO_DATABASE: string;
	
};

const config: config = {
	LOG_LEVEL: <string>(<string>process.env.LOG_LEVEL) || 'info',
	DEV_MODE: <boolean>(process.env.DEV_MODE === 'true' || false),
	SERVER_PORT: <number>Number(<string>process.env.SERVER_PORT) || 8080,
	SECRET: <string>process.env.SECRET,
	MONGO_HOST: <string>process.env.MONGO_HOST,
	MONGO_USERNAME: <string>process.env.MONGO_USERNAME,
	MONGO_PASSWORD: <string>process.env.MONGO_PASSWORD,
	MONGO_DATABASE: <string>process.env.MONGO_DATABASE,
};

/* GENERAL */
export default config;
