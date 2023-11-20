import express, { Router } from 'express';
import GroupOfActivityController from '../controllers/groupOfActivityController';
// import verifyJWT from '../middlewares/verifyToken';

const groupOfActivityRoutes: Router = express.Router();

groupOfActivityRoutes.get("/groupsOfActivities", GroupOfActivityController.getAllGroupOfActivity);
groupOfActivityRoutes.post('/create-groupsOfActivities', GroupOfActivityController.createGroupOfActivity);
groupOfActivityRoutes.get('/groupsOfActivities/:id', GroupOfActivityController.getGroupOfActivityById);
groupOfActivityRoutes.put('/update-groupsOfActivities/:id', GroupOfActivityController.updateGroupOfActivity);
groupOfActivityRoutes.delete('/delete-groupsOfActivities/:id', GroupOfActivityController.deleteGroupOfActivity);

export default groupOfActivityRoutes;
