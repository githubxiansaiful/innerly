export interface Palette {
  skyTop: string;
  skyMiddle: string;
  skyBottom: string;
  sunOrMoonGlow: string;
  horizonGlow: string;

  mountainFar: string;
  mountainMid: string;
  mountainNear: string;

  cloudMist: string;

  hillFar: string;
  hillMid: string;
  hillNear: string;

  grassBase: string;
  grassTip: string;
  flowerStem: string;
  flowerLeaf: string;

  sunflowerPetalOuter: string;
  sunflowerPetalInner: string;
  sunflowerPetalShadow: string;
  sunflowerCenterDark: string;
  sunflowerCenterRing: string;
  sunflowerCenterLight: string;
  sunflowerGlow: string;

  particleColor: string;
  particleGlow: string;
}

export const DAY_PALETTE: Palette = {
  skyTop: '#C8E4F8',        // soft daytime sky
  skyMiddle: '#E2F0FB',     // gentle atmospheric haze
  skyBottom: '#FFF5E4',     // warm golden horizon glow
  sunOrMoonGlow: 'rgba(255, 238, 190, 0.45)',
  horizonGlow: 'rgba(255, 225, 175, 0.35)',

  mountainFar: '#9EADC2',   // pale blue-grey distant peak
  mountainMid: '#7C8FA7',   // mid-distance ridge
  mountainNear: '#62768E',  // near mountain range

  cloudMist: 'rgba(255, 255, 255, 0.65)',

  hillFar: '#6F9D68',       // soft distant rolling green
  hillMid: '#54874E',       // mid rolling meadow
  hillNear: '#3C6F36',      // rich foreground hill

  grassBase: '#2E5A29',
  grassTip: '#7EB35D',
  flowerStem: '#3E6F33',
  flowerLeaf: '#4D8240',

  sunflowerPetalOuter: '#F8BE1F',
  sunflowerPetalInner: '#FFA705',
  sunflowerPetalShadow: '#D97A00',
  sunflowerCenterDark: '#2C1B10',
  sunflowerCenterRing: '#54361C',
  sunflowerCenterLight: '#7E532B',
  sunflowerGlow: 'rgba(255, 215, 80, 0.25)',

  particleColor: 'rgba(255, 248, 220, 0.7)',
  particleGlow: 'rgba(255, 230, 150, 0.3)',
};

export const NIGHT_PALETTE: Palette = {
  skyTop: '#060B18',        // deep navy midnight sky
  skyMiddle: '#0C162E',     // deep midnight blue
  skyBottom: '#182548',     // horizon blue-indigo glow
  sunOrMoonGlow: 'rgba(160, 195, 255, 0.25)',
  horizonGlow: 'rgba(75, 110, 175, 0.25)',

  mountainFar: '#121A2C',   // faint indigo mountain silhouette
  mountainMid: '#0D1424',   // mid silhouette
  mountainNear: '#090E1A',  // near mountain silhouette

  cloudMist: 'rgba(40, 60, 100, 0.22)',

  hillFar: '#152C22',       // deep dusky emerald hill
  hillMid: '#0F221B',       // dark twilight green
  hillNear: '#0A1813',      // midnight deep foliage

  grassBase: '#08140F',
  grassTip: '#1D3B2C',
  flowerStem: '#13281C',
  flowerLeaf: '#173323',

  sunflowerPetalOuter: '#C99324',
  sunflowerPetalInner: '#9C6E15',
  sunflowerPetalShadow: '#6E4907',
  sunflowerCenterDark: '#120B06',
  sunflowerCenterRing: '#26180C',
  sunflowerCenterLight: '#3D2614',
  sunflowerGlow: 'rgba(255, 195, 80, 0.35)',

  particleColor: 'rgba(255, 210, 120, 0.85)',
  particleGlow: 'rgba(255, 190, 80, 0.45)',
};
