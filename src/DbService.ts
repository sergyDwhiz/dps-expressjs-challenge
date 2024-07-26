// Defines a class that provides methods for interacting with db
import db from './db.service.ts';

// Create and return project object
export default class DbService {
    async createProject(project: {id: string, name: string, description: bigint }){
        const sql = 'INSERT INTO projects (id, name, description) VALUES (:id, :name, :description)';
        db.run (sql, project);
        return project;
    }
}
