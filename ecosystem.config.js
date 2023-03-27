/*
 Copyright (c), CKSource Holding sp. z o.o. All rights reserved.
 */

module.exports = {
	apps: [
		{
			name: 'cropper-js-app',
			script: 'npm',
			args: 'run serve-cropper-demo',
			autorestart: false
		},
		{
			name: 'sharp-server',
			script: 'node',
			args: './src/cropperjs-demo/server.js'
		}
	]
};
