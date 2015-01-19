var http = require("http");
var url = require("url");
var querystring = require("querystring");

function start(route, handle) {
    function onRequest(request, response) {

        var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
    console.log(request.method);
        if (request.method == "POST") {
            request.setEncoding("utf8");
            request.addListener("data", function (postDataChunk) {
                postData += postDataChunk;
            });
            request.addListener("end", function () {
                routePost(handle, pathname, response, postData);
            });
        }
        else
        {
            routeGet(handle, pathname, response, request);
        }
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}
exports.start = start;

function routeGet(handle, pathname, response, request) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request);
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not found");
        response.end();
    }
}

exports.routeGet = routeGet;

function routePost(handle, pathname, response, postData) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, postData);
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not found");
        response.end();
    }
}

exports.routePost = routePost;