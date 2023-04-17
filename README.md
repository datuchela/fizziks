# fizziks

A web based co-op physics playground where you can interact with objects with other people in real-time

## Run it locally

### Server

Install dependencies first in server directory, then run `npm run dev`, you can set up port in `.env` file as well.

### Client

After installing dependencies in client directory, run `npm run dev`, it should run on port **3000** or quit. You can change that in `package.json`

## To do

1. - [x] Set up WebSocket connection between the server and the client
2. - [x] Spawn an object on canvas and send it to other clients
3. - [x] Implement gravity
4. - [x] Collision with walls/floor
5. - [x] Collision detection between objects
6. - [ ] Collision handling between objects
