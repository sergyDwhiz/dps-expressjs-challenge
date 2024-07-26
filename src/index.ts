import express, { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express(); // for parsing json data
const port = process.env.PORT || 3000;

app.use(express.json());

// Authentication middleware
const authToken = 'Password123';

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const token = req.headers.authorization;
	if (token !== authToken) {
		return res.status(401).send('Unauthorized');
	}
	next();
};

app.use(authMiddleware);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
