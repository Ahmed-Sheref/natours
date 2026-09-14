const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV !== 'production') 
{
    dotenv.config({path: path.join(__dirname, 'config.env')});
}

const mongoose = require('mongoose');
const app = require('./index');

const DB = process.env.DATABASE;

mongoose
    .connect(DB)
    .then(() => 
    {
        console.log('Database connected');
    })
    .catch((err) => 
    {
        console.error('Database connection failed:', err);
        process.exit(1);
    });


const PORT = process.env.PORT || 3000;


const server = app.listen(
    PORT, '0.0.0.0', () => 
    {
        console.log(`Server running on port ${PORT}`);
    }
);


process.on(
    'unhandledRejection',
    (err) => 
    {
        console.error(
            'UNHANDLED REJECTION:',
            err
        );
        server.close(() => 
        {
            process.exit(1);
        });
    }
);