import {calculateLeftRightMovementLimits, identity} from './misc';
import {ConflictingRulesError} from './errors';
import PositionRules from './positionRules';

export default class SuspendedList {
  constructor(serializer = identity) {
    this._serializer = serializer;
    this._list = [];
    this._rules = new PositionRules(this._serializer);
  }

  // ========================================
  // Essential Access Methods
  // ========================================

  get length() {
    return this._list.length;
  }

  /**
   * @param {Integer} index - The index of the list item to retrieve.
   * @returns {Any} the item at the provided index.
   */
  item(index) {
    return this._list[index];
  }

  /**
   * @returns {Array} a copy of the inner list (not a SuspendedList). Since the
   * returned value is a copy modifying it won't affect the SuspendedList.
   */
  toArray() {
    return this._list.slice();
  }

  // ========================================
  // Specialized Suspended List Methods
  // ========================================

  addRuleXBeforeY(x, y) {
    this._applyRuleXBeforeY(x, y);
    this._rules.addRule(x, y);
  }

  addRuleXAfterY(x, y) {
    this.addRuleXBeforeY(y, x);
  }

  removeRuleXBeforeY(x, y) {
    this._rules.removeRule(x, y);
  }

  removeRuleXAfterY(x, y) {
    this._rules.removeRule(y, x);
  }

  removeRulesForItem(item) {
    this._rules.removeRulesForItem(item);
  }

  // ========================================
  // Common Collection Methods
  // ========================================

  copy() {
    let listCopy = new SuspendedList(thjs._serializer);
    listCopy._list = this._list.slice();
    listCopy._rules = this._rules.copy();
    return listCopy;
  }

  push(item) {
    this.pushRight(item);
  }

  unshift(item) {
    this.pushLeft(item);
  }

  pushLeft(item) {
    this._list.unshift(item);
    this._applyRulesForItem(item);
  }

  pushRight(item) {
    this._list.push(item);
    this._applyRulesForItem(item);
  }

  insert(item, index) {
    this._list.splice(index, 0, item);
    this._applyRulesForItem(item);
  }

  pop() {
    return this.popRight();
  }

  shift() {
    return this.popLeft();
  }

  popLeft() {
    return this._list.shift();
  }

  popRight() {
    return this._list.pop();
  }

  remove(item) {
    let index = this._list.indexOf(item);
    if (index !== -1) {
      this._list.splice(index, 1);
    }
  }

  removeAtIndex(index) {
    this._list.splice(index, 1);
  }

  find(callback, thisArg = this._list) {
    return this._list.find(callback, thisArg);
  }

  findIndex(callback, thisArg = this._list) {
    return this._list.findIndex(callback);
  }

  includes(valueToFind, fromIndex = undefined) {
    return this._list.inludes(valueToFind, fromIndex);
  }

  indexOf(searchElement, fromIndex = undefined) {
    return this._list.indexOf(searchElement, fromIndex);
  }

  lastIndexOf(searchElement, fromIndex = undefined) {
    return this._list.lastIndexOf(searchElement, fromIndex);
  }

  forEach(callback, thisArg = this._list) {
    this._list.forEach(callback, thisArg);
  }

  map(callback, thisArg = this._list) {
    this._list.map(callback, thisArg);
  }

  filter(callback, thisArg = this._list) {
    this._list.filter(callback, thisArg);
  }

  reduce(callback, initialValue = undefined) {
    if ( initialValue === undefined ) {
      if ( this._list.length === 0 ) {
        throw new TypeError(`Called reduce() on empty list without initial value.`);
      } else {
        initialValue = this._list[0];
      }
    }

    this._list.reduce(callback, initialValue);
  }

  reduceRight(callback, initialValue = undefined) {
    if ( initialValue === undefined ) {
      if ( this._list.length === 0 ) {
        throw new TypeError(`Called reduceRight() on empty list without initial value.`);
      } else {
        initialValue = this._list[0];
      }
    }

    this._list.reduceRight(callback, initialValue);
  }

  // ========================================
  // Internal Helper Methods
  // ========================================

  /*
   * @param xIndex {Integer} - the index of element x in the list.
   * @param yIndex {Integer} - the index of element y in the list.
   * @param limits {List<LeftRightMovementLimit>} - the movement limits for the items
   *   in the list.
   */
  _canMoveXAfterY(xIndex, yIndex, limits = null) {
    if (!limits) {
      limits = calculateLeftRightMovementLimits(this._list, this._rules);
    }

    let xRightLimit = limits[xIndex].right;
    let distanceToY = yIndex - xIndex;

    if (xRightLimit === null) {
      return true;
    } else if (xRightLimit >= distanceToY) {
      return true;
    }

    return false;
  }

  /**
   * Extracts the rules that concern the item, and applies each of them.
   * The item would be moved around to satisfy all rules.
   *
   * @param  {Any} item The item in the list unto whom we shall apply the rules.
   */
  _applyRulesForItem(item) {
    let rightBounds = this._rules.getRightBoundsForItem(item);
    rightBounds.forEach(rightBound => {
      this._applyRuleXBeforeY(item, rightBound);
    });
  }

  _applyRuleXBeforeY(x, y) {
    let xIndex = this._list.lastIndexOf(x);
    let yIndex = this._list.indexOf(y);

    if ( xIndex === -1 || yIndex === -1 ) {
      return;
    }

    // This is a while loop because the suspended list might have multiple
    // instances of x and y (e.g. ['a', y, 'b', y, x, 'c', x, 'd']) and we want
    // to apply the rule for all instances of x and y.
    while (xIndex > yIndex) {
      this._moveStackToRightOfTarget([yIndex], xIndex);
      xIndex = this._list.lastIndexOf(x);
      yIndex = this._list.indexOf(y);
    }
  }

  /**
   * moves the items in the stack to the right of the item at the target index
   * without breaking the rules, if possible.
   *
   * @param  {Array<Integer>} stack stack of indices of items that need to move
   *   before all rules are satisfied.
   * @param  {Integer} targetIndex index of the item that needs to end up being
   *   to the left hand side of all the stack items.
   * @throws ConflictingRulesError if it is not possible to move stack items to
   *   the right of the target item without breaking the rules.
   */
  _moveStackToRightOfTarget(stack, targetIndex) {
    if (stack.length === 0) {
      return;
    }

    let limits = calculateLeftRightMovementLimits(this._list, this._rules);
    let nextItemIndex = stack[stack.length - 1];
    let distanceToTarget = targetIndex - nextItemIndex;

    if (distanceToTarget === 0) {
      let previousItemIndex = stack[stack.length - 2];
      let xString = this._serializer(this._list[previousItemIndex]);
      let yString = this._serializer(this._list[nextItemIndex]);
      let message = `Moving ${xString} after ${yString} conflicts with existing rules.`;
      throw new ConflictingRulesError(message);
    }

    if (this._canMoveXAfterY(nextItemIndex, targetIndex, limits)) {
      stack.pop();
      let nextItem = this._list[nextItemIndex];
      this.removeAtIndex(nextItemIndex);
      this.insert(nextItem, targetIndex);
      this._moveStackToRightOfTarget(stack, targetIndex - 1);
    } else {
      let rightLimitOfItem = limits[nextItemIndex].right;
      let indexOfRightBound = nextItemIndex + rightLimitOfItem + 1;
      stack.push(indexOfRightBound);
      this._moveStackToRightOfTarget(stack, targetIndex);
    }
  }
}
