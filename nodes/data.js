module.exports = function (RED) {
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


        var populateProject = function () {
            currentProject.name = config.name;
            currentProject.isRunning = false;
            currentProject.productId = config.productId
            currentProject.remarks = config.remarks
            currentProject.loop = {}
            currentProject.loop.loopCount = config.loopcount;
            currentProject.loop.currentLoop = 0;
            currentProject.startTime = Date.now();
            currentProject.stopTime = null;
        };
        var currentProject = getCurrentProject();
        populateProject();


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
                currentProject.isRunning = false;
                currentProject.stopTime = Date.now();
                stop = { payload: "stopped" };
            }

            if (currentProject.loop.currentLoop === currentProject.loop.loopCount) {
                currentProject.isRunning = false;
                currentProject.stopTime = Date.now();
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
