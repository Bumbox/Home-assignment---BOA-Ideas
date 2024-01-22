/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from 'react';

import {
	Banner,
	Checkbox,
	Button,
	BlockStack,
	View,
	useApi,
	useTranslate,
	reactExtension,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
	const { checkoutToken, sessionToken, lines } = useApi();
	const [checkedItems, setCheckedItems] = useState({});

	const getInfo = () => {
		console.log(checkoutToken);
		const products = lines.current.map((item) => item.id);
		console.log(products);
	};

	const handleSave = async () => {
		const products = lines.current.map((item) => item.id);
		const token = await sessionToken.get();
		console.log('sessionToken.get()', token);
		fetch('https://adoption-ups-sir-jews.trycloudflare.com/api/example', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Указание типа контента
				Authorization: `Bearer ${token}`, // Пример заголовка авторизации
				// Другие заголовки можно добавить здесь
			},
			body: JSON.stringify({
				checkoutToken: checkoutToken.current,
				productIds: products,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json(); // Преобразование ответа в JSON
			})
			.then((data) => {
				console.log(data); // Обработка данных из ответа
			})
			.catch((error) => {
				console.error('Error:', error); // Обработка ошибок
			});
	};

	const translate = useTranslate();

	return (
		<>
			<Banner title="Save your cart">
				<BlockStack spacing="none">
					<View border="none" padding="tight">
						<Checkbox id="videographerSnowboard" name="checkbox">
							The Videographer Snowboard
						</Checkbox>
					</View>
					<View border="none" padding="tight">
						<Checkbox id="multiLocationSnowboard" name="checkbox">
							The Multi-location Snowboard
						</Checkbox>
					</View>
				</BlockStack>
				<Button onPress={handleSave}>Save</Button>
				<Button onPress={getInfo}>Get info</Button>
			</Banner>
		</>
	);
}
