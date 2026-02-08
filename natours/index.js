const express = require('express');
const TourRouter = require('./Routers/TourRouter')
const UserRouter = require('./Routers/UserRouter')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');


const app = express();
// app.use((req , res , next) => {console.log(req.query.sort = 5); next()});

app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/tours' , TourRouter);
app.use('/api/v1/users' , UserRouter);


module.exports = app;