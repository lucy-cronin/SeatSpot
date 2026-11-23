import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FLOORS } from '../data/mockSeats';
import { useSeats } from '../context/SeatContext';

export default function S8_AlertSetup({ navigation }) {
  const { addAlert } = useSeats();
  const [floorId, setFloorId] = useState('F2');
  const [quiet, setQuiet] = useState(true);
  const [socket, setSocket] = useState(true);
  const [accessible, setAccessible] = useState(false);

  const handleSave = async () => {
    await addAlert({ floorId, quiet, socket, accessible });
    Alert.alert('Alert Saved', `We'll notify you when a matching seat opens on ${floorId}.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Floor</Text>
      <View style={styles.floorRow}>
        {FLOORS.map((f) => {
          const active = f.id === floorId;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.floorChip, active && styles.floorChipActive]}
              onPress={() => setFloorId(f.id)}
            >
              <Text style={[styles.floorChipText, active && styles.floorChipTextActive]}>
                {f.id} ({f.freeSeats} free)
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.switchCard}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Quiet Zone</Text>
          <Switch value={quiet} onValueChange={setQuiet} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Power Socket Required</Text>
          <Switch value={socket} onValueChange={setSocket} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Accessible Desk</Text>
          <Switch value={accessible} onValueChange={setAccessible} />
        </View>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
        <Text style={styles.primaryBtnText}>Create Free-Seat Alert</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC', gap: 16 },
  label: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  floorRow: { flexDirection: 'row', gap: 8 },
  floorChip: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center' },
  floorChipActive: { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
  floorChipText: { fontWeight: '600', color: '#334155', fontSize: 13 },
  floorChipTextActive: { color: '#FFFFFF' },
  switchCard: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  switchLabel: { fontSize: 15, color: '#0F172A', fontWeight: '500' },
  primaryBtn: { backgroundColor: '#1E40AF', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});