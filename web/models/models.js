import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createOrUpdateCart = async (checkoutToken, productsJson) => {
	return prisma.savedCart.upsert({
		where: { checkoutToken },
		update: { products: productsJson },
		create: { checkoutToken, products: productsJson },
	});
};

export const deleteCartByToken = async (checkoutToken) => {
	const cart = await prisma.savedCart.findUnique({
		where: { checkoutToken },
	});

	if (cart) {
		return prisma.savedCart.delete({
			where: { checkoutToken },
		});
	}

	return { message: 'Cart successfully deleted or not found' };
};
