function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
export const API = {

  validateSession: function (callback) {
    var err = undefined;
    var url = '/api/v1/validate';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function (response) {
      if (response.status === 200) {
        return response.json();
      }
      else if (response.status === 204) {
        callback(err);
      } else {
        err = 'Error getting CSRF cookie.';
        callback(err);
      }
    }).then(function (responseJson) {
      if (responseJson) {
        callback(err, responseJson.username, responseJson.email);
      } else {
        err = 'Error getting CSRF cookie.';
        callback(err);
      }
    });
  },

  login: function (username, password, callback) {
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

    var messages = [];

    fetch(url, init).then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        messages.push('wrongUsernameOrPassword');
        callback(err, messages);
      } else {
        err = 'Error making login request.';
        callback(err);
      }
    }).then(function (responseJson) {
      if (responseJson) {
        callback(err, messages, responseJson.username, responseJson.email);
      } else {
        err = 'Error making login request.';
        callback(err);
      }
    });
  },

  logout: function (callback) {
    var err = undefined;
    var url = '/api/v1/auth/logout';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function (response) {
      if (response.status === 200) {
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
      body: form
    };

    var messages = [];

    fetch(url, init).then(function (response) {
      if (response.status === 200 || response.status === 400) {
        return response.json();
      } else {
        err = 'Error making register request.';
        callback(err);
      }
    }).then(function (responseJson) {
      if (responseJson) {
        // If form is valid but errors in create()
        if (responseJson.username && responseJson.username.indexOf("A user with that username already exists.") !== -1) {
          messages.push('usernameExists');
        } else if (responseJson.email && responseJson.email.indexOf("A user with that email already exists.") !== -1) {
          messages.push('emailExists');
        } else {
          // If form is not valid the errors come neatly in responseJson
          messages = responseJson;
        }
        callback(err, messages, responseJson.username, responseJson.email);
      }
    });
  },

  getAllMapsInfo: function (callback) {
    var err = undefined;
    var url = '/api/v1/level';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        err = 'Error fetching map info.';
        callback(err);
      }
    }).then(function (responseJson) {
      if (responseJson) {
        callback(err, responseJson);
      } else {
        err = 'Error fetching map info.';
        callback(err);
      }
    });
  },

  getMapData: function (id, callback) {
    var err = undefined;
    var url = '/api/v1/level?id=' + id;
    var init = {
      method: 'GET',
      credentials: 'same-origin'
    };

    fetch(url, init).then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        err = 'Error fetching map data.';
        callback(err);
      }
    }).then(function (responseJson) {
      if (responseJson) {
        callback(err, responseJson);
      } else {
        err = 'Error fetching map data.';
        callback(err);
      }
    });
  },

  addMap: function (levelName, mapData, mapInfo, callback) {
    var err = undefined;
    var url = '/api/v1/level/';
    var form = new FormData();
    form.append('levelName', levelName);
    form.append('mapData', mapData);
    form.append('mapInfo', mapInfo);
    var init = {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      body: form
    };

    fetch(url, init).then(function (response) {
      if (response.status === 200) {
        callback(err);
        return;
      } else {
        err = 'Error adding map data.';
        callback(err);
      }
    });
  },

  getReports: function (n, callback) {
    var err = undefined;
    var url = '/api/v1/report?n=' + n;
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        err = 'Error fetching reports.';
        callback(err);
      }
    }).then(function (responseJson) {
      if (responseJson) {
        callback(err, responseJson);
      } else {
        err = 'Error fetching report.';
        callback(err);
      }
    });
  },

  getMyLatestScores: function (callback) {
    var err = undefined;
    var url = '/api/v1/report/';
    var init = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(url, init).then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        err = 'Error fetching reports.';
        callback(err);
      }
    }).then(function (responseJson) {
      if (responseJson) {
        callback(err, responseJson);
      } else {
        err = 'Error fetching report.';
        callback(err);
      }
    });
  },

  postReport: function (data, callback) {
    var err = undefined;
    var url = '/api/v1/report/';
    var form = new FormData();
    Object.keys(data).forEach(function(key) {
      form.append(key, data[key]);
    });
    var init = {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      body: form
    };

    fetch(url, init).then(function (response) {
      if (response.status === 200) {
        callback(err);
      } else {
        err = 'Error posting report.';
        callback(err);
      }
    });
  },
}
