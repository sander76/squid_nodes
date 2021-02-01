var helper = require("node-red-node-test-helper");

var squidData = require("../nodes/data.js");
const assert = require('assert').strict;

describe('squid-data Node', function () {
    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "squid-data", name: "squid data", loopcount: 10 }];
        try {
            helper.load(squidData, flow, function () {
                try {
                    var n1 = helper.getNode("n1");
                    n1.should.have.property('name', "squid data");
                    done();
                }
                catch (err) { done(err); }



            })
        } catch (err) { done(err); }

    })

    it('should have a global loopcount value', function (done) {
        var flow = [{ id: "n1", type: "squid-data", name: "squid data", loopcount: 10 }];
        helper.load(squidData, flow, function () {
            var n1 = helper.getNode("n1");

            var currentProject = (n1.context().global).get("currentProject");

            assert.equal(currentProject.loop.loopCount, 10);


            done();
        })
    })

    it('should increase loopcount on incoming msg', function (done) {
        var flow = [{ id: "n1", type: "squid-data", name: "squid data", loopcount: 10 }];
        helper.load(squidData, flow, function () {
            var n1 = helper.getNode("n1");

            var currentProject = (n1.context().global).get("currentProject");

            assert.equal(currentProject.loop.isRunning, false);
            n1.receive({ payload: "start" });
            try {
                assert.equal(currentProject.loop.isRunning, true);
                assert.equal(currentProject.loop.currentLoop, 1)

            } catch (err) { done(err); }

            done();
        })

    })
    it('should increase current loop on general incoming message.', function (done) {
        var flow = [{ id: "n1", type: "squid-data", name: "squid data", loopcount: 10 }];
        helper.load(squidData, flow, function () {
            var n1 = helper.getNode("n1");

            var currentProject = (n1.context().global).get("currentProject");

            n1.receive({ payload: "start" });
            n1.receive({ payload: "just a message" })
            // makes loopcount == 2

            try {
                assert.equal(currentProject.loop.isRunning, true);
                assert.equal(currentProject.loop.currentLoop, 2)

            } catch (err) { done(err); }

            done();
        })
    })
    it('should set currentloop to 0 when starting.', function (done) {
        var flow = [{ id: "n1", type: "squid-data", name: "squid data", loopcount: 10 }];
        helper.load(squidData, flow, function () {
            var n1 = helper.getNode("n1");

            var currentProject = (n1.context().global).get("currentProject");
            currentProject.loop.currentLoop = 3

            n1.receive({ payload: "start" });

            try {
                assert.equal(currentProject.loop.isRunning, true);
                assert.equal(currentProject.loop.currentLoop, 1)

            } catch (err) { done(err); }

            done();
        })
    })
    it('should stop running when currentLoop reaches loopCount.', function (done) {
        var flow = [{ id: "n1", type: "squid-data", name: "squid data", loopcount: 10 }];
        helper.load(squidData, flow, function () {
            var n1 = helper.getNode("n1");

            var currentProject = (n1.context().global).get("currentProject");


            n1.receive({ payload: "start" });
            currentProject.loop.currentLoop = 10
            assert.equal(currentProject.loop.isRunning, true);

            n1.receive('just a message')
            // this should have stopped the loop.
            try {
                assert.equal(currentProject.loop.isRunning, false);
                assert.equal(currentProject.loop.currentLoop, 10)

            } catch (err) { done(err); }

            done();
        })
    })

    it('should loop exactly 10 times', function (done) {
        var flow = [
            { id: "n1", type: "squid-data", name: "squid data", loopcount: 10, wires: [["start_node"], ["stop_node"], ["n2"]] },
            {
                id: "n2", type: "helper"
            },
            {
                id: "start_node", type: "helper"
            }, {
                id: "stop_node", type: "helper"
            }];

        helper.load(squidData, flow, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2")

            var loopCounter = 0
            var currentProject = (n1.context().global).get("currentProject");

            n2.on("input", function (msg) {
                try {

                    if (msg !== null) {
                        loopCounter += 1;
                    }

                    if (loopCounter === 10) {
                        if (!currentProject.loop.isRunning) {
                            done();
                        }
                    }
                }
                catch (err) {
                    done(err)
                }

            })
            // a start input, starts the loop and runs it.
            n1.receive({ payload: "start" });

            // send incoming messages which exceed the number of loopcount.
            for (let i = 0; i < 15; i++) {
                n1.receive({ payload: "just a message" });
            }

        })
    })

})
