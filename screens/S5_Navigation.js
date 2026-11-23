import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSeats } from '../context/SeatContext';

export default function S5_Navigation({ route, navigation }) {
  const { seats } = useSeats();
  const seatId = route.params?.seatId || 'F2-A01';
  const seat = seats.find((s) => s.id === seatId) || seats[0];

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.seatTitle}>Walking to {seat.id}</Text>
        <Text style={styles.meta}>
          {seat.floorName} • Est. {seat.walkTime}
        </Text>
      </View>

      <View style={styles.stepsCard}>
        {seat.directions.map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{idx + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.arriveBtn}
        onPress={() => navigation.navigate('HoldConfirm', { seatId: seat.id, openScanner: true })}
      >
        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
        <Text style={styles.arriveText}>I've Arrived — Confirm Seat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC', gap: 16 },
  headerCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  seatTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  meta: { color: '#475569', marginTop: 4 },
  stepsCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 14 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' },
  stepNumText: { color: '#1E40AF', fontWeight: '700' },
  stepText: { flex: 1, fontSize: 15, color: '#1E293B', lineHeight: 21 },
  arriveBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#15803D', padding: 15, borderRadius: 12, marginTop: 'auto' },
  arriveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});