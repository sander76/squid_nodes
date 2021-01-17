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

        var currentProject = getCurrentProject()


        var status = [
            { 'port': '4', 'name': '4', 'val': '?' },
            { 'port': '5', 'name': '5', 'val': '?' },
            { 'port': '6', 'name': '6', 'val': '?' },
            { 'port': '7', 'name': '7', 'val': '?' }
        ]
        currentProject.ledGates = status

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
        node.on('input', function (msg) {
            var data = msg.payload.slice(1, -2).split(':')
            // this.log(data)

            if (data[0] === 's') {
                var port = getPortData(data[1])
                port.name = config.prefix + port.port
                if (data[2] === '0') {
                    port.val = false
                } else {
                    port.val = true
                }

                sendPayload(port)
                setNodeStatus()


                globalContext.set(port.name, port.val)


                // currentProject.ledGates = status
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
                var project = {};
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
            var prt = getPortData(config.port.toString(), currentProject.ledGates)
            node.error("found port" + prt)
            msg.payload = prt
            node.send([null, msg])

        })
    }
    RED.nodes.registerType('led-gate-status', ledGateStatus)
}
