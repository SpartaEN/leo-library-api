const API = require('../index');
(async () => {
    let api = new API('username', 'password', 'https://link/to/the/app');
    try {
        await api.login();
        console.log(await api.getUserDetails());
    } catch (e) {
        console.log(e.message);
    }
})();