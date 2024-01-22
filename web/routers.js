import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/example', async (req, res) => {
	const { checkoutToken, productIds } = req.body;

	try {
		const savedCart = await prisma.savedCart.create({
			data: {
				checkoutToken: checkoutToken,
				products: JSON.stringify(productIds), // Преобразование массива в JSON-строку
			},
		});

		res.json(savedCart);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;
