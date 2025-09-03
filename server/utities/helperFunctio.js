import { File } from "../models/file.model.js";

export const buildTree = (items,parentId = null,projectId) => {

    return items
    .filter(item => String(item.parentId) === String(parentId))
    .filter(item => String(item.projectId) === String(projectId))
    .map(item => ({
      _id: item._id,
      name: item.name,
      type: item.type,
      projectId: item.projectId,
      content: item.type === "file" ? item.content : undefined,
      children: buildTree(items, item._id,projectId) 
    }));
}

export const deleteFileRecursively = async (id) => {
  const children = await File.find({ parentId: id });
  for (const child of children) {
    await deleteFileRecursively(child._id);
  }
  await File.findByIdAndDelete(id);
}