module.exports = function (RED) {
    function RelaisOn(config) {
        RED.nodes.createNode(this, config)
        var node = this
        var pinNr = config.pinnr

        node.on('input', function (msg) {
            msg.payload = '{r:' + pinNr + ':1}'
            node.send(msg)
        })
    }
    RED.nodes.registerType('relais on', RelaisOn)

    function RelaisOff(config) {
        RED.nodes.createNode(this, config)
        var node = this
        var pinNr = config.pinnr

        node.on('input', function (msg) {
            msg.payload = '{r:' + pinNr + ':0}'
            node.send(msg)
        })
    }
    RED.nodes.registerType('relais off', RelaisOff)

    function RelaisActivate(config) {
        RED.nodes.createNode(this, config)
        var node = this;
        var pinNr = config.pinNr;
        var duration = config.duration;

        node.on('input', function (msg) {
            msg.payload = `{a:${pinNr}:${duration}}`

            node.send(msg)
        })
    }
    RED.nodes.registerType('relais activate', RelaisActivate)
}

// use setTimeout to set a timeout
