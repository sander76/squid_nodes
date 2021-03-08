module.exports = function (RED) {
    var yaml = require('js-yaml');
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
            var title = currentProject.name + " " + currentProject.productId;

            var message = {
                "@type": "MessageCard",
                "@context": "http://schema.org/extensions",
                "themeColor": "0076D7",
                "title": title,
                "text": msg.payload
            };


            if (config.addTestData) {
                var value = yaml.dump(currentProject)
                var sections = [];
                sections.push({ "text": "<pre>" + value + "</pre>" });
                message.sections = sections;
            }

            msg.payload = message;
            node.send(msg);

        })

    }
    RED.nodes.registerType('notification', squidNotify);

}
