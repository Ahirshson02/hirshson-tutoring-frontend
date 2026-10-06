import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, fonts } from '../theme';
import { SUBJECTS } from '../data/content';
import api from '../services/ApiService';

const EMPTY = { guardianName: '', studentName: '', phoneNumber: '', subject: '', notes: '', wantsRecurring: false, wantsMultiplePerWeek: false };

function Checkbox({ label, checked, onChange }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => onChange(!checked)} style={styles.checkRow}>
      <View style={[styles.box, checked && styles.boxOn]}>{checked && <Text style={styles.tick}>✓</Text>}</View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

export default function BookingModal({ slot, onClose, onBooked }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (slot) { setForm(EMPTY); setErrors({}); setDone(false); setFailed(false); setSubmitting(false); }
  }, [slot]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    const next = {};
    if (!form.guardianName.trim()) next.guardianName = 'Enter a parent or guardian name.';
    if (!form.studentName.trim()) next.studentName = 'Enter the student’s name.';
    if (!form.phoneNumber.trim()) next.phoneNumber = 'Enter a contact number.';
    if (!form.subject) next.subject = 'Choose a subject.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    setFailed(false);
    try {
      const res = await api.bookSessions({ slot, ...form });
      if (!res.success) throw new Error('Booking failed');
      setDone(true);
      onBooked && onBooked(slot);
    } catch (e) {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={!!slot} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {done ? (
            <View style={{ gap: 16 }}>
              <Text style={styles.title}>Session requested</Text>
              <Text style={styles.body}>
                {form.studentName}’s session on {slot?.day} at {slot?.time} has been requested. You’ll hear back to confirm.
              </Text>
              <Pressable style={styles.primary} onPress={onClose}><Text style={styles.primaryText}>Close</Text></Pressable>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ gap: 14 }} keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>Book {slot?.day} at {slot?.time}</Text>

              <Field label="Parent / guardian name" error={errors.guardianName}>
                <TextInput style={styles.input} value={form.guardianName} onChangeText={set('guardianName')} autoComplete="name" />
              </Field>
              <Field label="Student name" error={errors.studentName}>
                <TextInput style={styles.input} value={form.studentName} onChangeText={set('studentName')} />
              </Field>
              <Field label="Phone number" error={errors.phoneNumber}>
              <TextInput
                style={styles.input}
                value={form.phoneNumber}
                onChangeText={set('phoneNumber')}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                placeholder="(555) 123-4567"
                placeholderTextColor="#7A8D93"
              />
            </Field>
              <Field label="Subject" error={errors.subject}>
                <View style={styles.chips}>
                  {SUBJECTS.map((s) => {
                    const on = form.subject === s.name;
                    return (
                      <Pressable key={s.name} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => set('subject')(s.name)} style={[styles.chip, on && styles.chipOn]}>
                        <Text style={[styles.chipText, on && { color: colors.white }]}>{s.name}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Field>

              <Field label="Notes (optional)">
                <TextInput style={[styles.input, { height: 90, textAlignVertical: 'top' }]} multiline value={form.notes} onChangeText={set('notes')} placeholder="Topics, upcoming tests, or what’s been hard so far" placeholderTextColor="#7A8D93" />
              </Field>

              <Checkbox label="I’m interested in recurring sessions" checked={form.wantsRecurring} onChange={set('wantsRecurring')} />
              <Checkbox label="I’m interested in multiple sessions per week" checked={form.wantsMultiplePerWeek} onChange={set('wantsMultiplePerWeek')} />

              {failed && <Text style={styles.error}>Something went wrong. Please try again.</Text>}

              <View style={styles.actions}>
                <Pressable style={styles.secondary} onPress={onClose} disabled={submitting}><Text style={styles.secondaryText}>Cancel</Text></Pressable>
                <Pressable style={[styles.primary, submitting && { opacity: 0.7 }]} onPress={submit} disabled={submitting}>
                  {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryText}>Book now</Text>}
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, error, children }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(31,58,68,0.6)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 520, maxHeight: '92%', backgroundColor: colors.paper, borderRadius: 20, padding: 24 },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.slateDeep, fontWeight: '700' },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.slateDeep },
  label: { fontFamily: fonts.body, fontSize: 14, fontWeight: '700', color: colors.slateDeep },
  input: { fontFamily: fonts.body, fontSize: 16, color: colors.slateDeep, backgroundColor: colors.white, borderWidth: 1, borderColor: '#B9CBD0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.slate, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  chipOn: { backgroundColor: colors.slate },
  chipText: { fontFamily: fonts.body, fontSize: 14, color: colors.slate },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.slate, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  boxOn: { backgroundColor: colors.slate },
  tick: { color: colors.white, fontSize: 14, fontWeight: '700' },
  checkLabel: { fontFamily: fonts.body, fontSize: 15, color: colors.slateDeep, flexShrink: 1 },
  error: { fontFamily: fonts.body, fontSize: 13, color: '#B3261E' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  primary: { backgroundColor: colors.sun, borderRadius: 999, paddingHorizontal: 24, paddingVertical: 12, minWidth: 110, alignItems: 'center' },
  primaryText: { fontFamily: fonts.body, fontWeight: '700', fontSize: 16, color: colors.slateDeep },
  secondary: { borderRadius: 999, borderWidth: 1, borderColor: colors.slate, paddingHorizontal: 22, paddingVertical: 12 },
  secondaryText: { fontFamily: fonts.body, fontWeight: '700', fontSize: 16, color: colors.slate },
});
