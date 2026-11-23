import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FLOORS } from '../data/mockSeats';
import { useSeats } from '../context/SeatContext';

const STATUS_META = {
  free: { label: 'Free', icon: 'checkmark-circle', color: '#15803D', bg: '#DCFCE7', desk: '#16A34A' },
  occupied: { label: 'Occupied', icon: 'close-circle', color: '#B91C1C', bg: '#FEE2E2', desk: '#DC2626' },
  held: { label: 'Held', icon: 'time', color: '#B45309', bg: '#FEF3C7', desk: '#D97706' },
};

export default function S3_FloorMap({ route, navigation }) {
  const { seats, activeHold, unbookSeat, filters, accessibility } = useSeats();
  const [selectedFloor, setSelectedFloor] = useState(route.params?.selectedFloor || 'F2');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const scale = accessibility.largeText ? 1.15 : 1;

  useEffect(() => {
    if (route.params?.selectedFloor) {
      setSelectedFloor(route.params.selectedFloor);
    }
  }, [route.params?.selectedFloor]);

  const floorSeats = seats.filter((s) => {
    if (s.floorId !== selectedFloor) return false;
    if (filters.quietOnly && !s.quiet) return false;
    if (filters.accessibleOnly && !s.accessible) return false;
    if (filters.groupStudyOnly && !s.groupStudy) return false;
    return true;
  });

  const row1Seats = floorSeats.filter((s) => s.row === 1);
  const row2Seats = floorSeats.filter((s) => s.row === 2);

  const handleUnbookPress = async (seatId) => {
    await unbookSeat(seatId);
  };

  const renderDeskNode = (seat) => {
    const isMine = activeHold?.seatId === seat.id;
    const meta = isMine
      ? { label: 'Your Seat', icon: 'person-circle', color: '#1E40AF', bg: '#DBEAFE', desk: '#2563EB' }
      : STATUS_META[seat.status] || STATUS_META.free;

    return (
      <TouchableOpacity
        key={seat.id}
        style={[styles.deskUnit, { borderColor: meta.color, backgroundColor: meta.bg }]}
        onPress={() => navigation.navigate('SeatDetails', { seatId: seat.id })}
      >
        <View style={[styles.tableTop, { backgroundColor: meta.desk }]}>
          <Text style={styles.tableCode}>{seat.id.split('-')[1]}</Text>
          {seat.socket && <Ionicons name="flash" size={11} color="#FEF08A" />}
        </View>

        <View style={styles.chairRow}>
          <Ionicons name={meta.icon} size={18} color={meta.color} />
          {seat.accessible && <Ionicons name="accessibility" size={14} color="#334155" />}
        </View>
        <Text style={[styles.deskStatus, { color: meta.color }]}>
          {isMine ? 'Yours' : meta.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, accessibility.highContrast && styles.highContrastBg]}>
      {/* Active Booking / Unbook Banner */}
      {activeHold && (
        <View style={styles.myBookingBar}>
          <View>
            <Text style={styles.myBookingTitle}>
              Booked: {activeHold.seatId} ({activeHold.checkedIn ? 'Checked In' : 'Held'})
            </Text>
            <Text style={styles.myBookingSub}>Tap Unbook to free this desk immediately</Text>
          </View>
          <TouchableOpacity
            style={styles.unbookBtn}
            onPress={() => handleUnbookPress(activeHold.seatId)}
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            <Text style={styles.unbookBtnText}>Unbook</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floor Selector Tabs */}
      <View style={styles.floorTabs}>
        {FLOORS.map((f) => {
          const active = f.id === selectedFloor;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.floorTab, active && styles.floorTabActive]}
              onPress={() => setSelectedFloor(f.id)}
            >
              <Text style={[styles.floorTabText, active && styles.floorTabTextActive]}>
                Floor {f.id.replace('F', '')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Map vs Scrollable List Toggle */}
      <View style={styles.toggleBar}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Visual Seat Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            Scrollable List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Accessible Legend */}
      <View style={styles.legendRow}>
        {Object.values(STATUS_META).map((m) => (
          <View key={m.label} style={styles.legendItem}>
            <Ionicons name={m.icon} size={14} color={m.color} />
            <Text style={styles.legendText}>{m.label}</Text>
          </View>
        ))}
        <View style={styles.legendItem}>
          <Ionicons name="person-circle" size={14} color="#1E40AF" />
          <Text style={styles.legendText}>Yours</Text>
        </View>
      </View>

      {viewMode === 'map' ? (
        <ScrollView contentContainerStyle={styles.blueprintCard}>
          <View style={styles.windowWall}>
            <Ionicons name="sunny-outline" size={14} color="#0369A1" />
            <Text style={styles.windowText}>NORTH EXTERIOR WINDOWS</Text>
          </View>

          <Text style={styles.zoneLabel}>
            {row1Seats[0]?.zone || 'Window Study Bay'}
          </Text>
          <View style={styles.deskRow}>
            {row1Seats.length > 0 ? (
              row1Seats.map(renderDeskNode)
            ) : (
              <Text style={styles.emptyText}>No desks match active filters in this zone.</Text>
            )}
          </View>

          <View style={styles.aisleStrip}>
            <View style={styles.landmarkBadge}>
              <Ionicons name="walk-outline" size={14} color="#475569" />
              <Text style={styles.landmarkText}>Main Walkway</Text>
            </View>
            <View style={styles.landmarkBadge}>
              <Ionicons name="flash-outline" size={14} color="#B45309" />
              <Text style={styles.landmarkText}>Power Pillar</Text>
            </View>
          </View>

          <Text style={styles.zoneLabel}>
            {row2Seats[0]?.zone || 'Central Study Bay'}
          </Text>
          <View style={styles.deskRow}>
            {row2Seats.length > 0 ? (
              row2Seats.map(renderDeskNode)
            ) : (
              <Text style={styles.emptyText}>No desks match active filters in this zone.</Text>
            )}
          </View>

          <View style={styles.entranceWall}>
            <Ionicons name="enter-outline" size={15} color="#334155" />
            <Text style={styles.entranceText}>STAIRS & LIFT LOBBY ENTRANCE</Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={floorSeats}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
          renderItem={({ item }) => {
            const isMine = activeHold?.seatId === item.id;
            const meta = isMine
              ? { label: 'Your Seat', icon: 'person-circle', color: '#1E40AF', bg: '#DBEAFE' }
              : STATUS_META[item.status] || STATUS_META.free;
            return (
              <View style={[styles.listRow, { backgroundColor: meta.bg, borderColor: meta.color }]}>
                <View style={styles.rowBetween}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => navigation.navigate('SeatDetails', { seatId: item.id })}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name={meta.icon} size={20} color={meta.color} />
                      <Text style={[styles.listSeatId, { color: meta.color, fontSize: 15 * scale }]}>
                        {item.id} • {item.zone}
                      </Text>
                    </View>
                    <Text style={{ color: meta.color, fontWeight: '700', fontSize: 12, marginTop: 4 }}>
                      {meta.label} {item.socket ? '• Power Socket' : ''} {item.accessible ? '• Accessible' : ''}
                    </Text>
                  </TouchableOpacity>

                  {isMine && (
                    <TouchableOpacity
                      style={styles.smallUnbook}
                      onPress={() => handleUnbookPress(item.id)}
                    >
                      <Text style={styles.smallUnbookText}>Unbook</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: '#F8FAFC', gap: 10 },
  highContrastBg: { backgroundColor: '#FFFFFF' },
  myBookingBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E3A8A', padding: 12, borderRadius: 12 },
  myBookingTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  myBookingSub: { color: '#BFDBFE', fontSize: 12 },
  unbookBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#DC2626', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  unbookBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  floorTabs: { flexDirection: 'row', gap: 8 },
  floorTab: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center' },
  floorTabActive: { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
  floorTabText: { fontWeight: '700', color: '#334155', fontSize: 13 },
  floorTabTextActive: { color: '#FFFFFF' },
  toggleBar: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 10, padding: 3 },
  toggleBtn: { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 8 },
  toggleActive: { backgroundColor: '#FFFFFF' },
  toggleText: { fontWeight: '600', color: '#475569', fontSize: 13 },
  toggleTextActive: { color: '#1E40AF', fontWeight: '700' },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendText: { fontSize: 12, color: '#334155', fontWeight: '600' },
  blueprintCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 2, borderColor: '#94A3B8', padding: 12, gap: 12 },
  windowWall: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#E0F2FE', paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#7DD3FC' },
  windowText: { fontSize: 11, fontWeight: '800', color: '#0369A1', letterSpacing: 0.6 },
  zoneLabel: { fontSize: 12, fontWeight: '700', color: '#475569' },
  deskRow: { flexDirection: 'row', justifyContent: 'space-around', gap: 8 },
  deskUnit: { flex: 1, alignItems: 'center', padding: 8, borderRadius: 10, borderWidth: 1.5, gap: 5 },
  tableTop: { width: '100%', paddingVertical: 6, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 },
  tableCode: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  chairRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deskStatus: { fontSize: 11, fontWeight: '700' },
  aisleStrip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F5F9', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1' },
  landmarkBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  landmarkText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  entranceWall: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#F1F5F9', paddingVertical: 8, borderRadius: 6, borderTopWidth: 2, borderTopColor: '#64748B' },
  entranceText: { fontSize: 11, fontWeight: '800', color: '#334155', letterSpacing: 0.6 },
  listRow: { padding: 14, borderRadius: 12, borderWidth: 1.5, gap: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  listSeatId: { fontWeight: '800' },
  smallUnbook: { backgroundColor: '#DC2626', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  smallUnbookText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  emptyText: { color: '#64748B', fontSize: 13, paddingVertical: 12 },
});