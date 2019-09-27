module.exports = function (RED) {
    function voltsAmps(config) {
        RED.nodes.createNode(this, config)

        var node = this

        var deltaV = parseFloat(config.deltaV)
        // node.log("delta v " + deltaV)
        var deltaA = parseFloat(config.deltaA)
        // node.log("delta a" + deltaA)
        var bufferLength = parseInt(config.bufferLength)
        // node.log("bufferlength " + bufferLength +" " + typeof(bufferLength) )
        var buffer = []

        var addTimeStamp = function () {
            return Date.now()
        }

        var parseData = function (rawData) {
            var volts = parseFloat(rawData[2])
            var amps = parseFloat(rawData[4])
            return { 'v': volts, 'ma': amps }
        }

        var purgeData = function () {
            var purged = []
            var previousV
            var previousA
            for (var i = 0; i < buffer.length; i++) {
                var item = buffer[i]
                if (i === 0) {
                    node.log("Adding first item")
                    previousV = item.v
                    previousA = item.ma
                    purged.push(item)
                } else if (i === bufferLength - 1) {
                    node.log("Adding last item")
                    purged.push(item)
                } else {
                    if (item.v - previousV > deltaV || item.ma - previousA > deltaA) {
                        node.log("Adding item "+i)
                        purged.push(item)
                        previousA = item.ma
                        previousV = item.v
                    }                    else{
                        node.log("skipping item " + i)
                    }
                    
                }
            }
            buffer = []
            node.log(buffer)
            return purged
        }

        node.on('input', function (msg) {
            // Incoming data in form of : {s:v:1.05:a:-0.60}

            var data = msg.payload.slice(1, -2).split(':')
            node.log(data)
            if (data[0] === 's') {
                node.status({ fill: 'green', text: msg.payload })
                var measurement = parseData(data)
                measurement['time'] = addTimeStamp()

                node.log(measurement)

                buffer.push(measurement)
                node.log("buffer length" + buffer.length)
                if (buffer.length === bufferLength) {
                    var purged = purgeData()
                    msg.payload = purged
                    node.send(msg)
                }
            }
        })
    }
    RED.nodes.registerType('volts-amps', voltsAmps)
}
