export const C={
  bg:'#ffffff',
  surface:'#f7f7f7',
  surfaceSoft:'#f1f1f3',
  ink:'#202124',
  muted:'#6f7378',
  primary:'#6b35e8',
  primaryDark:'#5424c8',
  primarySoft:'#f0eaff',
  primaryBorder:'#d9cbff',
  selection:'#f0eaff',
  selectionBorder:'#c9b8ff',
  favorite:'#c85d54',
  star:'#e5a800',
  imagePlaceholder:'#f0f0f2',
  imageOverlay:'rgba(19,19,22,0.12)',
  imageLabel:'rgba(26,26,30,0.72)',
  priceLabel:'rgba(84,36,200,0.96)',
  elevatedSurface:'rgba(255,255,255,0.98)',
  card:'#ffffff',
  panel:'#ffffff',
  line:'#ececef',
  orange:'#f1b15e',
  red:'#c85d54',
  success:'#078b68',
  successSurface:'#edf7f3',
  successBorder:'#d9ebe4',
  warning:'#9e6c1d',
  warningSurface:'#fff4de',
  danger:'#bf4c42',
  dangerSurface:'#fdeae8',
  disabled:'#a1a3a8',
  inputPlaceholder:'#92959b',
  onPrimary:'#fff',
  backdrop:'rgba(22,22,26,0.42)',
  shadow:'rgba(24,24,28,0.10)'
};

export const spacing={xs:4,sm:8,md:12,lg:16,xl:22,xxl:32};
export const radii={sm:8,md:12,lg:16,xl:20,xxl:24,pill:999};
export const typography={caption:11,body:14,subtitle:18,title:24};
export const fontFamilies={ios:'System',android:'sans-serif',web:'system-ui'} as const;
export const fontWeights={regular:'400',medium:'500',semibold:'600',bold:'700'} as const;
export const iconSizes={sm:14,md:18,lg:24,xl:32};
export const imageRatios={category:1.5,banner:2.5,service:1.6};
export const touchTargets={minimum:44};
export const buttonSizes={primary:48,compact:40};
export const inputSizes={standard:48};
export const headerHeights={standard:56,compact:48};
export const navigationHeight=64;
export const shadows={
  card:{shadowColor:C.shadow,shadowOffset:{width:0,height:2},shadowOpacity:0.05,shadowRadius:6,elevation:1},
  raised:{shadowColor:C.shadow,shadowOffset:{width:0,height:4},shadowOpacity:0.08,shadowRadius:10,elevation:2}
};
