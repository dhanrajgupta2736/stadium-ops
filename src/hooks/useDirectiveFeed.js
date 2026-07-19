import { useEffect, useRef, useState } from 'react';
import { evaluateDirectives } from '../utils/directiveRules';

/** Maximum number of directive entries retained in the feed log. */
const MAX_FEED_ENTRIES = 12;

/**
 * Builds a unique composite key for a directive instance based on message key and parameters.
 * @param {Object} directive - Directive object.
 * @returns {string} Composite identifier string.
 */
function buildEntryKey(directive) {
  return `${directive.messageKey}:${JSON.stringify(directive.messageParams)}`;
}

/**
 * Custom React hook that watches zone state and derives the current directive feed.
 * New directives are prepended with a timestamp; identical directives
 * already at the top of the feed are not duplicated on every tick.
 *
 * @param {Array<Object>} zones - Array of active stadium zone objects.
 * @returns {Array<Object>} List of active, timestamped directive entries.
 */
export function useDirectiveFeed(zones) {
  const [feed, setFeed] = useState([]);
  const lastKeysRef = useRef(new Set());

  useEffect(() => {
    const activeDirectives = evaluateDirectives(zones);
    const activeKeys = new Set(activeDirectives.map(buildEntryKey));

    const isSameAsLastTick =
      activeKeys.size === lastKeysRef.current.size &&
      Array.from(activeKeys).every((key) => lastKeysRef.current.has(key));

    if (isSameAsLastTick) return;
    lastKeysRef.current = activeKeys;

    const timestampedEntries = activeDirectives.map((directive) => ({
      ...directive,
      id: `${buildEntryKey(directive)}-${Date.now()}`,
      occurredAt: Date.now(),
    }));

    setFeed((previousFeed) => [...timestampedEntries, ...previousFeed].slice(0, MAX_FEED_ENTRIES));
  }, [zones]);

  return feed;
}
