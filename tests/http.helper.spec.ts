import { describe, expect, it } from 'vitest';
import type { InternalAxiosRequestConfig } from 'axios';
import { http, keysToCamelCase, keysToSnakeCase } from '../src/services/http/http.helper';

describe('keysToSnakeCase / keysToCamelCase', () => {
  it('converts nested object and array keys but leaves values untouched', () => {
    const camel = { requesterName: 'John', tickets: [{ createdAt: 'x', status: 'in_progress' }] };
    const snake = { requester_name: 'John', tickets: [{ created_at: 'x', status: 'in_progress' }] };

    expect(keysToSnakeCase(camel)).toEqual(snake);
    expect(keysToCamelCase(snake)).toEqual(camel);
  });

  it('returns primitives and null as they are', () => {
    expect(keysToCamelCase(null)).toBeNull();
    expect(keysToCamelCase('in_progress')).toBe('in_progress');
  });
});

describe('http instance', () => {
  it('sends snake_case to the backend and returns camelCase to the app', async () => {
    let sentBody: unknown;

    const response = await http.post(
      '/tickets',
      { requesterName: 'John' },
      {
        // Fake adapter so no real request is made
        adapter: async (config: InternalAxiosRequestConfig) => {
          sentBody = JSON.parse(config.data);
          return {
            data: { data: { requester_name: 'John' } },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        },
      }
    );

    expect(sentBody).toEqual({ requester_name: 'John' });
    expect(response.data).toEqual({ data: { requesterName: 'John' } });
  });
});
