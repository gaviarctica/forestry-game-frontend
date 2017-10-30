# forestry-game

## Backend

https://github.com/nime88/forestry-game

## Frontend

### Setting up
0. Install node.js if you don't have it (npm comes included)
1. `cd frontend`
2. `npm install`

### Start development server
1. `cd frontend`
2. `npm start`
3. Server starts at _localhost:3000_

The environment supports hot reloading, so the site automatically refreshes every time a file is changed.

### Working with the backend
The frontend's _package.json_ has a proxy setting in it:

`"proxy": "http://localhost:8080"`

This way, the frontend app automatically redirects requests to routes not found from it's own server to _localhost:8080_. So with the backend running at _localhost:8080_, requests in the frontend code to eg. _/api/v1/give/me/stuff_ will be forwarded to the backend.

### Building the frontend and integrating to backend
This is not neccessary in development, but the project is set up so that this should already work.
1. `cd frontend`
2. `npm run build`
3. The whole frontend gets compiled into static files to _build_ folder
4. Move the contents of _build_ folder to _forestry_game/static_
5. Run Django app
6. Go to _localhost:8080_

Result: The whole app, backend and frontend, running under the single Django server.
