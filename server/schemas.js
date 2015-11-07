module.exports = {

	'User': {
		_id: String,
		password: String,
	},

	'Page': {
		_id: Number,
		title: String,
		author: String,
		dates: {
			created: Date,
			updated: Date
		}
	}

}