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
	const [deletion, setDeletion] = useState(false);

	const checkedList = (item) => {
		setDeletion(true);
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
		setDeletion(false);
		const token = await sessionToken.get();
		console.log('sessionToken.get()', token);
		fetch('https://bras-establish-firewall-departments.trycloudflare.com/api/deleteCart', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				checkoutToken: checkoutToken.current,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const handleSave = async () => {
		const token = await sessionToken.get();
		console.log('sessionToken.get()', token);
		fetch('https://bras-establish-firewall-departments.trycloudflare.com/api/addCart', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
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
				return response.json();
			})
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				console.error('Error:', error);
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
					Saves
				</Button>
				<Button onPress={deleteCart} disabled={checkedItems.length !== 0 || !deletion}>
					Clear saved cart
				</Button>
			</Banner>
		</>
	);
}
