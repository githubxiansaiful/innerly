export interface Palette {
  skyTop: string;
  skyMiddle: string;
  skyHorizon: string;
  sunOrMoonGlow: string;
  horizonMistGlow: string;

  mountainFar: string;
  mountainMid: string;
  mountainNear: string;
  mountainHaze: string;

  cloudMist: string;

  hillFar: string;
  hillMid: string;
  hillNear: string;
  hillShadow: string;

  treeTrunk: string;
  treeFoliageLight: string;
  treeFoliageDark: string;
  treeShadow: string;

  grassBase: string;
  grassTip: string;
  grassTick: string;

  stemHighlight: string;
  stemBase: string;
  stemShadow: string;
  stemCastShadow: string;
  leafColor: string;

  sunflowerPetalOuter: string;
  sunflowerPetalInner: string;
  sunflowerPetalCrease: string;
  sunflowerCenterDark: string;
  sunflowerCenterRing: string;
  sunflowerCenterLight: string;
  sunflowerLanternGlow: string;

  particleColor: string;
  particleGlow: string;
  bokehWarm: string;
  bokehCool: string;
}

export const DAY_PALETTE: Palette = {
  // Day Sky based on Screenshot_2.png (pale pastel grey-blue fading to misty white horizon)
  skyTop: '#D6DEE5',
  skyMiddle: '#E7ECF0',
  skyHorizon: '#F2F5F8',
  sunOrMoonGlow: 'rgba(255, 255, 255, 0.4)',
  horizonMistGlow: 'rgba(235, 243, 248, 0.5)',

  // Mountains based on Screenshot_2.png (pale crystalline lavender-grey silhouettes)
  mountainFar: '#D2D9E0',
  mountainMid: '#B8C4D0',
  mountainNear: '#A3B2C0',
  mountainHaze: '#DDE4EB',

  cloudMist: 'rgba(255, 255, 255, 0.7)',

  // Hills based on Screenshot_2.png (vibrant pastel meadow greens)
  hillFar: '#A8D47C',
  hillMid: '#95C968',
  hillNear: '#82BE56',
  hillShadow: 'rgba(90, 145, 50, 0.25)',

  // Tree based on Screenshot_2.png
  treeTrunk: '#6F4E37',
  treeFoliageLight: '#72B562',
  treeFoliageDark: '#569947',
  treeShadow: 'rgba(80, 130, 50, 0.35)',

  grassBase: '#6AA842',
  grassTip: '#8BC34A',
  grassTick: '#5C9A36',

  // Stems with cylindrical 3D shading
  stemHighlight: '#68A858',
  stemBase: '#4E8A42',
  stemShadow: '#366E2D',
  stemCastShadow: 'rgba(60, 110, 40, 0.35)',
  leafColor: '#529642',

  // Petals based on Screenshot_2.png (golden yellow, crease texture, inner contrast)
  sunflowerPetalOuter: '#F8BA1C',
  sunflowerPetalInner: '#FFA705',
  sunflowerPetalCrease: '#D47A00',
  sunflowerCenterDark: '#3A1E0D',
  sunflowerCenterRing: '#623819',
  sunflowerCenterLight: '#8C5226',
  sunflowerLanternGlow: 'rgba(255, 220, 100, 0.2)',

  // Dandelion fluff / white pollen
  particleColor: 'rgba(255, 255, 255, 0.85)',
  particleGlow: 'rgba(255, 255, 255, 0.4)',
  bokehWarm: 'rgba(255, 230, 160, 0.3)',
  bokehCool: 'rgba(220, 245, 255, 0.3)',
};

export const NIGHT_PALETTE: Palette = {
  // Night Sky based on Screenshot_1.png (deep midnight navy to dusky teal-navy twilight)
  skyTop: '#040814',
  skyMiddle: '#122030',
  skyHorizon: '#23252E',
  sunOrMoonGlow: 'rgba(140, 185, 240, 0.15)',
  horizonMistGlow: 'rgba(215, 135, 55, 0.45)', // signature warm amber horizon underglow

  mountainFar: '#0C1320',
  mountainMid: '#090E18',
  mountainNear: '#060A12',
  mountainHaze: '#141E2E',

  cloudMist: 'rgba(25, 40, 65, 0.15)',

  // Hills in night mode (dark meadow silhouettes)
  hillFar: '#10221A',
  hillMid: '#0C1A14',
  hillNear: '#07100D',
  hillShadow: 'rgba(0, 0, 0, 0.4)',

  treeTrunk: '#13110E',
  treeFoliageLight: '#183020',
  treeFoliageDark: '#102216',
  treeShadow: 'rgba(0, 0, 0, 0.5)',

  grassBase: '#08140F',
  grassTip: '#1D3B2C',
  grassTick: '#152E20',

  stemHighlight: '#2A4A33',
  stemBase: '#1B3323',
  stemShadow: '#112217',
  stemCastShadow: 'rgba(0, 0, 0, 0.3)',
  leafColor: '#24452E',

  sunflowerPetalOuter: '#F5B014',
  sunflowerPetalInner: '#DE9608',
  sunflowerPetalCrease: '#8C5604',
  sunflowerCenterDark: '#1C1108',
  sunflowerCenterRing: '#3A2412',
  sunflowerCenterLight: '#593B20',
  sunflowerLanternGlow: 'rgba(255, 205, 80, 0.9)',

  particleColor: 'rgba(255, 210, 120, 0.85)',
  particleGlow: 'rgba(255, 180, 70, 0.5)',
  bokehWarm: 'rgba(245, 160, 50, 0.65)',
  bokehCool: 'rgba(170, 235, 210, 0.55)',
};
