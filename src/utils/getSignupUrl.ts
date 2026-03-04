export const getSignupUrl = (): string => {
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  const base = 'https://app.senvia.pt/?tab=signup';
  return fbclid ? `${base}&fbclid=${encodeURIComponent(fbclid)}` : base;
};
