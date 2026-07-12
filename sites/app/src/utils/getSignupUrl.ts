export const getAppUrl = (path: string): string => {
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  const url = new URL(path, 'https://app.senvia.pt');
  if (fbclid) url.searchParams.set('fbclid', fbclid);
  return url.toString();
};

export const getSignupUrl = (): string => {
  return getAppUrl('/?tab=signup');
};
