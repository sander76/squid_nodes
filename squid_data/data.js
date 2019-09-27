module.exports = function (RED) {
    function squidProject(config) {
        RED.nodes.createNode(this, config)
        var node = this

        var glob = node.context().global

        var vals = {
            get currentloop() { return glob.get('currentloop') || 0 },
            set currentloop(val) { glob.set('currentloop', val) },

            get loopcount() { return glob.get('loopcount') },

            get looprunning() { return glob.get('looprunning') || false },
            set looprunning(val) { glob.set('looprunning', val) }
        }

        glob.set('loopcount', parseInt(config.loopcount))

        vals.looprunning = false

        var reset = function () {
            // reset global data.
            node.log('resetting')
            vals.currentloop = 0
        }

        var setStatus = function () {
            var color = vals.looprunning ? 'green' : 'red'
            var running = vals.looprunning ? 'running' : 'not running'
            var lop = 'loop ' + vals.currentloop

            if (vals.loopcount > 0) {
                lop = 'loop ' + vals.currentloop + ' of ' + vals.loopcount
            }

            var txt = lop + ' ' + running
            node.status({ fill: color, text: txt })
        }

        node.on('input', function (msg) {
            if (msg.payload === 'start') {
                reset()
                vals.looprunning = true
                msg.payload = 'running'
            }

            if (vals.currentloop === vals.loopcount) {
                vals.looprunning = false
                setStatus()
            }

            if (vals.looprunning) {
                vals.currentloop += 1
                node.log('current loop ' + vals.currentloop + ' of ' + vals.loopcount)
                setStatus()
                node.send(msg)
            }
        })
    }
    RED.nodes.registerType('squid-data', squidProject)
}
