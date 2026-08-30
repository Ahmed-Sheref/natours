const app = require('./index');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path: 'D:\\Programming\\Back_end\\Jonas\\natours\\config.env'})

const DB = process.env.DATABASE;

mongoose.connect(DB)
.then((con) => 
{
    console.log()
    console.log(con.connection)
    console.log('Connection Done');
})

const server = app.listen(3000 , () => {console.log('server is running...')});

process.on('unhandledRejection', (err) => 
{
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => 
    {
        process.exit(1);
    });
})
