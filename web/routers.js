import express from 'express';
import { handleDeleteCheckout, handleExamplePost } from './controllers/controllers.js';

const router = express.Router();

router.post('/example', handleExamplePost);

router.delete('/api/delete/:checkoutId', handleDeleteCheckout);

export default router;
