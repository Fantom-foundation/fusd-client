export const WFTM_ABI = [
	{
		constant: true,
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'deposit',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		payable: true,
		stateMutability: 'payable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
		name: 'withdraw',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

export default {
	SALES_CONTRACT_ABI,
	BUNDLE_SALES_CONTRACT_ABI,
	AUCTION_CONTRACT_ABI,
	NFT_CONTRACT_ABI,
	WFTM_ABI,
};