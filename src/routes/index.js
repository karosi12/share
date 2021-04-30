import express from 'express';
const router = express.Router();
import userRouter from './user';

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'server is running 🚀'
  });
});
router.use('/', userRouter);

export default router;
