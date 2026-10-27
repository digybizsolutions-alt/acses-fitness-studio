const KEY = 'acses_utm';

export interface Utm {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

const empty: Utm = { utmSource: '', utmMedium: '', utmCampaign: '' };

/** Capture UTM params from the landing URL once per session so later page navigations keep attribution. */
export function captureUtm(): void {
  try {
    const p = new URLSearchParams(window.location.search);
    const utm: Utm = {
      utmSource: (p.get('utm_source') ?? '').slice(0, 100),
      utmMedium: (p.get('utm_medium') ?? '').slice(0, 100),
      utmCampaign: (p.get('utm_campaign') ?? '').slice(0, 100),
    };
    if (utm.utmSource || utm.utmMedium || utm.utmCampaign) sessionStorage.setItem(KEY, JSON.stringify(utm));
  } catch {
    /* storage unavailable — attribution is best-effort */
  }
}

export function getUtm(): Utm {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...empty, ...(JSON.parse(raw) as Partial<Utm>) } : empty;
  } catch {
    return empty;
  }
}
