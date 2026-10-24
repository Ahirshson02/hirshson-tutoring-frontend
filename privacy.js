import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { linkProps } from './router';
import { colors, fonts } from './src/theme'; // use the same import path as your home page

const UPDATED = 'October 24, 2026';
const CONTACT_EMAIL = (process.env.EXPO_PUBLIC_EMAIL).replace(/\/$/, '') || "localemail.com"; // replace

export default function Privacy() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Privacy Policy | Adam Hirshson';
    return () => { document.title = previous; };
  }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.container}>
        <Text style={styles.back} {...linkProps('/')}>← Back to home</Text>

        <Text style={styles.h1}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: {UPDATED}</Text>

        <Text style={styles.p}>
          This site is operated by Adam Hirshson for personal math tutoring. This page explains what
          information is collected when you use it and what happens to it.
        </Text>

        <Text style={styles.h2}>Information I collect</Text>
        <Text style={styles.p}>
          Information is collected only when you book a session. That includes the parent/guardian
          name, student name, email address, phone number, the subject, any notes you choose to add,
          and the time slot you picked. Browsing the site does not collect personal information.
        </Text>

        <Text style={styles.h2}>Cookies and tracking</Text>
        <Text style={styles.p}>
          This site does not use cookies, analytics, or advertising trackers.
        </Text>

        <Text style={styles.h2}>How I use your information</Text>
        <Text style={styles.p}>
          Your information is used only to schedule and run tutoring sessions: to confirm your
          booking, contact you about it, and send a calendar invitation with a video meeting link.
          It is never sold or used for marketing.
        </Text>

        <Text style={styles.h2}>Where your information is stored</Text>
        <Text style={styles.p}>
          Booking details are stored in a secured database hosted by Supabase. Email and calendar
          invitations are sent through Google (Gmail and Google Calendar). These providers process
          the information only to provide those services.
        </Text>

        <Text style={styles.h2}>Sharing</Text>
        <Text style={styles.p}>
          Your information is not shared with anyone other than the service providers above, unless
          required by law.
        </Text>

        <Text style={styles.h2}>Children's privacy</Text>
        <Text style={styles.p}>
          Students may be minors. Bookings should be made by a parent or guardian, and I only collect
          the information needed to schedule sessions.
        </Text>

        <Text style={styles.h2}>Retention and deletion</Text>
        <Text style={styles.p}>
          Booking information is kept for as long as tutoring is ongoing. You can ask me to correct
          or delete your information at any time by emailing {CONTACT_EMAIL}.
        </Text>

        <Text style={styles.h2}>Changes</Text>
        <Text style={styles.p}>
          If this policy changes, the updated version will be posted here with a new date.
        </Text>

        <Text style={styles.h2}>Contact</Text>
        <Text style={styles.p}>Questions? Email {CONTACT_EMAIL}.</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Adam Hirshson. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  content: { flexGrow: 1 },
  container: { width: '100%', maxWidth: 800, alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 56, gap: 14, flexGrow: 1 },
  back: { fontFamily: fonts.body, fontSize: 16, color: colors.slate, textDecorationLine: 'underline', marginBottom: 8 },
  h1: { fontFamily: fonts.display, fontSize: 40, fontWeight: '700', color: colors.slateDeep },
  updated: { fontFamily: fonts.body, fontSize: 14, color: colors.slate },
  h2: { fontFamily: fonts.display, fontSize: 24, fontWeight: '700', color: colors.slateDeep, marginTop: 16 },
  p: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26, color: colors.slateDeep },
  footer: { padding: 28, alignItems: 'center', backgroundColor: colors.slateDeep },
  footerText: { fontFamily: fonts.body, fontSize: 14, color: colors.mist },
});