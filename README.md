# Redis Client

## Backend usage example

```js
const redis = require('node-redis');

redis.set('key1', 'value1', 60); // sets the value of 'key1' to 'value1' with a 60-second expiration time

const value1 = redis.get('key1'); // retrieves the value of 'key1'
console.log(value1); // prints 'value1'

redis.del('key1'); // deletes the key-value pair for 'key1'

const keys = redis.getAllKeys(); // retrieves all keys in the database
console.log(keys); // prints an array of all keys

redis.quit(); // clears the database and stops the expiration timer
```


## Installation
```
npm install -s git@github.com:sourabhossain/node-redis.git
```
