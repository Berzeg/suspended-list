import {identity} from 'misc';

export default class PositionRules {
  constructor(serializer = identity) {
    this._serializer = serializer;
    this._rulesLHS = {};
    this._rulesRHS = {};
  }

  copy() {
    let rulesCopy = new PositionRules(this._serializer);
    Object.assign(rulesCopy._rulesLHS, this._rulesLHS);
    Object.assign(rulesCopy._rulesRHS, this._rulesRHS);
    return rulesCopy;
  }

  addRule(lhs, rhs) {
    let lhsString = this._serializer(lhs);
    let rhsString = this._serializer(rhs);

    if ( !this._rulesLHS.hasOwnProperty(lhsString) ) {
      let lhsSet = new Set();
      lhsSet.add(rhsString);
      this._rulesLHS[lhsString] = lhsSet;
    } else {
      let lhsSet = this._rulesLHS[lhsString];
      lhsSet.add(rhsString);
      this._rulesLHS[lhsString] = lhsSet;
    }

    if ( !this._rulesRHS.hasOwnProperty(rhsString) ) {
      let rhsSet = new Set();
      rhsSet.add(lhsString);
      this._rulesRHS[rhsString] = rhsSet;
    } else {
      let rhsSet = this._rulesRHS[rhsString];
      rhsSet.add(lhsString);
      this._rulesRHS[rhsString] = rhsSet;
    }
  }

  removeRule(lhs, rhs) {
    let lhsString = this._serializer(lhs);
    let rhsString = this._serializer(rhs);

    if (this._rulesLHS.hasOwnProperty(lhsString) {
      this._rulesLHS[lhsString].delete(rhsString)
    }

    if (this._rulesRHS.hasOwnProperty(rhsString) {
      this._rulesRHS[rhsString].delete(lhsString)
    }
  }

  removeRulesForItem(item) {
    let itemString = this._serializer(item);

    if (this._rulesLHS.hasOwnProperty(itemString) {
      this._rulesLHS[itemString].forEach(rhsString => {
        this._rulesRHS[rhsString].delete(itemString)
      });
      delete this._rulesLHS[itemString];
    }

    if (this._rulesRHS.hasOwnProperty(itemString) {
      this._rulesRHS[itemString].forEach(lhsString => {
        this._rulesLHS[lhsString].delete(itemString)
      });
      delete this._rulesRHS[itemString];
    }
  }

  getLeftBoundsForItem(rhs) {
    let rhsString = this._serializer(rhs);

    if ( this._rulesRHS.hasOwnProperty(rhsString) ) {
      return this._rulesRHS[rhsString];
    }

    return new Set();
  }

  getRightBoundsForItem(lhs) {
    let lhsString = this._serializer(lhs);

    if ( this._rulesLHS.hasOwnProperty(lhsString) ) {
      return this._rulesLHS[lhsString];
    }

    return new Set();
  }
}
