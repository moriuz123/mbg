import { getCachedData, redis } from '../redis';

// Mock IORedis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn().mockResolvedValue('OK'),
  }));
});

describe('Redis Cache Helper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached data if available (CACHE HIT)', async () => {
    const mockData = { total: 100 };
    (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockData));

    const fetcher = jest.fn();
    const result = await getCachedData('test-key', fetcher);

    expect(redis.get).toHaveBeenCalledWith('test-key');
    expect(fetcher).not.toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('should call fetcher and set cache if data is missing (CACHE MISS)', async () => {
    (redis.get as jest.Mock).mockResolvedValueOnce(null);
    
    const freshData = { total: 200 };
    const fetcher = jest.fn().mockResolvedValueOnce(freshData);

    const result = await getCachedData('test-key', fetcher);

    expect(redis.get).toHaveBeenCalledWith('test-key');
    expect(fetcher).toHaveBeenCalled();
    expect(redis.set).toHaveBeenCalledWith('test-key', JSON.stringify(freshData), 'EX', 60);
    expect(result).toEqual(freshData);
  });
});
