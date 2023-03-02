import parseLinkHeader from 'parse-link-header';

const nextURL = (response) => {
  const links = parseLinkHeader(response.headers.get('link'));

  if (links && links.next) {
    return links.next.url;
  }
  return null;
};

const xTotalCountPagination = (response) => {
  const url = new URL(get(response, 'url'));

  const limit = parseInt(url.searchParams.get('limit'));
  const offset = parseInt(url.searchParams.get('offset')) || 0;
  const total = parseInt(response.headers['x-total-count']);

  if (isNaN(limit)) {
    throw new Error('OneRoster must use the `limit` when `next` link not provided');
  }

  if (isNaN(total)) {
    throw new Error(
      `Endpoint ${url.toString()} does not provide X-Total-Count nor 'next' link`,
      response,
    );
  }

  if (total > offset + limit) {
    url.searchParams.set('offset', `${offset + limit}`);

    return url.toString();
  }

  return null;
};

const offsetToEndPagination = (response) => {
  const url = new URL(response.url);

  const limit = parseInt(url.searchParams.get('limit'));
  const offset = parseInt(url.searchParams.get('offset')) || 0;

  const found = Object.values(response.body)
    .filter(Boolean)
    .find((value) => value.length);

  if (found) {
    url.searchParams.set('offset', `${offset + limit}`);
    return url.toString();
  }

  return null;
};


export const PAGINATIONS = {
  link: nextURL,
  'x-total-count': xTotalCountPagination,
  'offset-to-end': offsetToEndPagination,
};
