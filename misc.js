/**
 * @param  {Any} input any input
 * @return {Any} same instance as `input`.
 */
export function identity(input) {
  return input;
}

/**
 * @param  {Optional<Integer>} left the left movement limit.
 * @param  {Optional<Integer>} right the right movement limit.
 * @return {Object} the left / right movements limits.
 */
function createLeftRightMovementLimit(left = null, right = null) {
  return {left, right};
}

/**
 * @param  {Array} list An array whose items have to respect the rules in the
 *   following parameter.
 * @param  {PositionRules} rules Position rules that apply to the list items.
 * @return {Array<LeftRightMovementLimit>} an array that corresponds to the
 *   `list`. This array describes how many steps each `list` item can move
 *   left/right before breaking any of the `rules`.
 *
 *   e.g. for list ['a', 'b', 'c'] and rules ["'a' before 'b'", "'a' before 'c'"]
 *     we would expect the movement limits to be:
 *     ```[{left: null, right: 0}, {left: 0, right: null}, {left: 1, right: null}]```
 *     this means 'a' can't move to the right without breaking the rule
 *     "'a' before 'b'". Likewise, 'b' can't move to the left without breaking
 *     the same rule. Moreover, 'c' can only move one step to the left to give us
 *     a new list that doesn't break any rules: ['a', 'c', 'b'], but if it moves
 *     by two steps to the left then it would give us the list ['c', 'a', 'b'],
 *     which breaks the rule "'a' before 'c'".
 *
 */
function calculateLeftRightMovementLimits(list, rules) {
  let limits = [];

  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let limit = createLeftRightMovementLimit();
    let leftBounds = rules.getLeftBoundsForItem(item);
    let rightBounds = rules.getRightBoundsForItem(item);

    // for items [a, b, c, ... , item, ... , x, y, z]
    // we're iterating backwards from 'item' to 'a'.
    for (let backwardsIndex = i - 1; backwardsIndex >= 0; backwardsIndex--) {
      let maybeImABound = list[backwardsIndex];
      if (leftBounds.has(maybeImABound)) {
        limit.left = i - backwardsIndex - 1;
        break;
      }
    }

    // for items [a, b, c, ... , item, ... , x, y, z]
    // we're iterating forwards from 'item' to 'z'.
    for (let forwardsIndex = i + 1; forwardsIndex < list.length; forwardsIndex++) {
      let maybeImABound = list[forwardsIndex];
      if (rightBounds.has(maybeImABound)) {
        limit.right = forwardsIndex - i - 1;
        break;
      }
    }

    limits.push(limit);
  }

  return limits;
}
