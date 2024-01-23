import * as Model from '../models/models.js';

export const handleCartPost = async (req, res) => {
	try {
		const { checkoutToken, productIds } = req.body;
		const productsJson = JSON.stringify(productIds);
		const savedCart = await Model.createOrUpdateCart(checkoutToken, productsJson);
		res.json(savedCart);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const handleDeleteCheckout = async (req, res) => {
	try {
		const { checkoutToken } = req.body;
		await Model.deleteCartByToken(checkoutToken);
		res.status(200).json({ message: 'Cart successfully deleted or not found' });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('Error deleting cart');
	}
};
