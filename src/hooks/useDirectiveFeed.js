import { useEffect, useRef, useState } from 'react';
import { evaluateDirectives } from '../utils/directiveRules';

const MAX_FEED_ENTRIES = 12;

function buildEntryKey(directive) {
  return `${directive.messageKey}:${JSON.stringify(directive.messageParams)}`;
}

/**
 * Watches zone state and derives the current directive feed.
 * New directives are prepended with a timestamp; identical directives
 * already at the top of the feed are not duplicated on every tick.
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
