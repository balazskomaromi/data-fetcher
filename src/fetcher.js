import fetch, { AbortError } from 'node-fetch';

import {fetchRequests} from './store.js';
import {PAGINATIONS} from './pagination.js';

export const fetchData = async (fetchRequestId) => {
  const {config} = fetchRequests.get(fetchRequestId);
  const {source} = config;

  console.log(`Start working on ${fetchRequestId}`);

  const paginatorFunction = source.pagination ? PAGINATIONS[source.pagination] : () => null;

  let nextUrl = source.url;

  const responses = [];
  const headers = source.authToken ? {'Authorization': `Bearer ${source.authToken}`} : undefined;

  while (nextUrl != null) {
    const AbortController = globalThis.AbortController || await import('abort-controller')
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, source.requestTimeout || 10000);

    try {
      const response = await fetch(nextUrl, {
        method: 'get',
        headers,
        signal: controller.signal,
      });
      const data = await response.json();

      responses.push(data[source.rootObject]);

      nextUrl = paginatorFunction(response);
    } catch (error) {
      if (error instanceof AbortError) {
        console.log('Request was aborted, terminating');
        nextUrl = null;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  console.log(`Fetched everything for ${fetchRequestId}`);

  const result = {};

  result[source.rootObject] = responses.flat();

  return result;
}
