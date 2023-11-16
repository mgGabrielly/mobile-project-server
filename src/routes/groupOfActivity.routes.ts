import express, { Router } from 'express';
import GroupOfActivityController from '../controllers/groupOfActivityController';
// import verifyJWT from '../middlewares/verifyToken';

const GroupOfActivityRoutes: Router = express.Router();

GroupOfActivityRoutes.get("/groupsOfActivities", GroupOfActivityController.getAllGroupOfActivity);
GroupOfActivityRoutes.post('/create-groupsOfActivities', GroupOfActivityController.createGroupOfActivity);
GroupOfActivityRoutes.get('/groupsOfActivities/:id', GroupOfActivityController.getGroupOfActivityById);
GroupOfActivityRoutes.put('/update-groupsOfActivities/:id', GroupOfActivityController.updateGroupOfActivity);
GroupOfActivityRoutes.delete('/delete-groupsOfActivities/:id', GroupOfActivityController.deleteGroupOfActivity);

export default GroupOfActivityRoutes;
