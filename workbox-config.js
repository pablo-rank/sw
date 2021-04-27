module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,jpg,html,js,webmanifest,css}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'sw.js'
};