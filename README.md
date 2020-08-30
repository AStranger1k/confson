ConfSON - JSON for Humans
========================

In Short
---------
* ConfSON is JSON with comments, multi-line strings and unquoted property names.
* Comments use JavaScript syntax (//, /**/).
* Supports backticks as quotes (``) for multi-line strings.
* You can use either double-quotes ("") or single-quotes ('') for single-line strings.
* Property names do not require quotes if they are valid JavaScript identifiers.
* Commas after the last list element or property will be ignored.
* Every JSON string is valid ConfSON.
* ConfSON can easily be converted to real JSON. 



Intro
------
JSON is a great and very simple data format, especially if you are working with JavaScript. Increasingly configuration 
files are written in JSON, and often it is used as a simpler alternative to XML. Unfortunately, when you are creating
larger JSON files by hand, you will notice some shortcomings: you need to quote all strings, even object keys; 
you can not easily have strings with several lines; and you can not include comments. 

ConfSON is an extension of JSON that fixes those shortcomings with four simple additions to the JSON spec:
* quotes for strings are optional if they follow JavaScript identifier rules.
* you can alternatively use backticks, as in ES6's template string literal, as quotes for strings. 
  A backtick-quoted string may span several lines and you are not required to escape regular quote characters,
  only backticks. Backslashes still need to be escaped, and all other backslash-escape sequences work like in 
  regular JSON.
* for single-line strings, single quotes ('') are supported in addition to double quotes ("")
* you can use JavaScript comments, both single line (//) and multi-line comments (/* */), in all places where JSON allows whitespace.
* Commas after the last list element or object property will be ignored. 
  
  

Example ConfSON
---------------
```js
{
  listName: "Sesame Street Monsters", // note that listName needs no quotes
  content: [
    {
      name: "Cookie Monster",
      /* Note the template quotes and unescaped regular quotes in the next string */
      background: `Cookie Monster used to be a
monster that ate everything, especially cookies.
These days he is forced to eat "healthy" food.`
    }, {
      name: "Herry Monster",
      background: `Herry Monster is a furry blue monster with a purple nose.
He's mostly retired today.`
    },    // don't worry, the trailing comma will be ignored
   ]
}
```
  
  
Converting ConfSON to JSON
----------------------------
*confson* is a command-line converter that will convert ConfSON files to JSON. 
It is a Nodes.js package that can be installed using npm:
> npm install -g confson

After installation, convert a single file like this:
> confson input.sbconf output.json

You can also convert multiple files using the -m options. It will automatically change the file extension to .json:
> confson -m input1.sbconf input2.sbconf input3.sbconf input4.sbconf input5.sbconf



Grunt Task to Convert ConfSON to JSON
--------------------------------------

The Grunt plugin <a href="https://github.com/timjansen/grunt-confson-plugin">grunt-confson-plugin</a> can help you converting 
ConfSON files to JSON. More about it in its own <a href="https://github.com/timjansen/grunt-confson-plugin">repository</a>.


Webpack loader to Convert ConfSON to JSON
--------------------------------------

The Webpack loader [sbconf-loader](https://github.com/kentcdodds/sbconf-loader) can help you converting ConfSON files to JSON. More
about it in its own [repository](https://github.com/kentcdodds/sbconf-loader).


Reading ConfSON in JavaScript
-------------------------------
*confson.js* is a simple library for Node.js that provides you with a ConfSON object which works pretty much like the *JSON*
object, with the only difference being that confson.parse() will accept ConfSON.

```js
var confson = require('confson');
var obj = confson.parse(confsonSrc);
```
 
confson.stringify() will currently write regular JSON and just invokes JSON.stringify(), but future versions may pretty-print 
the output and use triple-quotes for multi-line strings instead of '\n'.

There's also a toJSON() function that can convert your ConfSON source into JSON:
```js
var confson = require('confson');
var json = confson.parse(confsonSrc);
```



How Can ConfSON Help Me?
--------------------------
* If you have configuration or descriptor files (like package.json), you can write them as ConfSON and convert them 
  with the command line tool or the Grunt task.
* Multi-line strings make it feasible to use JSON/ConfSON for larger template systems, e.g. to generate static HTML pages. 
  Just write a small script that accepts ConfSON and uses your favorite JavaScript template engine to create HTML.
  Actually this is why I started ConfSON - I wanted to replace my XSLT-based template system.
* You can, of course, extend your application to accept ConfSON files.



Function to Convert ConfSON
----------------------------
Want to use ConfSON in your program, without including any libraries? Use this function to convert
ConfSON to JSON. It returns a JSON string that can be read using JSON.parse().

```js
function toJSON(input) {
		var UNESCAPE_MAP = { '\\"': '"', "\\`": "`", "\\'": "'" };
		var ML_ESCAPE_MAP = {'\n': '\\n', "\r": '\\r', "\t": '\\t', '"': '\\"'};
		function unescapeQuotes(r) { return UNESCAPE_MAP[r] || r; }
		
		return input.replace(/`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\/\*[^]*?\*\/|\/\/.*\n?/g, // pass 1: remove comments 
							 function(s) {
			if (s.charAt(0) == '/')
				return '';
			else  
				return s;
		})
		.replace(/(?:true|false|null)(?=[^\w_$]|$)|([a-zA-Z_$][\w_$]*)|`((?:\\.|[^`])*)`|'((?:\\.|[^'])*)'|"(?:\\.|[^"])*"|(,)(?=\s*[}\]])/g, // pass 2: requote 
							 function(s, identifier, multilineQuote, singleQuote, lonelyComma) {
			if (lonelyComma)
				return '';
			else if (identifier != null)
					return '"' + identifier + '"';
			else if (multilineQuote != null)
				return '"' + multilineQuote.replace(/\\./g, unescapeQuotes).replace(/[\n\r\t"]/g, function(r) { return ML_ESCAPE_MAP[r]; }) + '"';
			else if (singleQuote != null)
				return '"' + singleQuote.replace(/\\./g, unescapeQuotes).replace(/"/g, '\\"') + '"';
			else 
				return s;
		});
}
```

Changes
--------
* August 14, 2013: First release (0.1.0)
* August 15, 2013: Replaced triple-quotes with backticks (1.0.0, backward-incompatible change)
* August 19, 2013: Added support for single-quotes (1.1.0)
* June 14, 2016: Support for STDIN/STDOUT in command line. Improved tests. Thank you, Matt Carter (1.2.0)


License
--------
All code and documentation has been dedicated to the public domain:
http://unlicense.org/






  
