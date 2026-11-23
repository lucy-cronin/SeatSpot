import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { INITIAL_SEATS, INITIAL_HISTORY } from '../data/mockSeats';

const SeatContext = createContext(null);
const HOLD_SECONDS = 15 * 60;

const triggerHaptic = async (type = 'success') => {
  if (Platform.OS === 'web') return;
  try {
    if (type === 'warning') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (type === 'medium') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch (e) {}
};

export function SeatProvider({ children }) {
  const [seats, setSeats] = useState(INITIAL_SEATS);
  const [activeHold, setActiveHold] = useState(null); // { seatId, remainingSec, checkedIn }
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [filters, setFilters] = useState({
    quietOnly: false,
    accessibleOnly: false,
    groupStudyOnly: false,
  });
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false,
  });

  useEffect(() => {
    if (!activeHold || activeHold.checkedIn) return;
    const interval = setInterval(() => {
      setActiveHold((prev) => {
        if (!prev) return null;
        if (prev.remainingSec <= 1) {
          setSeats((curr) =>
            curr.map((s) => (s.id === prev.seatId ? { ...s, status: 'free' } : s))
          );
          return null;
        }
        return { ...prev, remainingSec: prev.remainingSec - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeHold?.seatId, activeHold?.checkedIn]);

  const holdSeat = async (seatId) => {
    setSeats((curr) =>
      curr.map((s) => {
        if (s.id === seatId) return { ...s, status: 'held' };
        if (activeHold && s.id === activeHold.seatId) return { ...s, status: 'free' };
        return s;
      })
    );
    setActiveHold({ seatId, remainingSec: HOLD_SECONDS, checkedIn: false });
    await triggerHaptic('success');
  };

  const extendHold = async () => {
    setActiveHold((prev) =>
      prev ? { ...prev, remainingSec: prev.remainingSec + 10 * 60 } : null
    );
    await triggerHaptic('medium');
  };

  const unbookSeat = async (seatId) => {
    const targetId = seatId || activeHold?.seatId;
    if (!targetId) return;

    setSeats((curr) =>
      curr.map((s) => (s.id === targetId ? { ...s, status: 'free' } : s))
    );
    setActiveHold((prev) => (prev?.seatId === targetId ? null : prev));
    await triggerHaptic('warning');
  };

  const releaseHold = async () => {
    await unbookSeat(activeHold?.seatId);
  };

  const confirmArrival = async (seatId) => {
    setSeats((curr) =>
      curr.map((s) => (s.id === seatId ? { ...s, status: 'occupied' } : s))
    );
    setActiveHold((prev) =>
      prev ? { ...prev, seatId, checkedIn: true } : { seatId, remainingSec: 0, checkedIn: true }
    );
    setHistory((prev) => [
      {
        id: String(Date.now()),
        seatId,
        floorName: 'Active Session',
        date: 'Today',
        duration: 'Just started',
        status: 'Checked In',
      },
      ...prev,
    ]);
    await triggerHaptic('success');
  };

  const reportWrongStatus = async (seatId, nextStatus) => {
    setSeats((curr) =>
      curr.map((s) => (s.id === seatId ? { ...s, status: nextStatus } : s))
    );
    if (nextStatus === 'free' && activeHold?.seatId === seatId) {
      setActiveHold(null);
    }
    await triggerHaptic('medium');
  };

  const addAlert = async (alertConfig) => {
    setAlerts((prev) => [{ id: String(Date.now()), ...alertConfig }, ...prev]);
    await triggerHaptic('success');
  };

  return (
    <SeatContext.Provider
      value={{
        seats,
        activeHold,
        alerts,
        history,
        filters,
        setFilters,
        accessibility,
        setAccessibility,
        holdSeat,
        extendHold,
        releaseHold,
        unbookSeat,
        confirmArrival,
        reportWrongStatus,
        addAlert,
      }}
    >
      {children}
    </SeatContext.Provider>
  );
}

export const useSeats = () => useContext(SeatContext);