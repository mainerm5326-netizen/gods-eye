const translations = {
  ar: {
    subtitle:"GLOBAL EARTH INTELLIGENCE", searchPlaceholder:"ابحث عن مدينة أو دولة أو إحداثيات...", search:"بحث",
    prototype:"نسخة تجريبية", modules:"الأنظمة", overview:"نظرة عامة", satellite:"الأقمار الصناعية",
    cameras:"الكاميرات العامة", aircraft:"الطائرات", maritime:"السفن والبحار", weather:"الطقس", news:"الأخبار",
    disasters:"الكوارث", ai:"تحليل الذكاء الاصطناعي", system:"النظام", timeline:"الخط الزمني", settings:"الإعدادات",
    demoMode:"وضع التطوير", noLiveFeeds:"لا توجد مصادر مباشرة متصلة", globalView:"العرض العالمي",
    earthExplorer:"مستكشف الأرض", demoData:"واجهة أولية · بيانات غير متصلة", earthModel:"نموذج أرض ثلاثي الأبعاد",
    globeHint:"حرّك الكرة الأرضية لاستكشافها", globeLegend:"عرض جغرافي تفاعلي", selectedLocation:"الموقع المحدد",
    waiting:"بانتظار الاختيار", noLocation:"لم يتم تحديد موقع", searchOrTap:"ابحث عن مكان أو اختر نقطة على الكرة",
    dataLayers:"طبقات البيانات", planned:"مخططة", layerNotice:"اختر طبقة لمعرفة حالة ربطها. لن نعرض بيانات وهمية.",
    attribution:"الكرة الأرضية بواسطة Globe.gl · البحث الجغرافي بواسطة OpenStreetMap Nominatim",
    searchError:"تعذر العثور على المكان. تحقق من الاتصال أو جرّب اسماً آخر.",
    searching:"جارٍ البحث...", layerUnavailable:"هذه الطبقة لم تُربط بمصدر بيانات بعد. لا توجد بيانات مباشرة في هذه المرحلة.",
    searchSelect:"اختر نتيجة البحث", sourceAttribution:"نتائج البحث الجغرافي © OpenStreetMap contributors"
  },
  fa: {
    subtitle:"هوش جغرافیایی جهانی", searchPlaceholder:"نام شهر، کشور یا مختصات را جست‌وجو کنید...", search:"جست‌وجو",
    prototype:"نسخه آزمایشی", modules:"سامانه‌ها", overview:"نمای کلی", satellite:"ماهواره‌ها",
    cameras:"دوربین‌های عمومی", aircraft:"هواپیماها", maritime:"کشتی‌ها و دریاها", weather:"آب‌وهوا", news:"اخبار",
    disasters:"بلایای طبیعی", ai:"تحلیل هوش مصنوعی", system:"سیستم", timeline:"خط زمانی", settings:"تنظیمات",
    demoMode:"حالت توسعه", noLiveFeeds:"هیچ منبع زنده‌ای متصل نیست", globalView:"نمای جهانی",
    earthExplorer:"کاوشگر زمین", demoData:"رابط اولیه · داده‌ها متصل نیستند", earthModel:"مدل سه‌بعدی زمین",
    globeHint:"برای کاوش، کره زمین را بچرخانید", globeLegend:"نمای جغرافیایی تعاملی", selectedLocation:"موقعیت انتخاب‌شده",
    waiting:"در انتظار انتخاب", noLocation:"موقعیتی انتخاب نشده است", searchOrTap:"مکانی را جست‌وجو کنید یا روی کره انتخاب کنید",
    dataLayers:"لایه‌های داده", planned:"در برنامه", layerNotice:"برای مشاهده وضعیت اتصال، یک لایه را انتخاب کنید. داده ساختگی نمایش داده نمی‌شود.",
    attribution:"کره زمین با Globe.gl · جست‌وجوی مکان با OpenStreetMap Nominatim",
    searchError:"مکان پیدا نشد. اتصال را بررسی کنید یا نام دیگری وارد کنید.",
    searching:"در حال جست‌وجو...", layerUnavailable:"این لایه هنوز به منبع داده متصل نشده است. در این مرحله داده زنده‌ای وجود ندارد.",
    searchSelect:"یکی از نتایج را انتخاب کنید", sourceAttribution:"نتایج جست‌وجوی جغرافیایی © مشارکت‌کنندگان OpenStreetMap"
  },
  en: {
    subtitle:"GLOBAL EARTH INTELLIGENCE", searchPlaceholder:"Search a city, country, or coordinates...", search:"Search",
    prototype:"PROTOTYPE", modules:"SYSTEMS", overview:"Overview", satellite:"Satellites",
    cameras:"Public cameras", aircraft:"Aircraft", maritime:"Ships & maritime", weather:"Weather", news:"News",
    disasters:"Disasters", ai:"AI analysis", system:"SYSTEM", timeline:"Timeline", settings:"Settings",
    demoMode:"Development mode", noLiveFeeds:"No live data sources connected", globalView:"GLOBAL VIEW",
    earthExplorer:"Earth Explorer", demoData:"Initial interface · no data feeds connected", earthModel:"3D EARTH MODEL",
    globeHint:"Drag the globe to explore", globeLegend:"Interactive geographic view", selectedLocation:"SELECTED LOCATION",
    waiting:"AWAITING SELECTION", noLocation:"No location selected", searchOrTap:"Search a place or select a point on the globe",
    dataLayers:"DATA LAYERS", planned:"PLANNED", layerNotice:"Select a layer to inspect its connection status. No fabricated data is shown.",
    attribution:"Globe by Globe.gl · Geocoding by OpenStreetMap Nominatim",
    searchError:"Location not found. Check your connection or try another name.",
    searching:"Searching...", layerUnavailable:"This layer is not connected to a data provider yet. No live data is available in this phase.",
    searchSelect:"Select a search result", sourceAttribution:"Geocoding results © OpenStreetMap contributors"
  }
};

let currentLang = "ar";
let globeInstance = null;
let autoRotate = true;
let searchBusy = false;
let lastGeocodeRequestAt = 0;

const $ = (id) => document.getElementById(id);
function t(key){ return translations[currentLang][key] || translations.en[key] || key; }
function showToast(message){
  const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(()=>toast.classList.remove("show"), 3200);
}
function setLanguage(lang){
  currentLang = translations[lang] ? lang : "ar";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "en" ? "ltr" : "rtl";
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n; if(t(key)) el.textContent=t(key);});
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder);});
  $("languageSelect").value=currentLang;
}
function updateLocation(name, lat, lon){
  $("selectedPlace").querySelector("b").textContent = name || t("noLocation");
  $("selectedPlace").querySelector("small").textContent = t("searchOrTap");
  $("placeLat").textContent = `LAT ${Number(lat).toFixed(4)}`;
  $("placeLon").textContent = `LON ${Number(lon).toFixed(4)}`;
  $("coordinates").textContent = `LAT ${Number(lat).toFixed(3)} · LNG ${Number(lon).toFixed(3)}`;
  if(globeInstance) globeInstance.pointOfView({lat:Number(lat),lng:Number(lon),altitude:1.65},1200);
}
function initGlobe(){
  const target = $("globeViz");
  if(typeof Globe !== "function"){
    target.innerHTML = '<div class="globe-fallback">3D globe library could not load. Check your internet connection.</div>';
    return;
  }
  globeInstance = Globe()(target)
    .backgroundColor("rgba(0,0,0,0)")
    .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
    .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
    .showAtmosphere(true)
    .atmosphereColor("#55c9e8")
    .atmosphereAltitude(0.17)
    .width(target.clientWidth)
    .height(target.clientHeight)
    .onGlobeClick(({lat,lng})=>{
      updateLocation(currentLang==="en"?"Selected coordinates": "إحداثيات محددة",lat,lng);
    });
  globeInstance.controls().autoRotate = true;
  globeInstance.controls().autoRotateSpeed = 0.35;
  const resize = ()=>{
    if(globeInstance){globeInstance.width(target.clientWidth);globeInstance.height(target.clientHeight);}
  };
  window.addEventListener("resize",resize);
}
async function searchPlace(event){
  event.preventDefault();
  if(searchBusy) return;
  const query = $("placeSearch").value.trim();
  if(!query) return;
  const elapsed = Date.now() - lastGeocodeRequestAt;
  if (elapsed < 1100) {
    showToast(currentLang === "en" ? "Please wait before searching again." : (currentLang === "fa" ? "لطفاً پیش از جست‌وجوی بعدی کمی صبر کنید." : "انتظر قليلاً قبل إجراء بحث جديد."));
    return;
  }
  searchBusy=true; lastGeocodeRequestAt = Date.now(); showToast(t("searching"));
  try{
    const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q="+encodeURIComponent(query);
    const response = await fetch(url,{headers:{"Accept":"application/json"}});
    if(!response.ok) throw new Error("Geocoding request failed");
    const results = await response.json();
    if(!results.length) throw new Error("No results");
    const chosen = results[0];
    updateLocation(chosen.display_name,Number(chosen.lat),Number(chosen.lon));
    showToast(chosen.display_name);
  }catch(err){showToast(t("searchError"));}
  finally{searchBusy=false;}
}
function bindControls(){
  $("languageSelect").addEventListener("change",e=>setLanguage(e.target.value));
  $("searchForm").addEventListener("submit",searchPlace);
  $("resetGlobe").addEventListener("click",()=>{
    if(globeInstance) globeInstance.pointOfView({lat:18,lng:10,altitude:2.5},1000);
  });
  $("zoomIn").addEventListener("click",()=>{
    if(globeInstance){const p=globeInstance.pointOfView();globeInstance.pointOfView({altitude:Math.max(.7,p.altitude*.78)},500);}
  });
  $("zoomOut").addEventListener("click",()=>{
    if(globeInstance){const p=globeInstance.pointOfView();globeInstance.pointOfView({altitude:Math.min(4,p.altitude*1.25)},500);}
  });
  $("autoRotate").addEventListener("click",()=>{
    autoRotate=!autoRotate;
    if(globeInstance) globeInstance.controls().autoRotate=autoRotate;
  });
  $("menuToggle").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
  document.querySelectorAll("[data-layer]").forEach(button=>{
    button.addEventListener("click",()=>{
      const layer=button.dataset.layer;
      $("layerNotice").textContent=t("layerUnavailable");
      showToast(t("layerUnavailable"));
    });
  });
  document.querySelectorAll(".nav-item").forEach(button=>{
    button.addEventListener("click",()=>{
      document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
      button.classList.add("active");
      const panel=button.dataset.panel;
      if(panel && panel!=="overview") showToast(t("layerUnavailable"));
      $("sidebar").classList.remove("open");
    });
  });
}
document.addEventListener("DOMContentLoaded",()=>{
  setLanguage("ar");
  initGlobe();
  bindControls();
});
