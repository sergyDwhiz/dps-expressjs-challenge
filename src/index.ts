import express, { Express, NextFunction, Request, Response } from 'express';
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
// Define custom error classes
class ValidationError extends Error {
	constructor(message: string) {
	  super(message);
	  this.name = "ValidationError";
	}
  }

  class DatabaseError extends Error {
	constructor(message: string) {
	  super(message);
	  this.name = "DatabaseError";
	}
  }

// Define routes for projects

// create project
app.post('/projects', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            throw new ValidationError('Missing required parameters');
        }
        const newProject = await dbService.createProject({ id: '', name, description });
        res.status(201).json(newProject);
    } catch (error) {
        next(error);
    }
});


/// read (retrieve) all projects
app.get('/projects', async (req, res, next) => {
    try {
        const projects = await dbService.getProjects();
        res.json(projects);
    } catch (error) {
        console.error('Error retrieving projects:', error);
        next(new DatabaseError('Error retrieving projects'));
    }
});

// read (retrieve) project by Id
app.get('/projects/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await dbService.getProjectById(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error retrieving project:', error);
        next(new DatabaseError('Error retrieving project'));
    }
});

// update project
app.put('/projects/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = req.body;
        const updatedProject = await dbService.updateProject(id, project);
        res.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        next(new DatabaseError('Error updating project'));
    }
});

// delete project
app.delete('/projects/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await dbService.deleteProject(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting project:', error);
        next(new DatabaseError('Error deleting project'));
    }
});

// Define routes for reports

// Create report
app.post('/projects/:projectId/reports', async (req, res, next) => {
	try {
		const report = req.body;
		const project_id = req.params.projectId;
		const createdReport = await dbService.createReport({ ...report, project_id });
		res.status(201).json(createdReport);
	} catch (error) {
		console.error('Error creating report:', error);
		next(new DatabaseError('Error creating report'));
	}
});

// Get all reports for specific project
app.get('/projects/:projectId/reports', async (req, res, next) => {
	try {
		const projectId = req.params.projectId;
		const reports = await dbService.getReport(projectId);
		res.json(reports);
	} catch (error) {
		console.error('Error retrieving reports:', error);
		next(new DatabaseError('Error retrieving reports'));
	}
});

// Get specific report by id for a specific project
app.get('/projects/:projectId/reports/:id', async (req, res, next) => {
	try {
		const projectId = req.params.projectId;
		const id = req.params.id;
		const report = await dbService.getReportById(projectId, id);
		if (!report) {
			return res.status(404).json({ error: 'Report not found' });
		}
		res.json(report);
	} catch (error) {
		console.error('Error retrieving report:', error);
		next(new DatabaseError('Error retrieving report'));
	}
});

// update report
app.put('/projects/:projectId/reports/:id', async (req, res, next) => {
	try {
		const projectId = req.params.projectId;
		const id = req.params.id;
		const report = req.body;
		const updatedReport = await dbService.updateReport(id, { ...report, project_id: projectId });
		res.json(updatedReport);
	} catch (error) {
		console.error('Error updating report:', error);
		next(new DatabaseError('Error updating report'));
	}
});

// delete report
app.delete('/projects/:projectId/reports/:id', async (req, res, next) => {
	try {
		const projectId = req.params.projectId;
		const id = req.params.id;
		await dbService.deleteReport(projectId, id);
		res.status(204).send();
	} catch (error) {
		console.error('Error deleting report:', error);
		next(new DatabaseError('Error deleting report'));
	}
});

// Retrieve all reports with keywords appearing at least thrice
app.get('/reports/keywords/:keyword', async (req, res, next) => {
	try {
		const keyword = req.params.keyword;
		const reports = await dbService.RepeatedWord(keyword);
		res.json(reports);
	} catch (error) {
		console.error('Error retrieving reports with repeated keyword:', error);
		next(new DatabaseError('Error retrieving reports with repeated keyword'));
	}
});

// Add error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof ValidationError) {
	  res.status(400).json({ error: err.message });
	} else if (err instanceof DatabaseError) {
	  res.status(500).json({ error: 'Database error' });
	} else {
	  res.status(500).json({ error: 'Internal server error' });
	}
  });

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
