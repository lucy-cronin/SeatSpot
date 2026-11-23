import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSeats } from '../context/SeatContext';

function QrVerificationPanel({ seatId, onVerified, onClose }) {
  const { confirmArrival } = useSeats();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.qrBox}>
        <Text style={styles.qrMsg}>Camera access is needed to scan the desk QR code.</Text>
        <TouchableOpacity style={styles.qrBtn} onPress={requestPermission}>
          <Text style={styles.qrBtnText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    await confirmArrival(seatId);
    Alert.alert('Arrival Confirmed', `Verified seat ${seatId} via QR (${data}).`, [
      { text: 'OK', onPress: onVerified },
    ]);
  };

  return (
    <View style={styles.qrBox}>
      <View style={styles.cameraBox}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />
      </View>
      <Text style={styles.qrMsg}>Point camera at desk QR tag for {seatId}</Text>

      {/* Instant demo scan button for live testing without printing a QR code */}
      <TouchableOpacity
        style={styles.simBtn}
        onPress={() => handleScan({ data: `SEATSPOT:${seatId}` })}
      >
        <Text style={styles.qrBtnText}>Simulate QR Scan ({seatId})</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose}>
        <Text style={styles.closeQrText}>Close QR Scanner</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function S6_HoldConfirm({ route, navigation }) {
  const {
    activeHold,
    holdSeat,
    extendHold,
    releaseHold,
    confirmArrival,
    accessibility,
  } = useSeats();

  const targetSeatId = route.params?.seatId || activeHold?.seatId || 'F2-A01';
  const [showQr, setShowQr] = useState(Boolean(route.params?.openScanner));
  const scale = accessibility.largeText ? 1.15 : 1;

  const formatCountdown = (sec = 0) => {
    const mins = String(Math.floor(sec / 60)).padStart(2, '0');
    const secs = String(sec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleRelease = async () => {
    await releaseHold();
    navigation.navigate('MainTabs', { screen: 'Floor Map' });
  };

  const handleStartNewHold = async () => {
    await holdSeat(targetSeatId);
  };

  const isCurrentSeatHeld = activeHold && activeHold.seatId === targetSeatId;

  return (
    <View style={[styles.container, accessibility.highContrast && styles.highContrastBg]}>
      <View style={styles.timerCard}>
        <Text style={styles.label}>Seat {targetSeatId}</Text>

        {isCurrentSeatHeld ? (
          <>
            <Text style={[styles.timerText, { fontSize: 42 * scale }]}>
              {activeHold.checkedIn ? 'CHECKED IN' : formatCountdown(activeHold.remainingSec)}
            </Text>
            <Text style={styles.subText}>
              {activeHold.checkedIn
                ? 'Your seat is now marked occupied for your study session.'
                : 'Scan the desk QR code or confirm arrival before the hold expires.'}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.timerText, { fontSize: 28 * scale }]}>No Active Hold</Text>
            <Text style={styles.subText}>
              Start a 15-minute hold on {targetSeatId} or scan its QR code on arrival.
            </Text>
          </>
        )}
      </View>

      {isCurrentSeatHeld && !activeHold.checkedIn && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.extendBtn} onPress={extendHold}>
            <Ionicons name="add-circle-outline" size={18} color="#1E40AF" />
            <Text style={styles.extendText}>Extend +10m</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.releaseBtn} onPress={handleRelease}>
            <Ionicons name="close-circle-outline" size={18} color="#B91C1C" />
            <Text style={styles.releaseText}>Release Seat</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isCurrentSeatHeld && (
        <TouchableOpacity style={styles.primaryBtn} onPress={handleStartNewHold}>
          <Ionicons name="time-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>Hold {targetSeatId} for 15 Min</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.qrTriggerBtn}
        onPress={() => setShowQr((prev) => !prev)}
      >
        <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
        <Text style={styles.primaryBtnText}>
          {showQr ? 'Hide QR Scanner' : 'Scan QR Instead (Verify Seat)'}
        </Text>
      </TouchableOpacity>

      {isCurrentSeatHeld && !activeHold.checkedIn && (
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={async () => {
            await confirmArrival(targetSeatId);
            Alert.alert('Confirmed', `You are checked into seat ${targetSeatId}.`);
          }}
        >
          <Text style={styles.confirmText}>Confirm Arrival Without QR</Text>
        </TouchableOpacity>
      )}

      {showQr && (
        <QrVerificationPanel
          seatId={targetSeatId}
          onVerified={() => setShowQr(false)}
          onClose={() => setShowQr(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC', gap: 12 },
  highContrastBg: { backgroundColor: '#FFFFFF' },
  timerCard: { backgroundColor: '#0F172A', padding: 20, borderRadius: 14, alignItems: 'center', gap: 6 },
  label: { color: '#93C5FD', fontWeight: '700', fontSize: 15 },
  timerText: { color: '#FFFFFF', fontWeight: '800', fontVariant: ['tabular-nums'] },
  subText: { color: '#CBD5E1', fontSize: 13, textAlign: 'center', lineHeight: 19 },
  actionRow: { flexDirection: 'row', gap: 10 },
  extendBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#EFF6FF', padding: 13, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  extendText: { color: '#1E40AF', fontWeight: '700' },
  releaseBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', padding: 13, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA' },
  releaseText: { color: '#B91C1C', fontWeight: '700' },
  primaryBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#1E40AF', padding: 15, borderRadius: 12 },
  qrTriggerBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#15803D', padding: 15, borderRadius: 12 },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  confirmBtn: { alignItems: 'center', paddingVertical: 8 },
  confirmText: { color: '#1E40AF', fontWeight: '600', fontSize: 14 },
  qrBox: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 10 },
  cameraBox: { width: '100%', height: 190, borderRadius: 10, overflow: 'hidden', backgroundColor: '#000' },
  qrMsg: { fontSize: 13, color: '#334155', textAlign: 'center' },
  qrBtn: { backgroundColor: '#1E40AF', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 8 },
  simBtn: { backgroundColor: '#0F172A', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 8 },
  qrBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  closeQrText: { color: '#64748B', fontWeight: '600', fontSize: 13 },
});