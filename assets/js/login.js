$( document ).ready( function() {

	$( 'form' ).submit( function( event ) {

		var me = $( this ),
			timeout;

		if( me.hasClass( 'shake' ) ) {
			event.preventDefault();
			return;
		}

		$.post( me.method, me.serialize(), function( response ) {

			if( parseInt( response ) ) {
				location.reload();
			} else {

				clearTimeout( timeout );

				if( me.hasClass( 'error' ) ) {
					me.addClass( 'shake' );
				} else {
					me.addClass( 'shake error' );
				}

				timeout = setTimeout( function() {
					me.removeClass( 'shake' );
				}, 1000);

			}

		});

		event.preventDefault();

	});

});

