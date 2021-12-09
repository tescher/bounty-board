import mongoose from 'mongoose';
import { InferInterface } from '../types/Yup';
import {
	string,
	number,
	object,
	array,
	mixed,
} from 'yup';

export const DiscordUser = object().shape({
	discordHandle: string().optional(),
	discordId: string().optional(),
});

/**
 * Nested objects in yup behave strangely. We require a separate 
 * object to conditionally require the fields inside of it 
 */
export const RequiredDiscordUser = object().shape({
	discordHandle: string().when('$method', (method, schema) => requiredForPost({ method, schema })),
	discordId: string().when('$method', (method, schema) => requiredForPost({ method, schema })),
});

export const Reward = object({
	currency: string().min(0).when('$method', (method, schema) => requiredForPost({ method, schema })),
	amount: number().min(0).when('$method', (method, schema) => requiredForPost({ method, schema })),
	scale: number().min(0).optional().default(0),
	amountWithoutScale: number().min(0).optional(),
});

export const Status = mixed().oneOf([
	'Draft',
	'Open',
	'In-Progress',
	'In-Review',
	'Completed',
	'Deleted',
]);

export const StatusHistory = object({
	status: Status,
	modifiedAt: string(),
});

const requiredForPost = ({ method, schema, isObject }: { method: 'POST' | 'PUT', schema: any, isObject?: boolean }) => {
	if (method === 'POST') {
		return schema.defined()
	};
	if (isObject) {
		// prevent overwriting object with null
		return schema.optional().default(undefined)
	} else {
		return schema.optional()
	};
};

/**
 * Global typing for Bounties with validation checks
 * */
export const BountySchema = object().shape({
	_id: string().when('$method', (method, schema) => requiredForPost({ method, schema })),
	title: string().when('$method', (method, schema) => requiredForPost({ method, schema })),
	description: string().when('$method', (method, schema) => requiredForPost({ method, schema })),
	criteria: string().when('$method', (method, schema) => requiredForPost({ method, schema })),
	customer_id: string().when('$method', (method, schema) => requiredForPost({ method, schema })),
	status: Status.when('$method', (method, schema) => requiredForPost({ method, schema })),
	dueAt: string().when('$method', (method, schema) => requiredForPost({ method, schema })),
	reward: Reward.when('$method', (method, schema) => requiredForPost({ method, schema, isObject: true })),
	
	statusHistory: array(StatusHistory).optional(),
		
	editKey: string().optional(),
	discordMessageId: string().optional(),
	submissionNotes: string().optional(),
	submissionUrl: string().optional(),
	season: number().optional(),

	createdAt: string().when('$method', (method, schema) => requiredForPost({ method, schema })),
	claimedAt: string().optional(),
	submittedAt: string().optional(),
	reviewedAt: string().optional(),
	
	createdBy: RequiredDiscordUser.when('$method', (method, schema) => requiredForPost({ method, schema, isObject: true })),
	claimedBy: DiscordUser.when('$method', (method, schema) => requiredForPost({ method, schema, isObject: true })),
	submittedBy: DiscordUser.when('$method', (method, schema) => requiredForPost({ method, schema, isObject: true })),
	reviewedBy: DiscordUser.when('$method', (method, schema) => requiredForPost({ method, schema, isObject: true })),
});

export type BountyCollection = InferInterface<typeof BountySchema>;

/* BountyBoardSchema will correspond to a collection in your MongoDB database. */
const BountyBoardSchema = new mongoose.Schema<BountyCollection>({
	title: {
		/* The name of this Bounty */

		type: String,
	},
	customer_id: {
		/* the DAO under which this bounty belongs */

		type: String,
	},
	editKey: {
		/* Prevents editing by unauthorized users */
		type: String,
	},
	season: {
		/* The season of this Bounty */

		type: Number,
	},
	description: {
		/* A short description of the Bounty */

		type: String,
	},
	criteria: {
		/* Acceptance criteria of deliverables for the Bounty to be marked complete. */

		type: String,
	},
	reward: {
		/* Bounty reward */

		currency: String,
		amount: Number,
		scale: Number,
		amountWithoutScale: Number,
		type: Object,
	},
	createdBy: {
		/* Discord identity of bounty creator */

		discordHandle: String,
		discordId: Number,
		type: Object,
	},
	createdAt: {
		/* Date of Bounty creation */

		type: String,
	},
	dueAt: {
		/* Bounty Expiration */

		type: String,
	},
	discordMessageId: {
		type: String,
	},
	status: {
		/* Bounty Status */
		/* "Draft", "Open", "In-Progress", "In-Review", "Completed", "Deleted" */
		type: String,
	},
	statusHistory: {
		type: Array,
	},
	claimedBy: {
		discordHandle: String,
		discordId: Number,
		type: Object,
	},
	claimedAt: {
		type: String,
	},
	submissionNotes: {
		type: String,
	},
	submissionUrl: {
		type: String,
	},
	submittedAt: {
		type: String,
	},
	submittedBy: {
		discordHandle: String,
		discordId: Number,
		type: Object,
	},
	reviewedAt: {
		type: String,
	},
	reviewedBy: {
		discordHandle: String,
		discordId: Number,
		type: Object,
	},
});

export default mongoose.models.Bounty as mongoose.Model<BountyCollection> ||
  mongoose.model<BountyCollection>('Bounty', BountyBoardSchema);
