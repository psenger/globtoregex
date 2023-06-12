# globtoregex

> Glob to RegEx - lightweight tool to convert Apache Glob for Unix to a Regular Expression

## About

I needed a lightweight `glob` to `regex` converter for a project. I couldn't find one that was light weight enough for my needs so I wrote one.

## Installation

`npm install @psenger/globtoregex --save`

or

`yarn add @psenger/globtoregex`

## Syntax

| Wildcard | Description                                         | Example      | Matches                         | Does not match                   |
|----------|-----------------------------------------------------|--------------|---------------------------------|----------------------------------|
| `*`      | Matches any number of characters zero or more times | `*.txt`      | `foo.txt`, `bar.txt`, `baz.txt` | `foo.txt.bak`, `foo.txt/bar.txt` |
| `?`      | Matches any single character                        | `?.txt`      | `a.txt`, `b.txt`, `c.txt`       | `foo.txt`, `bar.txt`, `baz.txt`  |
| `[abc]`  | Matches any character in the set                    | `[abc].txt`  | `a.txt`, `b.txt`, `c.txt`       | `foo.txt`, `bar.txt`, `baz.txt`  |
| `[a-z]`  | Matches any character in the range                  | `[a-z].txt`  | `a.txt`, `b.txt`, `c.txt`       | `foo.txt`, `bar.txt`, `baz.txt`  |
| `[!abc]` | Matches any character not in the set                | `[!C]at`     | `Bat`, `bat`, or `cat`          | `Cat`                            |
| `[!a-z]` | Matches any character not in the range              | `[!a-z].txt` | `A.txt`, `B.txt`, `C.txt`       | `foo.txt`, `bar.txt`, `baz.txt`  |


