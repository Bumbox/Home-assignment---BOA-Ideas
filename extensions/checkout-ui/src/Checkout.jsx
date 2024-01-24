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
	const [checkedStates, setCheckedStates] = useState({});
	const [isLoading, setIsLoading] = useState({ sav: false, del: false });

	const checkedList = (item) => {
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

	const performFetch = async (url, body, action) => {
		setIsLoading((prevState) => ({ ...prevState, [action]: true }));
		try {
			const token = await sessionToken.get();
			const response = await fetch(
				`https://feb-lake-earth-colon.trycloudflare.com/api/${url}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(body),
				}
			);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return await response.json();
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setIsLoading((prevState) => ({ ...prevState, [action]: false }));
		}
	};

	const handleSave = async () => {
		const data = await performFetch(
			'addCart',
			{
				checkoutToken: checkoutToken.current,
				productIds: checkedItems,
			},
			'sav'
		);
		console.log(data);
	};

	const deleteCart = async () => {
		setCheckedStates({});
		setCheckedItems([]);
		const data = await performFetch(
			'deleteCart',
			{
				checkoutToken: checkoutToken.current,
			},
			'del'
		);
		console.log(data);
	};

	return (
		<>
			<Banner title="Save your cart" status="info">
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
							loading={isLoading.sav}
						>
							Save
						</Button>
					</View>
					<View border="base" padding="none" blockAlignment="center">
						<Button
							onPress={deleteCart}
							kind="plain"
							loading={isLoading.del}
							border="none"
							appearance="subdued"
						>
							Clear saved cart
						</Button>
					</View>
				</InlineLayout>
			</Banner>
		</>
	);
}
