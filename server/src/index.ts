import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes';

const app = express();

app.use(cors()); // Allow all origins by default
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use('/api/user', userRouter);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
