$( document ).ready( function() {

	$( '#chest .toggle' ).click( function(e) {

		$( this ).prevAll( 'nav' ).slideToggle( 300 );
		$( this ).toggleClass( 'on' );

		e.preventDefault();

	});

});