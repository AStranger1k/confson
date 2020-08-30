/*
 * test/stringify.js - Tests for confson.js # stringify()
 * https://github.com/timjansen/handson
 */
var expect = require('chai').expect;
var confson = require("../confson.js");

describe('stringify()', function() {
	it('writes JSON/ConfSON', function() {
		expect(confson.stringify(confson.parse('[`a`, //\n2, c/**/]'))).to.deep.equal(JSON.stringify(["a",2,"c"]));
 	});
});
