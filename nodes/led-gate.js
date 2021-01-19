module.exports = function (RED) {
    function ledGate(config) {
        RED.nodes.createNode(this, config)

        var node = this

        var getCurrentProject = function () {
            var project = (node.context().global).get("currentProject")
            if (project === undefined) {
                project = {};
                (node.context().global).set("currentProject", project)
            }
            return project
        }
        var status = [
            { 'port': 4, 'name': '4', 'val': '?' },
            { 'port': 5, 'name': '5', 'val': '?' },
            { 'port': 6, 'name': '6', 'val': '?' },
            { 'port': 7, 'name': '7', 'val': '?' }
        ]

        var populateProject = function () {
            currentProject.ledGates = status;
        }

        var currentProject = getCurrentProject();
        populateProject();


        var setNodeStatus = function () {
            var str = ''
            status.forEach(function (item) {
                str += item.name + '=' + item.val + ' '
            })
            node.status({ fill: 'green', text: str })
        }

        var sendPayload = function (input_data) {
            node.log('sending payload')
            var payload = [null, null, null, null]
            for (let i = 0; i < status.length; i++) {
                if (input_data.port === status[i].port) {
                    payload[i] = { 'payload': input_data }
                }
            }
            node.log(payload)
            node.send(payload)
        }
        var getPortData = function (port) {
            port = parseInt(port);
            var prt
            node.log('searching for port ' + port)
            status.forEach(function (item) {
                if (item.port === port) {
                    node.log('found an item')
                    prt = item
                }
            })

            return prt
        }

        var regex = /\{(.*)\}/;

        setNodeStatus();

        node.on('input', function (msg) {

            var found = msg.payload.match(regex);

            if (!found) {
                console.log("not found")
                return
            }

            // use the first matching group
            var data = found[1].split(':')
            // this.log(data)
            // console.log(data);
            if (data[0] === 's') {
                var port = getPortData(data[1])
                port.name = config.prefix + port.port
                if (data[2] == '1') {
                    port.val = true
                } else if (data[2] == '0') {
                    port.val = false
                }

                sendPayload(port)
                setNodeStatus()
            }
        })
    }
    RED.nodes.registerType('led-gate', ledGate)

    function ledGateStatus(config) {
        RED.nodes.createNode(this, config)

        var node = this

        var getCurrentProject = function () {
            var project = (node.context().global).get("currentProject")
            if (project === undefined) {
                project = {};
                (node.context().global).set("currentProject", project)
            }
            return project
        }

        var currentProject = getCurrentProject()

        var getPortData = function (port, availablePorts) {
            var prt = "not found"

            node.log('searching for port ' + port)
            availablePorts.forEach(function (item) {
                if (item.port === port) {
                    node.log('found an item')
                    prt = item
                }
            })

            return prt
        }

        node.on('input', function (msg) {
            var prt = getPortData(config.port, currentProject.ledGates);

            if (prt.val === "?") {
                // Send a message to the unknown port.
                node.send([null, null, msg]);
            }
            else if (prt.val === true) {
                // Send a message to the true port.
                node.send([msg, null, null]);
            }
            else {
                node.send([null, msg, null]);
            }


        })
    }
    RED.nodes.registerType('led-gate-status', ledGateStatus)
}
