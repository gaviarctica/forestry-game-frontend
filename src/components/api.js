
export const API = {

  getCSRFCookie: function(callback) {
    var err = undefined;
    var url = '/api/v1/csrf';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function(response) {
      if(!response.ok) {
        err = 'Error getting CSRF cookie.';
        callback(err);
      }
    });
  },

  login: function(username, password, callback) {
    var err = undefined;
    var url = '/api/v1/user';
    var init = {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        username: username,
        password: password
      })
    };

    var message = undefined;

    fetch(url, init).then(function (response) {
      if(response.ok) {
        return response.json();
      } else {
        err = 'Error making login request.';
        callback(err);
      }      
    }).then(function (responseJson) {
      if (responseJson.success) {
        callback(err, message);
      } else {
        message = responseJson.message;
        callback(err, message);
      }
    });

    // Placeholder code
    // if (username !== "Arho") {
    //   message = "Wrong username!";
    // }
    // setTimeout(callback(err, message), 500);
  },

  register: function (username, email, password, callback) {
    var err = undefined;
    var url = '/api/v1/user';
    var init = {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
    };

    var message = undefined;

    fetch(url, init).then(function(response) {
      if(response.ok) {
        return response.json();
      } else {
        err = 'Error making register request.';
        callback(err);
      }      
    }).then(function (responseJson) {
      if (responseJson.success) {
        callback(err, message);
      } else {
        message = responseJson.message;
        callback(err, message);
      }
    });
  },

  getMaps: function(callback) {
    var err = undefined;
    var url = '/api/v1/level';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };
  },

  getMap: function(id, callback) {
    var err = undefined;
    var url = '/api/v1/level?id=' + id;
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };
  },

  addMap: function(callback) {
    var err = undefined;
    var url = '/api/v1/level';
    var init = {
      method: 'POST',
      credentials: 'same-origin',
    };
  },

  getReports: function(n, callback) {
    var err = undefined;
    var url = '/api/v1/report?n=' + n;
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };
  },

  postReport: function(callback) {
    var err = undefined;
    var url = '/api/v1/report';
    var init = {
      method: 'POST',
      credentials: 'same-origin',
    };
  },
}
