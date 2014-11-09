This is a small module for collecting all the todos scattered
throughout a project and placing them in one easy to read file.

## Install
```js
npm install -g gen-todos
```

## What is this?
When I finish working for the day I write down what needs to be done
in the project for the next day so I don't forget. This inevitably leads
to wasted time the next day figuring out where to start instead of actually
starting.

Todos creates a single **todo.md** file at the root of a project to enable
individuals or teams to quickly start where they left off. This repo has its
own generated todos file. Go ahead and take a look at the format.

This is not designed to be a replacement for github issues in any way. Just an
easy way to remember little tasks that need to be done.

## Usage
```js
todos
```

There is one ignore flag which comes in useful.
```js
todos --ignore 'test/*'
```

Here is the command I used to generate the todo file for this project
```js
todos --ignore 'test, README.md'
```

## Formatting
Currently, it supports JavaScript/CoffeeScript style comments. These all work:

```js
// TODO example todo
// FIXME example todo
# TODO .coffee .rb comments

/* TODO example todo
 * TODO example todo
 */

/* FIXME example todo
 * FIXME example todo
 */

// Matches are case insensitive so this works too
// todo another todo
# FixMe pretty please
```

