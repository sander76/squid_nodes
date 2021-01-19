var helper = require("node-red-node-test-helper");

var ledGate = require("../nodes/led-gate.js");
const assert = require('assert').strict;

describe('ledgate Node', function () {
    afterEach(function () { helper.unload(); })

    it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "led-gate", name: "a ledgate" }];
        try {
            helper.load(ledGate, flow, function () {
                try {
                    var n1 = helper.getNode("n1");
                    n1.should.have.property('name', "a ledgate");
                    done();
                }
                catch (err) { done(err); }



            })
        } catch (err) { done(err); }

    })

    it('should set ledgate 4 to TRUE', function (done) {
        var flow = [{ id: "n1", type: "led-gate" }]

        helper.load(ledGate, flow, function () {
            var n1 = helper.getNode("n1");
            var ledGate4 = n1.context().global.get('currentProject').ledGates[0];

            try {
                assert.strictEqual(ledGate4.val, "?");
                n1.receive({ payload: "{s:4:1}" });
                assert.strictEqual(ledGate4.val, true);
                done();
            }
            catch (err) { done(err); }
        })

    })
    it('should set ledgate 4 to FALSE', function (done) {
        var flow = [{ id: "n1", type: "led-gate" }]

        helper.load(ledGate, flow, function () {
            var n1 = helper.getNode("n1");
            var ledGate4 = n1.context().global.get('currentProject').ledGates[0];

            try {
                assert.strictEqual(ledGate4.val, "?");
                n1.receive({ payload: "{s:4:0}" });
                assert.strictEqual(ledGate4.val, false);
                done();
            }
            catch (err) { done(err); }
        })

    })
    it('should keep ledgate 4 to ? (unknown)', function (done) {
        var flow = [{ id: "n1", type: "led-gate" }]

        helper.load(ledGate, flow, function () {
            var n1 = helper.getNode("n1");
            var ledGate4 = n1.context().global.get('currentProject').ledGates[0];

            try {
                //send an invalid payload.
                n1.receive({ payload: "s:4:0}" });
                assert.strictEqual(ledGate4.val, "?");
                done();
            }
            catch (err) { done(err); }
        })
    })

    it('should load led-gate-state', function (done) {
        var flow = [{ id: "n1", type: 'led-gate-status', name: 'a name' }];
        try {
            helper.load(ledGate, flow, function () {
                try {
                    var n1 = helper.getNode("n1");
                    n1.should.have.property('name', "a name");
                    done();
                }
                catch (err) { done(err); }



            })
        } catch (err) { done(err); }
    })

})
