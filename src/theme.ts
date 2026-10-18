export const C={
  bg:'#f4f1ee',
  surface:'#f7f4f0',
  surfaceSoft:'#eef2ee',
  ink:'#1d1d1f',
  muted:'#67756e',
  green:'#0e7a66',
  greenDark:'#0b5d4e',
  greenSoft:'#eaf6f0',
  lime:'#d5f0a9',
  card:'#ffffff',
  panel:'#f9f7f4',
  line:'#e8e1da',
  orange:'#f1b15e',
  red:'#c85d54',
  success:'#1b7f68',
  successSurface:'#edf9f3',
  successBorder:'#d8efe5',
  warning:'#9e6c1d',
  warningSurface:'#fff4de',
  danger:'#bf4c42',
  dangerSurface:'#fdeae8',
  disabled:'#a7afa7',
  inputPlaceholder:'#95a29b',
  onPrimary:'#fff',
  backdrop:'rgba(22,28,25,0.42)',
  shadow:'rgba(14,32,27,0.14)'
};

export const spacing={xs:4,sm:8,md:12,lg:16,xl:22,xxl:32};
export const radii={sm:10,md:14,lg:18,xl:22,xxl:26,pill:999};
export const typography={caption:11,body:14,subtitle:18,title:24};
export const fontWeights={regular:'400',medium:'500',semibold:'600',bold:'700'} as const;
export const iconSizes={sm:14,md:18,lg:24,xl:32};
export const imageRatios={category:1.5,banner:2.5,service:1.6};
export const touchTargets={minimum:44};
export const shadows={
  card:{shadowColor:C.shadow,shadowOffset:{width:0,height:3},shadowOpacity:0.08,shadowRadius:8,elevation:2},
  raised:{shadowColor:C.shadow,shadowOffset:{width:0,height:8},shadowOpacity:0.14,shadowRadius:16,elevation:4}
};
