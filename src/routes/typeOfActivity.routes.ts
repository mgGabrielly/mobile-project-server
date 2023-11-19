import express, { Router } from 'express';
import TypeOfActivityController from '../controllers/typeOfActivityController';
// import verifyJWT from '../middlewares/verifyToken';

const typeOfActivityRoutes: Router = express.Router();

typeOfActivityRoutes.get("/typesOfActivities", TypeOfActivityController.getAllTypeOfActivity);
typeOfActivityRoutes.post('/create-typesOfActivities', TypeOfActivityController.createTypeOfActivity);
typeOfActivityRoutes.get('/typesOfActivities/:id', TypeOfActivityController.getTypeOfActivityById);
typeOfActivityRoutes.put('/update-typesOfActivities/:id', TypeOfActivityController.updateTypeOfActivity);
typeOfActivityRoutes.delete('/delete-typesOfActivities/:id', TypeOfActivityController.deleteTypeOfActivity);

export default typeOfActivityRoutes;
