import SuspendedList from '../src/suspendedList';
import {ConflictingRulesError} from '../src/errors';

describe('SuspendedList', () => {
  let list;

  beforeEach(() => {
    list = new SuspendedList();
  });

  describe('constructor()', () => {
    it('can create instances of SuspendedList (trivial test)', () => {
      expect(list instanceof SuspendedList).toBe(true);
    });
  });

  describe('length', () => {
    it('returns 0 for an empty suspended list', () => {
      expect(list.length).toBe(0);
    });

    it('returns the number of items in the list', () => {
      list.push('a');
      expect(list.length).toBe(1);
    });
  });

  describe('item()', () => {
    it('returns the item at the indicated index if it exists', () => {
      list.push('a');
      expect(list.item(0)).toEqual('a');
    });

    it('returns an undefined value if the indicated index is out of bounds', () => {
      expect(list.item(0)).toBe(undefined);
    });
  });

  describe('toArray()', () => {
    it('returns an array with the same items as the suspended list', () => {
      let a = {'key': 'value'};
      list.push(a);
      let array = list.toArray();
      expect(array instanceof Array);
      expect(array[0]).toBe(a)
    });

    it('returns a copy of the internal list at the time of the function call', () => {
      let arrayOne = list.toArray();
      list.push('a');
      let arrayTwo = list.toArray();
      expect(arrayOne.length).toBe(0);
      expect(arrayTwo.length).toBe(1);
    });

    it('returns an array that can be modified without affecting the suspended list', () => {
      let arrayOne = list.toArray();
      arrayOne.push('a')
      let arrayTwo = list.toArray();
      expect(arrayOne.length).toBe(1);
      expect(arrayTwo.length).toBe(0);
    });
  });

  describe('addRuleXBeforeY()', () => {
    describe('if the items associated with the rule are not in the list', () => {
      it('adds the rule, but doesn\'t do anything', () => {
        expect(() => list.addRuleXBeforeY('a', 'b')).not.toThrow();
      });
    });

    describe('if the items associated with the rule are added to the list after the rule', () => {
      it('rearranges the items so that the rule is respected', () => {
        list.addRuleXBeforeY('a', 'b');
        list.pushLeft('b');
        list.pushRight('a');
        expect(list.item(0)).toEqual('a');
        expect(list.item(1)).toEqual('b');
      });
    });

    describe('if the items associated with the rule are added to the list before the rule', () => {
      it('rearranges the items so that the rule is respected', () => {
        list.pushLeft('b');
        list.pushRight('a');
        list.addRuleXBeforeY('a', 'b');
        expect(list.item(0)).toEqual('a');
        expect(list.item(1)).toEqual('b');
      });
    });
  });

  describe('addRuleXAfterY()', () => {
    it('rearranges the items in the list so that the rule is respected', () => {
      list.pushLeft('b');
      list.pushRight('a');
      list.addRuleXAfterY('b', 'a');
      expect(list.item(0)).toEqual('a');
      expect(list.item(1)).toEqual('b');
    });
  });

  describe('removeRuleXBeforeY()', () => {
    it('stops any rearrangement of the items after the rule has been removed', () => {
      list.addRuleXBeforeY('a', 'b');
      list.removeRuleXBeforeY('a', 'b');
      list.pushLeft('b');
      list.pushRight('a');
      expect(list.item(0)).toEqual('b');
      expect(list.item(1)).toEqual('a');
    });
  });

  describe('removeRuleXAfterY()', () => {
    it('stops any rearrangement of the items after the rule has been removed', () => {
      list.addRuleXAfterY('b', 'a');
      list.removeRuleXAfterY('b', 'a');
      list.pushLeft('b');
      list.pushRight('a');
      expect(list.item(0)).toEqual('b');
      expect(list.item(1)).toEqual('a');
    });
  });

  describe('removeRulesForItem()', () => {
    it('prevents the suspended list from rearranging items according to the rule', () => {
      list.addRuleXBeforeY('a', 'b');
      list.addRuleXBeforeY('a', 'c');
      list.removeRulesForItem('a');
      list.pushRight('c');
      list.pushRight('b');
      list.pushRight('a');
      expect(list.item(0)).toEqual('c');
      expect(list.item(1)).toEqual('b');
      expect(list.item(2)).toEqual('a');
    });
  });

  describe('for list [a, b, c, d, e]', () => {
    beforeEach(() => {
      list.pushRight('a');
      list.pushRight('b');
      list.pushRight('c');
      list.pushRight('d');
      list.pushRight('e');
    });

    describe('if b < c and c < d, and a new rule is introduced e < b', () => {
      beforeEach(() => {
        list.addRuleXBeforeY('b', 'c');
        list.addRuleXBeforeY('c', 'd');
        list.addRuleXBeforeY('e', 'b');
      });

      it('moves b and all its right bounds to the right of b\'s new left bound \'e\'', () => {
        expect(list.toArray()).toEqual(['a', 'e', 'b', 'c', 'd']);
      });
    });

    describe('if b < c and c < d, and a new rule is introduced d < a', () => {
      beforeEach(() => {
        list.addRuleXBeforeY('b', 'c');
        list.addRuleXBeforeY('c', 'd');
        list.addRuleXBeforeY('d', 'a');
      });

      it('moves d and all its left bounds to the left of d\'s new right bound \'a\'', () => {
        expect(list.toArray()).toEqual(['b', 'c', 'd', 'a', 'e']);
      });
    });

    describe('if a < b, b < c, and a new rule is introduced c < a', () => {
      beforeEach(() => {
        list.addRuleXBeforeY('a', 'b');
        list.addRuleXBeforeY('b', 'c');
      });

      it('throws a ConflictingRulesError', () => {
        expect(() => {
          list.addRuleXBeforeY('c', 'a');
        }).toThrow(ConflictingRulesError);
      });
    });

    describe('if a < c, c < d, and a new rule is introduced e < a', () => {
      beforeEach(() => {
        list.addRuleXBeforeY('a', 'c');
        list.addRuleXBeforeY('c', 'd');
        list.addRuleXBeforeY('e', 'a');
      });

      it('moves a and all its right bounds to the right of e', () => {
        expect(list.toArray()).toEqual(['b', 'e', 'a', 'c', 'd']);
      });
    });
  });
});
