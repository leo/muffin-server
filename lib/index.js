/*
app.get( '/muffin/edit/:id', function( req, res ) {

	var which = {
		_id: req.params.id
	}

	Page.findOne( which, 'title author', function( err, result ) {
		res.send( loadView( 'edit', err, result ) );
	});

});

app.get( '/muffin/list', function( req, res ) {

	Page.find( {}, 'title author', function( err, results ) {
		res.send( loadView( 'list', err, results ) );
	});

});
*/
