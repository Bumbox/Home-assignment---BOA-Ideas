import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/example', async (req, res) => {
	const { checkoutToken, productIds } = req.body;

	try {
		// Преобразование productIds в строку JSON
		const productsJson = JSON.stringify(productIds);

		const savedCart = await prisma.savedCart.upsert({
			where: { checkoutToken: checkoutToken },
			update: { products: productsJson },
			create: {
				checkoutToken: checkoutToken,
				products: productsJson,
			},
		});

		res.json(savedCart);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;
