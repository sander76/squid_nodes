var helper = require("node-red-node-test-helper");

var notification = require("../nodes/notify.js");
const assert = require('assert').strict;

describe('Notify Node', function () {
    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "notification", name: "notification" }];
        try {
            helper.load(notification, flow, function () {
                try {
                    var n1 = helper.getNode("n1");
                    n1.should.have.property('name', "notification");
                    done();
                }
                catch (err) { done(err); }



            })
        } catch (err) { done(err); }

    })

})
