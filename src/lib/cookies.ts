/**
 * Centralized Client-side Cookie Store
 * Replaces localStorage for state persistence.
 */

export function setCookie(name: string, value: string, days?: number) {
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax${secure}`;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${secure}`;
}

// Token helpers
export const getToken = () => getCookie('kredar_token');
export const setToken = (token: string) => setCookie('kredar_token', token, 7);
export const clearToken = () => deleteCookie('kredar_token');

// User helpers
export const getCurrentUser = () => {
  const raw = getCookie('kredar_current_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
export const setCurrentUser = (user: any) => {
  setCookie('kredar_current_user', JSON.stringify(user), 7);
};
export const clearCurrentUser = () => deleteCookie('kredar_current_user');

// Registered email helpers (used in verify-email redirection flow)
export const getRegisteredEmail = () => getCookie('kredar_registered_email');
export const setRegisteredEmail = (email: string) => setCookie('kredar_registered_email', email, 1);
export const clearRegisteredEmail = () => deleteCookie('kredar_registered_email');

// Onboarding completion helpers
export const isOnboardingComplete = () => getCookie('kredar_onboarding_complete') === 'true';
export const setOnboardingComplete = (val: boolean) =>
  setCookie('kredar_onboarding_complete', val ? 'true' : 'false', 7);
export const clearOnboardingComplete = () => deleteCookie('kredar_onboarding_complete');

// Onboarding state draft helpers
export const getOnboardingDraft = (email?: string) => {
  const key = email ? `kredar_onboarding_state_${email}` : 'kredar_onboarding_state';
  const raw = getCookie(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
export const setOnboardingDraft = (data: any, email?: string) => {
  const key = email ? `kredar_onboarding_state_${email}` : 'kredar_onboarding_state';
  setCookie(key, JSON.stringify(data), 7);
};
export const clearOnboardingDraft = (email?: string) => {
  const key = email ? `kredar_onboarding_state_${email}` : 'kredar_onboarding_state';
  deleteCookie(key);
};

// Logout helper
export const clearAuthCookies = () => {
  clearToken();
  clearCurrentUser();
  clearOnboardingComplete();
  clearRegisteredEmail();
};
