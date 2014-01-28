
var fs = require('fs');

var pattern = fs.readFileSync(__dirname + '/uri.regex', { encoding: 'utf8' });

var compressed_pattern = pattern
	// Remove comments 
	//
	// WARNING: \s is NOT equal to [ \t] and eats the first line (LF) nuking the regex, hence we use the more strict [ \t] here instead!
	.replace( /(^|\s)#([ \t].*)?/g, '' );

//console.log("compression #1\n", compressed_pattern);

compressed_pattern = compressed_pattern
	// Collapse whitespace
	.replace( /\s+/g, '' );

//console.log("compression #2\n", compressed_pattern);


var pattern_comment = "    // " + pattern.replace( /[\n]/g , "\n    // " );

fs.readFile(__dirname + '/uri.js', { encoding: 'utf8' }, function (err, data) {
	if (err) throw err;

	var s = '' + data;
	// see also second answer for 
	//     http://stackoverflow.com/questions/1979884/how-to-use-javascript-regex-over-multiple-lines
	//
	// First strip the old content and replace it by a unique string.
	// We use a replacement FUNCTION as we don't want ANY of the characters
	// in the compressed regex JSON string to be treated as a 'special replacement pattern'
	// ( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace )
	s = s.replace(/\/\/---regex---[\s\S]*\/\/---\/regex---/, function () {
		return "//---regex---\n" +
		       "    //\n" + 
			   pattern_comment + "\n" +
		       "    //\n" + 
			   "    URI.pattern = new RegExp(" + JSON.stringify(compressed_pattern) +  ");\n" +
			   "    //---/regex---";
	});

	fs.writeFileSync(__dirname + '/uri.js', s, { encoding: 'utf8' });
});

