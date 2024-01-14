import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cors());

app.listen(PORT,() => {

    console.log(`Server is Successfully Running, and App is listening on port ${PORT}`);

});
