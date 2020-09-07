/*
 * api.js - Manages user session and API calls
 *
 * Copyright (C) 2020, Sparta_EN<nya@sparta-en.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const urlJoin = require('url-join');
const request = require('request');
const fs = require('fs');
const tls = require('tls');

const verification = require('./verification');

// Disable common name verification, only verify the certificate
tls.checkServerIdentity = () => undefined;

const ca = fs.readFileSync(`${__dirname}/../certs/leosys.pem`);
const UA = 'Dart/2.1 (dart:io)';

function checkStatus(data) {
    if (data.code !== undefined) {
        return data.code == "0";
    } else if (data.status !== undefined) {
        if (typeof data.status === 'boolean') {
            return data.status === true;
        } else {
            return data.status == "success";
        }
    }
    return true;
}

class API {
    constructor(username, password, address) {
        this._username = username;
        this._password = password;
        this._address = address;
        this._token = '';
    }
    request(options) {
        return new Promise((resolve, reject) => {
            request({
                ...{
                    headers: {
                        ...{
                            'User-Agent': UA
                        },
                        ...verification.genHeaders(options.method)
                    },
                    ca: ca,
                },
                ...options
            }, (err, res, body) => {
                if (err) {
                    reject(err);
                } else if (res.statusCode !== 200) {
                    reject(new Error(`Server responded with status code ${res.statusCode}`));
                } else {
                    try {
                        let data = JSON.parse(body);
                        if (!checkStatus(data)) {
                            reject(new Error(data.message || "Unknown reason"));
                        } else {
                            resolve(data.data);
                        }
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });
    }
    login() {
        return this.request({
            url: urlJoin(this._address, 'rest/auth'),
            method: 'GET',
            qs: {
                username: this._username,
                password: this._password
            }
        }).then((data) => {
            this._token = data.token;
            return data;
        });
    }
    getUserDetails() {
        return this.request({
            url: urlJoin(this._address, 'rest/v2/user'),
            method: 'GET',
            qs: {
                token: this._token
            }
        });
    }
    getReservationsForCheckIn() {
        return this.request({
            url: urlJoin(this._address, 'rest/v2/user/reservations'),
            method: 'GET',
            qs: {
                token: this._token
            }
        });
    }
    getViolations() {
        return this.request({
            url: urlJoin(this._address, 'rest/v2/violations'),
            method: 'GET',
            qs: {
                token: this._token
            }
        });
    }
    getHistory() {
        return this.request({
            url: urlJoin(this._address, 'rest/v2/history/1/10'),
            method: 'GET',
            qs: {
                token: this._token
            }
        });
    }
    getMotd() {
        return this.request({
            url: urlJoin(this._address, 'rest/v2/announce'),
            method: 'GET',
        });
    }
    getRoomList(ipRestrict = false) {
        return this.request({
            url: urlJoin(this._address, 'rest/v2/free/filters'),
            method: 'GET',
            qs: {
                token: this._token,
                ip_restrict: ipRestrict
            }
        });
    }
    getBuildingStats(buildingId) {
        return this.request({
            url: urlJoin(this._address, `rest/v2/room/stats2/${buildingId}`),
            method: 'GET',
            qs: {
                token: this._token,
            }
        });
    }
    getRoomStatsByDate(roomId, date) {
        return this.request({
            url: urlJoin(this._address, `rest/v2/room/layoutByDate/${roomId}/${date}`),
            method: 'GET',
            qs: {
                token: this._token,
            }
        });
    }
    getAvailableStartTime(seatId, date) {
        return this.request({
            url: urlJoin(this._address, `rest/v2/startTimesForSeat/${seatId}/${date}`),
            method: 'GET',
            qs: {
                token: this._token,
            }
        });
    }
    getAvailableEndTime(seatId, date, hour) {
        return this.request({
            url: urlJoin(this._address, `rest/v2/endTimesForSeat/${seatId}/${date}/${hour*60}`),
            method: 'GET',
            qs: {
                token: this._token,
            }
        });
    }
    reserveSeat(seatId, date, startHour, endHour) {
        return this.request({
            url: urlJoin(this._address, 'rest/v2/freeBook'),
            method: 'POST',
            form: {
                token: this._token,
                seat: seatId,
                startTime: startHour * 60,
                endTime: endHour * 60,
                date: date
            }
        });
    }
    checkIn(reserveId) {
        return this.request({
            url: urlJoin(this._address, `rest/v2/checkIn/${reserveId}`),
            method: 'GET',
            qs: {
                token: this._token
            }
        });
    }
    extendTime(reserveId) {
        return this.request({
            url: urlJoin(this._address, `rest/v2/timeExtend/${reserveId}`),
            method: 'GET',
            qs: {
                token: this._token
            }
        });
    }
    // TODO: Submit extendTime
    leave(reserveId) {
        // TODO Return payload.message
        // CheckIn again to get rid of this status
        return this.request({
            url: urlJoin(this._address, `rest/v2/leave/${reserveId}`),
            method: 'GET',
            qs: {
                token: this._token
            }
        });
    }
    cancel(reserveId) {
        return this.request({
            url: urlJoin(this._address, `rest/v2/cancel/${reserveId}`),
            method: 'GET',
            qs: {
                token: this._token
            }
        });
    }
}

module.exports = API;