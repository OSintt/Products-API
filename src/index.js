import app from './app';
import './db';
import { createRoles } from './lib/initialSetup';

const main = async () => {
	//await createRoles();
	await app.listen(app.get("port"), () => {
		console.log("Server listening on Port: " + app.get("port"));
	});
}

main();