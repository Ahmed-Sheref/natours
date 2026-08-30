const express = require('express');
const TourRouter = require('./Routers/TourRouter');
const UserRouter = require('./Routers/UserRouter');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const appError = require('./utils/appError')
const errorHandler = require('./Controllers/errorController');


const app = express();
// app.use((req , res , next) => {console.log(req.query.sort = 5); next()});

app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/tours' , TourRouter);
app.use('/api/v1/users' , UserRouter);

app.use((req,res,next) => 
{
    // let err = new Error('Path not found')
    // err.statusCode = 404;
    // err.status = 'fail';

    next(new appError('path Not Found', 404));
})

app.use(errorHandler);

module.exports = app;