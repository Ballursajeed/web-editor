import express from "express";
import { createFileOrFolder, deleteFile, getAllProjects, getFile, getProject, getProjectByUser, getTree, newProject, saveFile } from "../controllers/file.controller.js";
import { validateUser } from "../middlewares/user.middleware.js";

const route = express();


route.route('/tree/:projectId').get(validateUser,getTree);
route.route('/get/:id').get(validateUser,getFile);
route.route('/project/get/:id').get(validateUser,getProject);
route.route('/project/get').get(validateUser,getAllProjects);
route.route('/project/user').get(validateUser,getProjectByUser);

route.route('/add').post(validateUser,createFileOrFolder);
route.route('/new').post(validateUser,newProject);

route.route('/save/:id').put(validateUser,saveFile);
route.route('/delete/:id').delete(validateUser,deleteFile);

export default route;