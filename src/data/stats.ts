/**
 * The shape of a proof stat. Numeric stats animate with a count-up
 * (reduced-motion safe); non-numeric stats (value === null) render statically.
 */

export type Stat = {
  /** The number to count up to, or null for a non-numeric stat like "M.S." */
  value: number | null;
  /** Static display text for non-numeric stats. */
  display?: string;
  /** Optional prefix/suffix shown around the number, e.g. "+". */
  suffix?: string;
  label: string;
};
