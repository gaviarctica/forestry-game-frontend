
export const API = {

  validateSession: function(callback) {
    var err = undefined;
    var url = '/api/v1/validate';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function(response) {
      if (response.status === 200) {
      	return response.json();
      }
      else if(response.status === 204) {
        callback(err);
      } else {
      	err = 'Error getting CSRF cookie.';
        callback(err);
      }
    }).then(function(responseJson) {
    	if (responseJson) {
    		callback(err, responseJson.username, responseJson.email);
    	} else {
      	err = 'Error getting CSRF cookie.';
        callback(err);
      }
    });
  },

  login: function(username, password, callback) {
    var err = undefined;
    var url = '/api/v1/auth/login';
    var form = new FormData();
    form.append('username', username);
    form.append('password', password);
    var init = {
      method: 'POST',
      credentials: 'same-origin',
      body: form
    };

    var message = undefined;

    fetch(url, init).then(function (response) {
      if(response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        message = 'Wrong username or password';
        callback(err, message);
      } else {
        err = 'Error making login request.';
        callback(err);
      }
    }).then(function(responseJson) {
      if (responseJson) {
        callback(err, message, responseJson.username, responseJson.email);
      } else {
        err = 'Error making login request.';
        callback(err);
      }
    });
  },

  logout: function(callback) {
    var err = undefined;
    var url = '/api/v1/auth/logout';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function (response) {
      if(response.status === 200) {
        callback(err);
      } else {
        err = 'Error making logout request.';
        callback(err);
      }
    });
  },

  register: function (username, password, email, callback) {
    var err = undefined;
    var url = '/api/v1/auth/register';
    var form = new FormData();
    form.append('username', username);
    form.append('password', password);
    form.append('email', email);
    var init = {
      method: 'POST',
      credentials: 'same-origin',
      // headers: {
      // 	'Accept': 'application/json',
      // 	'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      // },
      body: form
    };

    var message = undefined;

    fetch(url, init).then(function (response) {
      if(response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        message = 'Wrong username or password';
        callback(err, message);
      } else {
        err = 'Error making login request.';
        callback(err);
      }
    }).then(function(responseJson) {
      if (responseJson) {
        callback(err, message, responseJson.username, responseJson.email);
      }
    });
  },

  getAllMapsInfo: function(callback) {
    var err = undefined;
    var url = '/api/v1/level';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function(response) {
      if (response.status === 200) {
        return response.json();
      } else {
        err = 'Error fetching map info.';
        callback(err);
      }
    }).then(function(responseJson) {
      if (responseJson) {
        callback(err, responseJson);
      } else {
        err = 'Error fetching map info.';
        callback(err);
      }
    });
  },

  getMapData: function(id, callback) {
    var err = undefined;
    var url = '/api/v1/level?id=' + id;
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function(response) {
      if (response.status === 200) {
        return response.json();
      } else {
        err = 'Error fetching map data.';
        callback(err);
      }
    }).then(function(responseJson) {
      if (responseJson) {
        callback(err, responseJson);
      } else {
        err = 'Error fetching map data.';
        callback(err);
      }
    });
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

    fetch(url, init).then(function(response) {
      if (response.status === 200) {
        return response.json();
      } else {
        err = 'Error fetching reports.';
        callback(err);
      }
    }).then(function(responseJson) {
      if (responseJson) {
        callback(err, responseJson);
      } else {
        err = 'Error fetching report.';
        callback(err);
      }
    });
  },

  getMyLatestScores: function(callback) {
    var err = undefined;
    var url = '/api/v1/scores';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function(response) {
      if (response.status === 200) {
        return response.json();
      } else {
        err = 'Error fetching reports.';
        callback(err);
      }
    }).then(function(responseJson) {
      if (responseJson) {
        callback(err, responseJson);
      } else {
        err = 'Error fetching report.';
        callback(err);
      }
    });
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
