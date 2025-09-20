import express from "express";
import { 
         createFileOrFolder, 
         createSession, 
         deleteFile, 
         deleteProject, 
         getAllProjects, 
         getCollabeProject, 
         getFile, 
         getProject, 
         getProjectByUser, 
         getTree, 
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
route.route('/project/collabe/:session').get(validateUser,getCollabeProject);

route.route('/add').post(validateUser,createFileOrFolder);
route.route('/new').post(validateUser,newProject);
route.route('/project/createSession').post(validateUser,createSession);

route.route('/save/:id').put(validateUser,saveFile);
route.route('/project/:id').put(validateUser,updateProject);

route.route('/delete/:id').delete(validateUser,deleteFile);
route.route('/project/:id').delete(validateUser,deleteProject);

export default route;