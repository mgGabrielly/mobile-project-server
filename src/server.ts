import express from 'express';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';
import resetPasswordRoutes from './routes/resetPassword.routes';
import RegisterStudentsRoutes from './routes/registerStudents.routes';
import authRoutes from './routes/auth.routes';
import GroupOfActivityRoutes from './routes/groupOfActivity.routes';
import typeOfActivityRoutes from './routes/typeOfActivity.routes';
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

// // Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use(userRoutes);
app.use(resetPasswordRoutes);
app.use(RegisterStudentsRoutes);
app.use(authRoutes);
app.use(GroupOfActivityRoutes);
app.use(typeOfActivityRoutes);

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
