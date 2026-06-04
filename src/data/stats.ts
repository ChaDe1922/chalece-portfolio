/**
 * Proof stats for the #proof section. Numeric stats animate with a count-up
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

export const stats: Stat[] = [
  { value: 30630, suffix: "+", label: "Learners reached" },
  { value: 7, label: "Published Coursera courses" },
  { value: 10, suffix: "+", label: "Years in learning and technology" },
  { value: null, display: "M.S.", label: "Music Technology, Georgia Tech" },
];
