module.exports = function(RED) {
    function Openaistream(config) {
        RED.nodes.createNode(this,config);
        console.log(config);
    }
    RED.nodes.registerType("mcu_openaistream",Openaistream, {
        credentials: {
            key: {type:"password"}
        }
    });
}
