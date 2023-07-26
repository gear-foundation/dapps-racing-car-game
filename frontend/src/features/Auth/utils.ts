import { AnyJson } from '@polkadot/types/types';
import { AUTH_API_ADDRESS } from './consts';

const post = <T>(url: string, payload: AnyJson) =>
  fetch(`${AUTH_API_ADDRESS}/${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((response) => {
    if (!response.ok) throw new Error(response.statusText);

    return response.json() as T;
  });

const fetchAuth = <T>(url: string, method: string, token: string, payload?: AnyJson) =>
  fetch(`${AUTH_API_ADDRESS}/${url}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: payload ? JSON.stringify(payload) : undefined,
  }).then((response) => {
    if (!response.ok) throw new Error(response.statusText);

    return response.json() as T;
  });

export { post, fetchAuth };
