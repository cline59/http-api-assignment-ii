const users = {};
//respond to json object
const respondJSON = (request, response, status, object) => {
  //header object
  const headers = {
    'Content-Type': 'application/json',
  };

  //response
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

//respond without json body
const respondJSONMeta = (request, response, status) => {
  //header object
  const headers = {
    'Content-Type': 'application/json',
  };

  //response
  response.writeHead(status, headers);
  response.end();
};

//return json user object
const getUsers = (request, response) => {
    const responseJSON = {
      users,
    };
  
    respondJSON(request, response, 200, responseJSON);
};

//return 200
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

//404 with message
const notFound = (request, response) => {
    const responseJSON = {
      message: 'The page you are looking for was not found.',
      id: 'notFound',
    };
  
    respondJSON(request, response, 404, responseJSON);
};
//404 without message
const notFoundMeta = (request, response) => {
    respondJSONMeta(request, response, 404);
};

//add user from post body
const addUser = (request, response, body) => {
    // default json
    const responseJSON = {
      message: 'Name and age are both required.',
    };
    // check if fields exist
    if (!body.name || !body.age) {
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }
  
    // default status code
    let responseCode = 204;
  
    //create new user if name dosen't exist
    if (!users[body.name]) {
      responseCode = 201;
      users[body.name] = {};
    }
  
    //add/update fields
    users[body.name].name = body.name;
    users[body.name].age = body.age;
  
    // sent response if successful
    if (responseCode === 201) {
      responseJSON.message = 'Created Successfully';
      return respondJSON(request, response, responseCode, responseJSON);
    }
    // 204 has an empty payload, just a success
    // It cannot have a body, so we just send a 204 without a message
    // 204 will not alter the browser in any way!!!
    return respondJSONMeta(request, response, responseCode);
  };

module.exports = {
    getUsers,
    getUsersMeta,
    notFound,
    notFoundMeta,
    addUser,
};