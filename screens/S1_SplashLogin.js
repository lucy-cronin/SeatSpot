import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function S1_SplashLogin({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <Ionicons name="library" size={40} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>SeatSpot</Text>
      <Text style={styles.subtitle}>
        Find free study seats, hold for 15 minutes, and navigate indoors.
      </Text>

      <TouchableOpacity
        style={styles.ssoBtn}
        onPress={() => navigation.replace('MainTabs')}
      >
        <Ionicons name="flash" size={20} color="#FFFFFF" />
        <Text style={styles.ssoText}>Quick Demo Login (Bypass SSO)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0F172A', gap: 14 },
  iconBadge: { width: 76, height: 76, borderRadius: 20, backgroundColor: '#1E40AF', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 15, color: '#CBD5E1', textAlign: 'center', maxWidth: 300, lineHeight: 22 },
  ssoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#2563EB', paddingVertical: 15, paddingHorizontal: 24, borderRadius: 12, marginTop: 18 },
  ssoText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});