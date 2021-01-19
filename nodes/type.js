module.exports = function (RED) {
    function squidType(config) {
        RED.nodes.createNode(this, config)

        var node = this;
        var regex = /\{(.*)\}/;

        node.on('input', function (msg) {
            var found = msg.payload.match(regex);

            if (!found) {
                console.log("not found")
                return
            }

            // use the first matching group
            var data = found[1].split(':')

            if (data[0] === 'i') {
                node.status({ fill: 'green', text: msg.payload })
                msg.payload = data
                node.send(msg)
            }
        })
    }
    RED.nodes.registerType('squid-type', squidType)
}
