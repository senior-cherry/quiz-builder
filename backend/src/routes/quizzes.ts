import { Router, type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

interface QuestionInput {
  text: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
  correctAnswer?: string;
  options?: string[];
  correctOptions?: string[];
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, questions } = req.body;

    if (
      !title ||
      !questions ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res
        .status(400)
        .json({ error: 'Title and at least one question are required' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q: QuestionInput) => {
            if (q.type === 'BOOLEAN') {
              return {
                text: q.text,
                type: 'BOOLEAN',
                correctAnswer: q.correctAnswer ?? null,
                options: [],
                correctOptions: [],
              };
            } else if (q.type === 'INPUT') {
              return {
                text: q.text,
                type: 'INPUT',
                correctAnswer: q.correctAnswer ?? null,
                options: [],
                correctOptions: [],
              };
            } else if (q.type === 'CHECKBOX') {
              return {
                text: q.text,
                type: 'CHECKBOX',
                correctAnswer: null,
                options: q.options || [],
                correctOptions: q.correctOptions || [],
              };
            }
            throw new Error(`Invalid question type: ${q.type}`);
          }),
        },
      },
      include: {
        questions: true,
      },
    });

    res.status(201).json(quiz);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create quiz';
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const quizzesWithCount = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionCount: quiz._count.questions,
    }));

    res.json(quizzesWithCount);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch quizzes';
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Quiz ID is required' });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch quiz';
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: errorMessage });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Quiz ID is required' });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    await prisma.quiz.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete quiz';
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
