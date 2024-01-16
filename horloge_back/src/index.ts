import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRoutes from './routes/api';


const app = express();
const PORT = 2000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cors());
app.use(apiRoutes());


app.listen(PORT,() => {

    console.log(`Server is Successfully Running, and App is listening on port ${PORT}`);

});
