/*
 * verification.js - Generates HMAC-SHA256 Signature
 *
 * Copyright (C) 2020-2021, Sparta_EN<nya@sparta-en.org>
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
const crypto = require('crypto');
const uuid = require('uuid');

const secret = 'leos3cr3t';

function genSignature(uuid, timestamp, method) {
    let message = `seat::${uuid}::${timestamp}::${method.toUpperCase()}`;
    return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

exports.genUuid = uuid.v1();

exports.genDate = new Date().getTime();

exports.genSignature = genSignature;

exports.genHeaders = (method) => {
    let id = uuid.v1();
    let date = new Date().getTime();
    return {
        'x-hmac-request-key': genSignature(id, date, method),
        'x-request-date': date,
        'x-request-id': id,
    }
}