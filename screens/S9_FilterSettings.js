import React from 'react';
import { ScrollView, View, Text, Switch, StyleSheet } from 'react-native';
import { useSeats } from '../context/SeatContext';

export default function S9_FilterSettings() {
  const { filters, setFilters, accessibility, setAccessibility } = useSeats();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        accessibility.highContrast && styles.highContrastBg,
      ]}
    >
      <Text style={styles.sectionTitle}>Seat Search Filters</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.itemLabel}>Quiet Areas Only</Text>
          <Switch
            value={filters.quietOnly}
            onValueChange={(v) => setFilters((p) => ({ ...p, quietOnly: v }))}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.itemLabel}>Accessible Seating Only</Text>
          <Switch
            value={filters.accessibleOnly}
            onValueChange={(v) => setFilters((p) => ({ ...p, accessibleOnly: v }))}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.itemLabel}>Group Study Spaces</Text>
          <Switch
            value={filters.groupStudyOnly}
            onValueChange={(v) => setFilters((p) => ({ ...p, groupStudyOnly: v }))}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Accessibility</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.itemLabel}>Larger Text Scale</Text>
          <Switch
            value={accessibility.largeText}
            onValueChange={(v) => setAccessibility((p) => ({ ...p, largeText: v }))}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.itemLabel}>High Contrast Mode</Text>
          <Switch
            value={accessibility.highContrast}
            onValueChange={(v) => setAccessibility((p) => ({ ...p, highContrast: v }))}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Privacy & Prototype Help</Text>
      <View style={styles.card}>
        <Text style={styles.helpText}>
          • Occupancy & sensor data in this Expo Go prototype are simulated locally for demonstration.
        </Text>
        <Text style={styles.helpText}>
          • Camera access is used strictly on-device when scanning a desk QR code to confirm arrival.
        </Text>
        <Text style={styles.helpText}>
          • No external university credentials or personal analytics are transmitted.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F8FAFC', gap: 12 },
  highContrastBg: { backgroundColor: '#FFFFFF' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemLabel: { fontSize: 15, color: '#0F172A', fontWeight: '500' },
  helpText: { fontSize: 14, color: '#475569', paddingVertical: 6, lineHeight: 20 },
});