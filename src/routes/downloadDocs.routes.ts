import express, { Router } from 'express';
import DownloadApplicationController from '../controllers/downloadApplicationController';
import DownloadAccountingController from '../controllers/downloadAccountingController';
// import verifyJWT from '../middlewares/verifyToken';

const downloadDocsRoutes: Router = express.Router();

downloadDocsRoutes.get('/download-requerimento/:id', DownloadApplicationController.getDocApplicationByIdStudent);
downloadDocsRoutes.get('/download-contabilizacao/:id', DownloadAccountingController.getDocAccountingByIdStudent);

export default downloadDocsRoutes;
