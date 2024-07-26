import db from './db.service'; // for run and query commands

export default class DbService {
    // create and return project object
    async createProject(project: {id: string, name: string, description: string }){
        const sql = 'INSERT INTO projects (id, name, description) VALUES (:id, :name, :description)';
        db.run(sql, project);
        return project;
    }
    // read all projects
    async getProjects(){
        const sql = 'SELECT * FROM projects';
        return db.query(sql);
    }
    // read project by id
    async getProject(id: string){
        const sql = 'SELECT * FROM projects WHERE id = :id';
        return db.query(sql, {id});
    }
    // update project by id
    async updateProject(id: string, project: {name: string, description: string}){
        const sql = 'UPDATE projects SET name = :name, description = :description WHERE id = :id';
        db.run(sql, {...project, id});
        return {id, ...project};
    }
    // delete project by id
    async deleteProject(id: string){
        const sql = 'DELETE FROM projects WHERE id = :id';
        db.run(sql, {id});
        return console.log(`Project with ${id} deleted`);
    }
}