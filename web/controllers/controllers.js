import * as ExampleModel from '../models/models.js';

export const handleExamplePost = async (req, res) => {
	try {
		const { checkoutToken, productIds } = req.body;
		const productsJson = JSON.stringify(productIds);
		const savedCart = await ExampleModel.createOrUpdateCart(checkoutToken, productsJson);
		res.json(savedCart);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const handleDeleteCheckout = async (req, res) => {
	try {
		const { checkoutToken } = req.params;
		await ExampleModel.deleteCartByToken(checkoutToken);
		res.status(200).json({ message: 'Cart deleted successfully' });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('Error deleting cart');
	}
};
