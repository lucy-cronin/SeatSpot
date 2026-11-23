import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSeats } from '../context/SeatContext';

export default function S7_AlertsHistory({ navigation }) {
  const { activeHold, alerts, history, accessibility } = useSeats();
  const fontScale = accessibility.largeText ? 1.2 : 1;

  const formatTimer = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.container,
        accessibility.highContrast && styles.highContrastBg,
      ]}
      ListHeaderComponent={
        <>
          {/* Active Hold Banner */}
          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
              Active Seat Hold
            </Text>
            {activeHold ? (
              <TouchableOpacity
                style={styles.holdRow}
                onPress={() => navigation.navigate('HoldConfirm', { seatId: activeHold.seatId })}
              >
                <View>
                  <Text style={[styles.boldText, { fontSize: 16 * fontScale }]}>
                    Seat {activeHold.seatId} •{' '}
                    {activeHold.checkedIn ? 'Checked In' : formatTimer(activeHold.remainingSec)}
                  </Text>
                  <Text style={styles.mutedText}>Tap to manage hold or scan QR</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#1E40AF" />
              </TouchableOpacity>
            ) : (
              <Text style={styles.mutedText}>No active seat hold right now.</Text>
            )}
          </View>

          {/* Weekly Study Summary */}
          <View style={styles.summaryRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { fontSize: 20 * fontScale }]}>11.5 hrs</Text>
              <Text style={styles.mutedText}>Weekly Study</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { fontSize: 20 * fontScale }]}>{alerts.length}</Text>
              <Text style={styles.mutedText}>Active Alerts</Text>
            </View>
          </View>

          {/* Free-Seat Alert Subscriptions */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
                Free-Seat Alerts
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('AlertSetup')}>
                <Text style={styles.linkText}>+ New Alert</Text>
              </TouchableOpacity>
            </View>
            {alerts.length === 0 ? (
              <Text style={styles.mutedText}>No free-seat alerts configured.</Text>
            ) : (
              alerts.map((a) => (
                <View key={a.id} style={styles.alertItem}>
                  <Text style={[styles.boldText, { fontSize: 14 * fontScale }]}>
                    Floor {a.floorId}
                  </Text>
                  <Text style={styles.mutedText}>
                    {[a.quiet && 'Quiet', a.socket && 'Socket', a.accessible && 'Accessible']
                      .filter(Boolean)
                      .join(' • ') || 'Any seat'}
                  </Text>
                </View>
              ))
            )}
          </View>

          <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale, marginTop: 8 }]}>
            Recent Seat History
          </Text>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.historyCard}>
          <View>
            <Text style={[styles.boldText, { fontSize: 15 * fontScale }]}>
              {item.seatId} — {item.floorName}
            </Text>
            <Text style={styles.mutedText}>
              {item.date} • {item.duration}
            </Text>
          </View>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F8FAFC', gap: 12 },
  highContrastBg: { backgroundColor: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 8 },
  summaryRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  statNum: { fontWeight: '700', color: '#1E40AF' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  holdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  alertItem: { paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionTitle: { fontWeight: '700', color: '#0F172A' },
  boldText: { fontWeight: '600', color: '#0F172A' },
  mutedText: { color: '#64748B', fontSize: 13 },
  linkText: { color: '#1E40AF', fontWeight: '600' },
  badgeText: { color: '#15803D', fontWeight: '600', fontSize: 13 },
});