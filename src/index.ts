import express, { type Application } from 'express';
import ApiRoutes from './routes'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';


const app: Application = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/auth').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB', error);
});

app.use(bodyParser.json());


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api', ApiRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
