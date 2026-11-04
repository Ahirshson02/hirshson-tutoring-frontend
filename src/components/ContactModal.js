import { Modal, Pressable, StyleSheet, Text, View, Linking } from 'react-native';
import { colors, fonts } from '../theme';

export default function ContactModal({
  visible,
  onClose,
  phone = process.env.EXPO_PUBLIC_PHONE,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Inner Pressable swallows taps so clicking the card doesn't close it */}
        <Pressable style={styles.popup} onPress={() => {}}>
          <Text style={styles.text}>Contact me directly:</Text>
          <Pressable onPress={() => Linking.openURL(`tel:${phone}`)}>
            <Text style={styles.phone}>{phone}</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    maxWidth: 360,
    width: '100%',
    alignItems: 'center',
  },
  text: { fontFamily: fonts.body, fontSize: 17, color: colors.slateDeep },
  phone: {
    fontFamily: fonts.body,
    fontSize: 22,
    color: colors.slateDeep,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  closeBtn: { marginTop: 10, paddingVertical: 8, paddingHorizontal: 16 },
  closeText: { fontFamily: fonts.body, fontSize: 16, color: colors.slateDeep },
});