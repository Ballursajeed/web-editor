import express from "express";
import { 
         createFileOrFolder, 
         deleteFile, 
         deleteProject, 
         getAllProjects, 
         getColloboratedProject, 
         getFile, 
         getProject, 
         getProjectByUser, 
         getTree, 
         newCollaborator, 
         newProject, 
         saveFile, 
         updateProject 
        } from "../controllers/file.controller.js";
import { validateUser } from "../middlewares/user.middleware.js";

const route = express();


route.route('/tree/:projectId').get(validateUser,getTree);
route.route('/get/:id').get(validateUser,getFile);
route.route('/project/get/:id').get(validateUser,getProject);
route.route('/project/get').get(validateUser,getAllProjects);
route.route('/project/user').get(validateUser,getProjectByUser);
route.route('/project/live/:id').get(validateUser,getColloboratedProject);

route.route('/add').post(validateUser,createFileOrFolder);
route.route('/new').post(validateUser,newProject);
route.route('/project/newCollaborator/:id').post(validateUser,newCollaborator);

route.route('/save/:id').put(validateUser,saveFile);
route.route('/project/:id').put(validateUser,updateProject);

route.route('/delete/:id').delete(validateUser,deleteFile);
route.route('/project/:id').delete(validateUser,deleteProject);

export default route;