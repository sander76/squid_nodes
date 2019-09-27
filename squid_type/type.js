module.exports = function (RED) {
    function squidType(config) {
        RED.nodes.createNode(this, config)

        var node = this

        node.on('input', function (msg) {
            var data = msg.payload.slice(1, -2).split(':')

            if (data[0] === 'i') {
                node.status({ fill: 'green', text: msg.payload })
                msg.payload = data
                node.send(msg)
            }
        })
    }
    RED.nodes.registerType('squid-type', squidType)
}
