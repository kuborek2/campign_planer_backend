const DataEndpoint = require('./data.endpoint');

let dataEndpoint = new DataEndpoint();

module.exports = function(){
    this.routes = (router) =>
    {
        dataEndpoint.dataEndpoint(router);
    };
}