import app from './app';
import './db';
import { createRoles, createTypes } from './lib/initialSetup';
import { saleTimeout } from './lib/saleTimeout';

const main = async () => {
	//await createRoles();
	//await createTypes();
	saleTimeout();
	await app.listen(app.get("port"), () => {
		console.log("Server listening on Port: " + app.get("port"));
	});
}

main();