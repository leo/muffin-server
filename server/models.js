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

	var fields = schemas[name],
		me = new Schema( fields, {
			versionKey: false
		});

	var virtualID = me.virtual( 'id' );

	virtualID.get( function() {
		return this._id;
	});

	virtualID.set( function( value ) {
		this._id = value;
	});

	return checkModel( name, me );

}

module.exports = getModel;
