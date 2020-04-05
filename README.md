# suspended-list v1.0.0

A data-structure that arranges items according to a sparse set of position-rules (e.g. \"a before b\" and \"z after y\"), as a Node.js module.

## Index

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Motivation](#motivation)
- [The `SuspendedList` Class](#the-suspended-list-class)
  - [constructor](#suspended-list-constructor)
  - [length](#suspended-list-length)
  - [item](#suspended-list-item)
  - [toArray](#suspended-list-toArray)
  - [addRuleXBeforeY](#suspended-list-addRuleXBeforeY)
  - [addRuleXAfterY](#suspended-list-addRuleXAfterY)
  - [removeRuleXBeforeY](#suspended-list-removeRuleXBeforeY)
  - [removeRuleXAfterY](#suspended-list-removeRuleXAfterY)
  - [removeRulesForItem](#suspended-list-removeRulesForItem)
  - [copy](#suspended-list-copy)
  - [push](#suspended-list-push)
  - [unshift](#suspended-list-unshift)
  - [pushRight](#suspended-list-pushRight)
  - [insert](#suspended-list-insert)
  - [pop](#suspended-list-pop)
  - [shift](#suspended-list-shift)
  - [popLeft](#suspended-list-popLeft)
  - [popRight](#suspended-list-popRight)
  - [remove](#suspended-list-remove)
  - [removeAtIndex](#suspended-list-removeAtIndex)
  - [find](#suspended-list-find)
  - [findIndex](#suspended-list-findIndex)
  - [includes](#suspended-list-includes)
  - [indexOf](#suspended-list-indexOf)
  - [lastIndexOf](#suspended-list-lastIndexOf)
  - [forEach](#suspended-list-forEach)
  - [map](#suspended-list-map)
  - [filter](#suspended-list-filter)
  - [reduce](#suspended-list-reduce)
  - [reduceRight](#suspended-list-reduceRight)

## Installation

Using npm:

```
npm i -g npm
npm i --save suspended-list
```

Using yarn:

```
yarn add suspended-list
```

## Basic Usage

After installing the package you can use it in Node.js as follows:

```
// Load the package
var SuspendedList = require('suspended-list');

// create an instance of the list
var list = new SuspendedList();

// use the list
list.addRuleXBeforeY('a', 'b');
list.push('b');
list.push('a');

// prints 'list.toArray(): "[ 'a', 'b' ]"'
console.log('list.toArray(): "' + list.toArray() + '"');
```

## Motivation

A suspended-list is supposed to solve the scenario where there is no straight-forward, global order for a list of items, but there is an order that binds certain pairs of items in the list.

For example, if you have a list if tasks that you want to complete by the end of the day you may list them as follows:

```
[
  'shower',
  'do the dishes',
  'workout',
  'yoga',
  'creative writing',
  'meal prep',
  'water flowers',
  'grocery run'
]
```

The exact order in which you carry out the tasks may not be obvious at once, but you may have personal rules for some tasks that have to be carried out before others:

```
[
  'yoga after workout',
  'shower after yoga', // shower after the sweatiest part of the day
  'creative writing after meal prep',
  'do the dishes before creative writing', // the dishwasher will be done by the time you're done creative writing
  'grocery run before meal prep',
  'grocery run before workout',
  'meal prep before creative writing'
]
```

The suspended list would be able to arrange the items in an order that respects all of the above rules, if none of the rules conflict each other. Some tasks may have no associated rules and may be placed wherever we want.

## The `SuspendedList` Class

#### <a id="suspended-list-constructor"></a> constructor(serializer = identity)

  - `serializer` {Function} - A method that take a list itemas an input and outputs a unique string for each item. This defaults to an identity function (a function that returns the input as an output).

#### <a id="suspended-list-length"></a> length

  The length property returns the number of items in the list.

#### <a id="suspended-list-item"></a> item(index)

  returns {Any} the item at the provided index.

  - `index` {Integer} - The index of the list item to retrieve.

#### <a id="suspended-list-toArray"></a> toArray()

  returns {Array<Any>} a copy of the inner list (not a SuspendedList). Since the returned value is a copy modifying it won't affect the SuspendedList.

#### <a id="suspended-list-addRuleXBeforeY"></a> addRuleXBeforeY(x, y)

  Adds a rule that item `x` should appear in the list before item `y`.

  - `x` {Any} - The item that should appear to the left of `y`.
  - `y` {Any} - The item that should appear to the right of `x`.

#### <a id="suspended-list-addRuleXAfterY"></a> addRuleXAfterY(x, y)

  Adds a rule that item `x` should appear in the list after item `y`.

  - `x` {Any} - The item that should appear to the right of `y`.
  - `y` {Any} - The item that should appear to the left of `x`.

#### <a id="suspended-list-removeRuleXBeforeY"></a> removeRuleXBeforeY(x, y)

  Removes the rule that item `x` should appear in the list before item `y`, if that rule exists.

  - `x` {Any} - The item that should have appeared to the left of `y`.
  - `y` {Any} - The item that should have appeared to the right of `x`.

#### <a id="suspended-list-removeRuleXAfterY"></a> removeRuleXAfterY(x, y)

  Removes the rule that item `x` should appear in the list after item `y`, if that rule exists.

  - `x` {Any} - The item that should have appeared to the right of `y`.
  - `y` {Any} - The item that should have appeared to the left of `x`.

#### <a id="suspended-list-removeRulesForItem"></a> removeRulesForItem(item)

  Removes all rules associated with the provided item, if any exists. This means that all rules added by calling `list.addRuleXBeforeY(item, *)` or `list.addRuleXAfterY(item, *)` will be removed.

  - `item` {Any} - The item whose associated rules are to be removed.

#### <a id="suspended-list-copy"></a> copy()

  Returns {SuspendedList} a deep copy of the `SuspendedList`. Adding/Removing items or rules from this copy will not affect the original whatsoever.

#### <a id="suspended-list-push|pushRight"></a> push|pushRight(item)

  Pushes the provided item at the end of the list.

  - item {Any} - The item to add to the list.

#### <a id="suspended-list-unshift|pushLeft"></a> unshift|pushLeft(item)

  Pushes the provided item at the start of the list.

  - item {Any} - The item to add to the list.

#### <a id="suspended-list-insert"></a> insert(item, index)

  Inserts the provided item at the indicated list index.

  - item {Any} - The item to add to the list.
  - index {Integer} - The index in the list at which to add the item.

#### <a id="suspended-list-pop|popRight"></a> pop|popRight()

  Returns {Any} and removes the item at the end of the list.

#### <a id="suspended-list-shift|popLeft"></a> shift|popLeft()

  Returns {Any} and removes the item at the start of the list.

#### <a id="suspended-list-remove"></a> remove(item)

  Removes the first instance of the provided item that appears in the list.

  - item {Any} - The item to remove from the list.

#### <a id="suspended-list-removeAtIndex"></a> removeAtIndex(index)

  Removes the item at the indicated list index.

  - index {Integer} - The index of the item to be removed.

#### <a id="suspended-list-find"></a> find(callback, thisArg = this._list)

  Returns {Any} iterates over the list and returns the first item that satisfies the provided callback.

  - callback {Function} - A function that takes a list item as an input and returns `true` if the item matches the item being sought after.

#### <a id="suspended-list-findIndex"></a> findIndex(callback, thisArg = this._list)

  Returns {Integer} iterates over the list and returns the index of the first item that satisfies the provided callback.

  - callback {Function} - A function that takes a list item as an input and returns `true` if the item matches the item being sought after.

#### <a id="suspended-list-includes"></a> includes(valueToFind, fromIndex = undefined)

  Returns {Boolean} `true` if the item being sought after exists in the list.

  - valueToFind {Any} - The item being sought after in the list.
  - fromIndex {Integer} - The list index at which to start looking for the provided value.

#### <a id="suspended-list-indexOf"></a> indexOf(searchElement, fromIndex = undefined)

  Returns {Integer} the index in the list of the first item that matches the provided search item.

  - searchElement {Any} - The item whose index we're seeking.
  - fromIndex {Integer} - The list index at which to start looking for the provided item.

#### <a id="suspended-list-lastIndexOf"></a> lastIndexOf(searchElement, fromIndex = undefined)

  Returns {Integer} the index in the list of the last item that matches the provided search item.

  - searchElement {Any} - The item whose index we're seeking.
  - fromIndex {Integer} - The list index at which to start to start looking for the provided item (moving backwards from the indicated index).

#### <a id="suspended-list-forEach"></a> forEach(callback, thisArg = this._list)

  iterates over each item in the list and calls the callback with each item as an input.

  - callback {Function} - A function that takes a list item as an input.

#### <a id="suspended-list-map"></a> map(callback, thisArg = this._list)

  Returns {Array<Any>} iterates over each item in the list and calls the callback with each item as an input, and appends the output of the callback to a list that will eventually be returned to the caller.

  - callback {Function} - A function that takes a list item as an input, and outputs any value.

#### <a id="suspended-list-filter"></a> filter(callback, thisArg = this._list)

  Returns {Array<Any>} iterates over each item in the list and calls the callback with each item as an input, if the callback returns a truthy value then the list item is appended to a list that will eventually be returned to the caller.

  - callback {Function} - A function that takes a list item as an input, and outputs a boolean value. `true` indicates that the list item is to be included in the output list. `false` indicates that the list item is not to be included in the output list.

#### <a id="suspended-list-reduce"></a> reduce(callback, initialValue = undefined)

  Returns {Any} Reduces the list items into a single value by calling the provided "reducer" callback function.

  - callback {Function} - A method that takes two inputs `(accumulator, currentValue)` and returns a combined (reduced) value.
  - initialValue {Any} - The initial `accumulator` value. If not provided then the first list item is passed as the first `accumulator`.

#### <a id="suspended-list-reduceRight"></a> reduceRight(callback, initialValue = undefined)

  Returns {Any} Reduces the list items into a single value by calling the provided "reducer" callback function. The reduction happens from the right hand side and moves leftwards.

  - callback {Function} - A method that takes two inputs `(accumulator, currentValue)` and returns a combined (reduced) value.
  - initialValue {Any} - The initial `accumulator` value. If not provided then the last list item is passed as the initial `accumulator`.
