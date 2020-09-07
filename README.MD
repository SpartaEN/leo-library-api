# leo-library-api

API for leo library

## Disclaimer

Please **DO NOT** use for auto reservation. Please respect who get up early to reserve seats.

## Usage

```js
const API = require('./index');
(async () => {
let api = new API('username', 'password', 'https://link/to/the/app');
try {
    await api.login();
    console.log(await api.getHistory());
} catch(e) {
    console.log(e.message);
}
})();
```

Checkout more [examples](https://github.com/SpartaEN/leo-library-api/tree/master/examples).

## HMAC-SHA256 Signature

Checkout [docs](https://github.com/SpartaEN/leo-library-api/tree/master/docs/HMAC-Signature.MD);

## LICENSE
```
Copyright (C) 2020, Sparta_EN<nya@sparta-en.org>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>. 
```