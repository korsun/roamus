import { apiService } from './apiService';

describe('apiService', () => {
  fetchMock.mockResponse(JSON.stringify({ test: 'test' }));

  it('Adds necessary headers for a POST call', async () => {
    await apiService.post({
      url: 'https://graphhopper-api-test.com',
      payload: {},
    });
    expect(fetchMock).toBeCalledWith(`https://graphhopper-api-test.com/?`, {
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
    expect(fetchMock).toBeCalledWith(
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
    fetchMock.mockRejectOnce(err);

    await expect(
      apiService.post({
        url: 'https://graphhopper-api-test.com',
        payload: {},
      }),
    ).rejects.toThrow('Too bad');
  });

  xit('If response is not ok but there is no error from server, throws an error', async () => {
    //
  });

  it.todo('GET');
});
