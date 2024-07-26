import db from './db.service'; // for `run` and `query` commands

export default class DbService {
    // create and return project object
    async createProject(project: {id: string, name: string, description: string }){
        const sql = 'INSERT INTO projects (id, name, description) VALUES (:id, :name, :description)';
       const result = db.run(sql, project);
        return {...project, ...result }; // return project details and result from operation
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
        const result = db.run(sql, {...project, id});
        return {id, ...project, ... result};
    }
    // delete project by id
    async deleteProject(id: string){
        const sql = 'DELETE FROM projects WHERE id = :id';
        const result =  db.run(sql, {id});
        console.log(`Project with ${id} deleted`);
        return result;
    }

    // create report
    async createReport(report: {id: string, text: string, project_id: string}){
        const sql = 'INSERT INTO reports (id, text, project_id) VALUES (:id, :text, :project_id)';
        const result = db.run(sql, report);
        return {...report, ...result};
    }
    //
    // retrieve all reports associated with a specific project (could be multiple reports)
    async getReport(project_id: string){
        const sql = 'SELECT * FROM reports WHERE project_id = :project_id';
        return db.query(sql, {project_id});
    }

    // retrieves a specific report by its unique ID, ensuring it belongs to the
    // specified project. The output will be a single report object if found, or
    // null if no matching report exists.
    async getReportById(project_id:string, id: string){
        const sql = 'SELECT * FROM reports WHERE project_id = :project_id AND id = :id';
        return db.query(sql, {project_id, id});
    }
    // update report
    async updateReport(id: string, report :{text: string, project_id: string}){
        const sql = 'UPDATE reports SET text = :text, project_id = :project_id WHERE id = :id';
        const result =  db.run(sql, {...report, id});
        return {id, ...report, ...result};
    }
    // delete report
    async deleteReport(id: string, project_id: string){
        const sql = 'DELETE FROM reports WHERE id = :id AND project_id = :project_id';
        const result = db.run(sql, {id, project_id});
        return console.log(`Report with ${id} deleted`);
    }

}