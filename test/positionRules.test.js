import PositionRules from '../src/positionRules';

describe('PositionRules', () => {
  let rules;

  beforeEach(() => {
    rules = new PositionRules();
  });

  describe('copy()', () => {
    it('returns a copy that has the same existing rules as the original object', () => {
      rules.addRule('a', 'b');
      let copy = rules.copy();
      expect(copy.getRightBoundsForItem('a').has('b')).toBe(true);
    });

    it('doesn\'t add new rules to the copy after the copy has been completed', () => {
      rules.addRule('a', 'b');
      let copy = rules.copy();
      rules.addRule('b', 'c')
      expect(copy.getRightBoundsForItem('b').has('c')).toBe(false);
    });
  });

  describe('addRule()', () => {
    beforeEach(() => {
      rules.addRule('a', 'b');
    });

    it('has a right bound for the lhs item', () => {
      let rightBounds = rules.getRightBoundsForItem('a');
      expect(rightBounds.has('b')).toBe(true);
    });

    it('has a left bound for the rhs item', () => {
      let leftBounds = rules.getLeftBoundsForItem('b');
      expect(leftBounds.has('a')).toBe(true);
    });

    it('accumulates the bounds for an lhs item with multiple associated rules', () => {
      let rightBounds = rules.getRightBoundsForItem('a');
      rules.addRule('a', 'c');
      expect(rightBounds.has('b')).toBe(true);
      expect(rightBounds.has('c')).toBe(true);
    });

    it('accumulates the bounds for an rhs item with multiple associated rules', () => {
      rules.addRule('a', 'c');
      let bLeftBounds = rules.getLeftBoundsForItem('b');
      let cLeftBounds = rules.getLeftBoundsForItem('c');
      expect(bLeftBounds.has('a')).toBe(true);
      expect(cLeftBounds.has('a')).toBe(true);
    });

  });

  describe('removeRule()', () => {
    describe('if the rule being removed didn\'t exist', () => {
      it('does nothing', () => {
        expect(() => {
          rules.removeRule('a', 'b');
        }).not.toThrow();
      });
    });

    it('removes the left bound for the associated rule', () => {
      rules.addRule('a', 'b');
      rules.removeRule('a', 'b');
      let leftBounds = rules.getLeftBoundsForItem('b');
      expect(leftBounds.has('a')).toBe(false);
    });

    it('removes the right bound for the associated rule', () => {
      rules.addRule('a', 'b');
      rules.removeRule('a', 'b');
      let rightBounds = rules.getRightBoundsForItem('a');
      expect(rightBounds.has('b')).toBe(false);
    });

    it('does not remove any additional rules for the associated items', () => {
      rules.addRule('a', 'b');
      rules.addRule('a', 'c');
      rules.addRule('b', 'c');
      rules.removeRule('a', 'c');
      let aRightBounds = rules.getRightBoundsForItem('a');
      let cLeftBounds = rules.getLeftBoundsForItem('c');
      expect(aRightBounds.has('b')).toBe(true);
      expect(cLeftBounds.has('b')).toBe(true);
    });
  });

  describe('removeRulesForItem()', () => {
    describe('if the target item doesn\'t have any associated rules', () => {
      it('does nothing', () => {
        expect(() => {
          rules.removeRulesForItem('a');
        }).not.toThrow();
      });
    });

    it('removes all right bounds for the target item', () => {
      rules.addRule('a', 'b');
      rules.addRule('a', 'c');
      rules.removeRulesForItem('a');
      let rightBounds = rules.getRightBoundsForItem('a');
      expect(rightBounds.size).toBe(0);
    });

    it('removes all left bounds for the target item', () => {
      rules.addRule('a', 'c');
      rules.addRule('b', 'c');
      rules.removeRulesForItem('c');
      let leftBounds = rules.getLeftBoundsForItem('c');
      expect(leftBounds.size).toBe(0);
    });

    it('removes the target item from other items\' right bounds', () => {
      rules.addRule('a', 'b');
      rules.addRule('a', 'c');
      rules.removeRulesForItem('c');
      let rightBounds = rules.getRightBoundsForItem('a');
      expect(rightBounds.has('c')).toBe(false);
    });

    it('removes the target item from other items\' left bounds', () => {
      rules.addRule('a', 'c');
      rules.addRule('b', 'c');
      rules.removeRulesForItem('a');
      let leftBounds = rules.getLeftBoundsForItem('c');
      expect(leftBounds.has('a')).toBe(false);
    });
  });

  describe('getLeftBoundsForItem()', () => {
    describe('when the item has no associated rules', () => {
      it('returns an empty set', () => {
        let bounds = rules.getLeftBoundsForItem('a');
        expect(bounds instanceof Set).toBe(true);
        expect(bounds.size).toBe(0);
      });
    });
  });

  describe('getRightBoundsForItem()', () => {
    describe('when the item has no associated rules', () => {
      it('returns an empty set', () => {
        let bounds = rules.getRightBoundsForItem('a');
        expect(bounds instanceof Set).toBe(true);
        expect(bounds.size).toBe(0);
      });
    });
  });

});
