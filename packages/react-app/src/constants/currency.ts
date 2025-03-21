import { ObjectKeys } from 'react-hook-form/dist/types/path/common';

export const ALLOWED_CURRENCY_CONTRACTS = {
	'BANK': '0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198',
	'ETH': 'ETH',
	'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
	'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
	'BTC': '',
};

export const ALLOWED_CURRENCIES = Object.keys(ALLOWED_CURRENCY_CONTRACTS);
export type ALLOWED_CURRENCIES_TYPE = ObjectKeys<typeof ALLOWED_CURRENCY_CONTRACTS>;


export default ALLOWED_CURRENCIES;
