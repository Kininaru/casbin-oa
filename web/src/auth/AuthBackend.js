// Copyright 2020 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {authConfig} from "./Auth";

export function getAccount() {
  return fetch(`${authConfig.serverUrl}/api/get-account`, {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json());
}

export function register(values) {
  return fetch(`${authConfig.serverUrl}/api/register`, {
    method: 'POST',
    credentials: "include",
    body: JSON.stringify(values),
  }).then(res => res.json());
}

export function login(values) {
  return fetch(`${authConfig.serverUrl}/api/login`, {
    method: 'POST',
    credentials: "include",
    body: JSON.stringify(values),
  }).then(res => res.json());
}

export function logout() {
  return fetch(`${authConfig.serverUrl}/api/logout`, {
    method: 'POST',
    credentials: "include",
  }).then(res => res.json());
}

export function authLogin(applicationName, providerName, code, state, redirectUrl, method) {
  return fetch(`${authConfig.serverUrl}/api/auth/login?application=${applicationName}&provider=${providerName}&code=${code}&state=${state}&redirect_url=${redirectUrl}&method=${method}`, {
    method: 'GET',
    credentials: 'include',
  }).then(res => res.json());
}

export function getApplication(owner, name) {
  return fetch(`${authConfig.serverUrl}/api/get-application?id=${owner}/${encodeURIComponent(name)}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}
