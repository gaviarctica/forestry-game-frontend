export function login (username, password, callback) {
	//TODO: connect to db
	var message;
	if (username !== "Arho") {
		message = "Wrong username!";
	}
	setTimeout(callback(message), 500);
}