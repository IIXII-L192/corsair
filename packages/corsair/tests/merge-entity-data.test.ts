import {
	mergeEntityData,
	mergeEntityDataFromUnknown,
} from '../db/merge-entity-data';

describe('mergeEntityData', () => {
	it('preserves existing fields omitted from incoming partial updates', () => {
		const existing = {
			id: 1,
			title: 'Fix auth',
			user: { login: 'alice', id: 42 },
			labels: [{ name: 'bug', color: 'ff0000' }],
		};
		const incoming = { id: 1, title: 'Fix auth (updated)' };

		expect(mergeEntityData(existing, incoming)).toEqual({
			id: 1,
			title: 'Fix auth (updated)',
			user: { login: 'alice', id: 42 },
			labels: [{ name: 'bug', color: 'ff0000' }],
		});
	});

	it('overrides existing fields when incoming provides them', () => {
		const existing = {
			id: 1,
			state: 'open',
			user: { login: 'alice', id: 42 },
		};
		const incoming = { id: 1, state: 'closed' };

		expect(mergeEntityData(existing, incoming)).toEqual({
			id: 1,
			state: 'closed',
			user: { login: 'alice', id: 42 },
		});
	});

	it('ignores undefined incoming values so fields are not cleared', () => {
		const existing = { id: 1, user: { login: 'alice' } };
		const incoming = { id: 1, user: undefined, body: 'new comment' };

		expect(mergeEntityData(existing, incoming)).toEqual({
			id: 1,
			user: { login: 'alice' },
			body: 'new comment',
		});
	});

	it('allows explicit null to clear a field', () => {
		const existing = { id: 1, assignee: { login: 'bob' } };
		const incoming = { id: 1, assignee: null };

		expect(mergeEntityData(existing, incoming)).toEqual({
			id: 1,
			assignee: null,
		});
	});

	it('replaces arrays when incoming includes them', () => {
		const existing = {
			id: 1,
			labels: [{ name: 'bug', color: 'ff0000' }],
		};
		const incoming = {
			id: 1,
			labels: [{ name: 'feature', color: '00ff00' }],
		};

		expect(mergeEntityData(existing, incoming)).toEqual({
			id: 1,
			labels: [{ name: 'feature', color: '00ff00' }],
		});
	});

	it('returns incoming only when existing is not an object', () => {
		expect(mergeEntityDataFromUnknown(null, { id: 1, title: 'new' })).toEqual({
			id: 1,
			title: 'new',
		});
	});
});
