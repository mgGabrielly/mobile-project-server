import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import resetPasswordRoutes from './routes/resetPassword.routes';
import registerStudentsRoutes from './routes/registerStudents.routes';
import authRoutes from './routes/auth.routes';
import groupOfActivityRoutes from './routes/groupOfActivity.routes';
import typeOfActivityRoutes from './routes/typeOfActivity.routes';
import activityRoutes from './routes/activity.routes';
import dashboardRoutes from './routes/dashboard.routes';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocs from './swagger.json';

const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Use Helmet para configurar cabeçalhos de segurança
app.use(helmet());
// Permitir todas as origens (somente para desenvolvimento)
app.use(cors());

// // Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use(userRoutes);
app.use(resetPasswordRoutes);
app.use(registerStudentsRoutes);
app.use(authRoutes);
app.use(groupOfActivityRoutes);
app.use(typeOfActivityRoutes);
app.use(activityRoutes);
app.use(dashboardRoutes);

app.get('/', (req, res) => {
    res.send('Hello guys!');
});

// Default response to other requests
app.use((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.status(200).send({
      message: "Connected"
    });
});

// Listen to the App
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default app;
