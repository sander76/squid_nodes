var helper = require('node-red-node-test-helper')
var remote = require('../nodes/remote.js')

describe('remote Node', function () {
    afterEach(function () {
        helper.unload()
    })


    it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "remote button press", name: "test remote" }];
        helper.load(remote, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', "test remote");
            done();
        })
    })
})
