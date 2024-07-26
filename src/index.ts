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

// Apply middleware to all routes
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const token = req.headers.authorization;
	if (token !== authToken) {
		return res.status(401).send('Unauthorized');
	}
	next();
};
app.use(authMiddleware);

// Define routes for projects

// create project
app.post('/projects', async (req, res) => {
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

// Define routes for reports

// Create report
app.post('/projects/:projectId/reports', async (req, res) => {
	const report = req.body;
	const project_id = req.params.projectId;
    const createdReport = await dbService.createReport({...report, project_id});
    res.status(201).json(createdReport);
});
// Get all reports for specific project
app.get('/projects/:projectId/reports', async (req, res) => {
	const projectId = req.params.projectId;
	const reports = await dbService.getReport(projectId);
	res.json(reports);
});
// Get specific report by id for a specific project
app.get('/projects/:projectId/reports/:id', async (req, res) => {
	const projectId = req.params.projectId;
	const id = req.params.id;
	const reports = await dbService.getReportById(projectId, id);
	res.json(reports);
});
// update report
app.put('/projects/:projectId/reports/:id', async (req, res) => {
	const projectId = req.params.projectId;
	const id = req.params.id;
	const report = req.body;
	const updatedReport = await dbService.updateReport(id, { ...report, project_id: projectId });
	res.json(updatedReport);
});
// delete report
app.delete('/projects/:projectId/reports/:id', async (req, res) => {
	const projectId = req.params.projectId;
	const id = req.params.id;
	await dbService.deleteReport(projectId, id);
	res.status(204).send();
});
app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
