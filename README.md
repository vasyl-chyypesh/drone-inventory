# Drone inventory project

This is a project for managing a drone inventory. It allows you to keep track of your drones and their specifications.

## Checkout project

1. Clone the repository: `git clone https://github.com/vasyl-chyypesh/drone-inventory.git`
2. Change directory: `cd drone-inventory`

## Run the project locally using [Node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com/)

1. Install dependencies: `npm install`
2. Copy .env file and update values there: `cp .env.example .env`
3. Build project: `npm run build`
4. Start the server: `npm start`

## Run project using [Docker](https://www.docker.com/)

1. Copy .env file and update values there: `cp .env.example .env` 
2. Start `docker-compose up --build`

## Usage

1. Open your web browser and navigate to `http://localhost:3000`
2. Sign in with your credentials (or create your first admin user)
3. Start managing your drone inventory!

## License

This project is licensed under the [GPL-3.0](LICENSE) license.