const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

export const uploadContent = async (file) => {
  if (file.originalname) {
    const content = await readFileAsync(`./uploads/${file.originalname}`);
    if (!content) return { message: "unable to upload file", data: null };
    return { message: `${file.originalname} was uploaded successfully`, data: `${file.originalname}`};
  } else {
    return { message: "No file found, try upload again", data: null };
  }
}

