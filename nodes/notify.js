module.exports = function (RED) {
    function squidNotify(config) {
        RED.nodes.createNode(this, config);

        var node = this
        var getCurrentProject = function () {
            var project = (node.context().global).get("currentProject")
            if (project === undefined) {
                project = {};
                (node.context().global).set("currentProject", project)
            }
            return project
        }
        var currentProject = getCurrentProject();

        node.on('input', function (msg) {
            var message = {
                "@type": "MessageCard",
                "@context": "http://schema.org/extensions",
                "themeColor": "0076D7",
                "text": config.text
            };


            if (config.addTestData) {
                message.sections = [{ "text": JSON.stringify(currentProject) }];
            }

            msg.payload = message;
            node.send(msg);

        })

    }
    RED.nodes.registerType('notification', squidNotify);

}
