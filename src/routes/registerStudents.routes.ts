import express, { Router } from 'express';
import multer from "multer";
import AddStudentsController from "../controllers/registerStudentsController";

//logic to save a uploaded file
const path = require("path");
const storage = multer.diskStorage({
    destination: function (
        req: any,
        file: any,
        cb: (arg0: null, arg1: string) => void
    ) {
        cb(null, "uploads/register-students/");
    },
    filename: function (
        req: any,
        file: any,
        cb: (arg0: null, arg1: string) => void
    ) {
        cb(
            null,
            file.originalname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({
  storage: storage,
});

const registerStudentsRoutes: Router = express.Router();

registerStudentsRoutes.post("/register-students", upload.single("file"), AddStudentsController.addDatasStudents);

export default registerStudentsRoutes;
