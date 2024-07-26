import express, { Express } from 'express';
import dotenv from 'dotenv';
import DbService from '../src/services/DbService';

dotenv.config();

const app: Express = express(); // for parsing json data
const port = process.env.PORT || 3000;
const dbService = new DbService();

app.use(express.json());

// Authentication middleware
const authToken = process.env.AUTH_TOKEN;

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const token = req.headers.authorization;
	if (token !== authToken) {
		return res.status(401).send('Unauthorized');
	}
	next();
};

// Define routes for projects

// create project
app.post('/projects', authMiddleware, async (req, res) => {
	const project = req.body;
	const newProject = await dbService.createProject(project);
	res.status(201).json(newProject);
});
// read (retrieve) all projects
app.get('/projects', async (req, res) => {
	const projects = await dbService.getProjects();
	res.json(projects);
});
// read (retrieve) project by Id
app.get('/projects/:id', async (req, res) => {
	const id = req.params.id;
	const project = await dbService.getProjectById(id);
	res.json(project);
});

// update project
app.put('/projects/:id', async (req, res) => {
	const id = req.params.id;
	const project = req.body;
	const updatedProject = await dbService.updateProject(id, project);
	res.json(updatedProject);
});
// delete project
app.delete('/projects/:id', async (req, res) => {
	const id = req.params.id;
	await dbService.deleteProject(id);
	res.status(204).send();
});



app.use(authMiddleware);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
