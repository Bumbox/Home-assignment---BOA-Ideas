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
	return prisma.savedCart.delete({
		where: { checkoutToken },
	});
};
