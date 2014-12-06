var fs = require('fs');
var path = require('path');

var args = process.argv;
var dir = args[2];
var ext = args[3];

fs.readFile( dir, function( error, list ){
	if( error ){
		console.log( error );
	}
	
	else {
		for(var file in list){
			if( path.extname(file) == ext )
				console.log( list[file] );
		}
	}
});

