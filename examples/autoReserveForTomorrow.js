const API = require('../index');
const moment = require('moment');
let CronJob = require('cron').CronJob;

// Every day at 7:00 a.m.
let job = new CronJob('0 7 * * *', async () => {
    let api = new API('Username', 'Password', 'https://lib.example.com/')
    try {
        let date = moment().add(1, 'day').format("YYYY-MM-DD");
        await api.login();
        // Seat ID: 8141   8:00 to 12:00
        await api.reserveSeat(8141, date, 8, 12);
        console.log("Success");
    } catch (e) {
        console.log(e.message);
    }
}, null, true, 'Asia/Shanghai');