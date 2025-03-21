import { BountyCollection } from '../../../src/models/Bounty';
import { NextApiQuery } from '../../../src/types/Queries';
import * as service from '../../../src/services/bounty.service';
import { FilterQuery } from 'mongoose';
import PAID_STATUS from '@app/constants/paidStatus';

describe('Testing the bounty service', () => {

	describe('Getting filters', () => {
		const query: NextApiQuery = {
			status: 'status',
			search: 'search',
			lte: '1',
			gte: '1',
			customerId: 'customerId',
			createdBy: '1111',
			claimedBy: '2222',
		};

		it('Extracts status, search, lte, gte, customerId, createdBy, claimedBy from the query string', () => {
			const filters = service.getFilters(query);
			const { lte, gte, ...rest } = filters;
			expect(Object.keys(filters))
				.toEqual([...Object.keys(rest), 'lte', 'gte']);

			expect(typeof Object.values(rest)[0]).toBe('object');
			expect(lte).toEqual(1);
			expect(gte).toEqual(1);
		});

		it('Handles missing values okay', () => {
			const { lte, gte, ...notCustomerId } = query;
			const filters = service.getFilters(notCustomerId);
			expect(Object.keys(filters)).toEqual(Object.keys(notCustomerId));
			expect(lte).toEqual(gte);
		});

		it('Gracefully handles string arrays', () => {
			const queryArray: NextApiQuery = {
				status: ['Open', 'Draft'],
				search: 'search',
			};
			const filters = service.getFilters(queryArray);
			expect(filters).toEqual({ search: 'search' });
		});

		it('Gracefully exists when lte cannot be type coerced', () => {
			const notNumberQuery: NextApiQuery = {
				$lte: 'cannot coerce',
			};
			const filters = service.getFilters(notNumberQuery);
			expect(filters).toEqual({});
		});

		it('defaults to greater than 0', () => {
			const querygt0 = service.filterLessGreater({
				by: 'reward.amount',
				query: {},
			});
			expect(querygt0['reward.amount']).toEqual({ $gte: 0 });
		});

		it('otherwise applied $lte and $gte', () => {
			const queryltgt = service.filterLessGreater({
				by: 'reward.amount',
				query: {},
				lte: 100,
				gte: 100,
			});
			expect(queryltgt['reward.amount']).toEqual({ $gte: 100, $lte: 100 });
		});

	});

	describe('Testing sorts', () => {
		const sortQueries: NextApiQuery[] = ['true', '1', 'asc']
			.map(item => ({
				asc: item,
				sortBy: 'reward',
			}));

		it('Sorts ascending truthy strings', () => {
			const expected: service.BountyQuery = {
				$sort: { 'reward.amount': 1 },
			};
			sortQueries.forEach(query => {
				expect(service.getSort(query)).toEqual(expected);
			});
		});

		it('otherwise sorts descending', () => {
			const query = {
				asc: '0',
				sortBy: 'reward',
			};

			expect(service.getSort(query)['$sort']['reward.amount']).toEqual(-1);
		});

		it('Sorted by created Date if passed', () => {
			const query = {
				sortBy: 'createdAt',
				asc: 'false',
			};
			expect(service.getSort(query)['$sort']['createdAt']).toEqual(-1);
		});
	});

	describe('Search and status filters', () => {
		it('Sets status as array of values when nothing passed', () => {
			[undefined, []].forEach(entry => {
				expect(
					service.filterStatus({}, entry).status.$in
				)
					.toBeInstanceOf(Array);
			});
		});

		it('Else it returns the status', () => {
			const status = ['This could be anything'];
			expect(service.filterStatus({}, status).status.$in).toEqual(status);
		});

		it('returns the text search', () => {
			const search = 'This could be anything';
			expect(
				service.filterSearch({}, search).$text
			).toEqual({ $search: search });
		});
	});

	describe('The rest of the bounty service', () => {
		it('Returns a blank query if an empty object is passed', () => {
			const expectedEmpty = {
				$search: null,
				'reward.amount': undefined,
				status: '',
			};
			expect(service.handleEmpty(expectedEmpty)).toEqual({});
		});

		it('Returns the filters query object as expected', async () => {
			const query: NextApiQuery = {
				status: 'Open',
				search: 'Test',
				customerId: 'testId',
				lte: '100',
				asc: 'true',
			};
			const expected: FilterQuery<BountyCollection> = {
				$match: {
					status: {
						$in: ['Open'],
					},
					customerId: 'testId',
					$text: {
						$search: 'Test',
					},
					'reward.amount': {
						$lte: 100,
						$gte: 0,
					},
					$or: [
						{ paidStatus: { $in: [PAID_STATUS.PAID, PAID_STATUS.UNPAID] } },
						{ paidStatus: { $exists: false } },
					],
				},
			};
			const actual = service.getFilterQuery(query);
			expect(actual).toEqual(expected);
		});
	});

	it('Returns the paid status filters as expected', async () => {
		const query: NextApiQuery = {
			status: 'Open',
			search: 'Test',
			customerId: 'testId',
			lte: '100',
			asc: 'true',
			paidStatus: PAID_STATUS.UNPAID,
		};
		const expected: FilterQuery<BountyCollection> =
		{
			$match: {
				status: {
					$in: ['Open'],
				},
				customerId: 'testId',
				$text: {
					$search: 'Test',
				},
				'reward.amount': {
					$lte: 100,
					$gte: 0,
				},
				$or: [
					{ paidStatus: { $in: [PAID_STATUS.UNPAID] } },
					{ paidStatus: { $exists: false } },
				],
			},
		};
		let actual = service.getFilterQuery(query);
		expect(actual).toEqual(expected);

		query.paidStatus = PAID_STATUS.PAID;
		expected.$match.$or = [{ paidStatus: { $in: [PAID_STATUS.PAID] } }];

		actual = service.getFilterQuery(query);
		expect(actual).toEqual(expected);

	});


	describe('Testing pagination logic', () => {
		it('Creates a pagination object as expected', () => {
			const query = {
				next: '123',
				limit: '10',
			};
			const expected = { next: query.next, limit: Number(query.limit), previous: undefined };
			const actual = service.getPagination(query);
			expect(actual).toEqual(expected);
		});
		it('Handles the non number case', () => {
			const query = {
				next: '123',
				limit: 'fkekafk',
			};
			const expected = { next: query.next, limit: 1000, previous: undefined };
			const actual = service.getPagination(query);
			expect(actual).toEqual(expected);
		});
	});
});
