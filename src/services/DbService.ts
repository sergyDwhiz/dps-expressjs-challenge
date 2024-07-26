 // Define database operations.
import db from './db.service'; // for `run` and `query` commands

export default class DbService {
    // create and return project object
    async createProject(project: {id: string, name: string, description: string }){
        try {
            const sql = 'INSERT INTO projects (id, name, description) VALUES (:id, :name, :description)';
            const result = db.run(sql, project);
            return {...project, ...result };
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }
    // retrieve all projects
    async getProjects(){
        try {
            const sql = 'SELECT * FROM projects';
            return db.query(sql);
        } catch (error) {
            console.error('Error retrieving projects:', error);
            throw error;
        }
    }
    // retrieve project by id
    async getProjectById(id: string){
        try {
            const sql = 'SELECT * FROM projects WHERE id = :id';
            return db.query(sql, {id});
        } catch (error) {
            console.error('Error retrieving project by id:', error);
            throw error;
        }
    }
    // update project by id
    async updateProject(id: string, project: {name: string, description: string}){
        try {
            const sql = 'UPDATE projects SET name = :name, description = :description WHERE id = :id';
            const result = db.run(sql, {...project, id});
            return {id, ...project, ...result};
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }
    // delete project by id
    async deleteProject(id: string){
        try {
            const sql = 'DELETE FROM projects WHERE id = :id';
            const result =  db.run(sql, {id});
            console.log(`Project with ${id} deleted`);
            return result;
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }

    // create report
    async createReport(report: {id: string, text: string, project_id: string}){
        try {
            const sql = 'INSERT INTO reports (id, text, project_id) VALUES (:id, :text, :project_id)';
            const result = db.run(sql, report);
            return {...report, ...result};
        } catch (error) {
            console.error('Error creating report:', error);
            throw error;
        }
    }
    //
    // retrieve all reports associated with a specific project (could be multiple reports)
    async getReport(project_id: string){
        try {
            const sql = 'SELECT * FROM reports WHERE project_id = :project_id';
            return db.query(sql, {project_id});
        } catch (error) {
            console.error('Error retrieving reports:', error);
            throw error;
        }
    }

    // retrieves a specific report by its unique ID, ensuring it belongs to the
    // specified project. The output will be a single report object if found, or
    // null if no matching report exists.
    async getReportById(project_id:string, id: string){
        try {
            const sql = 'SELECT * FROM reports WHERE project_id = :project_id AND id = :id';
            return db.query(sql, {project_id, id});
        } catch (error) {
            console.error('Error retrieving report by id:', error);
            throw error;
        }
    }
    // update report
    async updateReport(id: string, report :{text: string, project_id: string}){
        try {
            const sql = 'UPDATE reports SET text = :text, project_id = :project_id WHERE id = :id';
            const result =  db.run(sql, {...report, id});
            return {id, ...report, ...result};
        } catch (error) {
            console.error('Error updating report:', error);
            throw error;
        }
    }
    // delete report
    async deleteReport(id: string, project_id: string){
        try {
            const sql = 'DELETE FROM reports WHERE id = :id AND project_id = :project_id';
            const result = db.run(sql, {id, project_id});
            return console.log(`Report with ${id} deleted`);
        } catch (error) {
            console.error('Error deleting report:', error);
            throw error;
        }
    }

    // Get reports where words repeat at least thrice
    async RepeatedWord(keyword: string){
        try {
            // Calculate the length of the text in each report (LENGTH(text)).
            // Remove all occurrences of the keyword from the text (REPLACE(text, :keyword, '')) and calculate the length of the result.
            // By subtracting the second length from the first, we get the total length of all occurrences of the keyword in the text.
            // Then divide this by the length of the keyword (LENGTH(:keyword)) to get the number of occurrences of the keyword.
            // Finally, we check if this number is greater than or equal to 3, which means the keyword appears at least three times.
            const sql = `SELECT * FROM reports WHERE (LENGTH(text) - LENGTH(REPLACE(text, :keyword, ''))) / LENGTH(:keyword) >= 3`;
            return db.query(sql, {keyword});
        } catch (error) {
            console.error('Error retrieving reports with repeated words:', error);
            throw error;
        }
    }
}