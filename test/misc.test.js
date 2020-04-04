import {
  identity,
  createLeftRightMovementLimit,
  calculateLeftRightMovementLimits,
} from '../src/misc';

import PositionRules from '../src/positionRules';

describe('identity()', () => {
  it('returns the input you provide it', () => {
    let input = 'abc';
    expect(identity(input)).toBe(input);
  });
});

describe('createLeftRightMovementLimit()', () => {
  it('returns an object with the left limit you provide it', () => {
    let leftValue = 2;
    let limit = createLeftRightMovementLimit(leftValue);
    expect(limit.left).toBe(leftValue)
  });

  it('returns an object with the right limit you provide it', () => {
    let leftValue = 2;
    let rightValue = 7;
    let limit = createLeftRightMovementLimit(leftValue, rightValue);
    expect(limit.right).toBe(rightValue)
  });

  it('defaults the left value to null', () => {
    let limit = createLeftRightMovementLimit();
    expect(limit.left).toBeNull()
  });

  it('defaults the right value to null', () => {
    let limit = createLeftRightMovementLimit();
    expect(limit.right).toBeNull()
  });
});

describe('calculateLeftRightMovementLimits()', () => {
  let rules;
  let isUnbounded;

  beforeAll(() => {
    isUnbounded = (limit) => (limit.left === null && limit.right === null);
  });

  beforeEach(() => {
    rules = new PositionRules();
  });

  describe('if given an empty list', () => {
    it('returns an empty list of limits', () => {
      rules.addRule('a', 'b');
      let limits = calculateLeftRightMovementLimits([], rules);
      expect(limits).toEqual([]);
    });
  });

  describe('if given an empty rule set', () => {
    it('returns open-ended (null) left/right limits for all items', () => {
      let list = ['a', 'b', 'c'];
      let limits = calculateLeftRightMovementLimits(list, rules);
      let limitsAreUnbounded = limits.map(isUnbounded);
      expect(limitsAreUnbounded).not.toContain(false);
    });
  });

  describe('if an element in the list is only bounded by another element that is not in the list', () => {
    it('returns open-ended (null) left/right limits for that item', () => {
      let list = ['a', 'b', 'c'];
      rules.addRule('a', 'z');
      let limits = calculateLeftRightMovementLimits(list, rules);
      expect(isUnbounded(limits[0])).toBe(true);
    });
  });

  describe('if an element in the list is bounded by one other element in the list', () => {
    it('returns a limit representing the steps that item can move before clashing with the other item', () => {
      let list = ['a', 'b', 'c', 'd'];
      rules.addRule('b', 'd');
      let limits = calculateLeftRightMovementLimits(list, rules);
      expect(limits[1].right).toBe(1);
      expect(limits[1].left).toBe(null);
    });
  });

  describe('if an element in the list is bounded by two other elements in the list', () => {
    it('returns a limit representing the steps that item can move before clashing with the closest of the two bounding items', () => {
      let list = ['a', 'b', 'c', 'd'];
      rules.addRule('a', 'c');
      rules.addRule('a', 'd');
      let limits = calculateLeftRightMovementLimits(list, rules);
      expect(limits[0].right).toBe(1);
      expect(limits[0].left).toBe(null);
      expect(limits[3].left).toBe(2);
      expect(limits[3].right).toBe(null);
    });
  });
});
