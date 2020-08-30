/*
 * test/parse.js - Tests for confson.js # parse()
 * https://github.com/timjansen/handson
 */
var expect = require('chai').expect;
var confson = require("../confson.js");

describe('parse()', function() {
	it('parses ConfSON', function() {
		expect(confson.parse('[`a`, //\n2, c/**/]')).to.deep.equal(["a", 2, "c"]);
 	});
});
