require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./router/router');
const app = express();

const URL = process.env.CLIENT_URL;


//middlewares
app.use(cors({ origin: URL }));
app.use(express.json());// req.body

//routes
app.use('/', router);

app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message: err.message || 'Something went wrong',
        status: statusCode
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
