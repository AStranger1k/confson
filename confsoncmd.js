#! /usr/bin/env node
/*
 * confson.js - Command line tool for ConfSON
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * For details, see LICENSE or http://unlicense.org/
 *
 *
 * To convert a single file, just write
 *   handson input.sbconf output.json
 *
 * You can also convert multiple files using the -m options. It will automatically change the file extension to .json:
 *   handson -m input1.sbconf input2.sbconf input3.sbconf input4.sbconf input5.sbconf
 * 
 * Use the -l option to keep line numbers by inserting spaces into the resulting JSON file:
 *   handson -l input.sbconf output.json
 * 
 * https://github.com/timjansen/confson
 */

var fs = require("fs");
var confson = require('./confson.js');


var args = process.argv.slice(2);
var keepLineNumbers = false;
var multiFile = false;

// Process each switch but ignore '-' by itself as it means STDIN / STDOUT
var examineOffset = 0;
while (/^-/.test(args[examineOffset])) {
	if (args[0] == '-') {
		examineOffset++;
	} else {
		var a = args.shift();
		if (/^--?h(elp)?$/.test(a))
			printHelp();
		else if (a == '-l')
			keepLineNumbers = true;
		else if (a == '-m')
			multiFile = true;
		else if (a == '-p')
			args = ['-', '-'];
		else if (a != '-')
			printHelp("Unknown option: " + a);
	}
}

if (multiFile) {
	for (var i = 0; i < args.length; i++)
		if (!fs.existsSync(args[i]))
			error("File not found: "+ args[i]);
	
	for (var i = 0; i < args.length; i++)
		convert(args[i], getOutputFileName(args[i]));
}
else {
	if (args.length < 1)
		error("No file names specified.");
	if (args.length < 2)
		error("No output file specified.");
	if (args.length > 2)
		error("Too many arguments - need input file and output file (or forgot -m option?)");

	if (args[0] != '-' && !fs.existsSync(args[0]))
		error("File not found: "+ args[0]);
	
	convert(args[0], args[1]);
}


function getOutputFileName(file) {
	return file.replace(/\.cson$/, '') + '.json';
}

function convert(inputFile, outputFile) {
	var src;
	if (inputFile == '-') {
		src = '';
		process.stdin.resume();
		process.stdin.on('data', function(data) {
			src += data;
		});
		process.stdin.on('end', function(data) {
			if (outputFile == '-') {
				process.stdout.write(confson.toJSON(src, keepLineNumbers));
			} else {
				fs.writeFileSync(outputFile, confson.toJSON(src, keepLineNumbers));
			}
		});
	} else {
		src = fs.readFileSync(inputFile, 'utf-8');
		if (outputFile == '-') {
			process.stdout.write(confson.toJSON(src, keepLineNumbers));
		} else {
			fs.writeFileSync(outputFile, confson.toJSON(src, keepLineNumbers));
		}
	}
}

function error(msg) {
	console.log('ERROR:', msg, '\n');
	console.log("Run confson -h for help.");
	process.exit(2);
}

function printHelp(extraMsg) {
	if (extraMsg)
		console.log(extraMsg, '\n');
	
	console.log('Hanson converts ConfSON files into JSON files.');
	console.log('Syntax: confson [-l] inputFile.sbconf outputFile.json');
	console.log('        confson [-l] -m inputFile1.sbconf [inputFile2.sbconf [inputFile3.sbconf...]]');
	console.log('        confson [-l] -p');
	console.log();
	console.log('A single hyphan ("-") can be used as input and/or output file names to refer to STDIN / STDOUT');
	console.log();
	console.log('Options: -l : keep line numbers in output files (adds empty lines)');
	console.log('         -m : multi-input files. Will write .json file for each.');
	console.log('         -p : pipe mode. Reads data from STDIN and outputs to STDOUT. Same as \'confson - -\'');
	console.log();
	process.exit(1);
}

