import { File } from "../models/file.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { buildTree, deleteFileRecursively } from "../utities/helperFunctio.js";

export const createFileOrFolder = async (req, res) => {
  try {

    const { name, type, parentId, projectId } = req.body;

    if (!name || !type || !projectId) {
      return res.status(400).json({
        message: "Name, type and projectId are required!",
        success: false,
      });
    }

  
    if (parentId) {
  const parent = await File.findById(parentId);
  if (!parent) {
    return res.status(404).json({
      message: "Parent not found!",
      success: false,
    });
  }

  if (parent.type === "file") {
    return res.status(400).json({
      message: "Sorry, can't create a file or folder inside another file!",
      success: false,
    });
  }
}

if(type === 'file'){
  
}

    const newItem = await File.create({
      name,
      type,
      content: "", 
      parentId: parentId || null,             
      projectId,
    });

    return res.status(201).json({
      message: `${type} created successfully!`,
      success: true,
      item: newItem,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
      error: error.message,
    });
  }
};

export const newProject = async(req,res) => {
    try {
        
        const { name } = req.body;

        const sameName = await Project.findOne({ name, owner: req.user._id });

    if (sameName) {
      return res.status(400).json({
        message: "You already have a project with this name",
        success: false,
      });
    }
        
        const project = await Project.create({
            name,
            owner:req.user._id
        });



        return res.status(200).json({
            message: "Project Created Successfully!",
            success: true,
            project
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong!",
            success: false,
            error
        })
    }
}

export const newCollaborator = async (req, res) => {
  try {
    
    const { id } = req.params;
    const userId = req.user; 
    
    if (!userId) {
      return res.status(401).json({
        message: "Not Authenticated!",
        success: false
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        message: "Project not found!",
        success: false
      });
    }

    if (project.collaborators.includes(user._id)) {
      return res.status(400).json({
        message: "User is already a collaborator!",
        success: false
      });
    }

    project.collaborators.push(user._id);
    await project.save();

    return res.status(200).json({
      message: "Collaborator added successfully!",
      success: true,
      project
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
      error: error.message
    });
  }
};

export const updateProject = async(req,res) => {
  try {
    
    const { name } = req.body;
    const { id } = req.params;

    const sameName = await Project.findOne({ name, owner: req.user._id });

    if (sameName) {
      return res.status(400).json({
        message: "You already have a project with this name",
        success: false,
      });
    }

    const project = await Project.findById(id);

    if(name) project.name = name;

    await project.save();

    res.status(200).json({
            message: "Project updated Successfully!",
            success: true,
            project
        })

  } catch (error) {
     return res.status(500).json({
            message: "Something went wrong!",
            success: false,
             error: error.message
        })
  }
}

export const saveFile = async(req,res) => {
    try {
        const {name, content} = req.body;
        const { id } = req.params;
        
        const file = await File.findById(id);

        if(!file) {
            res.status(400).json({
                message: "File not found!",
                success: false
            })
        }

        if (file.type === "folder" && content) {
            return res.status(400).json({
                message: "Cannot set content on a folder!",
                success: false,
            });
        }
        
        if(name) file.name = name;
        if(content) file.content = content;

        await file.save();

        res.status(200).json({
            message: "File saved Successfully!",
            success: true,
            file
        })

    } catch (error) {
         return res.status(500).json({
            message: "Something went wrong!",
            success: false,
            error: error.message
        })
    }
}

export const getFile = async(req,res) => {
    try {
        const { id } = req.params;

        const file = await File.findById(id);

        if(!file) {
            return res.status(400).json({
                message: "File not Found!",
                success: false
            })
        }

        return res.status(200).json({
            message:"File Fetched Successfully!",
            success: true,
            file
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong!",
            success: false,
            error: error.message
        })
    }
}

export const getAllProjects = async(req,res) => {
  try {
    const projects = await Project.find();

    return res.status(200).json({
      message: "Projects fetched Successfully!",
      success: true,
      projects
    })

  } catch (error) {
    return res.status(500).json({
            message: "Something went wrong!",
            success: false,
            error
        })
  }
}

export const getProjectByUser = async(req,res) => {

  try {
    
    const projects = await Project.find({ owner: req.user });

   if(projects.length == 0){
    return res.status(200).json({
      message: "You have no projects",
      success: true,
      projects
    })
   }

   return res.status(200).json({
    message:"Projects fetched Successfully!",
    success: true,
    projects
   })

  } catch (error) {
     return res.status(500).json({
            message: "Something went wrong! while fetching projects",
            success: false,
            error
        })
  }
}

export const getProject = async(req,res) => {
  try {
    
    const { id } = req.params;

    const project = await Project.findById(id);

    if(!project){
      return res.status(400).json({
        message: "Project Not found!",
        success: false
      })
    }

    return res.status(200).json({
      message: "Project Fetched Successfully!",
      success: true,
      project
    })

  } catch (error) {
    return res.status(500).json({
            message: "Something went wrong!",
            success: false,
            error
        })
  }
}

export const getTree = async(req,res) => {
    try {

        const { projectId } = req.params;

        const files = await File.find();
        const tree = buildTree(files,null,projectId);

        return res.status(200).json({
            message: "Tree fetched successfully!",
            success: true,
            tree
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong!",
            success: false,
            error: error.message
        })
    }
}

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        message: "File/Folder not found!",
        success: false,
      });
    }

    await deleteFileRecursively(id);

    return res.status(200).json({
      message: `${file.type} deleted successfully (including children if any)!`,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
      error: error.message,
    });
  }
};

export const deleteProject = async(req,res) => {
  try {
    
    const { id } = req.params;

    const project = await Project.findById(id);

    if(!project){
      return res.status(400).json({
        message: "Project not found!",
        success: false
      })
    }

    await Project.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Project is deleted Successfully!",
      success: true
    })

  } catch (error) {
      return res.status(500).json({
      message: "Something went wrong!",
      success: false,
      error: error.message,
    });
  }
}