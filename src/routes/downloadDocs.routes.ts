import express, { Router } from 'express';
import DownloadDocsController from '../controllers/downloadDocsController';
// import verifyJWT from '../middlewares/verifyToken';

const downloadDocsRoutes: Router = express.Router();

downloadDocsRoutes.get('/download-requerimento/:id', DownloadDocsController.getDocApplicationByIdStudent);
downloadDocsRoutes.get('/download-contabilização/:id', DownloadDocsController.getDocAccountingByIdStudent);

export default downloadDocsRoutes;
