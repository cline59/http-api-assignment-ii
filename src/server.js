//http server module
const http = require('http');
//URL module
const url = require('url');
//query string module
const query = require('querystring');
//response handler files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
//port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

//URL Object
const urlStruct = {
    GET: {
      '/': htmlHandler.getIndex,
      '/style.css': htmlHandler.getCSS,
      '/getUsers': jsonHandler.getUsers,
      notFound: jsonHandler.notFound,
    },
    HEAD: {
      '/getUsers': jsonHandler.getUsersMeta,
      notFound: jsonHandler.notFoundMeta,
    },
    POST: {
        '/addUser': jsonHandler.addUser,
    },
};
//recompiles body of request and calls correct handler
const parseBody = (request, response, handler) => {
    const body = [];
  
    //sends 400 message if an error exists
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });
  
    //assemble data chunks into the body
    request.on('data', (chunk) => {
      body.push(chunk);
    });
  
    //converts body to string and calls handler
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
  
      handler(request, response, bodyParams);
    });
  };

//handle post requests
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addUser') {
      parseBody(request, response, jsonHandler.addUser);
    }
};

//request handler
const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
    //reports not found if not part of urlStruct
    if (!urlStruct[request.method]) {
        return urlStruct.HEAD.notFound(request, response);
    }

    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
      } else {
        if (urlStruct[request.method][parsedUrl.pathname]) {
            return urlStruct[request.method][parsedUrl.pathname](request, response);
        }
        return urlStruct[request.method].notFound(request, response);
    }

};

// start server
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});