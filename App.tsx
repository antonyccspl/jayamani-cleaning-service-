import React,{useEffect,useMemo,useState} from 'react';
import {Alert,Animated,BackHandler,Easing,Image,KeyboardAvoidingView,Modal,Platform,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View} from 'react-native';
import {NavigationContainer,useNavigation,useRoute} from '@react-navigation/native'; import {createNativeStackNavigator} from '@react-navigation/native-stack'; import {SafeAreaProvider,useSafeAreaInsets} from 'react-native-safe-area-context'; import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {MarketplaceProvider,useMarketplace} from './src/state/Marketplace'; import {Application,Booking,FieldKey,Service,ServiceConfiguration,ServicePackage} from './src/types'; import {customHomeRooms,quote} from './src/utils/pricing';
import {cleaningFAQs,mockPromotions,sampleReviews} from './src/data/customer-content'; import {serviceCategories,ServiceCategoryId} from './src/data/service-categories';
import {servicePhoto} from './src/data/service-images'; import {C,radii,spacing,typography} from './src/theme';
const Stack=createNativeStackNavigator();
const discoveryStyles=StyleSheet.create({
   topBar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.line,backgroundColor:C.bg,zIndex:3},
  brandLine:{flexDirection:'row',alignItems:'center',marginTop:4},
  locationButton:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#edf7ea',paddingHorizontal:14,paddingVertical:12,borderRadius:12,marginTop:12,borderWidth:1,borderColor:'#dfeede'},
  search:{backgroundColor:'#fff',borderWidth:1,borderColor:C.line,paddingHorizontal:15,paddingVertical:13,borderRadius:13,marginTop:12,color:C.ink},
  searchSuggestions:{backgroundColor:C.card,borderRadius:13,borderWidth:1,borderColor:C.line,marginTop:5,paddingHorizontal:10},
  searchSuggestion:{minHeight:56,flexDirection:'row',alignItems:'center',gap:10,paddingVertical:7,borderBottomWidth:1,borderColor:C.line},
  suggestionImage:{width:42,height:42,borderRadius:9,backgroundColor:'#e5eee5'},
  offerCard:{flexDirection:'row',alignItems:'center',backgroundColor:'#f2f7e9',borderWidth:1,borderColor:'#dfe9d4',borderRadius:15,padding:14,marginTop:12},
  hero:{backgroundColor:'#1a6c56',borderRadius:22,padding:20,marginTop:15,overflow:'hidden',borderWidth:1,borderColor:'#dfeee4',shadowColor:'#183e2f',shadowOffset:{width:0,height:8},shadowOpacity:0.18,shadowRadius:14,elevation:5},
  heroPhoto:{position:'absolute',top:0,right:0,bottom:0,left:0,width:'100%',height:'100%',opacity:0.55},
  heroPhotoOverlay:{position:'absolute',top:0,right:0,bottom:0,left:0,backgroundColor:'rgba(15,68,53,0.48)'},
  heroButton:{backgroundColor:C.lime,borderRadius:10,paddingHorizontal:13,paddingVertical:11,alignSelf:'flex-start',marginTop:16},
  sectionHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:22,marginBottom:10},
  categoryGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:8},
  categoryTile:{width:'48.5%',minHeight:82,flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'#fff',padding:10,borderWidth:1,borderColor:C.line,borderRadius:14,shadowColor:'#1a2e29',shadowOffset:{width:0,height:3},shadowOpacity:0.06,shadowRadius:8,elevation:2},
  categoryTileSelected:{borderColor:C.green,backgroundColor:'#edf7ea',shadowOpacity:0.12},
  categoryImage:{width:48,height:56,borderRadius:10,backgroundColor:'#e5eee5'},
  roomChoice:{backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line,overflow:'hidden',marginBottom:12},
  roomChoiceImage:{width:'100%',height:154,backgroundColor:'#e5eee5'},
  roomChoiceBody:{padding:14},
  roomChoicePrice:{backgroundColor:'#edf7ea',borderRadius:10,paddingHorizontal:10,paddingVertical:7,alignSelf:'flex-start',marginTop:8},
  bookingOptionGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:8,marginTop:7},
  bookingOption:{width:'48%',minHeight:66,justifyContent:'space-between',backgroundColor:'#fff',borderWidth:1,borderColor:C.line,borderRadius:11,padding:10},
  bookingOptionOn:{borderColor:C.green,backgroundColor:'#edf7ea'},
  roomOptionImage:{width:'100%',height:76,borderRadius:9,backgroundColor:'#e5eee5',marginBottom:10},
  roleLinks:{flexDirection:'row',justifyContent:'center',gap:24,paddingVertical:14,marginTop:12,borderTopWidth:1,borderColor:C.line},
   areaOption:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:13,borderBottomWidth:1,borderColor:C.line},
   cleanerRow:{flexDirection:'row',alignItems:'center',gap:10,paddingTop:12},
   cleanerAvatar:{width:36,height:36,borderRadius:18,backgroundColor:'#eaf6d7',alignItems:'center',justifyContent:'center'},
   areaSummary:{backgroundColor:'#edf7ea',padding:12,borderRadius:10,marginTop:12,borderWidth:1,borderColor:'#dfeede'},
   quoteSummary:{backgroundColor:'#edf7ea',padding:14,borderRadius:12,borderWidth:1,borderColor:'#dfeede',marginTop:14},
   bookingFooter:{position:'absolute',left:0,right:0,bottom:78,backgroundColor:C.bg,paddingHorizontal:20,paddingTop:10,paddingBottom:12,borderTopWidth:1,borderColor:C.line,zIndex:4},
   bookingFooterSummary:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:2},
   addPackageLink:{alignSelf:'center',paddingHorizontal:14,paddingVertical:10,marginTop:2},
   addonOption:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:C.card,padding:12,borderRadius:12,borderWidth:1,borderColor:C.line,marginBottom:7},
   addonSelected:{borderColor:C.green,backgroundColor:'#f1f7eb'},
   addonControl:{flexDirection:'row',alignItems:'center',gap:9},
   addonQuantityButton:{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center',backgroundColor:'#eaf2ec'},
   processStep:{flexDirection:'row',alignItems:'flex-start',marginVertical:7},
   processNumber:{width:22,height:22,borderRadius:11,backgroundColor:'#eaf6d7',alignItems:'center',justifyContent:'center',marginRight:10},
   configGroup:{backgroundColor:C.card,borderRadius:12,borderWidth:1,borderColor:C.line,marginBottom:8,overflow:'hidden'},
   configGroupHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:13},
   configGroupBody:{paddingHorizontal:13,paddingBottom:10,borderTopWidth:1,borderColor:C.line},
   serviceCardWrap:{position:'relative'},
   favoriteButton:{position:'absolute',top:20,right:12,width:34,height:34,borderRadius:17,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:2,borderWidth:1,borderColor:C.line},
   favoriteActive:{backgroundColor:'#fce9e6'},
   favoriteCount:{position:'absolute',right:-3,top:-3,minWidth:16,height:16,borderRadius:8,backgroundColor:C.red,alignItems:'center',justifyContent:'center',paddingHorizontal:3},
   authScreen:{flex:1,width:'100%',maxWidth:430,alignSelf:'center',backgroundColor:C.bg,paddingHorizontal:20},
   authTop:{height:72,alignItems:'flex-end',justifyContent:'center',borderBottomWidth:1,borderColor:C.line},
   skipButton:{borderWidth:1,borderColor:C.line,borderRadius:10,paddingHorizontal:18,paddingVertical:10,backgroundColor:C.card},
   authBody:{flex:1,minHeight:0},
   authBodyContent:{paddingTop:34,paddingBottom:20},
   phoneIcon:{width:54,height:54,borderRadius:16,backgroundColor:'#eaf6d7',alignItems:'center',justifyContent:'center',marginBottom:26},
   authCopy:{lineHeight:23,marginTop:8,marginBottom:20},
   phoneInput:{height:60,flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderRadius:12,overflow:'hidden'},
   countryCode:{height:'100%',width:92,flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderRightWidth:1,borderColor:C.line},
   authTextInput:{flex:1,height:'100%',paddingHorizontal:14,color:C.ink,fontSize:16},
   authOtpInput:{height:60,backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderRadius:12,paddingHorizontal:14,color:C.ink,fontSize:18},
   authBottom:{paddingTop:13,paddingBottom:22,borderTopWidth:1,borderColor:C.line},
   locationLoading:{alignItems:'center',justifyContent:'center',minHeight:310,flex:1}
});
const serviceCatalogStyles=StyleSheet.create({
   intro:{backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderRadius:radii.lg,padding:spacing.lg,marginTop:spacing.md},
   landingHero:{backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderRadius:radii.lg,overflow:'hidden',marginTop:spacing.md},
   landingImage:{width:'100%',height:150,backgroundColor:'#e5eee5'},
   landingCopy:{padding:spacing.md},
   categoryGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:10},
   categoryCard:{width:'48.5%',backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderRadius:radii.md,overflow:'hidden'},
   categoryImage:{width:'100%',height:92,backgroundColor:'#e5eee5'},
   categoryCopy:{padding:10,minHeight:88},
   categoryHeading:{fontSize:14,fontWeight:'700',color:C.ink},
   categoryCaption:{fontSize:11,color:C.muted,marginTop:4,lineHeight:15},
   popularCard:{backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderRadius:radii.md,overflow:'hidden',marginBottom:10},
   popularImage:{width:'100%',height:112,backgroundColor:'#e5eee5'},
   popularCopy:{padding:12},
   areaLabel:{fontSize:11,color:C.muted,marginTop:3},
   section:{marginTop:spacing.lg},
   search:{backgroundColor:C.card,borderWidth:1,borderColor:C.line,paddingHorizontal:spacing.md,paddingVertical:spacing.md,borderRadius:radii.md,marginTop:spacing.md,color:C.ink},
   filterRail:{maxHeight:48,marginTop:spacing.md},
   group:{marginTop:spacing.lg},
   groupTitle:{fontSize:typography.subtitle,fontWeight:'700',color:C.ink},
   groupCount:{fontSize:typography.caption,color:C.muted,marginTop:3},
   categoryBanner:{height:152,borderRadius:radii.lg,overflow:'hidden',marginTop:spacing.md,backgroundColor:'#1a6c56'},
   categoryBannerImage:{width:'100%',height:'100%',position:'absolute',opacity:0.48},
   categoryBannerShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(15,68,53,0.42)'},
   categoryBannerCopy:{flex:1,justifyContent:'flex-end',padding:16},
   listItem:{backgroundColor:C.card,borderWidth:1,borderColor:C.line,borderRadius:radii.md,overflow:'hidden',marginTop:12},
   listItemImage:{width:'100%',height:152,backgroundColor:'#e5eee5'},
   listItemBody:{padding:13}
});
const adminStyles=StyleSheet.create({
  content:{paddingHorizontal:16,paddingTop:12,paddingBottom:20},
  editorContent:{paddingHorizontal:16,paddingTop:10},
  search:{paddingVertical:10,marginTop:6},
  head:{padding:15,borderRadius:16},
  tabRail:{marginTop:9,maxHeight:43},
  sectionHeading:{marginTop:16,marginBottom:8},
  card:{padding:12,borderRadius:14,marginBottom:8},
  packageCard:{padding:11,borderRadius:13,marginBottom:7},
  editorHeading:{marginTop:15,marginBottom:7},
  editorFieldGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginTop:5},
  editorField:{width:'48.5%'},
  field:{marginBottom:8},
  fieldLabel:{fontSize:12,marginBottom:4},
  input:{paddingVertical:10,paddingHorizontal:12},
  categoryLabel:{fontSize:13,marginTop:3},
  packageTitle:{fontSize:13,lineHeight:18},
  serviceActions:{flexDirection:'row',alignItems:'center',gap:6,marginTop:9},
  compactChip:{paddingHorizontal:10,paddingVertical:7,marginRight:6,marginBottom:4},
  compactButton:{paddingHorizontal:10,paddingVertical:8,borderRadius:9,marginTop:0,alignSelf:'auto'},
  addLink:{paddingHorizontal:10,paddingVertical:8,marginTop:12},
  metric:{width:'48%',marginBottom:7,paddingVertical:9,minHeight:84},
  metricIcon:{width:24,height:24,borderRadius:8,marginBottom:4},
  revenue:{padding:13,borderRadius:15},
  rowText:{fontSize:14},
  meta:{fontSize:12,lineHeight:17},
  label:{fontSize:11,lineHeight:16}
});
const employeeStyles=StyleSheet.create({
  content:{paddingHorizontal:16,paddingTop:10},
  formGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginTop:4},
  formColumn:{width:'48.5%'},
  intro:{padding:13,borderRadius:14,marginBottom:12},
  introTitle:{fontSize:18,lineHeight:24},
  sectionHeading:{marginTop:13,marginBottom:7},
  field:{marginBottom:8},
  fieldLabel:{fontSize:12,marginBottom:4},
  input:{paddingVertical:10,paddingHorizontal:12},
  skillLabel:{fontSize:12,marginTop:3},
  skillWrap:{marginTop:5,marginBottom:2},
  compactCard:{padding:12,borderRadius:14,marginBottom:8},
  disclaimerTitle:{fontSize:12},
  disclaimer:{fontSize:11,lineHeight:16},
  consent:{paddingVertical:9},
  compactButton:{paddingVertical:10,borderRadius:10,marginTop:8},
  jobActions:{marginTop:4}
});
const shortWeekdays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const shortMonths=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function availableDays(service:Service){const base=new Date();base.setHours(0,0,0,0);return Array.from({length:15},(_,offset)=>{const value=new Date(base);value.setDate(base.getDate()+offset);return {offset,value,label:`${shortWeekdays[value.getDay()]}, ${value.getDate()} ${shortMonths[value.getMonth()]}`,day:value.getDate(),weekday:shortWeekdays[value.getDay()],month:shortMonths[value.getMonth()]}}).filter(day=>day.offset>=service.leadDays&&service.weekdays.includes(day.value.getDay())).slice(0,7)}
const money=(n:number)=>`₹${Math.round(n).toLocaleString('en-IN')}`;
function ServiceImage({id,style,resizeMode='cover',accessibilityLabel}:{
 id:string;
 style:React.ComponentProps<typeof Image>['style'];
 resizeMode?:React.ComponentProps<typeof Image>['resizeMode'];
 accessibilityLabel?:string;
}){
 const [imageId,setImageId]=useState(id);
 useEffect(()=>setImageId(id),[id]);
 return <Image source={servicePhoto(imageId)} style={style} resizeMode={resizeMode} accessibilityLabel={accessibilityLabel} onError={()=>setImageId('home')}/>;
}
const statusText=(status:string)=>({awaiting_assignment:'Finding a cleaner',awaiting_employee_acceptance:'Waiting for cleaner',assigned:'Cleaner accepted',en_route:'On the way',arrived:'Cleaner arrived',in_progress:'Cleaning in progress',completed:'Completed',cancelled:'Cancelled'} as Record<string,string>)[status]||status.replaceAll('_',' ');
const configurationSummary=(configuration?:ServiceConfiguration)=>configuration?[
 ...Object.entries(configuration.requirements).map(([key,value])=>`${fieldLabels[key as FieldKey]||key}: ${value}`),
 ...configuration.addons.map(addon=>`${addon.name}${addon.quantity>1?` × ${addon.quantity}`:''}`)
].join(' · '):'';
function Txt({children,size=15,color=C.ink,bold=false,style,...textProps}:any){return <Text {...textProps} style={[{fontSize:size,color,fontWeight:bold?'700':'400'},style]}>{children}</Text>}
function LocationPin({confirmed=false}:{confirmed?:boolean}){
  const pulse=React.useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    if(confirmed){pulse.stopAnimation();pulse.setValue(0);return}
    const animation=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:1000,easing:Easing.out(Easing.ease),useNativeDriver:false}),
      Animated.timing(pulse,{toValue:0,duration:0,useNativeDriver:false})
    ]));
    animation.start();
    return ()=>animation.stop();
  },[confirmed,pulse]);
  const scale=pulse.interpolate({inputRange:[0,1],outputRange:[0.85,1.35]});
  const opacity=pulse.interpolate({inputRange:[0,1],outputRange:[0.45,0]});
  return <View style={s.locationPinWrap} accessibilityLabel={confirmed?'Location confirmed':'Fetching location'}>
    {!confirmed&&<Animated.View style={[s.locationPulse,{transform:[{scale}],opacity}]}/>}
    <View style={[s.locationPinHead,confirmed&&s.locationPinConfirmed]}>{confirmed?<Txt size={17} color="#fff" bold>✓</Txt>:<View style={s.locationPinCenter}/>}</View>
    <View style={[s.locationPinStem,confirmed&&s.locationPinStemConfirmed]}/>
  </View>
}
function Btn({title,onPress,secondary=false,disabled=false,compact=false}:any){return <TouchableOpacity disabled={disabled} onPress={onPress} style={[s.btn,compact&&adminStyles.compactButton,secondary&&s.btnSecondary,disabled&&{opacity:.45}]}><Txt size={compact?12:15} color={secondary?C.green:'#fff'} bold>{title}</Txt></TouchableOpacity>}
function Chip({label,selected,onPress,disabled=false,compact=false}:any){return <TouchableOpacity disabled={disabled} onPress={onPress} style={[s.chip,compact&&adminStyles.compactChip,selected&&s.chipOn,disabled&&{opacity:.35}]}><Txt size={compact?11:13} color={selected?'#fff':C.ink} bold={selected}>{label}</Txt></TouchableOpacity>}
function Card({children,style}:any){return <View style={[s.card,style]}>{children}</View>}
function Heading({title,subtitle,compact=false,admin=false}:any){return <View style={compact?adminStyles.sectionHeading:admin?adminStyles.editorHeading:{marginTop:22,marginBottom:12}}><Txt size={compact?18:admin?17:21} bold>{title}</Txt>{subtitle&&<Txt size={compact||admin?12:15} color={C.muted} style={{marginTop:3}}>{subtitle}</Txt>}</View>}
function Field({label,value,onChangeText,placeholder,keyboardType,compact=false}:any){return <View style={compact?adminStyles.field:{marginBottom:12}}><Txt size={compact?12:13} bold style={compact?adminStyles.fieldLabel:{marginBottom:6}}>{label}</Txt><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder||label} placeholderTextColor="#9aa8a1" keyboardType={keyboardType} style={[s.input,compact&&adminStyles.input]}/></View>}
function FooterBar(){const navigation=useNavigation<any>();const route=useRoute<any>();const activeTab=route.name==='Bookings'||route.name==='Detail'?'Bookings':route.name==='Employee'?'Cleaner':route.name==='Admin'||route.name==='EditService'?'Admin':['Home','HomeServices','RoomCleaning','Service','Basket','Book'].includes(route.name)?'Home':null;const tabs=[{name:'Home',route:'Home',icon:'⌂'},{name:'Bookings',route:'Bookings',icon:'✓'},{name:'Cleaner',route:'Employee',icon:'✦'},{name:'Admin',route:'Admin',icon:'◌'}];return <View style={[s.footerBar,{position:'relative',left:0,right:0,bottom:0,marginHorizontal:12,marginBottom:10,flexShrink:0}]}>{tabs.map(tab=>{const selected=activeTab===tab.name;return <TouchableOpacity key={tab.name} style={[s.footerItem,selected&&{backgroundColor:'#eaf6d7',borderRadius:12}]} onPress={()=>navigation.navigate(tab.route)} accessibilityRole="button" accessibilityState={{selected}}><Txt size={12} color={selected?C.green:C.muted} bold>{tab.icon}</Txt><Txt size={10} color={selected?C.green:C.muted} bold>{tab.name}</Txt></TouchableOpacity>})}</View>}
function Screen({children,footer,scrollRef,contentStyle,stickyHeader=true,bottomSpace}:any){return <KeyboardAvoidingView style={{flex:1,backgroundColor:C.bg}} behavior={Platform.OS==='ios'?'padding':undefined}><View style={{flex:1}}><ScrollView ref={scrollRef} style={{flex:1}} stickyHeaderIndices={stickyHeader?[0]:[]} contentContainerStyle={[s.content,contentStyle,{paddingBottom:bottomSpace??(footer?230:100)}]} keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS==='ios'?'interactive':'on-drag'} nestedScrollEnabled showsVerticalScrollIndicator={false}>{children}</ScrollView>{footer}<FooterBar/></View></KeyboardAvoidingView>}
function Header({title,back,compact=false}:any){return <View style={[s.header,{backgroundColor:C.bg,paddingVertical:compact?8:10,borderBottomWidth:1,borderBottomColor:C.line}]}><Txt size={compact?20:23} bold>{title}</Txt>{back&&<TouchableOpacity onPress={back}><Txt size={compact?13:15} color={C.green} bold>← Back</Txt></TouchableOpacity>}</View>}
function Root(){return <View style={s.appShell}><NavigationContainer><Stack.Navigator screenOptions={{headerShown:false,contentStyle:{backgroundColor:C.bg},animation:'slide_from_right'}}><Stack.Screen name="Home" component={Home}/><Stack.Screen name="HomeServices" component={HomeServicesPage}/><Stack.Screen name="CleaningCategory" component={CleaningCategoryPage}/><Stack.Screen name="RoomCleaning" component={RoomCleaningPage}/><Stack.Screen name="Service" component={ServicePage}/><Stack.Screen name="Basket" component={BasketPage}/><Stack.Screen name="Book" component={BookingFlow}/><Stack.Screen name="Bookings" component={BookingsPage}/><Stack.Screen name="Detail" component={BookingDetail}/><Stack.Screen name="Employee" component={EmployeePage}/><Stack.Screen name="Admin" component={AdminGate}/><Stack.Screen name="EditService" component={ServiceEditor}/></Stack.Navigator></NavigationContainer></View>}
export default function App(){
  useEffect(()=>{
    if (Platform.OS === 'web') {
      const previousBodyBg = document.body.style.backgroundColor;
      const previousBodyMargin = document.body.style.margin;
      const previousBodyOverflow = document.body.style.overflow;
      document.body.style.backgroundColor = '#dfe7dc';
      document.body.style.margin = '0';
      document.body.style.overflow = 'hidden';
      return ()=>{
        document.body.style.backgroundColor = previousBodyBg;
        document.body.style.margin = previousBodyMargin;
        document.body.style.overflow = previousBodyOverflow;
      };
    }
    return undefined;
  }, []);
  return <SafeAreaProvider><MarketplaceProvider><View style={s.pageWrap}><ExpoStatusBar style="dark"/><Root/></View></MarketplaceProvider></SafeAreaProvider>
}

function Home({navigation}:any){const {services,user,setUser}=useMarketplace();const [search,setSearch]=useState('');const [filter,setFilter]=useState('All');const [showLogin,setShowLogin]=useState(true);const [step,setStep]=useState<'phone'|'otp'|'done'>('phone');const [phone,setPhone]=useState('');const [otp,setOtp]=useState('');const [name,setName]=useState('');const shown=services.filter(x=>x.active&&!x.paused&&(filter==='All'||x.category===filter)&&x.name.toLowerCase().includes(search.toLowerCase()));
function HomeDiscovery({navigation}:any){
  const {services,user,setUser,cart}=useMarketplace();
  const insets=useSafeAreaInsets();
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('All');
  const [favoriteIds,setFavoriteIds]=useState<string[]>([]);
  const [area,setArea]=useState('Adyar');
  const [showAreaPicker,setShowAreaPicker]=useState(false);
  const [locationStep,setLocationStep]=useState<'choose'|'fetching'|'confirm'>('choose');
  const [detectedArea,setDetectedArea]=useState('Adyar');
  const [showLogin,setShowLogin]=useState(false);
  const [step,setStep]=useState<'phone'|'otp'>('phone');
  const [phone,setPhone]=useState('');
  const [otp,setOtp]=useState('');
  const [name,setName]=useState('');
  const scrollRef=React.useRef<ScrollView|null>(null);
  const serviceListOffset=React.useRef(0);
  const areas=['Adyar','Anna Nagar','T. Nagar','Velachery','Nungambakkam','Tambaram'];
  const categories=['Home','Room','Fabric','Specialty'];
  useEffect(()=>{if(locationStep!=='fetching')return;const timer=setTimeout(()=>setLocationStep('confirm'),1400);return()=>clearTimeout(timer)},[locationStep]);
  const query=search.trim().toLowerCase();
  const shown=services.filter(service=>service.active&&!service.paused&&(filter==='Favorites'?favoriteIds.includes(service.id):filter==='All'||service.category===filter)&&(!query||[service.name,service.category,service.description,...service.addons.map(addon=>addon.name)].some(value=>value.toLowerCase().includes(query))));
  const proceed=()=>{if(!/^\d{10}$/.test(phone)){Alert.alert('Check your number','Enter a 10-digit demo phone number.');return}setStep('otp')};
  const openAreaAfterAuth=()=>{setShowLogin(false);setTimeout(()=>setShowAreaPicker(true),350)};
  const skipAuth=()=>openAreaAfterAuth();
  const verify=()=>{if(!/^\d{6}$/.test(otp)){Alert.alert('Enter six digits');return}setUser({name:name||'Demo customer',phone});openAreaAfterAuth()};
  const openService=(service:Service)=>navigation.navigate('Service',{service,area});
  const browseServices=(category='All')=>{setFilter(category);setSearch('');requestAnimationFrame(()=>scrollRef.current?.scrollTo({y:serviceListOffset.current,animated:true}))};
  const toggleFavorite=(id:string)=>setFavoriteIds(current=>current.includes(id)?current.filter(favoriteId=>favoriteId!==id):[...current,id]);
  const renderServiceCard=(service:Service,featured=false)=><View key={service.id} style={[discoveryStyles.serviceCardWrap,!featured&&s.serviceGridItem]}><TouchableOpacity onPress={()=>openService(service)}><ServiceCard service={service} featured={featured}/></TouchableOpacity><TouchableOpacity style={discoveryStyles.favoriteButton} onPress={()=>toggleFavorite(service.id)} accessibilityRole="button" accessibilityState={{selected:favoriteIds.includes(service.id)}} accessibilityLabel={`${favoriteIds.includes(service.id)?'Remove from':'Add to'} favorites: ${service.name}`}><Txt size={20} color={favoriteIds.includes(service.id)?C.red:C.green} bold>{favoriteIds.includes(service.id)?'♥':'♡'}</Txt></TouchableOpacity></View>;
  return <>
    <Screen scrollRef={scrollRef}>
      <View style={discoveryStyles.topBar}>
        <View><Txt size={11} color={C.muted} style={{letterSpacing:1.2}}>YOUR HOME, A LITTLE LIGHTER</Txt><View style={discoveryStyles.brandLine}><Txt size={28} bold>Tidyday</Txt><View style={s.brandBadge}><Txt size={12} color={C.green} bold>✦</Txt></View></View></View>
        <View style={{flexDirection:'row',gap:9}}>
          <TouchableOpacity onPress={()=>navigation.navigate('Basket')} style={[s.avatar,s.basketAvatar]} accessibilityRole="button" accessibilityLabel={`Open basket, ${cart.reduce((total,item)=>total+item.quantity,0)} items`}><Txt size={18} color={C.green} bold>▣</Txt>{cart.length>0&&<View style={s.basketCount}><Txt size={9} color="#fff" bold>{cart.reduce((total,item)=>total+item.quantity,0)}</Txt></View>}</TouchableOpacity>
          <TouchableOpacity onPress={()=>setFilter(filter==='Favorites'?'All':'Favorites')} style={[s.avatar,filter==='Favorites'&&discoveryStyles.favoriteActive]} accessibilityRole="button" accessibilityState={{selected:filter==='Favorites'}} accessibilityLabel={filter==='Favorites'?'Show all cleaning services':'Show favorite services'}><Txt size={19} color={favoriteIds.length?C.red:C.green} bold>{favoriteIds.length?'♥':'♡'}</Txt>{favoriteIds.length>0&&<View style={discoveryStyles.favoriteCount}><Txt size={9} color="#fff" bold>{favoriteIds.length}</Txt></View>}</TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={discoveryStyles.locationButton} onPress={()=>setShowAreaPicker(true)} accessibilityRole="button">
        <View><Txt size={11} color={C.muted} bold>DEMO SERVICE AREA · CHENNAI</Txt><Txt color={C.green} bold style={{marginTop:3}}>⌖  {area}  ▾</Txt></View><Txt size={12} color={C.muted}>Change</Txt>
      </TouchableOpacity>
      <TextInput value={search} onChangeText={setSearch} placeholder="Search home cleaning" placeholderTextColor="#87958e" style={discoveryStyles.search} accessibilityLabel="Search cleaning services" />
      {!!query&&shown.length>0&&<View style={discoveryStyles.searchSuggestions}>{shown.slice(0,3).map(service=><TouchableOpacity key={service.id} onPress={()=>openService(service)} style={discoveryStyles.searchSuggestion} accessibilityRole="button"><ServiceImage id={service.id} style={discoveryStyles.suggestionImage} accessibilityLabel=""/><View style={{flex:1}}><Txt size={13} bold>{service.name}</Txt><Txt size={11} color={C.muted}>From {money(service.price)} · See details</Txt></View><Txt color={C.green}>›</Txt></TouchableOpacity>)}</View>}
      <View style={discoveryStyles.hero}>
        <ServiceImage id="floor" style={discoveryStyles.heroPhoto} accessibilityLabel="Professional floor cleaning at home" />
        <View pointerEvents="none" style={discoveryStyles.heroPhotoOverlay}/>
        <Txt size={11} color="#daefad" bold>THOUGHTFUL HOME CARE</Txt>
        <Txt size={25} color="#fff" bold style={{marginTop:8}}>A fresher home,{ '\n'}room by room.</Txt>
        <Txt color="#e5efe9" style={{marginTop:8}}>Reliable cleaning, shaped around your space.</Txt>
        <TouchableOpacity onPress={()=>navigation.navigate('HomeServices',{area})} style={discoveryStyles.heroButton}><Txt color={C.ink} bold>Explore home cleaning  →</Txt></TouchableOpacity>
      </View>
      <View style={discoveryStyles.offerCard}><View style={{flex:1}}><Txt size={10} color={C.green} bold>SAMPLE DEMO OFFER · {mockPromotions[0].code}</Txt><Txt size={16} bold style={{marginTop:4}}>{mockPromotions[0].title}</Txt><Txt size={12} color={C.muted} style={{marginTop:3}}>{mockPromotions[0].description} · not a live discount</Txt></View><Txt size={21} color={C.green} bold>✦</Txt></View>
      <View style={discoveryStyles.sectionHeading}><View><Txt size={20} bold>Browse cleaning</Txt><Txt size={13} color={C.muted} style={{marginTop:4}}>Services for every corner of home</Txt></View><TouchableOpacity onPress={()=>navigation.navigate('HomeServices',{area})} accessibilityRole="button"><Txt size={13} color={C.green} bold>All services</Txt></TouchableOpacity></View>
      <View style={discoveryStyles.categoryGrid}>{categories.map(category=>{
        const count=services.filter(service=>service.active&&!service.paused&&(category==='Home'||service.category===category)).length;
        const imageId=category==='Home'?'home':category==='Room'?'bath':category==='Fabric'?'sofa':'tank';
        return <TouchableOpacity key={category} style={[discoveryStyles.categoryTile,filter===category&&discoveryStyles.categoryTileSelected]} onPress={()=>category==='Home'?navigation.navigate('HomeServices',{area}):category==='Room'?navigation.navigate('RoomCleaning',{area}):navigation.navigate('CleaningCategory',{categoryId:category==='Fabric'?'fabric':'specialty',area})} accessibilityRole="button" accessibilityState={{selected:filter===category}}>
          <ServiceImage id={imageId} style={discoveryStyles.categoryImage} accessibilityLabel={`${category} cleaning`} />
          <View style={{flex:1}}><Txt size={14} bold>{category==='Home'?'Home services':category==='Room'?'Room cleaning':category==='Fabric'?'Fabric care':'Specialty care'}</Txt><Txt size={11} color={C.muted} style={{marginTop:3}}>{count} services</Txt></View><Txt color={C.muted}>&gt;</Txt>
        </TouchableOpacity>})}</View>
      <Card style={s.promiseStrip}><View style={s.promiseItem}><Txt color={C.green} bold>✓  Trained demo team</Txt></View><View style={s.promiseItem}><Txt color={C.green} bold>✓  Clear estimates</Txt></View><View style={s.promiseItem}><Txt color={C.green} bold>✓  Support on every visit</Txt></View></Card>
      <View onLayout={event=>{serviceListOffset.current=event.nativeEvent.layout.y}}><View style={discoveryStyles.sectionHeading}><View><Txt size={20} bold>{search?'Search results':filter==='Favorites'?'Favorite cleaning':filter==='All'?'Popular cleaning':'Popular '+filter.toLowerCase()}</Txt><Txt size={13} color={C.muted} style={{marginTop:4}}>{filter==='Favorites'?`${shown.length} saved services`:`${shown.length} services · illustrative demo pricing`}</Txt></View></View>
      {shown.length>0?renderServiceCard(shown[0],true):<><Empty text={filter==='Favorites'?'No favorites yet. Tap a heart on a service to save it.':'No cleaning services match your search.'}/>{filter!=='Favorites'&&<Btn title="Clear search and browse all" secondary onPress={()=>{setSearch('');setFilter('All')}}/>}</>}
      <View style={s.serviceGrid}>{shown.slice(1).map(service=>renderServiceCard(service))}</View>
      </View>
      <View style={discoveryStyles.roleLinks}><TouchableOpacity onPress={()=>navigation.navigate('Employee')}><Txt size={12} color={C.green} bold>Cleaner portal</Txt></TouchableOpacity><TouchableOpacity onPress={()=>navigation.navigate('Admin')}><Txt size={12} color={C.green} bold>Admin studio</Txt></TouchableOpacity></View>
    </Screen>
    <Modal visible={showAreaPicker} transparent animationType="slide" onRequestClose={()=>{setShowAreaPicker(false);setLocationStep('choose')}}><View style={s.scrim}><View style={[s.sheet,(locationStep==='fetching'||locationStep==='confirm')&&s.locationSheet]}><View style={s.grabber}/>{locationStep==='fetching'?<View style={discoveryStyles.locationLoading}><LocationPin/><Txt size={16} bold style={{marginTop:28}}>Fetching your location...</Txt><Txt size={13} color={C.muted} style={{marginTop:7,textAlign:'center'}}>Finding the nearest service area</Txt><Txt size={11} color={C.muted} style={{marginTop:12}}>Demo only · no location permission requested.</Txt></View>:locationStep==='confirm'?<View style={s.locationConfirm}><LocationPin confirmed/><Txt size={13} color={C.green} bold style={{marginTop:22}}>DELIVERING SERVICE AT</Txt><Txt size={27} bold style={{marginTop:8,textAlign:'center'}}>{detectedArea}</Txt><Txt color={C.muted} style={{marginTop:8,textAlign:'center'}}>{detectedArea}, Chennai, Tamil Nadu · demo area</Txt><Btn title={`Confirm ${detectedArea}`} onPress={()=>{setArea(detectedArea);setShowAreaPicker(false);setLocationStep('choose')}}/><TouchableOpacity onPress={()=>setLocationStep('choose')} style={{padding:12,alignItems:'center'}}><Txt color={C.green} bold>Choose a different area</Txt></TouchableOpacity></View>:<><Txt size={22} bold>Choose your area</Txt><Txt color={C.muted} style={{marginTop:6,marginBottom:12}}>Select an area for this Chennai demo.</Txt><TouchableOpacity style={discoveryStyles.locationButton} onPress={()=>{setDetectedArea(area);setLocationStep('fetching')}}><View><Txt color={C.green} bold>⌖  Use current location</Txt><Txt size={11} color={C.muted} style={{marginTop:3}}>Simulated · no GPS permission</Txt></View><Txt color={C.green}>&gt;</Txt></TouchableOpacity>{areas.map(option=><TouchableOpacity key={option} style={discoveryStyles.areaOption} onPress={()=>{setDetectedArea(option);setLocationStep('confirm')}}><Txt color={option===area?C.green:C.ink} bold={option===area}>{option}</Txt><Txt color={option===area?C.green:C.muted}>{option===area?'Current':'>'}</Txt></TouchableOpacity>)}<TouchableOpacity onPress={()=>{setShowAreaPicker(false);setLocationStep('choose')}} style={{padding:12,alignItems:'center'}}><Txt color={C.green} bold>Browse without changing area</Txt></TouchableOpacity></>}</View></View></Modal>
    <Modal visible={showLogin&&!user} animationType="slide" onRequestClose={()=>setShowLogin(false)}>
      <KeyboardAvoidingView style={[discoveryStyles.authScreen,{paddingTop:insets.top+12,paddingBottom:insets.bottom+12}]} behavior={Platform.OS==='ios'?'padding':undefined}>
        <View style={discoveryStyles.authTop}><TouchableOpacity onPress={skipAuth} style={discoveryStyles.skipButton}><Txt color={C.ink} bold>Skip</Txt></TouchableOpacity></View>
        <ScrollView style={discoveryStyles.authBody} contentContainerStyle={discoveryStyles.authBodyContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={discoveryStyles.phoneIcon}><Txt size={29} color={C.green} bold>☎</Txt></View>
          <Txt size={25} bold>{step==='phone'?'Enter your phone number':'Enter verification code'}</Txt>
          <Txt color={C.muted} size={16} style={discoveryStyles.authCopy}>{step==='phone'?'We’ll prepare a demo verification code. No SMS will be sent.':'Enter any six digits to continue. This verification is simulated.'}</Txt>
          {step==='phone'?<View style={discoveryStyles.phoneInput}><View style={discoveryStyles.countryCode}><Txt color={C.ink} bold>+91</Txt><Txt color={C.muted}>⌄</Txt></View><TextInput value={phone} onChangeText={value=>setPhone(value.replace(/\D/g,'').slice(0,10))} placeholder="Enter phone number" placeholderTextColor="#9aa8a1" keyboardType="phone-pad" style={discoveryStyles.authTextInput} accessibilityLabel="Enter phone number" /></View>:<TextInput value={otp} onChangeText={value=>setOtp(value.replace(/\D/g,'').slice(0,6))} placeholder="Six-digit demo code" placeholderTextColor="#9aa8a1" keyboardType="number-pad" style={discoveryStyles.authOtpInput} accessibilityLabel="Enter six-digit demo code" />}
          {step==='otp'&&<TouchableOpacity onPress={()=>{setStep('phone');setOtp('')}} style={{marginTop:14}}><Txt color={C.green} bold>Edit phone number</Txt></TouchableOpacity>}
        </ScrollView>
        <View style={discoveryStyles.authBottom}>
          <Txt size={12} color={C.muted} style={{textAlign:'center',marginBottom:12}}>{step==='phone'?'By continuing, you agree to use this local demo. No real account or message is created.':'Demo sign-in only · your profile stays in memory until the app restarts.'}</Txt>
          <Btn title={step==='phone'?'Continue':'Verify and continue'} disabled={step==='phone'?phone.length!==10:otp.length!==6} onPress={step==='phone'?proceed:verify}/>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  </>
}
 return HomeDiscovery({navigation});
 const proceed=()=>{if(!/^\d{10}$/.test(phone)){Alert.alert('Check your number','Enter a 10-digit demo phone number.');return}setStep('otp')};
 return <><Screen><View style={[s.homeTop,{backgroundColor:C.bg,paddingVertical:12,marginTop:-8,borderBottomWidth:1,borderBottomColor:C.line}]}><View><Txt size={11} color={C.muted} style={{letterSpacing:1.2}}>{'YOUR HOME, A LITTLE LIGHTER'.toUpperCase()}</Txt><View style={{flexDirection:'row',alignItems:'center',marginTop:4}}><Txt size={28} bold>Tidyday</Txt><View style={s.brandBadge}><Txt size={12} color={C.green} bold>✦</Txt></View></View></View><TouchableOpacity onPress={()=>navigation.navigate('Bookings')} style={s.avatar}><Txt bold color={C.green}>{user?'●':'♡'}</Txt></TouchableOpacity></View><View style={s.premiumLocation}><Txt color={C.green}>⌖ Chennai, Tamil Nadu</Txt></View><View style={s.roleDock}><TouchableOpacity onPress={()=>navigation.navigate('Employee')} style={s.roleDockItem}><Txt size={13}>✦</Txt><Txt size={12} color={C.green} bold>Cleaner portal</Txt></TouchableOpacity><TouchableOpacity onPress={()=>navigation.navigate('Admin')} style={s.roleDockItem}><Txt size={13}>◌</Txt><Txt size={12} color={C.green} bold>Admin studio</Txt></TouchableOpacity></View><TouchableOpacity style={s.location}><Txt color={C.green}>⌖  Chennai, Tamil Nadu  ▾</Txt></TouchableOpacity><TextInput value={search} onChangeText={setSearch} placeholder="What would you like cleaned?" style={s.search}/><View style={s.hero}><Txt size={12} color="#daefad" bold>THE TIDYDAY EDIT</Txt><Txt size={25} color="#fff" bold style={{marginTop:8}}>Make room for{ '\n'}a slower Sunday.</Txt><Txt color="#e5efe9" style={{marginTop:8}}>A thoughtful clean, right on schedule.</Txt><TouchableOpacity onPress={()=>navigation.navigate('Service',{service:services[0]})} style={s.heroBtn}><Txt color={C.ink} bold>Explore home cleaning  →</Txt></TouchableOpacity></View><View style={s.rowBetween}><Heading title="Cleaning, your way"/><TouchableOpacity onPress={()=>navigation.navigate('Bookings')}><Txt color={C.green} bold>My bookings</Txt></TouchableOpacity></View><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight:42}}>{['All','Home','Room','Specialty','Fabric'].map(c=><Chip key={c} label={c} selected={filter===c} onPress={()=>setFilter(c)}/>)}</ScrollView><Heading title="Popular near you" subtitle={`${shown.length} services · illustrative demo prices`}/>{shown.length>0&&<TouchableOpacity onPress={()=>navigation.navigate('Service',{service:shown[0]})}><ServiceCard service={shown[0]} featured/></TouchableOpacity>}<View style={s.serviceGrid}>{shown.slice(1).map(service=><TouchableOpacity key={service.id} style={s.serviceGridItem} onPress={()=>navigation.navigate('Service',{service})}><ServiceCard service={service}/></TouchableOpacity>)}</View>{!shown.length&&<Empty text="No services match your search."/>}</Screen>
 <Modal visible={showLogin&&!user} animationType="slide" transparent onRequestClose={()=>setShowLogin(false)}><View style={s.scrim}><View style={s.sheet}><View style={s.grabber}/><Txt size={24} bold>{step==='done'?'You’re all set':step==='otp'?'Verify your number':'A cleaner home starts here'}</Txt><Txt color={C.muted} style={{marginTop:7,marginBottom:18}}>{step==='otp'?'Demo only · no message will be sent. Enter any six digits.':step==='done'?'Your demo profile is ready. Explore at your own pace.':'Sign in to keep your bookings together.'}</Txt>{step==='phone'&&<><Field label="Mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/><Btn title="Continue with phone" onPress={proceed}/></>}{step==='otp'&&<><Field label="Six-digit demo OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad"/><Btn title="Verify demo code" onPress={()=>{if(!/^\d{6}$/.test(otp)){Alert.alert('Enter six digits');return}setUser({name:name||'Demo customer',phone});setStep('done')}}/></>}{step==='done'&&<Btn title="Start exploring" onPress={()=>setShowLogin(false)}/>}<TouchableOpacity style={{padding:12,alignItems:'center'}} onPress={()=>setShowLogin(false)}><Txt color={C.green} bold>Skip and explore</Txt></TouchableOpacity><View style={s.rowBetween}><TouchableOpacity onPress={()=>{setShowLogin(false);navigation.navigate('Employee')}}><Txt color={C.muted}>Employee access</Txt></TouchableOpacity><TouchableOpacity onPress={()=>{setShowLogin(false);navigation.navigate('Admin')}}><Txt color={C.muted}>Admin access</Txt></TouchableOpacity></View></View></View></Modal></>}
function ServiceCard({service,featured=false}:any){
  const cardStyle:any = featured ? {
    backgroundColor:'#fff',
    borderRadius:24,
    borderWidth:1,
    borderColor:'#e7eee6',
    overflow:'hidden' as const,
    shadowColor:'#153f32',
    shadowOffset:{width:0,height:8},
    shadowOpacity:0.12,
    shadowRadius:18,
    elevation:5,
  } : {
    backgroundColor:'#fff',
    height:300,
    borderRadius:18,
    borderWidth:1,
    borderColor:'#e9efe8',
    overflow:'hidden' as const,
    shadowColor:'#153f32',
    shadowOffset:{width:0,height:4},
    shadowOpacity:0.06,
    shadowRadius:10,
    elevation:3,
  };
  const imageStyle:any = featured ? {width:'100%',height:210,resizeMode:'cover' as const} : {width:'100%',height:150,resizeMode:'cover' as const};
  return <View style={[cardStyle]}>
    <View style={{position:'relative'}}>
      <ServiceImage id={service.id} style={imageStyle} accessibilityLabel={`${service.name} sample service photo`}/>
      <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(11,35,27,0.15)'}}/>
      <View style={{position:'absolute',top:12,left:12,paddingHorizontal:9,paddingVertical:6,borderRadius:999,backgroundColor:'rgba(11,35,27,0.45)',borderWidth:1,borderColor:'rgba(255,255,255,0.22)'}}>
        <Txt size={10} color="#fff" bold>{service.category.toUpperCase()}</Txt>
      </View>
      <View style={{position:'absolute',right:12,top:12,paddingHorizontal:10,paddingVertical:7,borderRadius:12,backgroundColor:'rgba(18,98,75,0.9)'}}><Txt color="#fff" bold>{money(service.price)}+</Txt></View>
    </View>
    <View style={{padding:14,flex:featured?0:1,height:featured?undefined:148,justifyContent:featured?'flex-start':'space-between'}}>
      <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',gap:8}}>
        <Txt size={featured?19:15} bold style={{flex:1,minHeight:featured?0:36,height:featured?undefined:36,lineHeight:featured?undefined:18}} numberOfLines={2}>{service.name}</Txt>
      </View>
      <Txt size={12} color={C.muted} style={{marginTop:7,lineHeight:18,height:featured?undefined:36}} numberOfLines={2}>{service.description}</Txt>
      <View style={{marginTop:featured?12:'auto',paddingTop:featured?0:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <Txt size={11} color={C.muted}>◷ {Math.round(service.duration/60)}h {service.duration%60?`${service.duration%60}m`:''}</Txt>
        <Txt size={11} color={C.green} bold>View details →</Txt>
      </View>
    </View>
  </View>
}
function emoji(category:string){return category==='Home'?'⌂':category==='Room'?'◈':category==='Fabric'?'▧':'◉'}
function HomeServicesPage({route,navigation}:any){
 const {services}=useMarketplace();
 const [query,setQuery]=useState('');
 const area=route.params?.area||'Adyar';
 const activeServices=services.filter(service=>service.active&&!service.paused);
 const normalizedQuery=query.trim().toLowerCase();
 const shown=activeServices.filter(service=>!normalizedQuery||[service.name,service.category,service.description,...service.addons.map(addon=>addon.name)].some(value=>value.toLowerCase().includes(normalizedQuery)));
 const openCategory=(categoryId:ServiceCategoryId)=>navigation.navigate('CleaningCategory',{categoryId,area});
 const openService=(service:Service)=>navigation.navigate('Service',{service,area});
 const popularIds=['bath','kitchen','home','sofa'];
 const popular=popularIds.map(id=>activeServices.find(service=>service.id===id)).filter((service):service is Service=>Boolean(service));
 return <Screen>
  <Header title="Cleaning services" back={()=>navigation.goBack()}/>
  {!normalizedQuery?<>
   <View style={serviceCatalogStyles.landingHero}>
    <ServiceImage id="home" style={serviceCatalogStyles.landingImage} accessibilityLabel="Bright home interior"/>
    <View style={serviceCatalogStyles.landingCopy}><Txt size={11} color={C.green} bold>HOME CLEANING & CARE</Txt><Txt size={23} bold style={{marginTop:5}}>A clean for every corner</Txt><Txt size={13} color={C.muted} style={{marginTop:5}}>Choose an area, compare what's included and see your estimate before booking.</Txt></View>
   </View>
  </>:null}
  <TextInput value={query} onChangeText={setQuery} placeholder="Search services, rooms or extras" placeholderTextColor="#87958e" style={serviceCatalogStyles.search} accessibilityLabel="Search home services"/>
  {normalizedQuery?<View style={serviceCatalogStyles.section}><Txt style={serviceCatalogStyles.groupTitle}>Search results</Txt><Txt style={serviceCatalogStyles.groupCount}>{shown.length} matching service{shown.length===1?'':'s'} · Chennai demo</Txt>{shown.length?<View style={s.serviceGrid}>{shown.map(service=><TouchableOpacity key={service.id} style={s.serviceGridItem} onPress={()=>openService(service)} accessibilityRole="button" accessibilityLabel={`View ${service.name}, from ${money(service.price)}`}><ServiceCard service={service}/></TouchableOpacity>)}</View>:<><Empty text="No services match your search."/><Btn title="Clear search and browse categories" secondary onPress={()=>setQuery('')}/></>}</View>:<>
   <View style={serviceCatalogStyles.section}><View style={discoveryStyles.sectionHeading}><View><Txt size={19} bold>Browse by category</Txt><Txt size={12} color={C.muted} style={{marginTop:3}}>Choose the type of cleaning you need</Txt></View></View>
    <View style={serviceCatalogStyles.categoryGrid}>{serviceCategories.map(category=>{
     const count=activeServices.filter(service=>category.serviceIds.includes(service.id)).length;
     return <TouchableOpacity key={category.id} style={serviceCatalogStyles.categoryCard} onPress={()=>openCategory(category.id)} accessibilityRole="button" accessibilityLabel={`${category.title}, ${count} services`}>
      <ServiceImage id={category.imageId} style={serviceCatalogStyles.categoryImage} accessibilityLabel={`${category.title} example photo`}/>
      <View style={serviceCatalogStyles.categoryCopy}><Txt style={serviceCatalogStyles.categoryHeading}>{category.title}</Txt><Txt style={serviceCatalogStyles.categoryCaption}>{count} service{count===1?'':'s'} · {category.description}</Txt></View>
     </TouchableOpacity>
    })}</View>
   </View>
   <View style={serviceCatalogStyles.section}><View style={discoveryStyles.sectionHeading}><View><Txt size={19} bold>Popular services</Txt><Txt size={12} color={C.muted} style={{marginTop:3}}>Starting prices are illustrative demo estimates</Txt></View></View>
    {popular.map(service=><TouchableOpacity key={service.id} style={serviceCatalogStyles.popularCard} onPress={()=>openService(service)} accessibilityRole="button" accessibilityLabel={`View ${service.name}, from ${money(service.price)}`}>
     <ServiceImage id={service.id} style={serviceCatalogStyles.popularImage} accessibilityLabel={`${service.name} example photo`}/>
     <View style={serviceCatalogStyles.popularCopy}><View style={s.rowBetween}><Txt size={15} bold style={{flex:1}}>{service.name}</Txt><Txt color={C.green} bold>{money(service.price)}+</Txt></View><Txt size={12} color={C.muted} style={{marginTop:4}} numberOfLines={2}>{service.description}</Txt><Txt size={11} color={C.green} bold style={{marginTop:8}}>View details  ›</Txt></View>
    </TouchableOpacity>)}
   </View>
   <View style={discoveryStyles.offerCard}><View style={{flex:1}}><Txt size={10} color={C.green} bold>SAMPLE DEMO OFFER · {mockPromotions[0].code}</Txt><Txt size={15} bold style={{marginTop:4}}>{mockPromotions[0].title}</Txt><Txt size={11} color={C.muted} style={{marginTop:3}}>{mockPromotions[0].description} · not a live discount</Txt></View><Txt size={20} color={C.green} bold>✦</Txt></View>
  </>}
 </Screen>
}
function CleaningCategoryPage({route,navigation}:any){
 const {services}=useMarketplace();
 const category=serviceCategories.find(item=>item.id===route.params?.categoryId);
 const area=route.params?.area||'Adyar';
 const activeServices=services.filter(service=>service.active&&!service.paused);
 const shown=category?activeServices.filter(service=>category.serviceIds.includes(service.id)):[];
 const openService=(service:Service)=>navigation.navigate('Service',{service,area});
 return <Screen>
  <Header title={category?.title||'Cleaning category'} back={()=>navigation.goBack()}/>
  {category?<>
   <View style={serviceCatalogStyles.categoryBanner}>
    <ServiceImage id={category.imageId} style={serviceCatalogStyles.categoryBannerImage} accessibilityLabel={`${category.title} example photo`}/>
    <View pointerEvents="none" style={serviceCatalogStyles.categoryBannerShade}/>
    <View style={serviceCatalogStyles.categoryBannerCopy}><Txt size={11} color="#daefad" bold>TIDYDAY HOME CARE</Txt><Txt size={24} color="#fff" bold style={{marginTop:5}}>{category.title}</Txt><Txt size={12} color="#f1f6f1" style={{marginTop:4}}>{category.description}</Txt></View>
   </View>
   <View style={serviceCatalogStyles.section}><Txt style={serviceCatalogStyles.groupTitle}>Choose a service</Txt><Txt style={serviceCatalogStyles.groupCount}>{shown.length} available service{shown.length===1?'':'s'} · Chennai demo</Txt>
    {shown.length?shown.map(service=><TouchableOpacity key={service.id} style={serviceCatalogStyles.listItem} onPress={()=>openService(service)} accessibilityRole="button" accessibilityLabel={`Configure ${service.name}, starting at ${money(service.price)}`}>
     <ServiceImage id={service.id} style={serviceCatalogStyles.listItemImage} accessibilityLabel={`${service.name} example photo`}/>
     <View style={serviceCatalogStyles.listItemBody}><View style={s.rowBetween}><Txt size={16} bold style={{flex:1}}>{service.name}</Txt><Txt color={C.green} bold>{money(service.price)}+</Txt></View><Txt size={12} color={C.muted} style={{marginTop:5,lineHeight:18}}>{service.description}</Txt><Txt size={11} color={C.muted} style={{marginTop:8}}>◷ {Math.round(service.duration/60)}h{service.duration%60?` ${service.duration%60}m`:''} · Price may change with your selections</Txt><Txt size={12} color={C.green} bold style={{marginTop:9}}>Configure service  →</Txt></View>
    </TouchableOpacity>):<Empty text="There are no active services in this category right now."/>}
   </View>
  </>:<Empty text="This cleaning category is unavailable. Go back and choose another category."/>}
 </Screen>
}
function RoomCleaningPage({route,navigation}:any){
 const {services}=useMarketplace();
 const roomServices=services.filter(service=>service.active&&!service.paused&&(service.id==='bath'||service.id==='kitchen'));
 const openService=(service:Service)=>navigation.navigate('Service',{service,area:route.params?.area||'Adyar'});
 return <Screen>
  <Header title="Bathroom & kitchen" back={()=>navigation.goBack()}/>
  <View style={discoveryStyles.hero}>
   <Txt size={11} color="#daefad" bold>ROOM-BY-ROOM CARE</Txt>
   <Txt size={24} color="#fff" bold style={{marginTop:7}}>Choose a room to refresh</Txt>
   <Txt color="#e5efe9" style={{marginTop:6}}>Review the clean, choose optional extras and see your estimate before scheduling.</Txt>
  </View>
  {roomServices.map(service=><TouchableOpacity key={service.id} style={discoveryStyles.roomChoice} onPress={()=>openService(service)} accessibilityRole="button" accessibilityLabel={`View ${service.name}`}>
   <ServiceImage id={service.id} style={discoveryStyles.roomChoiceImage} accessibilityLabel={`${service.name} example`}/>
   <View style={discoveryStyles.roomChoiceBody}>
    <View style={s.rowBetween}><Txt size={17} bold style={{flex:1}}>{service.name}</Txt><Txt color={C.green} bold>View details ›</Txt></View>
    <Txt size={13} color={C.muted} style={{marginTop:5}}>{service.description}</Txt>
    <View style={{flexDirection:'row',alignItems:'center',gap:8,marginTop:10}}>
     <View style={discoveryStyles.roomChoicePrice}><Txt size={13} color={C.green} bold>From {money(service.price)}</Txt></View>
     <Txt size={12} color={C.muted}>About {service.duration} min</Txt>
     <Txt size={12} color={C.muted}>·</Txt>
     <Txt size={12} color={C.muted}>{service.leadDays===0?'Booking from today':'Plan a day ahead'}</Txt>
    </View>
   </View>
  </TouchableOpacity>)}
  <Card><Txt bold>One visit, your choice</Txt><Txt color={C.muted} style={{marginTop:5}}>Configure each room clean first. You’ll choose a visit time and address before confirming.</Txt></Card>
 </Screen>
}
function ServicePage({route,navigation}:any){
 const {services,applications,addToCart}=useMarketplace();
 const service:Service=services.find(x=>x.id===route.params.service.id)||route.params.service;
 const area=route.params.area||'Adyar';
 const roomService=service.id==='bath'||service.id==='kitchen';
 const cleaners=applications.filter(application=>application.status==='Approved'&&application.active&&(application.skills.includes(service.id)||application.skills.includes('home')));
 const [selectedPackageId,setSelectedPackageId]=useState(service.packages?.[0]?.id||'');
 const [expandedFaq,setExpandedFaq]=useState<number|null>(null);
 const selectedPackage=service.packages?.find(item=>item.id===selectedPackageId);
 const selectedName=selectedPackage?.name||service.name;
 const selectedPrice=selectedPackage?.price||service.price;
 const selectedDuration=selectedPackage?.duration||service.duration;
 const serviceFaqs=roomService?(service.id==='bath'?[
  {question:'How many bathrooms can I include?',answer:'Choose the number of bathrooms during setup. Your estimate updates before you schedule.'},
  {question:'Can I add glass or basin detailing?',answer:'Yes. Choose optional glass, mirror, basin or drain detailing during setup.'},
  {question:'What should I prepare?',answer:'Move personal items from counters and keep the bathroom accessible for the visit.'}
 ]:[
  {question:'How do I choose my kitchen size?',answer:'Select compact, standard or large during setup. The estimate updates with your choice.'},
  {question:'Can I add appliance cleaning?',answer:'Yes. Inside-fridge, chimney and cabinet-shelf detailing are optional extras.'},
  {question:'What should I prepare?',answer:'Clear loose utensils from worktops and switch off appliances before the visit.'}
 ]):cleaningFAQs;
 const bookSelectedPackage=()=>navigation.navigate('Book',{serviceId:service.id,area,packageId:selectedPackage?.id,packageName:selectedName,packagePrice:selectedPrice,packageDuration:selectedDuration});
 const addSelectedPackage=()=>{if(selectedPackage?.id==='partial-home'){bookSelectedPackage();return}addToCart({serviceId:service.id,name:selectedName,unitPrice:selectedPrice});navigation.navigate('Basket')};
 return <Screen>
  <Header title="Service details" back={()=>navigation.goBack()}/>
  <View style={s.detailHero}><ServiceImage id={service.id} style={s.detailHeroPhoto}/><View style={s.detailHeroShade}/><View style={s.detailHeroCopy}><Txt size={11} color="#e5f6dc" bold>{service.category.toUpperCase()} SERVICE · CHENNAI</Txt><Txt size={25} color="#fff" bold style={{marginTop:5}}>{service.name}</Txt><Txt color="#fff" style={{marginTop:8}}>{service.duration} min · booking from {service.leadDays===0?'today':'tomorrow'}</Txt></View></View>
  <Card style={s.reviewSummary}><View style={s.rowBetween}><View><Txt size={12} color={C.muted}>SAMPLE CUSTOMER RATING</Txt><View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:4}}><Txt size={23} color={C.green} bold>★ {service.rating?.toFixed(1)||'4.8'}</Txt><Txt size={12} color={C.muted}>({(service.reviewCount||120).toLocaleString('en-IN')} demo reviews)</Txt></View></View><View style={s.detailIcon}><Txt size={24}>{emoji(service.category)}</Txt></View></View></Card>
  {roomService&&<Card style={{marginTop:8}}><View style={s.rowBetween}><View><Txt size={11} color={C.muted} bold>PERSONALIZED CLEAN</Txt><Txt size={24} color={C.green} bold style={{marginTop:3}}>From {money(service.price)}</Txt></View><Txt size={12} color={C.muted}>{service.duration} min</Txt></View><Txt size={13} color={C.muted} style={{marginTop:7}}>{service.id==='bath'?'Choose the number of bathrooms and cleaning condition to see your estimate.':'Choose your kitchen size, cleaning condition and any optional extras.'}</Txt><Btn title={service.id==='bath'?'Configure bathroom clean':'Configure kitchen clean'} onPress={bookSelectedPackage}/><Txt size={11} color={C.muted} style={{marginTop:7}}>Select a visit time next · address and price shown before confirmation</Txt></Card>}
  {!!service.packages?.length&&<><Heading title="Choose your home type" subtitle="Pick the package that best matches your space."/><View style={s.packageList}>{service.packages.map(item=><TouchableOpacity key={item.id} style={[s.packageOption,selectedPackageId===item.id&&s.packageOptionOn]} onPress={()=>setSelectedPackageId(item.id)} accessibilityRole="radio" accessibilityState={{selected:selectedPackageId===item.id}}><View style={{flex:1}}><View style={{flexDirection:'row',alignItems:'center',gap:7}}><Txt bold>{item.name}</Txt>{item.tag&&<Txt size={9} color={C.green} bold>{item.tag.toUpperCase()}</Txt>}</View><Txt size={12} color={C.muted} style={{marginTop:4}}>{item.description}</Txt><Txt size={11} color={C.muted} style={{marginTop:5}}>About {item.duration} min</Txt></View><View style={{alignItems:'flex-end',marginLeft:8}}><Txt color={C.green} bold>{money(item.price)}+</Txt><View style={[s.radioOuter,selectedPackageId===item.id&&s.radioOuterOn]}>{selectedPackageId===item.id&&<View style={s.radioInner}/>}</View></View></TouchableOpacity>)}</View></>}
  {!roomService&&<Card style={{marginTop:10}}><View style={s.rowBetween}><View><Txt color={C.muted} size={12}>STARTING FROM</Txt><Txt size={25} color={C.green} bold>{money(selectedPrice)}</Txt>{service.discount? <Txt size={12} color={C.green} bold>{service.discount}% demo offer on eligible quotes</Txt>:null}</View><Txt size={11} color={C.muted}>{selectedDuration} min</Txt></View><Txt color={C.muted} style={{marginTop:10}}>{service.description}</Txt><Txt size={12} color={C.muted} style={{marginTop:8}}>Your itemized quote appears before confirmation. No payment is collected in this demo.</Txt><Btn title={selectedPackage?.id==='partial-home'?'Choose rooms and book':'Configure and book now'} onPress={bookSelectedPackage}/>{selectedPackage?.id!=='partial-home'&&<TouchableOpacity onPress={addSelectedPackage} style={discoveryStyles.addPackageLink} accessibilityRole="button"><Txt color={C.green} bold>Add package to basket</Txt></TouchableOpacity>}</Card>}
  <Card style={{marginTop:8}}><View style={s.rowBetween}><Txt bold>Cleaner matching</Txt><Txt size={11} color={C.green} bold>DEMO PROFILES</Txt></View>{cleaners.length?cleaners.slice(0,2).map(cleaner=><View key={cleaner.id} style={discoveryStyles.cleanerRow}><View style={discoveryStyles.cleanerAvatar}><Txt color={C.green} bold>{cleaner.name.slice(0,1).toUpperCase()}</Txt></View><View style={{flex:1}}><Txt bold>{cleaner.name}</Txt><Txt size={12} color={C.muted}>{cleaner.area} · Admin-approved demo profile</Txt></View></View>):<Txt size={13} color={C.muted} style={{marginTop:9}}>No active approved demo cleaner currently matches this service.</Txt>}<Txt size={11} color={C.muted} style={{marginTop:8}}>Matching uses service skills and admin approval. Availability and verification are not live.</Txt></Card>
  <View style={discoveryStyles.areaSummary}><Txt size={12} color={C.muted}>SERVICE AREA</Txt><Txt color={C.green} bold style={{marginTop:3}}>⌖  {area}, Chennai</Txt></View>
  <Heading title={service.id==='bath'?'What your bathroom clean covers':service.id==='kitchen'?'What your kitchen clean covers':'Included'}/>{service.includes.map(x=><Txt key={x} style={s.bullet}>✓  {x}</Txt>)}
  <Heading title="Not included"/>{service.excludes.map(x=><Txt key={x} color={C.muted} style={s.bullet}>·  {x}</Txt>)}
  {roomService&&<><Heading title="Before your visit" subtitle="A quick checklist to help the clean go smoothly"/><Card>{(service.id==='bath'?['Move personal items off counters and shelves','Keep the bathroom accessible during the visit']:['Clear loose utensils from counters and sink','Switch off appliances before the visit']).map(item=><Txt key={item} style={s.bullet}>✓  {item}</Txt>)}</Card></>}
  {!!service.addons.length&&<><Heading title="Popular add-ons"/>{service.addons.map(a=><Txt key={a.id} style={s.bullet}>{a.name} · {money(a.price)}</Txt>)}</>}
  <Heading title="Recent customer notes" subtitle="Illustrative feedback for the client demo"/>{sampleReviews.map(review=><Card key={review.name} style={s.sampleReview}><View style={s.rowBetween}><Txt bold>{review.name} · {review.area}</Txt><Txt color={C.green} bold>★ {review.rating}.0</Txt></View><Txt color={C.muted} style={{marginTop:7}}>{review.text}</Txt></Card>)}
  <Heading title="Common questions" subtitle="Helpful details before you book"/>{serviceFaqs.map((faq,index)=><TouchableOpacity key={faq.question} style={s.faqRow} onPress={()=>setExpandedFaq(expandedFaq===index?null:index)} accessibilityRole="button" accessibilityState={{expanded:expandedFaq===index}}><View style={s.rowBetween}><Txt bold style={{flex:1,marginRight:12}}>{faq.question}</Txt><Txt color={C.green} bold>{expandedFaq===index?'−':'+'}</Txt></View>{expandedFaq===index&&<Txt color={C.muted} style={{marginTop:8,lineHeight:19}}>{faq.answer}</Txt>}</TouchableOpacity>)}
  <Card style={s.trustCard}><Txt color={C.green} bold>THE TIDYDAY PROMISE · DEMO</Txt><Txt style={{marginTop:8}}>✓  Cleaner profiles reviewed by the demo admin</Txt><Txt style={{marginTop:6}}>✓  Package scope and price shown before booking</Txt><Txt style={{marginTop:6}}>✓  Help and visit updates available from booking details</Txt></Card>
 </Screen>
}

const options:Record<FieldKey,string[]>={property:['Apartment','Independent house','Villa','Duplex','Other'],occupancy:['Occupied home','Vacant / empty'],bhk:['Studio / 1 BHK','2 BHK','3 BHK','4 BHK','5+ BHK'],area:['Under 800 sq ft','800–1,200 sq ft','1,201–1,800 sq ft','Over 1,800 sq ft'],floors:['1 floor','2 floors','3 floors','4+ floors'],bathrooms:['1 bathroom','2 bathrooms','3 bathrooms','4+ bathrooms'],kitchenSize:['Compact kitchen','Standard kitchen','Large kitchen'],condition:['Regular','Heavy dirt / grease','Move-in / move-out','Post-renovation']};const fieldLabels:Record<FieldKey,string>={property:'Property type',occupancy:'Occupancy',bhk:'Home size',area:'Built-up area',floors:'Number of floors',bathrooms:'Bathrooms',kitchenSize:'Kitchen size',condition:'Cleaning condition'};
function BookingFlow({route,navigation}:any){
 const {services,user,addBooking,setUser,bookings,cart,clearCart,addToCart}=useMarketplace();
 const cartMode=Boolean(route.params.cartMode);
 const cartServices=cart.map(item=>services.find(service=>service.id===item.serviceId)).filter((service):service is Service=>Boolean(service));
 const actualService:Service=services.find(service=>service.id===route.params.serviceId)||cartServices[0]||services[0];
 const partialPackage=route.params.packageId==='partial-home';
 const cartWeekdays=cartServices.reduce((days,service)=>days.filter(day=>service.weekdays.includes(day)),cartServices[0]?.weekdays||[]);
 const cartSlots=cartServices.reduce((slots,service)=>slots.filter(time=>service.slots.includes(time)),cartServices[0]?.slots||[]);
 const cartDuration=cart.reduce((duration,item)=>duration+(services.find(service=>service.id===item.serviceId)?.duration||0)*item.quantity,0);
 const service:Service=cartMode?{...actualService,name:'Basket checkout',price:0,duration:cartDuration,leadDays:Math.max(0,...cartServices.map(item=>item.leadDays)),weekdays:cartWeekdays,slots:cartSlots,fields:[],addons:[]}:{...actualService,name:route.params.packageName||actualService.name,price:partialPackage?0:(route.params.packagePrice??actualService.price),duration:route.params.packageDuration||actualService.duration,fields:partialPackage?['condition']:actualService.fields};
 const requirementGroups:{id:string;title:string;fields:FieldKey[]}[]=[{id:'home',title:'Property details',fields:['property','occupancy']},{id:'size',title:'Overall home size',fields:['bhk','area']},{id:'floors',title:'Number of floors',fields:['floors']},{id:'bathrooms',title:'Bathrooms to clean',fields:['bathrooms']},{id:'kitchenSize',title:'Kitchen size',fields:['kitchenSize']},{id:'condition',title:'Cleaning condition',fields:['condition']}].map(group=>({...group,fields:service.fields.filter(key=>group.fields.includes(key))})).filter(group=>group.fields.length>0);
 const scheduleDays=availableDays(service);
 const requestedServiceIds=cartMode?cartServices.map(item=>item.id):[service.id];
 const occupied=(day:string,time:string)=>bookings.some(booking=>{
  const bookedIds=booking.serviceItems?.map(item=>item.serviceId)||[booking.serviceId];
  return bookedIds.some(id=>requestedServiceIds.includes(id))&&booking.date===day&&booking.slot===time&&booking.status!=='cancelled';
 });
 const firstAvailableSlot=(day:string)=>service.slots.find(time=>!occupied(day,time))||'';
 const [req,setReq]=useState<Record<string,string>>({});
 const [selectedRooms,setSelectedRooms]=useState<string[]>([]);
 const [expandedGroup,setExpandedGroup]=useState<string|null>(requirementGroups[0]?.id||null);
 const [addons,setAddons]=useState<string[]>([]);
 const [date,setDate]=useState(scheduleDays[0]?.label||'No available date');
 const [slot,setSlot]=useState(()=>firstAvailableSlot(scheduleDays[0]?.label||''));
 const [name,setName]=useState(user?.name||'');
 const [phone,setPhone]=useState(user?.phone||'');
 const [house,setHouse]=useState('');
 const [street,setStreet]=useState('');
 const [area,setArea]=useState(route.params.area||'Adyar');
 const [city,setCity]=useState('Chennai');
 const [pin,setPin]=useState('600020');
 const [landmark,setLandmark]=useState('');
 const [notes,setNotes]=useState('');
 const [promoInput,setPromoInput]=useState('');
 const [promoCode,setPromoCode]=useState('');
 const [paymentMethod,setPaymentMethod]=useState<'pay_at_service'|'upi_demo'>('pay_at_service');
 const [step,setStep]=useState(cartMode?1:0);
 const [guestAuth,setGuestAuth]=useState(false);
 const [otp,setOtp]=useState('');
 const [saved,setSaved]=useState(false);
 const [savedBooking,setSavedBooking]=useState<{id:string;total:number;date:string;slot:string}|null>(null);
 useEffect(()=>{if(route.params.area)setArea(route.params.area)},[route.params.area]);
 const firstStep=cartMode?1:0;
 const handleBookingBack=()=>{
  if(guestAuth){setGuestAuth(false);return true}
  if(step>firstStep){setStep(current=>current-1);return true}
  return false;
 };
 useEffect(()=>{
  const subscription=BackHandler.addEventListener('hardwareBackPress',()=>{
   if(!navigation.isFocused())return false;
   return handleBookingBack();
  });
  return ()=>subscription.remove();
 },[guestAuth,navigation,step,firstStep]);
 useEffect(()=>{if(!service.slots.includes(slot)||occupied(date,slot))setSlot(firstAvailableSlot(date))},[date,bookings]);
 if(saved&&savedBooking)return <Screen><Header title="Booking confirmed" back={()=>navigation.replace('Detail',{bookingId:savedBooking.id})}/><Card style={{alignItems:'center',padding:24,marginTop:18}}><View style={{width:56,height:56,borderRadius:28,backgroundColor:'#eaf6d7',alignItems:'center',justifyContent:'center'}}><Txt size={28} color={C.green} bold>✓</Txt></View><Txt size={22} bold style={{marginTop:14}}>Your visit is booked</Txt><Txt color={C.muted} style={{marginTop:6,textAlign:'center'}}>Your demo booking has been saved. No payment or message was sent.</Txt></Card><Card><View style={s.rowBetween}><Txt color={C.muted}>Booking reference</Txt><Txt color={C.green} bold>{savedBooking.id}</Txt></View><View style={[s.priceLine,{marginTop:10}]}><Txt color={C.muted}>Visit</Txt><Txt bold>{savedBooking.date} · {savedBooking.slot}</Txt></View><View style={[s.priceLine,{marginTop:8}]}><Txt color={C.muted}>Total</Txt><Txt color={C.green} bold>{money(savedBooking.total)}</Txt></View></Card><Btn title="View booking details" onPress={()=>navigation.replace('Detail',{bookingId:savedBooking.id})}/><Btn title="My bookings" secondary onPress={()=>navigation.navigate('Bookings')}/></Screen>;
 if(cartMode&&cart.length===0)return <Screen><Header title="Basket checkout" back={()=>navigation.goBack()}/><Empty text="Your basket is empty. Add a home-cleaning service before checkout."/><Btn title="Browse cleaning" onPress={()=>navigation.navigate('Home')}/></Screen>;
 const quoteRequirements={...req,rooms:selectedRooms.join(',')};const price=quote(service,quoteRequirements,addons);const priceForOption=(key:FieldKey,value:string)=>quote(service,{...quoteRequirements,[key]:value},addons).total;const cartLines=cart.flatMap(item=>{const serviceRecord=services.find(entry=>entry.id===item.serviceId);const line={label:`${item.name}${item.quantity>1?` × ${item.quantity}`:''}`,amount:item.unitPrice*item.quantity};const saving=serviceRecord?.discount?Math.round(line.amount*serviceRecord.discount/100):0;return saving?[line,{label:`${serviceRecord?.name||item.name} demo offer (${serviceRecord?.discount}%)`,amount:-saving}]:[line]});const cartSubtotal=cartLines.reduce((sum,line)=>sum+line.amount,0);const baseLines=cartMode?cartLines:price.lines;const subtotal=cartMode?cartSubtotal:price.total;const selectedPromo=mockPromotions.find(item=>item.code===promoCode);const promoDiscount=selectedPromo?(selectedPromo.kind==='percent'?Math.min(selectedPromo.maximum,Math.round(subtotal*selectedPromo.value/100)):subtotal>=selectedPromo.minimum?selectedPromo.value:0):0;const total=Math.max(0,subtotal-promoDiscount);const breakdown=promoDiscount?[...baseLines,{label:`${promoCode} demo savings`,amount:-promoDiscount}]:baseLines;const addonCount=(id:string)=>addons.filter(addonId=>addonId===id).length;const adjustAddon=(id:string,delta:number)=>setAddons(current=>{if(delta>0)return [...current,id];const index=current.indexOf(id);return index<0?current:[...current.slice(0,index),...current.slice(index+1)]});
 const validateDetails=()=>{if(cartMode&&(!cart.length||cart.some(item=>!services.some(entry=>entry.id===item.serviceId)||!Number.isInteger(item.quantity)||item.quantity<1||!Number.isFinite(item.unitPrice)||item.unitPrice<0))){Alert.alert('Check your basket','Your basket contains no services or an invalid item. Return to the basket and review it before booking.');return false}const invalid=service.fields.filter((key:FieldKey)=>!options[key].includes(req[key]));if(invalid.length){Alert.alert('Complete your cleaning details','Please select: '+invalid.map((key:FieldKey)=>fieldLabels[key]).join(', '));return false}if(partialPackage&&(!selectedRooms.length||selectedRooms.some(id=>!customHomeRooms.some(room=>room.id===id)))){Alert.alert('Choose rooms','Select at least one valid room or area for your custom clean.');return false}if(!Number.isFinite(total)||total<=0){Alert.alert('Check your estimate','The booking total is invalid. Review your selections and try again.');return false}return true};
 const continueDetails=()=>{if(validateDetails())setStep(1)};
 const currentConfiguration=():ServiceConfiguration=>({requirements:service.fields.reduce<Record<string,string>>((selected,key)=>{if(req[key])selected[key]=req[key];return selected},{}),addons:service.addons.flatMap(addon=>{const quantity=addonCount(addon.id);return quantity?[{id:addon.id,name:addon.name,quantity,unitPrice:addon.price}]:[]})});
 const addConfiguredCleanToBasket=()=>{if(!validateDetails())return;addToCart({serviceId:actualService.id,name:service.name,unitPrice:total,configuration:currentConfiguration()});navigation.navigate('Basket')};
 const validateSchedule=()=>{if(!scheduleDays.length){Alert.alert('No dates available','This service has no available dates in the current demo schedule.');return false}if(!service.slots.length){Alert.alert('No shared arrival windows','The selected services do not share an available arrival time. Remove an item and try again.');return false}if(!scheduleDays.some(day=>day.label===date)){Alert.alert('Choose an available date','Select one of the dates shown for this service.');return false}if(!service.slots.includes(slot)||occupied(date,slot)){const available=firstAvailableSlot(date);if(available)setSlot(available);Alert.alert('Choose an available time',available?'That arrival time is no longer available. We selected the next open time.':'There are no open arrival times on this date. Choose another date.');return false}return true};
 const continueSchedule=()=>{if(validateDetails()&&validateSchedule())setStep(2)};
 const validateAddress=()=>{if(!name.trim()||!/^\d{10}$/.test(phone)||!house.trim()||!street.trim()||!area.trim()||!city.trim()||!/^\d{6}$/.test(pin)){Alert.alert('Complete your address','Add your name, valid 10-digit phone, house number, street, area, city and 6-digit PIN.');return false}return true};
 const reviewAddress=()=>{if(validateAddress())setStep(3)};
 const confirm=()=>{if(!validateDetails()||!validateSchedule()||!validateAddress())return;if(!user){setGuestAuth(true);return}create()};
 const applyPromo=()=>{const normalized=promoInput.trim().toUpperCase();const candidate=mockPromotions.find(item=>item.code===normalized);if(!candidate){Alert.alert('Code not found','Try TIDY10 or FIRST200 in this demo.');return}if(candidate.kind==='flat'&&subtotal<candidate.minimum){Alert.alert('Minimum basket not reached',`Add services worth ${money(candidate.minimum)} to use this code.`);return}setPromoCode(candidate.code);setPromoInput(candidate.code)};
 const create=()=>{if(saved||!validateDetails()||!validateSchedule()||!validateAddress()){setGuestAuth(false);return}const id=`TD-${Math.random().toString(36).slice(2,7).toUpperCase()}`;const address=`${house}, ${street}, ${area}, ${city} ${pin}${landmark?`, near ${landmark}`:''}`;const serviceItems=cartMode?cart.map(item=>({serviceId:item.serviceId,name:item.name,quantity:item.quantity,unitPrice:item.unitPrice,configuration:item.configuration?{requirements:{...item.configuration.requirements},addons:item.configuration.addons.map(addon=>({...addon}))}:undefined})): [{serviceId:service.id,name:service.name,quantity:1,unitPrice:total,configuration:currentConfiguration()}];const requirements={...req,...(selectedRooms.length?{rooms:selectedRooms.join(', ')}:{})};const b:Booking={id,serviceId:serviceItems[0]?.serviceId||service.id,serviceName:serviceItems.map(item=>`${item.name}${item.quantity>1?` × ${item.quantity}`:''}`).join(' + '),serviceItems,customerName:name,phone,address,area,date,slot,requirements,addons:[...addons],breakdown:breakdown.map(x=>({...x})),total,paymentMethod,promoCode:promoCode||undefined,notes:notes.trim()||undefined,status:'awaiting_assignment',createdAt:new Date().toISOString(),timeline:['Booking placed','Finding a professional']};addBooking(b);if(cartMode)clearCart();setSavedBooking({id,total,date,slot});setSaved(true);setGuestAuth(false)};
 return <><Screen footer={step===0&&!cartMode&&<View style={discoveryStyles.bookingFooter}><View style={discoveryStyles.bookingFooterSummary}><View><Txt size={11} color={C.muted} bold>YOUR ESTIMATE</Txt><Txt size={21} color={C.green} bold>{money(total)}</Txt></View><Txt size={12} color={C.muted}>{partialPackage?`${selectedRooms.length} room(s) selected`:addons.length?`${addons.length} extra${addons.length===1?'':'s'} selected`:'Updates with your choices'}</Txt></View><View style={{flexDirection:'row',gap:8}}><View style={{flex:1}}><Btn title="Choose a time" onPress={continueDetails}/></View>{(service.id==='bath'||service.id==='kitchen')&&<View style={{flex:1}}><Btn title="Add to basket" secondary onPress={addConfiguredCleanToBasket}/></View>}</View></View>}><Header title="Your booking" back={()=>{if(!handleBookingBack())navigation.goBack()}}/><View style={s.bookingServiceSummary}><ServiceImage id={service.id} style={s.bookingServicePhoto}/><View style={{flex:1}}><Txt size={12} color={C.muted} bold>{cartMode?'BASKET CHECKOUT':'YOUR SERVICE'}</Txt><Txt bold style={{marginTop:3}} numberOfLines={1}>{cartMode?`${cart.reduce((sum,item)=>sum+item.quantity,0)} cleaning item(s)`:service.name}</Txt><Txt size={12} color={C.green} bold style={{marginTop:4}}>{money(total)} · {service.duration} min{cartMode?' + additional services':''}</Txt></View></View><View style={s.bookingProgress}>{['Details','Schedule','Address','Review'].map((x,i)=><View key={x} style={s.bookingProgressItem}><View style={[s.bookingProgressLine,i<=step&&s.bookingProgressLineOn]}/><Txt size={10} color={i===step?C.green:C.muted} bold={i===step}>{x}</Txt></View>)}</View>
 {step===0&&<>
  <Heading title={partialPackage?'Build your room package':service.id==='bath'?'Set up your bathroom clean':service.id==='kitchen'?'Set up your kitchen clean':'Personalize your clean'} subtitle={service.id==='bath'?'Tell us how many bathrooms need attention and how much build-up to expect.':service.id==='kitchen'?'Choose your kitchen size and cleaning condition; add appliance cleaning if needed.':'Choose the details that help your team prepare the right clean.'}/>
  {partialPackage&&<><Heading title="Rooms and areas" subtitle="Select one or more spaces; your estimate updates as you go."/><View style={s.roomOptionGrid}>{customHomeRooms.map(room=>{const selected=selectedRooms.includes(room.id);const imageId=room.id==='living-room'||room.id==='bedroom'?'interior':room.id==='bathroom'?'bath':room.id;return <TouchableOpacity key={room.id} style={[s.roomOption,selected&&s.roomOptionOn]} onPress={()=>setSelectedRooms(current=>selected?current.filter(id=>id!==room.id):[...current,room.id])} accessibilityRole="checkbox" accessibilityState={{checked:selected}}><ServiceImage id={imageId} style={discoveryStyles.roomOptionImage} accessibilityLabel={`${room.name} cleaning example`}/><View style={s.rowBetween}><Txt bold>{room.name}</Txt><Txt color={selected?C.green:C.muted} bold>{selected?'✓':'+'}</Txt></View><Txt size={12} color={C.green} bold style={{marginTop:7}}>From {money(room.price)}</Txt></TouchableOpacity>})}</View></>}
  {requirementGroups.map((group,index)=>{const expanded=expandedGroup===group.id;const summary=group.fields.map(key=>req[key]).filter(Boolean).join(' · ');return <View key={group.id} style={discoveryStyles.configGroup}><TouchableOpacity style={discoveryStyles.configGroupHeader} onPress={()=>setExpandedGroup(expanded?null:group.id)} accessibilityRole="button" accessibilityState={{expanded}}><View style={{flexDirection:'row',alignItems:'center',flex:1}}><View style={discoveryStyles.processNumber}><Txt size={11} color={C.green} bold>{index+1}</Txt></View><View style={{flex:1}}><Txt bold>{group.title}</Txt><Txt size={12} color={C.muted} style={{marginTop:3}} numberOfLines={1}>{summary||`Choose ${group.title.toLowerCase()}`}</Txt></View></View><Txt size={19} color={C.green} bold>{expanded?'−':'+'}</Txt></TouchableOpacity>{expanded&&<View style={discoveryStyles.configGroupBody}>{group.fields.map(key=><View key={key} style={{marginTop:10}}><Txt size={13} bold style={{marginBottom:4}}>{fieldLabels[key]}</Txt>{key==='bathrooms'||key==='kitchenSize'?<View style={discoveryStyles.bookingOptionGrid}>{options[key].map(value=>{const selected=req[key]===value;return <TouchableOpacity key={value} style={[discoveryStyles.bookingOption,selected&&discoveryStyles.bookingOptionOn]} onPress={()=>setReq({...req,[key]:value})} accessibilityRole="radio" accessibilityState={{selected}}><Txt size={12} color={selected?C.green:C.ink} bold>{value}</Txt><Txt size={14} color={C.green} bold>{money(priceForOption(key,value))}</Txt></TouchableOpacity>})}</View>:<View style={s.wrap}>{options[key].map(value=><Chip key={value} label={value} selected={req[key]===value} onPress={()=>setReq({...req,[key]:value})}/>)}</View>}</View>)}</View>}</View>})}
  {!!service.addons.length&&<><Heading title="Select add-ons" subtitle="Optional extras · change quantities anytime."/>{service.addons.map(addon=>{const quantity=addonCount(addon.id);return <View key={addon.id} style={[discoveryStyles.addonOption,quantity>0&&discoveryStyles.addonSelected]}><View style={{flex:1}}><Txt bold>{addon.name}</Txt><Txt size={12} color={C.muted} style={{marginTop:3}}>+{money(addon.price)} each</Txt></View>{quantity===0?<TouchableOpacity onPress={()=>adjustAddon(addon.id,1)} style={discoveryStyles.addonQuantityButton} accessibilityLabel={`Add ${addon.name}`}><Txt color={C.green} bold>Add</Txt></TouchableOpacity>:<View style={discoveryStyles.addonControl}><TouchableOpacity onPress={()=>adjustAddon(addon.id,-1)} style={discoveryStyles.addonQuantityButton} accessibilityLabel={`Remove one ${addon.name}`}><Txt color={C.green} size={18} bold>−</Txt></TouchableOpacity><Txt bold>{quantity}</Txt><TouchableOpacity onPress={()=>adjustAddon(addon.id,1)} style={discoveryStyles.addonQuantityButton} accessibilityLabel={`Add one ${addon.name}`}><Txt color={C.green} size={18} bold>+</Txt></TouchableOpacity></View>}</View>})}</>}
  <Heading title="Included surfaces"/>
  <Card>{service.includes.map((item,index)=><View key={item} style={discoveryStyles.processStep}><View style={discoveryStyles.processNumber}><Txt size={11} color={C.green} bold>{index+1}</Txt></View><Txt style={{flex:1}}>{item}</Txt></View>)}</Card>
  <Heading title="How it works"/>
  <Card>{['Share a few details about your home','Choose a date and arrival time','Your cleaner confirms and updates the visit status'].map((item,index)=><View key={item} style={discoveryStyles.processStep}><View style={discoveryStyles.processNumber}><Txt size={11} color={C.green} bold>{index+1}</Txt></View><Txt style={{flex:1}}>{item}</Txt></View>)}</Card>
  <Card style={discoveryStyles.quoteSummary}><View style={s.rowBetween}><View><Txt size={11} color={C.muted} bold>{service.id==='bath'||service.id==='kitchen'?'CURRENT ESTIMATE':'LIVE ESTIMATE'}</Txt><Txt size={23} color={C.green} bold style={{marginTop:3}}>{money(price.total)}</Txt></View><Txt size={12} color={C.muted} style={{maxWidth:130,textAlign:'right'}}>Updates with your selections</Txt></View><Txt size={11} color={C.muted} style={{marginTop:7}}>Base clean {money(service.price)} · final total shown before confirmation</Txt></Card>
  <Field label="Special instructions (optional)" value={notes} onChangeText={setNotes} placeholder="Anything the cleaning team should know?"/>
  <Card><Txt bold>Service photos</Txt><Txt color={C.muted}>Illustrative photos only · no upload or gallery access in this demo.</Txt></Card>
 </>}
 {step===1&&<><Heading title="Choose your visit" subtitle="Pick a date and an open arrival window."/><Card style={s.calendarCard}><View style={s.rowBetween}><View><Txt bold>Available dates</Txt><Txt size={12} color={C.muted}>Based on the service's lead time.</Txt></View><Txt size={12} color={C.green} bold>{service.leadDays===0?'Same-day available':'Plan ahead'}</Txt></View>{scheduleDays.length?<ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.dateRail}>{scheduleDays.map(d=><TouchableOpacity key={d.label} style={[s.dateTile,date===d.label&&s.dateTileOn]} onPress={()=>{setDate(d.label);setSlot(firstAvailableSlot(d.label))}}><Txt size={11} color={date===d.label?'#fff':C.muted} bold>{d.weekday}</Txt><Txt size={22} color={date===d.label?'#fff':C.ink} bold>{d.day}</Txt><Txt size={11} color={date===d.label?'#e3f5df':C.muted}>{d.month}</Txt></TouchableOpacity>)}</ScrollView>:<Txt color={C.red} style={{marginTop:14}}>No dates are currently available.</Txt>}</Card><Heading title="Arrival time" subtitle="Your cleaner will confirm before travelling."/><View style={s.timeGrid}>{service.slots.map(t=><TouchableOpacity key={t} disabled={occupied(date,t)} style={[s.timeTile,slot===t&&s.timeTileOn,occupied(date,t)&&s.timeTileDisabled]} onPress={()=>setSlot(t)}><Txt size={14} color={slot===t?'#fff':C.ink} bold>{t}</Txt><Txt size={11} color={slot===t?'#e3f5df':C.muted}>{occupied(date,t)?'Filled':slot===t?'Selected':'Available'}</Txt></TouchableOpacity>)}</View>{service.slots.length>0&&!firstAvailableSlot(date)&&<Txt size={12} color={C.red} style={{marginTop:7}}>No arrival windows remain on this date. Please select another date.</Txt>}<Card style={{marginTop:14}}><Txt bold>After you choose</Txt><Txt size={13} color={C.muted} style={{marginTop:5}}>We’ll match an eligible cleaner, who must accept before the visit is confirmed.</Txt></Card><Btn title="Continue to address" onPress={continueSchedule}/></>}
 {step===2&&<><Heading title="Service address" subtitle="Where should your cleaner arrive?"/><TouchableOpacity style={s.location} onPress={()=>{setHouse('12B');setStreet('Demo lane');setArea(route.params.area||'Adyar');setCity('Chennai');setPin('600020');Alert.alert('Demo location','Sample address filled locally. No location permission was requested.')}}><Txt color={C.green} bold>⌖  Use sample address · demo only</Txt></TouchableOpacity><Card style={s.bookingFormCard}><Txt bold>Address details</Txt><View style={{marginTop:12}}><Field label="House / flat number" value={house} onChangeText={setHouse}/><Field label="Street" value={street} onChangeText={setStreet}/><Field label="Area" value={area} onChangeText={setArea}/><Field label="City" value={city} onChangeText={setCity}/><Field label="PIN code" value={pin} onChangeText={setPin} keyboardType="number-pad"/><Field label="Landmark (optional)" value={landmark} onChangeText={setLandmark}/></View></Card><Card style={s.bookingFormCard}><Txt bold>Contact person</Txt><View style={{marginTop:12}}><Field label="Name" value={name} onChangeText={setName}/><Field label="Mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/></View></Card><Btn title="Review booking" onPress={reviewAddress}/></>}
 {step===3&&<>
  <Heading title="Review your booking" subtitle={`${date} · ${slot} · ${cartMode?'multiple services':`${service.duration} min`}`}/>
  <Card><Txt bold>{cartMode?'Services in this visit':service.name}</Txt>{cartMode?cart.map(item=><View key={item.id} style={{paddingVertical:4}}><View style={s.priceLine}><Txt color={C.muted}>{item.name} × {item.quantity}</Txt><Txt>{money(item.unitPrice*item.quantity)}</Txt></View>{!!configurationSummary(item.configuration)&&<Txt size={11} color={C.muted} style={{marginTop:3}}>{configurationSummary(item.configuration)}</Txt>}</View>):<Txt color={C.muted} style={{marginTop:5}}>{Object.entries(quoteRequirements).filter(([key])=>key!=='rooms').map(([key,value])=>`${fieldLabels[key as FieldKey]||key}: ${value}`).join(' · ')||'Standard service'}{selectedRooms.length?` · Rooms: ${selectedRooms.map(id=>customHomeRooms.find(room=>room.id===id)?.name).join(', ')}`:''}</Txt>}<Txt color={C.muted} style={{marginTop:8}}>{house}, {street}, {area}, {city} {pin}</Txt><Txt color={C.muted}>{name} · {phone}</Txt>{notes.trim()&&<Txt color={C.muted} style={{marginTop:6}}>Note: {notes.trim()}</Txt>}</Card>
  <Heading title="Offers and promo codes" subtitle="Available demo offers"/>{mockPromotions.map(promo=><TouchableOpacity key={promo.code} style={[s.promoOffer,promoCode===promo.code&&s.promoOfferOn]} onPress={()=>{setPromoInput(promo.code);if(promo.kind==='flat'&&subtotal<promo.minimum){Alert.alert('Minimum basket not reached',`Add services worth ${money(promo.minimum)} to use this code.`);return}setPromoCode(promo.code)}}><View style={{flex:1}}><Txt bold>{promo.title}</Txt><Txt size={12} color={C.muted} style={{marginTop:3}}>{promo.code} · {promo.description}</Txt></View><Txt color={C.green} bold>{promoCode===promo.code?'Applied':'Apply'}</Txt></TouchableOpacity>)}<View style={s.promoInputRow}><TextInput style={[s.input,{flex:1}]} value={promoInput} onChangeText={value=>{setPromoInput(value);if(promoCode)setPromoCode('')}} autoCapitalize="characters" placeholder="Enter promo code"/><TouchableOpacity style={s.promoApplyButton} onPress={applyPromo}><Txt color="#fff" bold>Apply</Txt></TouchableOpacity></View>
  <Heading title="Payment preference" subtitle="No payment is collected in this prototype."/><View style={s.paymentChoices}><TouchableOpacity style={[s.paymentChoice,paymentMethod==='pay_at_service'&&s.paymentChoiceOn]} onPress={()=>setPaymentMethod('pay_at_service')}><Txt color={C.green} bold>Pay at service</Txt><Txt size={11} color={C.muted} style={{marginTop:4}}>Cash / offline · demo</Txt></TouchableOpacity><TouchableOpacity style={[s.paymentChoice,paymentMethod==='upi_demo'&&s.paymentChoiceOn]} onPress={()=>setPaymentMethod('upi_demo')}><Txt color={C.green} bold>UPI</Txt><Txt size={11} color={C.muted} style={{marginTop:4}}>Simulated · no transaction</Txt></TouchableOpacity></View>
  <Heading title="Price breakdown"/>{breakdown.map((line,i)=><View style={s.priceLine} key={`${line.label}-${i}`}><Txt color={C.muted}>{line.label}</Txt><Txt bold>{line.amount<0?'−':''}{money(Math.abs(line.amount))}</Txt></View>)}<View style={[s.priceLine,{borderTopWidth:1,borderColor:C.line,paddingTop:14,marginTop:8}]}><Txt size={18} bold>Total</Txt><Txt size={20} color={C.green} bold>{money(total)}</Txt></View>
  <Btn title={user?'Confirm demo booking':'Sign in to confirm'} onPress={confirm}/><TouchableOpacity style={{padding:15,alignItems:'center'}} onPress={()=>setStep(2)}><Txt color={C.green}>Edit address</Txt></TouchableOpacity>
 </>}
 </Screen><Modal visible={guestAuth} transparent animationType="slide"><View style={s.scrim}><View style={s.sheet}><Txt size={23} bold>Sign in to confirm</Txt><Txt color={C.muted} style={{marginVertical:8}}>Your booking details are saved here while you verify. Demo only · no SMS sent.</Txt>{!otp&&<Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>}{otp!==''&&<Field label="Any six-digit demo OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad"/>}<Btn title={otp?'Verify and place booking':'Continue with phone'} onPress={()=>{if(!otp){if(!/^\d{10}$/.test(phone)){Alert.alert('Enter a 10-digit phone number');return}setOtp(' ')}else if(!/^\d{6}$/.test(otp)){Alert.alert('Enter any six digits');return}else{setUser({name,phone});setGuestAuth(false);create()}}}/><TouchableOpacity onPress={()=>setGuestAuth(false)} style={{padding:14,alignItems:'center'}}><Txt color={C.green}>Return to booking</Txt></TouchableOpacity></View></View></Modal></>}

function Empty({text}:any){return <Card style={{alignItems:'center',padding:28}}><Txt size={26}>✦</Txt><Txt bold style={{marginTop:8}}>{text}</Txt></Card>}
function BasketPage({navigation}:any){
 const {cart,services,removeCartItem,setCartQuantity}=useMarketplace();
 const subtotal=cart.reduce((sum,item)=>sum+item.unitPrice*item.quantity,0);
 const serviceSavings=cart.reduce((sum,item)=>{const service=services.find(entry=>entry.id===item.serviceId);return sum+(service?.discount?Math.round(item.unitPrice*item.quantity*service.discount/100):0)},0);
 return <Screen><Header title="Your basket" back={()=>navigation.goBack()}/><Txt color={C.muted}>Review cleaning services before choosing one visit time.</Txt>{cart.length?<>
  <Heading title={`${cart.reduce((sum,item)=>sum+item.quantity,0)} selected item(s)`} subtitle="You can remove items or adjust quantities."/>{cart.map(item=>{const service=services.find(entry=>entry.id===item.serviceId);return <Card key={item.id} style={s.basketItem}><ServiceImage id={item.serviceId} style={s.bookingServicePhoto}/><View style={{flex:1}}><Txt bold>{item.name}</Txt>{!!configurationSummary(item.configuration)&&<Txt size={11} color={C.muted} style={{marginTop:3}}>{configurationSummary(item.configuration)}</Txt>}<Txt size={12} color={C.green} bold style={{marginTop:4}}>{money(item.unitPrice)} each</Txt><View style={s.quantityControl}><TouchableOpacity style={s.quantityButton} onPress={()=>setCartQuantity(item.id,item.quantity-1)} accessibilityLabel={`Remove one ${item.name}`}><Txt color={C.green} bold>−</Txt></TouchableOpacity><Txt bold>{item.quantity}</Txt><TouchableOpacity style={s.quantityButton} onPress={()=>setCartQuantity(item.id,item.quantity+1)} accessibilityLabel={`Add one ${item.name}`}><Txt color={C.green} bold>+</Txt></TouchableOpacity></View></View><TouchableOpacity onPress={()=>removeCartItem(item.id)} accessibilityLabel={`Remove ${item.name}`}><Txt color={C.red} bold>Remove</Txt></TouchableOpacity></Card>})}
  <Card><View style={s.rowBetween}><Txt color={C.muted}>Service subtotal</Txt><Txt bold>{money(subtotal)}</Txt></View>{serviceSavings>0&&<View style={[s.priceLine,{marginTop:7}]}><Txt color={C.green}>Service offers</Txt><Txt color={C.green}>−{money(serviceSavings)}</Txt></View>}<View style={[s.priceLine,{borderTopWidth:1,borderColor:C.line,paddingTop:10,marginTop:6}]}><Txt bold>Estimated before promo</Txt><Txt color={C.green} bold>{money(subtotal-serviceSavings)}</Txt></View><Txt size={11} color={C.muted} style={{marginTop:6}}>Additional demo promo savings are calculated during review.</Txt></Card>
  <Btn title="Continue to booking" onPress={()=>navigation.navigate('Book',{serviceId:cart[0].serviceId,cartMode:true,area:'Adyar'})}/>
  <Btn title="Add another room clean" secondary onPress={()=>navigation.navigate('RoomCleaning',{area:'Adyar'})}/>
 </>:<><Empty text="Your basket is empty. Add a cleaning package to book it."/><Btn title="Explore cleaning services" onPress={()=>navigation.navigate('Home')}/></>}</Screen>
}
function BookingsPage({navigation}:any){const {bookings}=useMarketplace();const active=bookings.filter(b=>!['completed','cancelled'].includes(b.status));const history=bookings.filter(b=>['completed','cancelled'].includes(b.status));return <Screen><Header title="My bookings" back={()=>navigation.goBack()}/><Txt color={C.muted}>Appointments and service updates for this demo profile.</Txt><Heading title="Upcoming"/>{active.length?active.map(b=><TouchableOpacity key={b.id} onPress={()=>navigation.navigate('Detail',{bookingId:b.id})}><BookingCard b={b}/></TouchableOpacity>):<Empty text="No upcoming visits. Your next clean starts here."/>}<Heading title="Past visits"/>{history.length?history.map(b=><TouchableOpacity key={b.id} onPress={()=>navigation.navigate('Detail',{bookingId:b.id})}><BookingCard b={b}/></TouchableOpacity>):<Txt color={C.muted}>Completed and cancelled bookings will appear here.</Txt>}<Btn title="Explore services" onPress={()=>navigation.navigate('Home')}/></Screen>}
function BookingCard({b}:any){return <Card style={{marginBottom:10}}><View style={s.rowBetween}><Txt bold>{b.serviceName}</Txt><Txt color={C.green} bold>{money(b.total)}</Txt></View><Txt color={C.muted} style={{marginTop:5}}>{b.id} · {b.date} at {b.slot}</Txt><View style={s.badge}><Txt size={12} color={C.green} bold>{statusText(b.status)}</Txt></View></Card>}
function BookingDetail({route,navigation}:any){
 const {bookings,applications,services,changeStatus,rescheduleBooking,saveReview}=useMarketplace();
 const b=bookings.find(x=>x.id===route.params.bookingId);
 const [showReschedule,setShowReschedule]=useState(false);
 const [reviewRating,setReviewRating]=useState(0);
 const [reviewText,setReviewText]=useState('');
 const [rescheduleDate,setRescheduleDate]=useState<string|null>(null);
 const rescheduleServices=b?(b.serviceItems?.length?b.serviceItems.map(entry=>services.find(item=>item.id===entry.serviceId)).filter((item):item is Service=>Boolean(item)):[services.find(item=>item.id===b.serviceId)].filter((item):item is Service=>Boolean(item))):[];
 const firstService=rescheduleServices[0];
 const service=firstService?{...firstService,leadDays:Math.max(0,...rescheduleServices.map(item=>item.leadDays)),weekdays:rescheduleServices.reduce((days,item)=>days.filter(day=>item.weekdays.includes(day)),firstService.weekdays),slots:rescheduleServices.reduce((slots,item)=>slots.filter(time=>item.slots.includes(time)),firstService.slots)}:undefined;
 const rescheduleDays=service?availableDays(service):[];
 if(!b)return <Screen><Empty text="Booking not found."/></Screen>;
 const cleaner=applications.find(a=>a.id===b.employeeId);
 const stages:[Booking['status'],string][]=[['awaiting_assignment','Finding a cleaner'],['awaiting_employee_acceptance','Cleaner confirms'],['assigned','Booking accepted'],['en_route','On the way'],['arrived','Arrived'],['in_progress','Cleaning in progress'],['completed','Completed']];
 const active=Math.max(0,stages.findIndex(([status])=>status===b.status));
 const liveCopy:Record<string,string>={awaiting_assignment:'We are checking nearby approved cleaners who can take this visit.',awaiting_employee_acceptance:'We found a cleaner and are waiting for confirmation.',assigned:'Your cleaner has accepted this booking.',en_route:'Your cleaner is travelling to your address.',arrived:'Your cleaner has arrived.',in_progress:'Your service is underway.',completed:'Your service is complete.'};
 const cancel=()=>Alert.alert('Cancel this booking?','This demo booking will be marked cancelled.',[{text:'Keep booking',style:'cancel'},{text:'Cancel booking',style:'destructive',onPress:()=>{changeStatus(b.id,'cancelled');navigation.goBack()}}]);
 const rescheduleTimeTaken=(date:string,time:string)=>{const serviceIds=b.serviceItems?.map(item=>item.serviceId)||[b.serviceId];return bookings.some(item=>item.id!==b.id&&item.date===date&&item.slot===time&&item.status!=='cancelled'&&(item.serviceItems?.some(entry=>serviceIds.includes(entry.serviceId))||serviceIds.includes(item.serviceId)))};
 const requestReschedule=(day:{label:string},time:string)=>{const serviceIds=b.serviceItems?.map(item=>item.serviceId)||[b.serviceId];const conflict=bookings.some(item=>item.id!==b.id&&item.date===day.label&&item.slot===time&&item.status!=='cancelled'&&(item.serviceItems?.some(entry=>serviceIds.includes(entry.serviceId))||serviceIds.includes(item.serviceId)));if(conflict){Alert.alert('Time just filled','Please choose another available time.');return}rescheduleBooking(b.id,day.label,time);setShowReschedule(false);setRescheduleDate(null)};
 const contactSupport=()=>Alert.alert('Tidyday help · demo','For this prototype, support is simulated. A live version can connect chat, phone support and service issue reporting.',[{text:'Close'}]);
 return <><Screen><Header title="Booking details" back={()=>navigation.goBack()}/><BookingCard b={b}/>{!!b.serviceItems?.length&&<><Heading title="Service selections"/><Card>{b.serviceItems.map((item,index)=><View key={`${item.serviceId}-${index}`} style={{paddingVertical:index?9:0,borderTopWidth:index?1:0,borderColor:C.line}}><Txt bold>{item.name}{item.quantity>1?` × ${item.quantity}`:''}</Txt>{!!configurationSummary(item.configuration)&&<Txt size={12} color={C.muted} style={{marginTop:4}}>{configurationSummary(item.configuration)}</Txt>}</View>)}</Card></>}<Heading title="Live visit tracking" subtitle="Updates appear when your cleaner takes the next action."/><Card style={s.trackingCard}>{stages.map(([status,label],index)=><View key={status} style={s.trackRow}><View style={[s.trackDot,index<=active&&b.status!=='cancelled'&&s.trackDotOn]}/><View style={{flex:1}}><Txt bold={index===active} color={index<=active&&b.status!=='cancelled'?C.ink:C.muted}>{label}</Txt>{index===active&&<Txt size={12} color={C.green} style={{marginTop:2}}>{liveCopy[b.status]||statusText(b.status)}</Txt>}</View></View>)}</Card><Heading title="Appointment"/><Card><Txt bold>{b.date} · {b.slot}</Txt><Txt color={C.muted} style={{marginTop:5}}>{b.address}</Txt>{b.paymentMethod&&<Txt size={12} color={C.muted} style={{marginTop:6}}>{b.paymentMethod==='upi_demo'?'UPI selected · simulated only':'Pay at service · demo'}</Txt>}</Card><Card><Txt bold>{cleaner?`${cleaner.name} is handling your visit`:'Finding a suitable cleaner'}</Txt><Txt color={C.muted} style={{marginTop:5}}>{cleaner?`Skills: ${cleaner.skills.join(', ')} · Service area: ${cleaner.area}`:'We match approved active cleaners by service skill, area, availability and schedule.'}</Txt><Txt size={12} color={C.muted} style={{marginTop:8}}>Location tracking is simulated in this prototype. The cleaner updates their journey status from their dashboard.</Txt></Card><Heading title="Your selections"/>{b.serviceItems?.map((item,index)=><Txt key={`${item.serviceId}-${index}`} style={s.bullet}>{item.name} · {item.quantity} · {money(item.unitPrice)}</Txt>)}{Object.entries(b.requirements).map(([k,v])=><Txt key={k} style={s.bullet}>{fieldLabels[k as FieldKey]||k} · {v}</Txt>)}{b.addons.map(x=><Txt key={x} style={s.bullet}>Add-on · {x}</Txt>)}{b.notes&&<Card><Txt bold>Instructions</Txt><Txt color={C.muted} style={{marginTop:5}}>{b.notes}</Txt></Card>}<Heading title="Price snapshot"/>{b.breakdown.map((x,i)=><View key={i} style={s.priceLine}><Txt color={C.muted}>{x.label}</Txt><Txt>{money(x.amount)}</Txt></View>)}<Heading title="Updates"/>{b.timeline.map((x,i)=><Txt key={i} style={s.bullet}>●  {x}</Txt>)}{!['cancelled','completed','in_progress'].includes(b.status)&&<><Btn title="Reschedule visit" secondary onPress={()=>setShowReschedule(true)}/><Btn title="Cancel booking" secondary onPress={cancel}/></>}<Btn title="Need help with this visit?" secondary onPress={contactSupport}/>{b.status==='completed'&&!b.rating&&<Card style={s.reviewForm}><Txt bold>How was your cleaning?</Txt><View style={s.ratingStars}>{[1,2,3,4,5].map(value=><TouchableOpacity key={value} onPress={()=>setReviewRating(value)} accessibilityLabel={`Rate ${value} stars`}><Txt size={30} color={value<=reviewRating?C.orange:C.line}>★</Txt></TouchableOpacity>)}</View><Field label="Share a few words (optional)" value={reviewText} onChangeText={setReviewText} placeholder="What went well?"/><Btn title="Submit review" disabled={!reviewRating} onPress={()=>{saveReview(b.id,reviewRating,reviewText.trim());Alert.alert('Thank you','Your demo review has been saved to this session.')}}/></Card>}{b.rating&&<Card><Txt color={C.green} bold>Your rating · {'★'.repeat(b.rating)}</Txt>{b.review&&<Txt color={C.muted} style={{marginTop:5}}>{b.review}</Txt>}</Card>}</Screen><Modal visible={showReschedule} transparent animationType="slide" onRequestClose={()=>setShowReschedule(false)}><View style={s.scrim}><View style={s.sheet}><View style={s.grabber}/><Txt size={22} bold>Choose a new visit time</Txt><Txt color={C.muted} style={{marginTop:5}}>Select an available day and arrival window.</Txt><ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.dateRail}>{rescheduleDays.map(day=><TouchableOpacity key={day.label} style={[s.dateTile,rescheduleDate===day.label&&s.dateTileOn]} onPress={()=>setRescheduleDate(day.label)}><Txt size={11} color={rescheduleDate===day.label?'#fff':C.muted} bold>{day.weekday}</Txt><Txt size={20} color={rescheduleDate===day.label?'#fff':C.ink} bold>{day.day}</Txt><Txt size={11} color={rescheduleDate===day.label?'#fff':C.muted}>{day.month}</Txt></TouchableOpacity>)}</ScrollView>{rescheduleDate&&<View style={s.timeGrid}>{(service?.slots||[]).map(time=>{const unavailable=rescheduleTimeTaken(rescheduleDate,time);return <TouchableOpacity key={time} disabled={unavailable} style={[s.timeTile,unavailable&&s.timeTileDisabled]} onPress={()=>{const day=rescheduleDays.find(item=>item.label===rescheduleDate);if(day)requestReschedule(day,time)}}><Txt color={unavailable?C.muted:C.green} bold>{time}</Txt><Txt size={10} color={C.muted}>{unavailable?'Filled':'Available'}</Txt></TouchableOpacity>})}</View>}<Btn title="Keep current appointment" secondary onPress={()=>setShowReschedule(false)}/></View></View></Modal></>}
function EmployeePage({navigation}:any){const {applications,addApplication,bookings,changeStatus}=useMarketplace();const [name,setName]=useState('');const [phone,setPhone]=useState('');const [area,setArea]=useState('Adyar');const [experience,setExperience]=useState('');const [consent,setConsent]=useState(false);const [skills,setSkills]=useState<string[]>(['home']);const [chosen,setChosen]=useState<string|null>(null);const found=applications.find(a=>a.id===chosen)||applications.find(a=>a.phone===phone);const jobs=bookings.filter(b=>b.employeeId===found?.id);const [hours,setHours]=useState('09:00–18:00');
 return <Screen contentStyle={employeeStyles.content} bottomSpace={88}><Header title="Cleaner community" back={()=>navigation.goBack()} compact/><Card style={employeeStyles.intro}><Txt size={18} bold>Good work starts with care.</Txt><Txt size={12} color={C.muted} style={{marginTop:4}}>Join a local team that takes pride in the details.</Txt></Card>{found?<><Heading compact title={found.name} subtitle={`Application · ${found.status}`}/><Card style={employeeStyles.compactCard}><Txt size={13} bold>{found.status==='Pending'?'We’ve received your application.':found.status==='Approved'?'Your demo profile is approved.':'Your application was not approved.'}</Txt><Txt size={11} color={C.muted} style={{marginTop:5}}>Skills: {found.skills.join(', ')} · {found.area} · {found.hours}</Txt><Txt size={11} color={C.muted} style={{marginTop:7}}>Identity check: placeholder only · Bank/payment: placeholder only. Do not submit real documents or account information.</Txt></Card>{found.status==='Approved'&&<><Heading compact title="Your assigned jobs" subtitle="Demo earnings · no payouts"/>{jobs.length?jobs.map(b=><Card key={b.id} style={employeeStyles.compactCard}><Txt size={13} bold>{b.serviceName}</Txt><Txt size={11} color={C.muted} style={{marginTop:4}}>{b.date} · {b.slot} · {b.area}</Txt><Txt size={11} color={C.muted}>{b.id} · {money(b.total*.4)} estimated</Txt><View style={[s.wrap,employeeStyles.jobActions]}>{([['assigned','Accept job'],['en_route','On the way'],['arrived','Arrived'],['in_progress','Start job'],['completed','Complete']] as [Booking['status'],string][]).map(([st,label])=><Chip compact key={st} label={label} onPress={()=>changeStatus(b.id,st)} selected={b.status===st}/>)}</View></Card>):<Empty text="No assigned jobs yet."/>}</>}</>:<><Heading compact title="Apply to join" subtitle="Demo application · no real identity or bank details"/><Field compact label="Full name" value={name} onChangeText={setName}/><Field compact label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/><Btn compact title="Open existing demo profile" secondary onPress={()=>{const a=applications.find(x=>x.phone===phone);if(a)setChosen(a.id);else Alert.alert("No demo profile found","Submit an application first.")}}/><Txt size={12} bold style={employeeStyles.skillLabel}>Services you can do</Txt><View style={[s.wrap,employeeStyles.skillWrap]}>{[['home','Home clean'],['bath','Bathroom'],['kitchen','Kitchen'],['tank','Tank'],['sofa','Sofa']].map(([id,label])=><Chip compact key={id} label={label} selected={skills.includes(id)} onPress={()=>setSkills(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}/>)}</View><View style={employeeStyles.formGrid}><View style={employeeStyles.formColumn}><Field compact label="Experience" value={experience} onChangeText={setExperience} placeholder="e.g. 2 years"/></View><View style={employeeStyles.formColumn}><Field compact label="Service area" value={area} onChangeText={setArea}/></View><View style={employeeStyles.formColumn}><Field compact label="Preferred working hours" value={hours} onChangeText={setHours}/></View></View><Card style={employeeStyles.compactCard}><Txt size={12} bold>Verification · demo placeholder</Txt><Txt size={11} color={C.muted} style={{marginTop:3}}>No document upload or real identity information collected.</Txt><Txt size={12} bold style={{marginTop:7}}>Bank information · demo placeholder</Txt><Txt size={11} color={C.muted} style={{marginTop:3}}>Not collected in this prototype.</Txt></Card><TouchableOpacity style={employeeStyles.consent} onPress={()=>setConsent(!consent)} accessibilityRole="checkbox" accessibilityState={{checked:consent}}><Txt size={12} color={C.green}>{consent?'☑':'□'}  I agree this is a local demo application.</Txt></TouchableOpacity><Btn title="Submit demo application" onPress={()=>{if(!name.trim()||!/^\d{10}$/.test(phone)||!area.trim()||!consent){Alert.alert('Complete the application','Name, 10-digit number, area and consent are required.');return}const id=`EMP-${Date.now().toString().slice(-5)}`;addApplication({id,name,phone,skills,experience,area,hours,status:'Pending',active:false});setChosen(id)}}/></>}</Screen>}

function AdminGate({navigation}:any){const [entered,setEntered]=useState(false);return entered?<AdminDashboard navigation={navigation}/>:<Screen><Header title="Admin demo access" back={()=>navigation.goBack()}/><Card><Txt size={23} bold>Operations dashboard</Txt><Txt color={C.muted} style={{marginTop:7}}>Manage sample services, bookings, and cleaner applications in this local demo.</Txt><Txt size={12} color={C.muted} style={{marginTop:12}}>Demo-only access · no password or production authorization.</Txt></Card><Btn title="Enter Demo Admin" onPress={()=>setEntered(true)}/></Screen>}
function AdminDashboard({navigation}:any){const {services,bookings,applications,activities,saveService,assign,approve,changeStatus,updateEmployeeStatus}=useMarketplace();const [tab,setTab]=useState('Overview');const [filter,setFilter]=useState('All');const [query,setQuery]=useState('');const employees=applications.filter(a=>a.status==='Approved'&&a.active);const pending=applications.filter(a=>a.status==='Pending');const needsAttention=bookings.filter(b=>['awaiting_assignment','awaiting_employee_acceptance'].includes(b.status));const shownBookings=bookings.filter(b=>(filter==='All'||b.status===filter)&&(`${b.id} ${b.serviceName} ${b.area}`.toLowerCase().includes(query.toLowerCase())));return <Screen contentStyle={adminStyles.content}><View style={[s.adminHead,adminStyles.head]}><View><Txt size={11} color="#c9dfd3">TIDYDAY · OPERATIONS</Txt><Txt size={21} color="#fff" bold>Admin studio</Txt><Txt size={10} color="#d9e9e0" style={{marginTop:3}}>Chennai demo workspace · local session</Txt></View><TouchableOpacity onPress={()=>navigation.navigate('Home')}><Txt size={13} color="#fff" bold>Exit</Txt></TouchableOpacity></View><ScrollView horizontal showsHorizontalScrollIndicator={false} style={[s.adminTabs,adminStyles.tabRail]}>{['Overview','Bookings','Services','Team','Offers','Customers','Activity'].map(t=><Chip compact key={t} label={t} selected={tab===t} onPress={()=>setTab(t)}/>)}</ScrollView>
 {tab==='Overview'&&<><Heading compact title="Operations overview" subtitle="Current workload and team readiness"/><View style={s.metricGrid}>{([['Today’s bookings',bookings.filter(b=>b.status!=='cancelled').length,'#eaf2ec'],['Needs attention',needsAttention.length,'#fff2df'],['Active cleaners',employees.length,'#eaf2ec'],['Pending reviews',pending.length,'#fcebe7']] as [string,number,string][]).map(([label,value,tint])=><Card key={label} style={[s.metric,s.opsMetric,adminStyles.metric]}><View style={[s.metricIcon,adminStyles.metricIcon,{backgroundColor:tint}]}><Txt size={12} color={C.green} bold>{label==='Needs attention'?'!':label==='Pending reviews'?'…':label==='Active cleaners'?'✓':'↗'}</Txt></View><Txt size={21} bold>{value}</Txt><Txt size={11} color={C.muted}>{label}</Txt></Card>)}</View><Card style={[s.revenueCard,adminStyles.revenue]}><View style={s.rowBetween}><View><Txt size={10} color="#d4e9dc" bold>COMPLETED WORK · DEMO</Txt><Txt size={21} color="#fff" bold style={{marginTop:3}}>{money(bookings.filter(b=>b.status==='completed').reduce((sum,b)=>sum+b.total,0))}</Txt></View><View style={[s.revenueMark,{width:34,height:34,borderRadius:11}]}><Txt size={17} color="#fff" bold>₹</Txt></View></View><Txt size={10} color="#d4e9dc" style={{marginTop:6}}>Illustrative total · no payments have been collected</Txt></Card><View style={s.rowBetween}><Heading compact title="Needs attention" subtitle="Bookings awaiting a next action"/><TouchableOpacity onPress={()=>setTab('Bookings')} style={s.viewQueue}><Txt size={11} color={C.green} bold>View queue →</Txt></TouchableOpacity></View>{needsAttention.length?needsAttention.slice(0,3).map(b=><TouchableOpacity key={b.id} onPress={()=>setTab('Bookings')}><Card style={[s.queueCard,adminStyles.card]}><View style={s.rowBetween}><View style={{flex:1}}><Txt size={13} bold>{b.serviceName}</Txt><Txt size={11} color={C.muted} style={{marginTop:3}}>{b.id} · {b.date} · {b.area}</Txt></View><View style={s.queueStatus}><Txt size={10} color={b.status==='awaiting_assignment'?C.orange:C.green} bold>{statusText(b.status)}</Txt></View></View></Card></TouchableOpacity>):<Empty text="No bookings are waiting for action."/>}<View style={s.rowBetween}><Heading compact title="Recent bookings"/><TouchableOpacity onPress={()=>setTab('Bookings')} style={s.viewQueue}><Txt size={11} color={C.green} bold>All bookings →</Txt></TouchableOpacity></View>{bookings.slice(0,4).map(b=><TouchableOpacity key={b.id} onPress={()=>navigation.navigate('Detail',{bookingId:b.id})}><BookingCard b={b}/></TouchableOpacity>)}</>}
 {tab==='Bookings'&&<><Heading compact title="Bookings" subtitle="Search, assign and update jobs"/><TextInput style={[s.search,adminStyles.search]} value={query} onChangeText={setQuery} placeholder="Search booking, service, area"/><View style={s.wrap}>{['All','awaiting_assignment','assigned','in_progress','completed','cancelled'].map(x=><Chip compact key={x} label={x.replaceAll('_',' ')} selected={filter===x} onPress={()=>setFilter(x)}/>)}</View>{shownBookings.length?shownBookings.map(b=><Card key={b.id} style={adminStyles.card}><View style={s.rowBetween}><Txt size={13} bold>{b.serviceName}</Txt><Txt size={13} color={C.green} bold>{money(b.total)}</Txt></View><Txt size={11} color={C.muted} style={{marginVertical:4}}>{b.id} · {b.customerName} · {b.phone}</Txt><Txt size={11} color={C.muted}>{b.date} {b.slot} · {b.area} · {b.status.replaceAll('_',' ')}</Txt><Txt size={11} color={C.muted} style={{marginTop:3}}>{b.address}</Txt>{!b.employeeId&&<><Txt size={12} bold style={{marginTop:8}}>Eligible demo cleaners</Txt>{employees.filter(e=>e.skills.includes(b.serviceId)||e.skills.includes('home')).map(e=><TouchableOpacity key={e.id} style={s.assignBtn} onPress={()=>{const conflict=bookings.some(x=>x.id!==b.id&&x.employeeId===e.id&&x.date===b.date&&x.slot===b.slot&&!(['cancelled','completed'].includes(x.status)));if(conflict){Alert.alert('Schedule conflict','This cleaner already has a job in the same window. Choose another cleaner or time.');return}assign(b.id,e.id)}}><Txt size={12} color={C.green} bold>Assign {e.name} · {e.area}</Txt></TouchableOpacity>)}{employees.length===0&&<Txt size={12} color={C.red}>No approved active cleaner available.</Txt>}</>}<View style={s.wrap}>{([['en_route','On the way'],['arrived','Arrived'],['in_progress','Start'],['completed','Complete'],['cancelled','Cancel']] as [Booking['status'],string][]).map(([st,label])=><Chip compact key={st} label={label} selected={b.status===st} onPress={()=>changeStatus(b.id,st)}/>)}</View></Card>):<Empty text="No bookings match this filter."/>}</>}
 {tab==='Services'&&<><View style={s.rowBetween}><Heading compact title="Services" subtitle="Changes appear in the catalogue now"/><TouchableOpacity style={adminStyles.addLink} onPress={()=>navigation.navigate('EditService',{service:null})}><Txt size={13} color={C.green} bold>＋ Add service</Txt></TouchableOpacity></View>{services.map(service=><Card key={service.id} style={adminStyles.card}><View style={s.rowBetween}><Txt size={13} bold style={{flex:1,marginRight:8}}>{service.name}</Txt><Txt size={13} color={C.green} bold>{money(service.price)}</Txt></View><Txt size={11} color={C.muted} style={{marginTop:3}}>{service.category} · {service.duration} min · {service.active?(service.paused?'Paused':'Active'):'Inactive'}</Txt><View style={adminStyles.serviceActions}><Btn compact title="Edit" secondary onPress={()=>navigation.navigate('EditService',{service})}/><Btn compact title={service.active?'Deactivate':'Activate'} secondary onPress={()=>saveService({...service,active:!service.active})}/><Btn compact title={service.paused?'Resume':'Pause'} secondary onPress={()=>saveService({...service,paused:!service.paused})}/></View></Card>)}</>}
 {tab==='Team'&&<><Heading compact title="Applications" subtitle="Verification status is placeholder only"/>{applications.map(a=><Card key={a.id} style={adminStyles.card}><View style={s.rowBetween}><Txt size={13} bold>{a.name}</Txt><Txt size={11} color={a.status==='Approved'?C.green:C.orange}>{a.status}</Txt></View><Txt size={11} color={C.muted} style={{marginTop:3}}>{a.phone} · {a.skills.join(', ')} · {a.area}</Txt><Txt size={10} color={C.muted} style={{marginTop:3}}>Experience: {a.experience} · Hours: {a.hours} · Verification: demo placeholder</Txt>{a.status==='Pending'&&<View style={adminStyles.serviceActions}><Btn compact title="Approve" onPress={()=>approve(a.id,'Approved')}/><Btn compact title="Reject" secondary onPress={()=>Alert.alert('Reject this application?','This demo application will be marked rejected.',[{text:'Keep',style:'cancel'},{text:'Reject',style:'destructive',onPress:()=>approve(a.id,'Rejected')}])}/></View>}{a.status==='Approved'&&<View style={adminStyles.serviceActions}><Btn compact title={a.active?'Deactivate':'Activate'} secondary onPress={()=>updateEmployeeStatus(a.id,!a.active)}/></View>}</Card>)}</>}
 {tab==='Offers'&&<><Heading compact title="Offers & discounts" subtitle="Edit a service to change its discount"/>{services.map(service=><Card key={service.id} style={adminStyles.card}><View style={s.rowBetween}><Txt size={13} bold>{service.name}</Txt><Txt size={13} color={C.green} bold>{service.discount||0}% off</Txt></View><Txt size={11} color={C.muted} style={{marginTop:3}}>Applies to new quotes · illustrative demo offer</Txt><View style={adminStyles.serviceActions}><Btn compact title="Edit offer" secondary onPress={()=>navigation.navigate('EditService',{service})}/></View></Card>)}</>}
  {tab==='Customers'&&<><Heading compact title="Customers" subtitle="Derived from customer bookings"/>{[...new Map(bookings.map(b=>[b.phone,b])).values()].map(b=><Card key={b.phone} style={adminStyles.card}><Txt size={13} bold>{b.customerName}</Txt><Txt size={11} color={C.muted} style={{marginTop:3}}>{b.phone} · {bookings.filter(x=>x.phone===b.phone).length} booking(s)</Txt></Card>)}{bookings.length===0&&<Empty text="Customers appear after the first booking."/>}</>}
 {tab==='Activity'&&<><Heading compact title="Activity log" subtitle="Service, booking and team updates"/>{activities.map(a=><Card key={a.id} style={adminStyles.card}><Txt size={12}>{a.message}</Txt><Txt size={10} color={C.muted} style={{marginTop:3}}>{a.time}</Txt></Card>)}{activities.length===0&&<Empty text="Activity will appear as you use the demo."/>}</>}
 <Card style={[adminStyles.card,{marginTop:10}]}><Txt size={10} color={C.muted}>Demo admin mode · client-side role switching is not production authorization.</Txt></Card></Screen>}

function ServiceEditor({route,navigation}:any){
 const {saveService}=useMarketplace();
 const orig=route.params.service as Service|null;
 const [name,setName]=useState(orig?.name||'');
 const [category,setCategory]=useState(orig?.category||'Home');
 const [price,setPrice]=useState(String(orig?.price||''));
 const [duration,setDuration]=useState(String(orig?.duration||120));
 const [lead,setLead]=useState(String(orig?.leadDays??1));
 const [discount,setDiscount]=useState(String(orig?.discount||0));
 const [desc,setDesc]=useState(orig?.description||'');
 const [slotText,setSlotText]=useState(orig?.slots.join(', ')||'09:00, 13:00');
 const [days,setDays]=useState<number[]>(orig?.weekdays||[1,2,3,4,5,6]);
 const [fieldSet,setFieldSet]=useState<FieldKey[]>(orig?.fields||['condition']);
 const [packages,setPackages]=useState<ServicePackage[]>(orig?.packages||[]);
 const fields:FieldKey[]=['property','occupancy','bhk','area','floors','bathrooms','kitchenSize','condition'];
 const dayLabels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 const updatePackage=(id:string,key:'price'|'duration',value:string)=>setPackages(current=>current.map(item=>item.id===id?{...item,[key]:Number(value)}:item));
 return <Screen contentStyle={adminStyles.editorContent} stickyHeader={false}>
  <Header compact title={orig?'Edit service':'New service'} back={()=>navigation.goBack()}/>
  <Txt size={12} color={C.muted} style={{marginTop:7,marginBottom:3}}>Illustrative prices · changes take effect immediately.</Txt>
  <Field compact label="Service name" value={name} onChangeText={setName}/>
  <Field compact label="Description" value={desc} onChangeText={setDesc}/>
  <Txt size={13} bold style={adminStyles.categoryLabel}>Category</Txt><View style={s.wrap}>{['Home','Room','Specialty','Fabric'].map(x=><Chip compact key={x} label={x} selected={category===x} onPress={()=>setCategory(x)}/>)}</View>
  <View style={adminStyles.editorFieldGrid}><View style={adminStyles.editorField}><Field compact label="Base price (₹)" value={price} onChangeText={setPrice} keyboardType="number-pad"/></View><View style={adminStyles.editorField}><Field compact label="Duration (min)" value={duration} onChangeText={setDuration} keyboardType="number-pad"/></View><View style={adminStyles.editorField}><Field compact label="Lead time (days)" value={lead} onChangeText={setLead} keyboardType="number-pad"/></View><View style={adminStyles.editorField}><Field compact label="Discount (%)" value={discount} onChangeText={setDiscount} keyboardType="number-pad"/></View></View>
  {packages.length>0&&<><Heading admin title="Home package prices" subtitle="These package prices appear in the customer app."/>
   {packages.map(item=><Card key={item.id} style={adminStyles.packageCard}><Txt size={13} bold style={adminStyles.packageTitle}>{item.name}</Txt><View style={s.packageEditorRow}><View style={{flex:1}}><Field compact label="Price (₹)" value={String(item.price)} onChangeText={(value:string)=>updatePackage(item.id,'price',value)} keyboardType="number-pad"/></View><View style={{flex:1}}><Field compact label="Duration (min)" value={String(item.duration)} onChangeText={(value:string)=>updatePackage(item.id,'duration',value)} keyboardType="number-pad"/></View></View></Card>)}</>}
  <Heading admin title="Booking questions" subtitle="Select fields shown to customers"/>
  <View style={s.wrap}>{fields.map(f=><Chip compact key={f} label={fieldLabels[f]} selected={fieldSet.includes(f)} onPress={()=>setFieldSet(v=>v.includes(f)?v.filter(x=>x!==f):[...v,f])}/>)}</View>
  <Heading admin title="Availability rules" subtitle="Local demo schedule · one booking per service slot"/>
  <Field compact label="Arrival slots (HH:MM, comma separated)" value={slotText} onChangeText={setSlotText} placeholder="09:00, 13:00"/>
  <Txt size={12} bold style={adminStyles.categoryLabel}>Available weekdays</Txt><View style={s.wrap}>{dayLabels.map((x,i)=><Chip compact key={x} label={x} selected={days.includes(i)} onPress={()=>setDays(v=>v.includes(i)?v.filter(d=>d!==i):[...v,i])}/>)}</View>
  <Btn title="Save service" onPress={()=>{
   const n=Number(price),d=Number(duration),minimumLead=Number(lead),slots=slotText.split(',').map(x=>x.trim());
   const validPackages=packages.every(item=>Number.isFinite(item.price)&&item.price>=100&&Number.isFinite(item.duration)&&item.duration>=15);
   if(!name.trim()||!desc.trim()||!Number.isFinite(n)||n<100||!Number.isFinite(d)||d<15||!Number.isFinite(minimumLead)||minimumLead<0||fieldSet.length===0||days.length===0||slots.some(x=>!/^([01]\d|2[0-3]):[0-5]\d$/.test(x))||!validPackages){
    Alert.alert('Check service details','Add a name, description, valid base/package prices and durations, a non-negative lead time, one booking question, at least one weekday, and valid 24-hour slots.');
    return;
   }
   const service:Service={...(orig||{id:`service-${Date.now()}`,category,active:true,weekdays:days,slots,addons:[],includes:['General surface clean'],excludes:['Repairs']}),name,category,description:desc,price:n,duration:d,leadDays:minimumLead,discount:Math.min(100,Math.max(0,Number(discount)||0)),fields:fieldSet,weekdays:days,slots,packages:packages.length?packages:undefined};
   saveService(service);Alert.alert('Saved',`${name} is updated in the customer catalogue.`);navigation.goBack();
  }}/>
 </Screen>
}
const s=StyleSheet.create({
 pageWrap:{flex:1,width:'100%',height:'100%',backgroundColor:'#dfe7dc',alignItems:'center',justifyContent:'center',padding:0},appShell:{flex:1,width:'100%',maxWidth:430,height:'100%',backgroundColor:C.bg,alignSelf:'center',shadowColor:'#000',shadowOpacity:0.08,shadowRadius:14,elevation:5},content:{paddingHorizontal:20,paddingTop:16,paddingBottom:42},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10},homeTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},avatar:{width:42,height:42,borderRadius:21,backgroundColor:C.lime,alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOpacity:0.08,shadowRadius:8,elevation:3},brandBadge:{width:26,height:26,borderRadius:13,backgroundColor:'#eaf6d7',alignItems:'center',justifyContent:'center',marginLeft:8},premiumLocation:{backgroundColor:'#edf7ea',paddingHorizontal:14,paddingVertical:10,borderRadius:12,marginTop:10,borderWidth:1,borderColor:'#dfeede'},roleDock:{flexDirection:'row',marginTop:12,gap:8},roleDockItem:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,backgroundColor:'#eaf2ec',borderWidth:1,borderColor:'#d7e3d8',borderRadius:12,paddingVertical:10},location:{backgroundColor:'#e9f0e8',padding:12,borderRadius:13,marginTop:13},search:{backgroundColor:'#fff',borderWidth:1,borderColor:C.line,paddingHorizontal:15,paddingVertical:13,borderRadius:14,marginTop:12,color:C.ink},hero:{backgroundColor:C.green,borderRadius:22,padding:22,marginTop:16,overflow:'hidden'},heroBtn:{backgroundColor:C.lime,borderRadius:12,padding:12,alignSelf:'flex-start',marginTop:18},rowBetween:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},card:{backgroundColor:C.card,borderRadius:17,padding:16,borderWidth:1,borderColor:C.line,marginBottom:10},photoServiceCard:{height:280,backgroundColor:'#fff',borderRadius:18,overflow:'hidden',borderWidth:1,borderColor:C.line,marginTop:10},featuredServiceCard:{height:'auto',marginTop:2},photoFrame:{height:116,position:'relative',backgroundColor:'#dfe9de'},featuredPhotoFrame:{height:185},servicePhoto:{width:'100%',height:'100%'},photoShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(10,33,28,.18)'},categoryPill:{position:'absolute',left:10,top:10,backgroundColor:'rgba(20,62,51,.84)',paddingHorizontal:8,paddingVertical:5,borderRadius:10},featuredPrice:{position:'absolute',right:12,bottom:11,backgroundColor:'rgba(13,39,32,.88)',paddingHorizontal:10,paddingVertical:7,borderRadius:10},serviceCardBody:{padding:12,flex:1},serviceTitle:{height:38},serviceDescription:{height:36,marginTop:5},serviceMeta:{marginTop:'auto',paddingTop:9,borderTopWidth:1,borderColor:'#edf0ec',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, serviceGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginTop:16},serviceGridItem:{width:'48.4%',marginBottom:16},calendarCard:{padding:15},dateRail:{marginTop:14,marginHorizontal:-2},dateTile:{width:62,alignItems:'center',borderRadius:14,borderWidth:1,borderColor:C.line,backgroundColor:'#fff',paddingVertical:9,marginRight:8},dateTileOn:{backgroundColor:C.green,borderColor:C.green},timeGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},timeTile:{width:'30%',minWidth:86,alignItems:'center',borderRadius:13,borderWidth:1,borderColor:C.line,backgroundColor:'#fff',paddingVertical:11},timeTileOn:{backgroundColor:C.green,borderColor:C.green},timeTileDisabled:{opacity:.35},trackingCard:{paddingVertical:12},trackRow:{flexDirection:'row',alignItems:'flex-start',minHeight:48},trackDot:{width:13,height:13,borderRadius:7,backgroundColor:'#d9e3db',marginTop:3,marginRight:12},trackDotOn:{backgroundColor:C.green},detailHero:{height:220,borderRadius:21,overflow:'hidden',position:'relative',backgroundColor:C.green},detailHeroPhoto:{width:'100%',height:'100%'},detailHeroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(6,30,23,.42)'},detailHeroCopy:{position:'absolute',left:20,right:20,bottom:19},detailIcon:{width:46,height:46,borderRadius:14,backgroundColor:'#eaf1df',alignItems:'center',justifyContent:'center'},illustration:{width:56,height:56,borderRadius:16,backgroundColor:'#eaf1df',alignItems:'center',justifyContent:'center'},chip:{borderRadius:30,borderWidth:1,borderColor:C.line,backgroundColor:'#fff',paddingHorizontal:13,paddingVertical:9,marginRight:7,marginBottom:6},chipOn:{backgroundColor:C.green,borderColor:C.green},wrap:{flexDirection:'row',flexWrap:'wrap',marginTop:7},btn:{alignItems:'center',justifyContent:'center',backgroundColor:C.green,borderRadius:13,paddingHorizontal:17,paddingVertical:13,marginTop:12,alignSelf:'stretch'},btnSecondary:{backgroundColor:'#eaf2ec',borderColor:'#d9e5dc',borderWidth:1},input:{backgroundColor:'#fff',borderWidth:1,borderColor:C.line,borderRadius:12,paddingHorizontal:13,paddingVertical:12,color:C.ink},bullet:{marginVertical:5},addon:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:14,borderRadius:12,marginVertical:4,borderWidth:1,borderColor:C.line},steps:{flexDirection:'row',justifyContent:'space-around',marginTop:16},stepDot:{width:27,height:27,borderRadius:14,backgroundColor:'#e4e9e2',alignItems:'center',justifyContent:'center',marginBottom:5},priceLine:{flexDirection:'row',justifyContent:'space-between',paddingVertical:7},scrim:{flex:1,backgroundColor:'rgba(13,35,28,.48)',justifyContent:'flex-end',alignItems:'center'},sheet:{backgroundColor:C.bg,borderTopLeftRadius:25,borderTopRightRadius:25,padding:22,paddingBottom:32,width:'100%',maxWidth:430,alignSelf:'center'},grabber:{height:4,width:42,borderRadius:3,backgroundColor:'#ccd5ce',alignSelf:'center',marginBottom:18},badge:{alignSelf:'flex-start',backgroundColor:'#edf5e9',borderRadius:20,paddingHorizontal:10,paddingVertical:5,marginTop:8},adminHead:{backgroundColor:C.green,borderRadius:19,padding:19,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},metricGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},metric:{width:'48%',marginBottom:8},assignBtn:{padding:9,backgroundColor:'#f1f6ee',borderRadius:10,marginTop:6},footerBar:{position:'absolute',left:12,right:12,bottom:10,height:68,backgroundColor:'rgba(255,255,255,0.98)',borderRadius:20,borderWidth:1,borderColor:'#e5ebe5',flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,alignItems:'center',shadowColor:'#000',shadowOpacity:0.08,shadowRadius:12,elevation:6},footerItem:{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:8,borderRadius:14},
 locationSheet:{minHeight:470,justifyContent:'center'},locationConfirm:{alignItems:'center',paddingVertical:22},locationPinWrap:{width:92,height:92,alignItems:'center',justifyContent:'center',marginTop:12},locationPulse:{position:'absolute',width:92,height:92,borderRadius:46,backgroundColor:'#eaf6d7'},locationPinHead:{width:36,height:36,borderRadius:18,backgroundColor:C.green,alignItems:'center',justifyContent:'center',zIndex:1},locationPinConfirmed:{backgroundColor:C.green},locationPinCenter:{width:10,height:10,borderRadius:5,backgroundColor:'#fff'},locationPinStem:{width:2,height:16,backgroundColor:C.green,marginTop:-1},locationPinStemConfirmed:{backgroundColor:C.green},bookingServiceSummary:{flexDirection:'row',alignItems:'center',gap:12,padding:11,backgroundColor:'#fff',borderRadius:16,borderWidth:1,borderColor:C.line},bookingServicePhoto:{width:58,height:58,borderRadius:12,backgroundColor:'#e5eee5'},bookingProgress:{flexDirection:'row',marginTop:18,marginBottom:8},bookingProgressItem:{flex:1,alignItems:'stretch'},bookingProgressLine:{height:4,borderRadius:3,backgroundColor:'#e3e9e3',marginHorizontal:3,marginBottom:7},bookingProgressLineOn:{backgroundColor:C.green},bookingFormCard:{marginTop:12},adminTabs:{maxHeight:50,marginTop:14},opsMetric:{paddingVertical:13,minHeight:106},metricIcon:{width:28,height:28,borderRadius:10,alignItems:'center',justifyContent:'center',marginBottom:7},revenueCard:{backgroundColor:C.green,borderColor:C.green,marginTop:4},revenueMark:{width:42,height:42,borderRadius:14,backgroundColor:'rgba(255,255,255,0.16)',alignItems:'center',justifyContent:'center'},viewQueue:{paddingTop:24},queueCard:{marginBottom:8,paddingVertical:13},queueStatus:{backgroundColor:'#f3f6f0',borderRadius:20,paddingHorizontal:9,paddingVertical:6,marginLeft:8},basketAvatar:{position:'relative'},basketCount:{position:'absolute',right:-3,top:-3,minWidth:16,height:16,borderRadius:8,backgroundColor:C.green,alignItems:'center',justifyContent:'center',paddingHorizontal:3},promiseStrip:{marginTop:16,marginBottom:0,paddingVertical:9},promiseItem:{paddingVertical:4},reviewSummary:{marginTop:12},packageList:{gap:8},packageOption:{flexDirection:'row',alignItems:'center',padding:13,borderRadius:15,borderWidth:1,borderColor:C.line,backgroundColor:'#fff'},packageOptionOn:{borderColor:C.green,backgroundColor:'#f0f7ed'},radioOuter:{width:18,height:18,borderRadius:9,borderWidth:1.5,borderColor:C.line,alignItems:'center',justifyContent:'center',marginTop:8},radioOuterOn:{borderColor:C.green},radioInner:{width:9,height:9,borderRadius:5,backgroundColor:C.green},sampleReview:{marginBottom:8},faqRow:{padding:14,backgroundColor:'#fff',borderRadius:14,borderWidth:1,borderColor:C.line,marginBottom:8},trustCard:{backgroundColor:'#edf7ea',borderColor:'#d5e8d5'},basketItem:{flexDirection:'row',alignItems:'center',gap:10},quantityControl:{flexDirection:'row',alignItems:'center',gap:12,marginTop:8},quantityButton:{width:30,height:30,borderRadius:15,backgroundColor:'#eaf2ec',alignItems:'center',justifyContent:'center'},roomOptionGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},roomOption:{width:'48.5%',backgroundColor:'#fff',borderRadius:14,borderWidth:1,borderColor:C.line,padding:12,marginBottom:8},roomOptionOn:{borderColor:C.green,backgroundColor:'#edf7ea'},promoOffer:{flexDirection:'row',alignItems:'center',padding:12,backgroundColor:'#fff',borderRadius:13,borderWidth:1,borderColor:C.line,marginBottom:7},promoOfferOn:{borderColor:C.green,backgroundColor:'#edf7ea'},promoInputRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:4},promoApplyButton:{height:48,paddingHorizontal:16,backgroundColor:C.green,borderRadius:12,alignItems:'center',justifyContent:'center'},paymentChoices:{flexDirection:'row',gap:8},paymentChoice:{flex:1,padding:13,borderRadius:13,borderWidth:1,borderColor:C.line,backgroundColor:'#fff'},paymentChoiceOn:{borderColor:C.green,backgroundColor:'#edf7ea'},reviewForm:{marginTop:14},ratingStars:{flexDirection:'row',gap:8,marginVertical:12},packageEditorRow:{flexDirection:'row',gap:10}
});
