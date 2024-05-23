import express from "express";
import multer from "multer";
//import { v4 as uuid } from "uuid"; // Hussain: Problem with using this so not implemented going to use the same file name as what teh user is uploading 
import fs from "fs";


const upload = multer({ dest: "temp" });
const router = express.Router();

/**
 * On a POST to "/api/uploads", as multipart/form-data, multer will read the uploaded file
 * specified with "imageFile". The text part, named "message", will be available as req.body.message.
 *
 * This
 */
router.post("/", upload.single("image-file"), async (req, res) => {
    // If we want the original file name, we can get it with req.file.originalname
    // Getting the path will get the current location and filename of the uploaded file.
    // Note that the file will be named something random.
    
  
    // Let's create a custom file name for our newly uploaded file, and move it into the
    // public/images folder. We're creating a random file name here; you could potentially
    // use the originalname instead, but then you'll have to watch out for cases where users might
    // accidentally overwrite each others' files.
    const originalname = req.file.originalname;
    //const fileExtension = originalname.substring(originalname.lastIndexOf(".")); // Hussain: Not making a new name: this is not needed 

    //const newFileName = uuid() + fileExtension; Hussain: not doing this cuz not sure whats wrong with uuid
    const newFileName= originalname; 
   
  
    // Move the file using fs package. We can do this using rename operations
    fs.renameSync(req.file.path, `public/images/${newFileName}`);
  
    // Now let's send req.body.message and the path of the image back to the browser, as JSON.
    const response = {
      message: req.body.message,
      imageUrl: `/images/${newFileName}` // Remember not to include "public" since that part will be ignored in the URL.
    };
  
    return res.json(response);
  });
  
  export default router;