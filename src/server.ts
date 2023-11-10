import express from 'express';
// import userRoutes from './routes/user.routes';
// import resetPasswordRoutes from './routes/resetPassword.routes';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocs from './swagger.json';

const app = express();

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// // Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// // Routes
// app.use(userRoutes);
// app.use(resetPasswordRoutes);

app.get('/', (req, res) => {
    res.send('Hello guys!');
});

// Listen to the App
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default app;
