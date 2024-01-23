import React, { useState } from 'react';

import {
	Banner,
	Checkbox,
	Button,
	BlockStack,
	View,
	useApi,
	InlineLayout,
	reactExtension,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
	const { checkoutToken, sessionToken, lines } = useApi();
	const [checkedItems, setCheckedItems] = useState([]);
	const [deletion, setDeletion] = useState(false);
	const [checkedStates, setCheckedStates] = useState({});
	const [isLoadingSav, setIsLoadingSav] = useState(false);
	const [isLoadingDel, setIsLoadingDel] = useState(false);

	const checkedList = (item) => {
		setDeletion(true);
		setCheckedStates((prevStates) => ({
			...prevStates,
			[item]: !prevStates[item],
		}));
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
		setIsLoadingDel(true);
		setCheckedStates({});
		setCheckedItems([]);
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
				setIsLoadingDel(false);
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
		setIsLoadingSav(true);
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
				setIsLoadingSav(false);
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
			<Banner title="Save your cart" status="info" >
				<BlockStack spacing="none">
					{lines.current.map((line, index) => (
						<View key={index} border="none" padding={['base', 'none']}>
							<Checkbox
								id={`Checkbox-${index}`}
								name="checkbox"
								checked={checkedStates[line.merchandise.id] || false}
								onChange={() => checkedList(line.merchandise.id)}
							>
								{line.merchandise.title}
							</Checkbox>
						</View>
					))}
				</BlockStack>
				<InlineLayout columns={['15%', '30%']} padding={['tight', 'none', 'none', 'none']}>
					<View border="none" padding="none">
						<Button
							onPress={handleSave}
							disabled={checkedItems.length === 0}
							loading={isLoadingSav}
							
						>
							Save
						</Button>
					</View>
					<View border="base" padding="none" blockAlignment="center">
						<Button onPress={deleteCart} kind="plain" loading={isLoadingDel} border="none" appearance="subdued">
							Clear saved cart
						</Button>
					</View>
				</InlineLayout>
			</Banner>
		</>
	);
}
