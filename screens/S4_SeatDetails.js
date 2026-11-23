import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSeats } from '../context/SeatContext';

export default function S4_SeatDetails({ route, navigation }) {
  const {
    seats,
    activeHold,
    holdSeat,
    unbookSeat,
    reportWrongStatus,
    accessibility,
  } = useSeats();

  const seatId = route.params?.seatId || 'F2-A01';
  const seat = seats.find((s) => s.id === seatId) || seats[0];
  const isMySeat = activeHold?.seatId === seat.id;
  const scale = accessibility.largeText ? 1.15 : 1;

  const handleHold = async () => {
    await holdSeat(seat.id);
    navigation.navigate('HoldConfirm', { seatId: seat.id });
  };

  const handleUnbook = async () => {
    await unbookSeat(seat.id);
  };

  const handleReportStatus = async () => {
    const nextStatus = seat.status === 'free' ? 'occupied' : 'free';
    await reportWrongStatus(seat.id, nextStatus);
  };

  const attributes = [
    { label: 'Power Socket', active: seat.socket, icon: 'flash-outline' },
    { label: 'Window Desk', active: seat.window, icon: 'sunny-outline' },
    { label: 'Quiet Zone', active: seat.quiet, icon: 'volume-mute-outline' },
    { label: 'Accessible Seating', active: seat.accessible, icon: 'accessibility-outline' },
    { label: 'Group Study Space', active: seat.groupStudy, icon: 'people-outline' },
  ];

  const displayStatus = isMySeat
    ? activeHold.checkedIn
      ? 'YOUR SEAT (CHECKED IN)'
      : 'YOUR HOLD (ACTIVE)'
    : seat.status.toUpperCase();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        accessibility.highContrast && styles.highContrastBg,
      ]}
    >
      {/* Seat Header Card */}
      <View
        style={[
          styles.headerCard,
          accessibility.highContrast && styles.highContrastCard,
        ]}
      >
        <View style={styles.rowBetween}>
          <Text style={[styles.title, { fontSize: 24 * scale }]}>{seat.id}</Text>
          <View
            style={[
              styles.statusPill,
              isMySeat && styles.mySeatPill,
              seat.status === 'occupied' && !isMySeat && styles.occupiedPill,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isMySeat && styles.mySeatText,
                seat.status === 'occupied' && !isMySeat && styles.occupiedText,
              ]}
            >
              {displayStatus}
            </Text>
          </View>
        </View>

        <Text style={[styles.subtitle, { fontSize: 15 * scale }]}>
          {seat.floorName} • {seat.zone}
        </Text>
        <Text style={styles.walkMeta}>
          Est. walk from entrance: {seat.walkTime}
        </Text>
      </View>

      {/* Seat Attributes Card */}
      <View
        style={[
          styles.attrCard,
          accessibility.highContrast && styles.highContrastCard,
        ]}
      >
        <Text style={[styles.sectionTitle, { fontSize: 16 * scale }]}>
          Desk Features & Zone Rules
        </Text>
        {attributes.map((attr) => (
          <View key={attr.label} style={styles.attrRow}>
            <View style={styles.attrLeft}>
              <Ionicons name={attr.icon} size={18} color="#334155" />
              <Text style={[styles.attrLabel, { fontSize: 15 * scale }]}>
                {attr.label}
              </Text>
            </View>
            <Text style={attr.active ? styles.yesText : styles.noText}>
              {attr.active ? 'Yes' : 'No'}
            </Text>
          </View>
        ))}
      </View>

      {/* Primary Hold or Unbook Action */}
      {isMySeat ? (
        <>
          <TouchableOpacity
            style={styles.manageHoldBtn}
            onPress={() => navigation.navigate('HoldConfirm', { seatId: seat.id })}
          >
            <Ionicons name="timer-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.primaryBtnText, { fontSize: 16 * scale }]}>
              Open Hold Timer & QR Check-In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.unbookBtn} onPress={handleUnbook}>
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.primaryBtnText, { fontSize: 16 * scale }]}>
              Unbook Seat ({seat.id})
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            seat.status !== 'free' && styles.disabledBtn,
          ]}
          disabled={seat.status !== 'free'}
          onPress={handleHold}
        >
          <Ionicons name="time" size={20} color="#FFFFFF" />
          <Text style={[styles.primaryBtnText, { fontSize: 16 * scale }]}>
            {seat.status === 'free'
              ? 'Hold for 15 Min'
              : `Seat Currently ${seat.status.toUpperCase()}`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Indoor Wayfinding Action */}
      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('Navigation', { seatId: seat.id })}
      >
        <Ionicons name="navigate-outline" size={20} color="#1E40AF" />
        <Text style={[styles.secondaryBtnText, { fontSize: 15 * scale }]}>
          Navigate to Seat
        </Text>
      </TouchableOpacity>

      {/* Report Wrong Status Action */}
      <TouchableOpacity style={styles.reportBtn} onPress={handleReportStatus}>
        <Ionicons name="flag-outline" size={17} color="#B45309" />
        <Text style={[styles.reportText, { fontSize: 14 * scale }]}>
          Report Wrong Status (Toggle Free / Occupied)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
    gap: 12,
    paddingBottom: 28,
  },
  highContrastBg: {
    backgroundColor: '#FFFFFF',
  },
  highContrastCard: {
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    color: '#334155',
    fontWeight: '500',
  },
  walkMeta: {
    color: '#64748B',
    fontSize: 13,
  },
  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    color: '#15803D',
    fontWeight: '700',
    fontSize: 11,
  },
  mySeatPill: {
    backgroundColor: '#DBEAFE',
  },
  mySeatText: {
    color: '#1E40AF',
  },
  occupiedPill: {
    backgroundColor: '#FEE2E2',
  },
  occupiedText: {
    color: '#B91C1C',
  },
  attrCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  attrLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attrLabel: {
    color: '#1E293B',
    fontWeight: '500',
  },
  yesText: {
    color: '#15803D',
    fontWeight: '700',
    fontSize: 14,
  },
  noText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E40AF',
    padding: 15,
    borderRadius: 12,
    marginTop: 4,
  },
  manageHoldBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E40AF',
    padding: 15,
    borderRadius: 12,
    marginTop: 4,
  },
  unbookBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 12,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E40AF',
  },
  secondaryBtnText: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  reportBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 4,
  },
  reportText: {
    color: '#B45309',
    fontWeight: '700',
  },
});