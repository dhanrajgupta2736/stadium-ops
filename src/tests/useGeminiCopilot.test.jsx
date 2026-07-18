import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeminiCopilot } from '../hooks/useGeminiCopilot';

describe('useGeminiCopilot', () => {
  const mockZones = [
    { id: 'gate-a', label: 'Gate A', category: 'gate', densityPercent: 50, waitMinutes: 10, status: 'safe' },
    { id: 'concourse-b', label: 'Concourse B', category: 'concourse', densityPercent: 80, waitMinutes: 0, status: 'warning' }
  ];
  const mockDirectives = [];
  const mockIncidents = [];
  const mockCompletedActions = new Set();

  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with empty key and empty chat history', () => {
    const { result } = renderHook(() =>
      useGeminiCopilot(mockZones, mockDirectives, mockIncidents, mockCompletedActions, 'en')
    );
    expect(result.current.apiKey).toBe('');
    expect(result.current.chatHistory).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('saves the API key correctly in localStorage', () => {
    const { result } = renderHook(() =>
      useGeminiCopilot(mockZones, mockDirectives, mockIncidents, mockCompletedActions, 'en')
    );

    act(() => {
      result.current.saveApiKey('test-api-key');
    });

    expect(result.current.apiKey).toBe('test-api-key');
    expect(window.localStorage.getItem('stadium_ops_gemini_api_key')).toBe('test-api-key');
  });

  it('clears chat history when requested', () => {
    const { result } = renderHook(() =>
      useGeminiCopilot(mockZones, mockDirectives, mockIncidents, mockCompletedActions, 'en')
    );

    act(() => {
      result.current.sendMessage('Hello');
    });
    
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.chatHistory.length).toBeGreaterThan(0);

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.chatHistory).toEqual([]);
  });

  it('sends simulated replies in English in simulation mode', () => {
    const { result } = renderHook(() =>
      useGeminiCopilot(mockZones, mockDirectives, mockIncidents, mockCompletedActions, 'en')
    );

    act(() => {
      result.current.generateOptimizationPlan();
    });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.chatHistory).toHaveLength(2);
    expect(result.current.chatHistory[1].role).toBe('model');
    expect(result.current.chatHistory[1].text).toContain('All zones are running nominal');
  });
});
