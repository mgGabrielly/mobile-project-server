import express, { Router } from 'express';
import DataDashboardController from '../controllers/dataDashboardController';
// import verifyJWT from '../middlewares/verifyToken';

const dashboardRoutes: Router = express.Router();

dashboardRoutes.get('/my-dashboard/:id', DataDashboardController.getDataDashboardByIdStudent);

export default dashboardRoutes;
