import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { describe, expect, it } from 'vitest';

import type { ApiError } from '@services/api/errors';

import { API_CLIENT, normalizeApiBaseUrl } from './api';

type InterceptorHandler = {
  fulfilled: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
};

const getFirstResponseInterceptor = (): InterceptorHandler => {
  const handlers = (
    API_CLIENT.interceptors.response as unknown as {
      handlers: InterceptorHandler[];
    }
  ).handlers;
  return handlers[0];
};

describe('normalizeApiBaseUrl', () => {
  it('defaults to /api when undefined or empty', () => {
    expect(normalizeApiBaseUrl(undefined)).toBe('/api');
    expect(normalizeApiBaseUrl('')).toBe('/api');
    expect(normalizeApiBaseUrl('   ')).toBe('/api');
  });

  it('keeps /api intact without duplicate slashes', () => {
    expect(normalizeApiBaseUrl('/api')).toBe('/api');
    expect(normalizeApiBaseUrl('/api/')).toBe('/api');
    expect(normalizeApiBaseUrl('/api///')).toBe('/api');
  });

  it('appends /api to domain roots if omitted', () => {
    expect(normalizeApiBaseUrl('https://api.sridhaacademy.com')).toBe(
      'https://api.sridhaacademy.com/api',
    );
    expect(normalizeApiBaseUrl('https://api.sridhaacademy.com/')).toBe(
      'https://api.sridhaacademy.com/api',
    );
  });

  it('preserves existing /api on domain roots and does not duplicate to /api/api', () => {
    expect(normalizeApiBaseUrl('https://api.sridhaacademy.com/api')).toBe(
      'https://api.sridhaacademy.com/api',
    );
    expect(normalizeApiBaseUrl('https://api.sridhaacademy.com/api/')).toBe(
      'https://api.sridhaacademy.com/api',
    );
  });
});

describe('API_CLIENT response interceptor', () => {
  it('passes through successful JSON responses', async () => {
    const fakeResponse: AxiosResponse = {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { headers: new AxiosHeaders() } as InternalAxiosRequestConfig,
    };

    const interceptor = getFirstResponseInterceptor();
    const result = interceptor.fulfilled(fakeResponse);

    expect(result).toBe(fakeResponse);
  });

  it('rejects with API_UNAVAILABLE when HTML is returned', async () => {
    const fakeHtmlResponse: AxiosResponse = {
      data: '<!doctype html><html><head><title>letaEd</title></head></html>',
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/html' },
      config: {
        url: '/catalogue',
        headers: new AxiosHeaders(),
      } as InternalAxiosRequestConfig,
    };

    const interceptor = getFirstResponseInterceptor();

    await expect(interceptor.fulfilled(fakeHtmlResponse)).rejects.toThrow(
      AxiosError,
    );

    try {
      await interceptor.fulfilled(fakeHtmlResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(AxiosError);
      const axiosError = error as AxiosError<ApiError>;
      expect(axiosError.response?.status).toBe(503);
      expect(axiosError.response?.data?.code).toBe('API_UNAVAILABLE');
    }
  });

  it('rejects with API_UNAVAILABLE when HTML string without content-type header is returned', async () => {
    const fakeHtmlResponse: AxiosResponse = {
      data: '<!DOCTYPE html>\n<html><body>App</body></html>',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        url: '/catalogue',
        headers: new AxiosHeaders(),
      } as InternalAxiosRequestConfig,
    };

    const interceptor = getFirstResponseInterceptor();

    try {
      await interceptor.fulfilled(fakeHtmlResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(AxiosError);
      const axiosError = error as AxiosError<ApiError>;
      expect(axiosError.response?.status).toBe(503);
      expect(axiosError.response?.data?.code).toBe('API_UNAVAILABLE');
    }
  });
});
