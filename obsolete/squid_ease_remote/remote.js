module.exports = function (RED) {
    function Press(config) {
        // Press a remote control button (short press)
        RED.nodes.createNode(this, config)
        var node = this
        var buttonNr = config.button

        node.on('input', function (msg) {
            msg.payload = '{a:' + buttonNr + ':300}'
            node.send(msg)
        })
    }
    RED.nodes.registerType('remote button press', Press)
}
