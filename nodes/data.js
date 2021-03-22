module.exports = function (RED) {
    var prettyms = require('pretty-ms');
    function squidProject(config) {
        RED.nodes.createNode(this, config)
        var node = this;
        // var glob = node.context().global;

        var getCurrentProject = function () {
            var project = node.context().global.get("currentProject")
            if (project === undefined) {
                project = {};
                node.context().global.set("currentProject", project);
            }
            return project;
        }
        var started = 0
        var finished = 0

        var populateProject = function () {
            started = new Date();

            currentProject.name = config.name;
            currentProject.isRunning = false;
            currentProject.productId = config.productId
            currentProject.productType = config.productType
            currentProject.productMaterial = config.productMaterial
            currentProject.productDimensions = config.productDimensions
            currentProject.remarks = config.remarks
            currentProject.loop = {}
            currentProject.loop.loopCount = parseInt(config.loopcount);
            currentProject.loop.currentLoop = 0;
            currentProject.startTime = started.toString();
            currentProject.stopTime = "unknown";
            currentProject.duration = "unknown";
        };
        var currentProject = getCurrentProject();
        populateProject();


        var stopTest = function () {
            currentProject.isRunning = false;
            finished = new Date();
            currentProject.stopTime = finished.toString()
            currentProject.duration = prettyms(finished - started)
        }

        var reset = function () {
            // reset global data.
            populateProject();
        }

        var setStatus = function () {
            var color = currentProject.isRunning ? 'green' : 'red'
            var running = currentProject.isRunning ? 'running' : 'not running'
            var lop = 'loop ' + currentProject.loop.currentLoop;

            if (currentProject.loop.loopCount > 0) {
                lop = 'loop ' + currentProject.loop.currentLoop + ' of ' + currentProject.loop.loopCount;
            }

            var txt = lop + ' ' + running;
            node.status({ fill: color, text: txt });
        }

        node.on('input', function (msg) {
            //console.log("input");
            var start = null;
            var stop = null;
            var running = null;

            if (msg.payload === 'start') {
                reset();
                currentProject.isRunning = true;
                msg.payload = 'running';
                start = { payload: "started" };
                running = msg;
            }
            if (msg.payload === 'stop') {
                // currentProject.isRunning = false;
                // currentProject.stopTime = Date.now();
                stopTest()
                stop = { payload: "stopped" };
            }

            if (currentProject.loop.currentLoop === currentProject.loop.loopCount) {
                // currentProject.isRunning = false;
                // currentProject.stopTime = Date.now();
                stopTest()
                stop = { payload: "finished" };

            }

            if (currentProject.isRunning) {
                currentProject.loop.currentLoop += 1;

                running = msg;
                node.log('current loop ' + currentProject.loop.currentLoop + ' of ' + currentProject.loop.loopCount);

            }
            var output = [start, stop, running];
            // console.log(output);
            node.send(output);
            setStatus();
        })
    }
    RED.nodes.registerType('squid-data', squidProject);
}
