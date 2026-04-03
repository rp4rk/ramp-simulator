import { hasTalent } from "lib/talents";

// Oracle Hero Talent: Twinsight - Penance fires extra bolts
// When healing, fires extra bolt at enemy; when damaging, fires extra bolt to heal allies
const TWINSIGHT_ID = 395021; // TODO: Replace with actual WoW talent ID

/**
 * Returns the extra tick count from Twinsight
 */
export const getTwinsightBonusTicks = (state: any): number => {
  return hasTalent(state, TWINSIGHT_ID) ? 1 : 0;
};
