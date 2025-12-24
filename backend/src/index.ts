import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import quizzesRouter from './routes/quizzes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(corsMiddleware);

app.use('/quizzes', quizzesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Quiz Builder API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
