import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, useWindowDimensions, Platform, ActivityIndicator, ImageBackground } from 'react-native';
import { colors, fonts } from './src/theme';
import { SUBJECTS, REVIEWS, ABOUT_TEXT, FAQ } from './src/data/content';
import api from './src/services/ApiService';
import BookingModal from './src/components/BookingModal';
import { usePath, linkProps } from './router';
import Privacy from './privacy';
//import { Link } from 'expo-router';


const gridBg = Platform.select({
  web: {
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)',
    backgroundSize: '44px 44px',
  },
  default: {},
});

function BookButton({ onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ hovered }) => [styles.cta, hovered && { backgroundColor: '#F0A055' }]}>
      <Text style={styles.ctaText}>Book a Session</Text>
    </Pressable>
  );
}

function Home() {
  const { width } = useWindowDimensions();
  const wide = width >= 860;
  const scrollRef = useRef(null);
  const positions = useRef({});
  const [availabilities, setAvailabilities] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedIds, setBookedIds] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    api.getAvailabilities().then(setAvailabilities);
  }, []);

  const track = (key) => (e) => { positions.current[key] = e.nativeEvent.layout.y; };
  const goTo = useCallback((key) => {
    scrollRef.current?.scrollTo({ y: Math.max((positions.current[key] || 0) - navHeight - 8, 0), animated: true });
  }, [navHeight]);
  const goToAvailability = () => goTo('availability');
  
  const goToTop = useCallback(() => {
  scrollRef.current?.scrollTo({ y: 0, animated: true });
}, []);

  const pad = wide ? 64 : 24;
  const NAV = [['Availability', 'availability'],['About', 'about'], ['FAQ', 'faq'] ]; //['Reviews', 'reviews']

  const faqItems = Array.isArray(FAQ)
    ? FAQ.map((item) => {
        if (Array.isArray(item)) return { q: item[0], a: item[1] };
        if (item.question !== undefined) return { q: item.question, a: item.answer };
        if (item.q !== undefined) return { q: item.q, a: item.a };
        return { q: Object.keys(item)[0], a: Object.values(item)[0] };
      })
    : Object.entries(FAQ).map(([q, a]) => ({ q, a }));

  return (
    <View style={styles.root}>
      {/* NAV BAR */}
      <View
        onLayout={(e) => setNavHeight(e.nativeEvent.layout.height)}
        style={[styles.nav, styles.navFixed, { paddingHorizontal: pad, flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'flex-start' }]}
      >
        <Pressable accessibilityRole="link" accessibilityLabel="Back to top" onPress={goToTop}>
          <Text style={styles.brand}>Adam Hirshson</Text>
          <Text style={styles.brandSub}>Math Tutor</Text>
        </Pressable>
        <View style={styles.navLinks}>
          {NAV.map(([label, key]) => (
            <Pressable key={key} accessibilityRole="link" onPress={() => goTo(key)}>
              <Text style={styles.navText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    
      <ScrollView ref={scrollRef} contentContainerStyle={{ backgroundColor: colors.paper }}>
        {/* Hero + nav */}
        <ImageBackground
          source={require('./assets/mathbackground.png')}
          resizeMode="cover"
          style={[styles.hero, { paddingTop: (navHeight), borderBottomLeftRadius: wide ? 240 : 100 }]}
          imageStyle={{ borderBottomLeftRadius: wide ? 240 : 100 }}
>
          {/* <View style={[styles.nav, { paddingHorizontal: pad, flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'flex-start' }]}>
            <View>
              <Text style={styles.brand}>Adam Hirshson</Text>
              <Text style={styles.brandSub}>Math Tutor</Text>
            </View>
            <View style={styles.navLinks}>
              {NAV.map(([label, key]) => (
                <Pressable key={key} accessibilityRole="link" onPress={() => goTo(key)}>
                  <Text style={styles.navText}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View> */}

          <View style={[styles.heroBody, { paddingHorizontal: pad, flexDirection: wide ? 'row' : 'column' }]}>
            <View style={{ flex: 1, gap: 24, paddingVertical: wide ? 40 : 8 }}>
              <Text style={[styles.h1, { fontSize: wide ? 64 : 42, lineHeight: wide ? 70 : 48 }]}>Level up in math today!</Text>
              <Text style={styles.lead}>Personalized one-on-one math tutoring for students who want to understand, not just memorize.</Text>
              <Text style={styles.freeAdvert}>First session free, book it now!</Text>
              <View style={{ alignSelf: 'flex-start' }}><BookButton onPress={goToAvailability} /></View>
            </View>
            {/* <View style={[styles.heroPhotoWrap, wide ? { marginLeft: 48 } : { marginTop: 32, alignSelf: 'center' }]}> */}
              {/* <Image source={require('./assets/adam-hero.jpg')} style={styles.heroPhoto} resizeMode="cover" accessibilityLabel="Adam Hirshson" /> */}
            {/* </View> */}
          </View>
        </ImageBackground>

        {/* Services */}
        <View onLayout={track('services')} style={[styles.section, { paddingHorizontal: pad }]}>
          <Text style={styles.h2}>How I can help</Text>
          <View style={styles.serviceRow}>
            {SUBJECTS.map((s) => (
              <View key={s.name} style={styles.service}>
                <Text style={styles.serviceName}>{s.name}</Text>
                <Text style={styles.serviceBlurb}>{s.blurb}</Text>
              </View>
            ))}
          </View>
        </View>


        {/* Availability */}
        <View onLayout={track('availability')} style={[styles.section, { paddingHorizontal: pad, backgroundColor: colors.mist }]}>
          <Text style={styles.h2}>Availability</Text>
          <Text style={styles.sectionNote}>Choose a time to request a session.</Text>
          {!availabilities ? (
            <ActivityIndicator color={colors.slate} />
          ) : (
            <View style={styles.dayRow}>
              {availabilities.map((d) => (
                <View key={d.day} style={styles.dayCol}>
                  <Text style={styles.dayName}>{d.day}</Text>
                  {d.slots.map((s) => {
                    const taken = bookedIds.includes(s.id);
                    return (
                      <Pressable
                        key={s.id}
                        disabled={taken}
                        accessibilityRole="button"
                        accessibilityLabel={`${d.day} ${s.time}`}
                        onPress={() => setSelectedSlot(s)}
                        style={({ hovered }) => [styles.slot, hovered && !taken && styles.slotHover, taken && styles.slotTaken]}
                      >
                        <Text style={[styles.slotText, taken && { textDecorationLine: 'line-through' }]}>{taken ? 'Requested' : s.time}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          )}
          {/* <View style={{ alignSelf: 'flex-start', marginTop: 8 }}><BookButton onPress={goToAvailability} /></View> */}
        </View>



        {/* About */}
        <View onLayout={track('about')} style={[styles.aboutBand, { paddingHorizontal: pad }]}>
          <Text style={[styles.h2, { color: colors.white }]}>A little about me</Text>
          <View style={{ flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'flex-start', gap: 40 }}>
            <Image source={require('./assets/adam-about.jpg')} style={styles.aboutPhoto} resizeMode="cover" accessibilityLabel="Portrait of Adam Hirshson" />
            <View style={{ flex: 1, gap: 16, maxWidth: 620 }}>
              {ABOUT_TEXT.map((t, i) => <Text key={i} style={styles.aboutText}>{t}</Text>)}
            </View>
          </View>
        </View>
        
        {/* FAQ */}
      <View onLayout={track('faq')} style={[styles.section, { paddingHorizontal: pad, backgroundColor: colors.mist }]}>
        <Text style={styles.h2}>Frequently asked questions</Text>
        <View style={styles.faqList}>
          {faqItems.map((item, i) => {
            const open = openFaq === i;
            return (
              <View key={i} style={styles.faqItem}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  onPress={() => setOpenFaq(open ? null : i)}
                  style={({ hovered }) => [styles.faqHeader, hovered && styles.faqHeaderHover]}
                >
                  <Text style={styles.faqQuestion}>{item.q}</Text>
                  <Text style={[styles.faqChevron, { transform: [{ rotate: open ? '180deg' : '0deg' }] }]}>▾</Text>
                </Pressable>
                {open && <Text style={styles.faqAnswer}>{item.a}</Text>}
              </View>
            );
          })}
        </View>
      </View>

        {/* Reviews */}
        {/* <View onLayout={track('reviews')} style={[styles.section, { paddingHorizontal: pad }]}>
          <Text style={styles.h2}>What parents &amp; students say</Text>
          <View style={[styles.reviewRow, { flexDirection: wide ? 'row' : 'column' }]}>
            {REVIEWS.map((r, i) => (
              <View key={i} style={styles.review}>
                <View style={styles.quoteMark}><Text style={styles.quoteGlyph}>“</Text></View>
                <Text style={styles.reviewText}>{r.quote}</Text>
                <Text style={styles.reviewAuthor}>{r.author}</Text>
              </View>
            ))}
          </View>
        </View> */}

        

          
         <View style={styles.footer}>
           <Text style={styles.footerText}>© {new Date().getFullYear()} Adam Hirshson. All rights reserved.</Text>
           <Text style={styles.footerLink} {...linkProps('/privacy')}>Privacy</Text>
         </View>
      </ScrollView>

      <BookingModal
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onBooked={(slot) => setBookedIds((ids) => [...ids, slot.id])}
      />
    </View>
  );
}
export default function App() {
  const path = usePath();
  return path === '/privacy' ? <Privacy /> : <Home />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  hero: { backgroundColor: colors.slate, paddingBottom: 56, overflow: 'hidden'},
  nav: { paddingTop: 24, paddingBottom: 16, justifyContent: 'space-between', gap: 12 },
  brand: { fontFamily: fonts.display, fontSize: 26, fontWeight: '700', color: colors.white },
  brandSub: { fontFamily: fonts.body, fontSize: 15, color: colors.mist },
  navFixed: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: colors.slate },
  navLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
  navText: { fontFamily: fonts.body, fontSize: 22, fontWeight: '500', color: colors.white },
  heroBody: { alignItems: 'center', paddingTop: 24 },
  h1: { fontFamily: fonts.display, fontWeight: '700', color: colors.white },
  lead: { fontFamily: fonts.body, fontSize: 24, lineHeight: 30, color: colors.mist, maxWidth: 480 },
  freeAdvert: { fontFamily: fonts.body, fontSize: 24, lineHeight: 30, fontWeight: 700, color: colors.black, maxWidth: 480 },
  cta: { backgroundColor: colors.sun, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 999 },
  ctaText: { fontFamily: fonts.body, fontSize: 17, fontWeight: '700', color: colors.slateDeep },
  heroPhotoWrap: { width: 320, height: 380, borderTopLeftRadius: 160, borderTopRightRadius: 160, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden', backgroundColor: colors.slateDeep },
  heroPhoto: { width: '100%', height: '100%' },

  section: { paddingVertical: 72, gap: 20 },
  h2: { fontFamily: fonts.display, fontSize: 36, fontWeight: '700', color: colors.slateDeep },
  sectionNote: { fontFamily: fonts.body, fontSize: 17, color: colors.slateDeep },
  serviceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 8 },
  service: { flexGrow: 1, flexBasis: 220, maxWidth: 360, gap: 8, borderTopWidth: 3, borderTopColor: colors.sun, paddingTop: 14 },
  serviceName: { fontFamily: fonts.display, fontSize: 22, fontWeight: '700', color: colors.slateDeep },
  serviceBlurb: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.slateDeep },

  aboutBand: { backgroundColor: colors.slate, paddingVertical: 72, gap: 28 },
  aboutPhoto: { width: 240, height: 300, borderRadius: 24 },
  aboutText: { fontFamily: fonts.body, fontSize: 20, lineHeight: 28, color: colors.white },

  reviewRow: { gap: 24, marginTop: 8 },
  review: { flex: 1, gap: 14, backgroundColor: colors.white, padding: 28, borderRadius: 20 },
  quoteMark: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.sun, alignItems: 'center', justifyContent: 'center' },
  quoteGlyph: { fontFamily: fonts.display, fontSize: 32, color: colors.white, lineHeight: 40, marginTop: 6 },
  reviewText: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26, color: colors.slateDeep },
  reviewAuthor: { fontFamily: fonts.body, fontSize: 15, fontWeight: '700', color: colors.slate },

  dayRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 8 },
  dayCol: { flexGrow: 1, flexBasis: 130, gap: 10 },
  dayName: { fontFamily: fonts.display, fontSize: 20, fontWeight: '700', color: colors.slateDeep, marginBottom: 2 },
  slot: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.slate, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  slotHover: { backgroundColor: colors.slate },
  slotTaken: { backgroundColor: 'transparent', borderColor: '#9FB5BB', borderStyle: 'dashed' },
  slotText: { fontFamily: fonts.body, fontSize: 16, fontWeight: '500', color: colors.slateDeep },

  faqList: { gap: 14, marginTop: 8, width: '100%', maxWidth: 1400, alignSelf: 'center' },
  faqItem: { backgroundColor: colors.beige, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: colors.sun, overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingHorizontal: 24, paddingVertical: 20 },
  faqHeaderHover: { backgroundColor: colors.white },
  faqQuestion: { flex: 1, fontFamily: fonts.display, fontSize: 20, fontWeight: '700', color: colors.slateDeep },
  faqChevron: { fontSize: 22, color: colors.slate },
  faqAnswer: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26, color: colors.slateDeep, paddingHorizontal: 24, paddingBottom: 22 },

  // footer: { padding: 28, alignItems: 'center', backgroundColor: colors.slateDeep },
  // footerText: { fontFamily: fonts.body, fontSize: 14, color: colors.mist },
  footer: { padding: 28, alignItems: 'center', backgroundColor: colors.slateDeep, gap: 8 },
  footerText: { fontFamily: fonts.body, fontSize: 14, color: colors.mist },
  footerLink: { fontFamily: fonts.body, fontSize: 14, color: colors.mist, textDecorationLine: 'underline' },
});
