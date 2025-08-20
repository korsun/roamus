import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyRoute } from '../applyRoute';

describe('applyRoute', () => {
  const mockCoordinates = [
    [0, 0],
    [1, 1],
  ];

  const mockPath = {
    distance: 100,
    duration: 200,
    coordinates: mockCoordinates,
  };

  const defaultParams = {
    coordinates: mockCoordinates,
    getMarkersSource: vi.fn(),
    routes: {
      graphhopper: { isActive: true },
      osrm: { isActive: true },
    },
    setGraphhopperLimits: vi.fn(),
    cleanRoute: vi.fn(),
    setPath: vi.fn(),
    renderRoute: vi.fn(),
    fetchRoute: vi.fn().mockResolvedValue(mockPath),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    defaultParams.getMarkersSource.mockReturnValue({
      getFeatures: () => [],
    });
  });

  it('should not process empty coordinates', async () => {
    await applyRoute({
      ...defaultParams,
      coordinates: [],
    });

    expect(defaultParams.fetchRoute).not.toHaveBeenCalled();
  });

  it('should process coordinates when under GraphHopper limit', async () => {
    defaultParams.getMarkersSource.mockReturnValue({
      getFeatures: () => new Array(5), // 5 markers (limit is 5)
    });

    await applyRoute(defaultParams);

    // Wait for Promise.all to resolve
    await new Promise(process.nextTick);

    expect(defaultParams.setGraphhopperLimits).not.toHaveBeenCalled();
    expect(defaultParams.fetchRoute).toHaveBeenCalledTimes(2); // Both engines active
    expect(defaultParams.setPath).toHaveBeenCalledTimes(2);
  });

  it('should set GraphHopper limits when over marker limit', async () => {
    defaultParams.getMarkersSource.mockReturnValue({
      getFeatures: () => new Array(6), // 6 markers (over limit of 5)
    });

    await applyRoute(defaultParams);

    expect(defaultParams.setGraphhopperLimits).toHaveBeenCalledWith(
      true,
      'Free GraphHopper engine allows maximum 5 markers',
    );
    expect(defaultParams.fetchRoute).toHaveBeenCalledTimes(1); // Only OSRM
    expect(defaultParams.fetchRoute).toHaveBeenCalledWith(
      expect.objectContaining({ engine: 'osrm' }),
    );
  });

  it('should clean up routes when data is null', async () => {
    // Mock fetchRoute to return null data for one engine
    defaultParams.fetchRoute.mockResolvedValueOnce(null);

    await applyRoute(defaultParams);

    // Wait for all promises to resolve
    await new Promise(process.nextTick);

    // Verify cleanRoute was called for the engine with null data
    expect(defaultParams.cleanRoute).toHaveBeenCalled();
  });

  it('should handle inactive engines', async () => {
    await applyRoute({
      ...defaultParams,
      routes: {
        graphhopper: { isActive: false },
        osrm: { isActive: false },
      },
    });

    expect(defaultParams.fetchRoute).not.toHaveBeenCalled();
  });

  it('should process only active engines', async () => {
    await applyRoute({
      ...defaultParams,
      routes: {
        graphhopper: { isActive: true },
        osrm: { isActive: false },
      },
    });

    expect(defaultParams.fetchRoute).toHaveBeenCalledTimes(1);
    expect(defaultParams.fetchRoute).toHaveBeenCalledWith(
      expect.objectContaining({ engine: 'graphhopper' }),
    );
  });
});
