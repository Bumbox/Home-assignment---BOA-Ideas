/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from 'react';

import {
	Banner,
	Checkbox,
	Button,
	BlockStack,
	View,
	useApi,
	reactExtension,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
	const { checkoutToken, sessionToken, lines } = useApi();
	const [checkedItems, setCheckedItems] = useState([]);
	const [deletation, setDeletation] = useState(false);

	const checkedList = (item) => {
		setDeletation(true);
		setCheckedItems((prevItems) => {
			let updatedItems;

			if (prevItems.includes(item)) {
				updatedItems = prevItems.filter((currentItem) => currentItem !== item);
			} else {
				updatedItems = [...prevItems, item];
			}
			return [...new Set(updatedItems)];
		});
	};

	const deleteCart = async () => {
		setDeletation(false);
		const token = await sessionToken.get();
		console.log('sessionToken.get()', token);
		fetch(
			`https://newest-nowhere-calculate-extremely.trycloudflare.com/api/delete/${checkoutToken.current}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json', // Указание типа контента
					Authorization: `Bearer ${token}`, // Пример заголовка авторизации
					// Другие заголовки можно добавить здесь
				},
			}
		)
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

	const handleSave = async () => {
		const token = await sessionToken.get();
		console.log('sessionToken.get()', token);
		fetch('https://newest-nowhere-calculate-extremely.trycloudflare.com/api/example', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Указание типа контента
				Authorization: `Bearer ${token}`, // Пример заголовка авторизации
				// Другие заголовки можно добавить здесь
			},
			body: JSON.stringify({
				checkoutToken: checkoutToken.current,
				productIds: checkedItems,
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

	return (
		<>
			<Banner title="Save your cart">
				<BlockStack spacing="none">
					{lines.current.map((line, index) => (
						<View key={index} border="none" padding="tight">
							<Checkbox
								id={`Checkbox-${index}`}
								name="checkbox"
								onChange={() => checkedList(line.merchandise.id)}
							>
								{line.merchandise.title}
							</Checkbox>
						</View>
					))}
				</BlockStack>
				<Button onPress={handleSave} disabled={checkedItems.length === 0}>
					Save
				</Button>
				<Button onPress={deleteCart} disabled={checkedItems.length !== 0 || !deletation}>
					Delete saved
				</Button>
			</Banner>
		</>
	);
}
