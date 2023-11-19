import express, { Router } from 'express';
import multer from "multer";
import ActivityController from '../controllers/activityController';
// import verifyJWT from '../middlewares/verifyToken';

//logic to save a uploaded file
const path = require("path");
const storage = multer.diskStorage({
    destination: function (
        req: any,
        file: any,
        cb: (arg0: null, arg1: string) => void
    ) {
        cb(null, "uploads/certificates/");
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

const activityRoutes: Router = express.Router();

activityRoutes.get("/activities", ActivityController.getAllActivity);
activityRoutes.post('/create-activities/:id', upload.single("file"), ActivityController.createActivity);
activityRoutes.get('/activities/:id', ActivityController.getActivityById);
activityRoutes.put('/update-activities/:id', ActivityController.updateActivity);
activityRoutes.delete('/delete-activities/:id', ActivityController.deleteActivity);
activityRoutes.get('/my-activities/:id', ActivityController.getAllActivityByIdStudent);
activityRoutes.put('/evaluate-activity/:id', ActivityController.evaluateActivity);

export default activityRoutes;
