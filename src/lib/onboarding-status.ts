// Session-scoped (not persisted across browser/tab restarts) — this is
// intentional: the "complete your profile" banner should reappear on the
// next real login, not just the next page refresh within the same login.

const ONBOARDING_COMPLETE_KEY = 'kredar_onboarding_complete';
const BANNER_DISMISSED_KEY = 'kredar_profile_banner_dismissed';

export function setOnboardingCompleteFlag(complete: boolean) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ONBOARDING_COMPLETE_KEY, complete ? 'true' : 'false');
  // Every fresh login clears any previous dismissal, so the banner
  // reappears next login even if it was dismissed last time.
  sessionStorage.removeItem(BANNER_DISMISSED_KEY);
}

export function isOnboardingComplete(): boolean {
  if (typeof window === 'undefined') return true;
  return sessionStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
}

export function isBannerDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  return sessionStorage.getItem(BANNER_DISMISSED_KEY) === 'true';
}

export function dismissBanner() {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true');
}
