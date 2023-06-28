import { config } from 'dotenv';
config();

export const {
	AZURE_STORAGE_ACCOUNT_NAME = '',
	AZURE_STORAGE_ACCOUNT_KEY = '',
} = process.env;
