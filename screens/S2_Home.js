import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FLOORS } from '../data/mockSeats';
import { useSeats } from '../context/SeatContext';

export default function S2_Home({ navigation }) {
  const { seats, activeHold, accessibility } = useSeats();
  const scale = accessibility.largeText ? 1.15 : 1;

  const freeCount = seats.filter((s) => s.status === 'free').length;
  const totalCount = seats.length;
  const liveOccupancy = Math.round(((totalCount - freeCount) / totalCount) * 100);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        accessibility.highContrast && styles.highContrastBg,
      ]}
    >
      {/* Live Building Occupancy Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>MTU Library • Live Occupancy</Text>
        <Text style={[styles.heroPercent, { fontSize: 34 * scale }]}>
          {liveOccupancy}% Full
        </Text>
        <Text style={styles.heroSub}>
          {freeCount} of {totalCount} tracked seats currently free
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickRow}>
        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => navigation.navigate('AlertSetup')}
        >
          <Ionicons name="notifications-outline" size={20} color="#1E40AF" />
          <Text style={styles.quickBtnText}>Notify Me</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickBtn, activeHold && styles.quickBtnActive]}
          onPress={() =>
            activeHold
              ? navigation.navigate('HoldConfirm', { seatId: activeHold.seatId })
              : navigation.navigate('Alerts')
          }
        >
          <Ionicons
            name="time-outline"
            size={20}
            color={activeHold ? '#FFFFFF' : '#1E40AF'}
          />
          <Text
            style={[
              styles.quickBtnText,
              activeHold && { color: '#FFFFFF' },
            ]}
          >
            {activeHold ? `My Hold (${activeHold.seatId})` : 'My Hold'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Per-Floor Free Seat Breakdown */}
      <Text style={[styles.sectionTitle, { fontSize: 16 * scale }]}>
        Floors & Free Seats
      </Text>
      {FLOORS.map((floor) => {
        const floorFree = seats.filter(
          (s) => s.floorId === floor.id && s.status === 'free'
        ).length;
        return (
          <TouchableOpacity
            key={floor.id}
            style={styles.floorCard}
            onPress={() =>
              navigation.navigate('Floor Map', { selectedFloor: floor.id })
            }
          >
            <View>
              <Text style={[styles.floorName, { fontSize: 15 * scale }]}>
                {floor.name}
              </Text>
              <Text style={styles.mutedText}>
                {floor.occupancyPct}% typical load • Tap to view seats
              </Text>
            </View>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>
                {floorFree > 0 ? `${floorFree} Free` : 'View'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F8FAFC', gap: 12 },
  highContrastBg: { backgroundColor: '#FFFFFF' },
  heroCard: { backgroundColor: '#1E3A8A', padding: 20, borderRadius: 14, gap: 4 },
  heroLabel: { color: '#BFDBFE', fontSize: 13, fontWeight: '600' },
  heroPercent: { color: '#FFFFFF', fontWeight: '800' },
  heroSub: { color: '#DBEAFE', fontSize: 14 },
  quickRow: { flexDirection: 'row', gap: 10 },
  quickBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1' },
  quickBtnActive: { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
  quickBtnText: { fontWeight: '700', color: '#1E40AF', fontSize: 14 },
  sectionTitle: { fontWeight: '700', color: '#0F172A', marginTop: 4 },
  floorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  floorName: { fontWeight: '700', color: '#0F172A' },
  mutedText: { color: '#64748B', fontSize: 13, marginTop: 2 },
  freeBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  freeBadgeText: { color: '#15803D', fontWeight: '700', fontSize: 13 },
});