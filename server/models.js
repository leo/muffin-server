var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var schemas = {

	user: {
		_id: String,
		password: String,
	},

	page: {
		_id: Number,
		title: String,
		author: String,
		dates: {
			created: Date,
			updated: Date
		}
	}

}

var checkModel = function( name, schema ) {

	if( mongoose.models[name] ) {
		return mongoose.model( name );
	} else {
		return mongoose.model( name, schema );
	}

}

var getModel = function( name ) {

	var fields = schemas[name];

	var me = new Schema( fields, {
		versionKey: false
	});

	return checkModel( name, me );

}

module.exports = getModel;
