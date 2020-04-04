import {ConflictingRulesError} from '../src/errors';

test('ConflictingRulesError trivial test', () => {
  expect(() => {throw new ConflictingRulesError('some message')})
    .toThrow(ConflictingRulesError);
});
