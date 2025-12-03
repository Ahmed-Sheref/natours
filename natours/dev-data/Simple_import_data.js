// const app = require('./index');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path')
const fs = require('fs'); 
dotenv.config({path: 'D:\\Programming\\Back_end\\Jonas\\natours\\config.env'})

// console.log(__dirname)
const tourModelPath = path.join(__dirname, '..', 'Models', 'tourModel.js');
const toursFilePath = path.join(__dirname, 'data', 'tours-simple.json');


const Tour = require(tourModelPath)

const TourData = JSON.parse(fs.readFileSync(toursFilePath, 'utf-8'));

const DB = process.env.DATABASE;

mongoose.connect(DB)
.then((con) => 
{
    console.log(con.connection)
    console.log('Connection Done');
})
.catch((err) => 
{
    console.error('Connection Error:', err);
});

async function import_data ()
{
    try
    {
        await Tour.create(TourData);
        console.log('import Data')
    }
    catch (err)
    {
        console.log('Failed' + err);
    }
    process.exit();
}

async function Delete_Data ()
{
    try
    {
        await Tour.deleteMany();
        console.log('Deleted Data')
    }
    catch (err)
    {
        console.log('Failed' + err);
    }
    process.exit();
}

if (process.argv[2] === '--import') import_data();
else if (process.argv[2] === '--delete') Delete_Data();