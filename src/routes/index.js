import express from 'express';
const router = express.Router();
import userRouter from './user';
import postRouter from './post';

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'server is running 🚀'
  });
});
router.use('/api/', userRouter);
router.use('/api/', postRouter);

export default router;
