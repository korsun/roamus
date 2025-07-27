import { beforeEach, describe, expect, it } from 'vitest';

import { apiService } from './apiService';

describe.skip('apiService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('Adds necessary headers for a POST call', async () => {
    await apiService.post({
      url: 'some-url',
      payload: {},
    });
    expect(fetch).toHaveBeenCalledWith(`https://graphhopper-api-test.com/?`, {
      body: '{}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  it('Merges necessary headers and queryParams with custom ones', async () => {
    await apiService.post({
      url: 'https://graphhopper-api-test.com',
      payload: {},
      headers: {
        'My-Header': 'test',
      },
      queryParams: {
        key: 'custom-api-key',
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      `https://graphhopper-api-test.com/?key=custom-api-key`,
      {
        body: '{}',
        headers: { 'Content-Type': 'application/json', 'My-Header': 'test' },
        method: 'POST',
      },
    );
  });

  it('Returns a parsed JSON', async () => {
    const res = await apiService.post({
      url: 'https://graphhopper-api-test.com',
      payload: {},
    });
    expect(res).toEqual({ test: 'test' });
  });

  it('Handles errors', async () => {
    const err = new Error('Too bad');
    fetch.mockImplementationOnce(() => Promise.reject(err));

    await expect(
      apiService.post({
        url: 'https://graphhopper-api-test.com',
        payload: {},
      }),
    ).rejects.toThrow('Too bad');
  });

  it.todo(
    'If response is not ok but there is no error from server, throws an error',
  );

  it.todo('GET');
});
