import http from 'node:http';
import crypto from 'crypto';

import {uploadToS3} from './src/s3.js';
import {fetchData} from './src/fetcher.js';
import {fetchRequests} from './src/store.js';

http.createServer((request, response) => {
  const chunks = [];

  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    chunks.push(chunk);
  }).on('end', async () => {
    const body = JSON.parse(Buffer.concat(chunks).toString());
    const fetchRequestId = crypto.randomUUID();

    fetchRequests.set(fetchRequestId, { config: body});

    const responseBody = { fetchRequestId, };

    response.on('error', (err) => {
      console.error(err);
    });
    response.writeHead(200, {'Content-Type': 'application/json'})

    response.end(JSON.stringify(responseBody))

    const fetchedData = await fetchData(fetchRequestId);
    await uploadToS3(fetchRequestId, fetchedData);
  });
}).listen(8080);
