const tf = require('@tensorflow/tfjs-node');
const nsfw = require('nsfwjs');

process.on('message', async out => {
	const res = await run(out);
	process.send(res);
	process.exit();
});

async function run(res) {
	try {
		tf.engine().startScope();
		const model = await nsfw.load('file://nsfw_model/', {type: 'graph'});
		const readImage = tf.node.decodeImage(Buffer.from(res), 3);
		const predictions = await model.classify(readImage);
		const hasil = {};
		for (const i of predictions) {
			hasil[i.className] = i.probability.toFixed(2).slice(2) + '%';
		}
		readImage.dispose();
		tf.disposeVariables();
		tf.engine().endScope();
		return hasil;
	} catch (error) {
		console.error(error);
		process.exit();
	}
}
