export const FLOORS = [
  { id: 'F1', name: 'Ground Floor Commons', occupancyPct: 72, freeSeats: 14 },
  { id: 'F2', name: 'Level 2 Quiet Study', occupancyPct: 64, freeSeats: 19 },
  { id: 'F3', name: 'Level 3 Group & Tech Zone', occupancyPct: 55, freeSeats: 27 },
];

export const INITIAL_SEATS = [
  // Floor 1
  {
    id: 'F1-A01', floorId: 'F1', floorName: 'Ground Floor Commons', zone: 'Atrium Window',
    row: 1, col: 1, status: 'free', socket: true, window: true, quiet: false, accessible: true, groupStudy: false,
    directions: ['Enter Ground Floor Commons past the main reception.', 'Turn left toward the South Courtyard windows.', 'Seat F1-A01 is the first accessible desk on the left.'],
    walkTime: '20 sec (15 m)',
  },
  {
    id: 'F1-A02', floorId: 'F1', floorName: 'Ground Floor Commons', zone: 'Atrium Window',
    row: 1, col: 2, status: 'occupied', socket: true, window: true, quiet: false, accessible: false, groupStudy: false,
    directions: ['Enter Ground Floor Commons past the main reception.', 'Turn left toward the South Courtyard windows.', 'Seat F1-A02 is next to F1-A01.'],
    walkTime: '25 sec (18 m)',
  },
  {
    id: 'F1-B01', floorId: 'F1', floorName: 'Ground Floor Commons', zone: 'Cafe Commons',
    row: 2, col: 1, status: 'free', socket: false, window: false, quiet: false, accessible: true, groupStudy: true,
    directions: ['Walk straight past the self-service kiosks.', 'Seat F1-B01 is in the open commons cluster.'],
    walkTime: '30 sec (22 m)',
  },
  {
    id: 'F1-B02', floorId: 'F1', floorName: 'Ground Floor Commons', zone: 'Cafe Commons',
    row: 2, col: 2, status: 'free', socket: true, window: false, quiet: false, accessible: false, groupStudy: true,
    directions: ['Walk straight past the self-service kiosks.', 'Seat F1-B02 is across from F1-B01.'],
    walkTime: '30 sec (24 m)',
  },

  // Floor 2 (2 held seats: F2-A01 and F2-B01)
  {
    id: 'F2-A01', floorId: 'F2', floorName: 'Level 2 Quiet Study', zone: 'North Window Row',
    row: 1, col: 1, status: 'held', socket: true, window: true, quiet: true, accessible: true, groupStudy: false,
    directions: ['Enter Level 2 from the main atrium lift lobby.', 'Turn left past the study carrels toward the north glass wall.', 'Seat F2-A01 is the second desk on your right beside the power pillar.'],
    walkTime: '45 sec (35 m)',
  },
  {
    id: 'F2-A02', floorId: 'F2', floorName: 'Level 2 Quiet Study', zone: 'North Window Row',
    row: 1, col: 2, status: 'occupied', socket: true, window: true, quiet: true, accessible: false, groupStudy: false,
    directions: ['Enter Level 2 from the main atrium lift lobby.', 'Turn left toward the north glass wall.', 'Seat F2-A02 is immediately next to F2-A01.'],
    walkTime: '50 sec (38 m)',
  },
  {
    id: 'F2-A03', floorId: 'F2', floorName: 'Level 2 Quiet Study', zone: 'North Window Row',
    row: 1, col: 3, status: 'free', socket: true, window: true, quiet: true, accessible: false, groupStudy: false,
    directions: ['Enter Level 2 from the main atrium lift lobby.', 'Walk to the far end of the North Window Row.', 'Seat F2-A03 is the corner window desk.'],
    walkTime: '55 sec (42 m)',
  },
  {
    id: 'F2-B01', floorId: 'F2', floorName: 'Level 2 Quiet Study', zone: 'Central Quiet Desks',
    row: 2, col: 1, status: 'held', socket: true, window: false, quiet: true, accessible: true, groupStudy: false,
    directions: ['Take the east stairs or lift to Level 2.', 'Walk straight into the central bay past the printer station.', 'Seat F2-B01 has extra wheelchair clearance.'],
    walkTime: '30 sec (22 m)',
  },
  {
    id: 'F2-B02', floorId: 'F2', floorName: 'Level 2 Quiet Study', zone: 'Central Quiet Desks',
    row: 2, col: 2, status: 'occupied', socket: false, window: false, quiet: true, accessible: false, groupStudy: false,
    directions: ['Take the east stairs or lift to Level 2.', 'Seat F2-B02 is in the middle row of the central bay.'],
    walkTime: '35 sec (25 m)',
  },
  {
    id: 'F2-B03', floorId: 'F2', floorName: 'Level 2 Quiet Study', zone: 'Central Quiet Desks',
    row: 2, col: 3, status: 'free', socket: true, window: false, quiet: true, accessible: false, groupStudy: false,
    directions: ['Take the east stairs or lift to Level 2.', 'Seat F2-B03 is on the right aisle of the central bay.'],
    walkTime: '35 sec (26 m)',
  },

  // Floor 3
  {
    id: 'F3-C01', floorId: 'F3', floorName: 'Level 3 Group & Tech Zone', zone: 'Collaboration Booths',
    row: 1, col: 1, status: 'occupied', socket: true, window: true, quiet: false, accessible: true, groupStudy: true,
    directions: ['Head up to Level 3 via the central stairwell.', 'Turn right at the media wall.', 'Seat F3-C01 is Booth 1.'],
    walkTime: '1 min 05 sec (50 m)',
  },
  {
    id: 'F3-C02', floorId: 'F3', floorName: 'Level 3 Group & Tech Zone', zone: 'Collaboration Booths',
    row: 1, col: 2, status: 'free', socket: true, window: true, quiet: false, accessible: true, groupStudy: true,
    directions: ['Head up to Level 3 via the central stairwell.', 'Turn right at the media wall into Collaboration Booths.', 'Seat F3-C02 is at the corner table with dual outlets.'],
    walkTime: '1 min 10 sec (55 m)',
  },
  {
    id: 'F3-D01', floorId: 'F3', floorName: 'Level 3 Group & Tech Zone', zone: 'Dual-Monitor Pods',
    row: 2, col: 1, status: 'free', socket: true, window: false, quiet: false, accessible: false, groupStudy: true,
    directions: ['Exit the Level 3 lift and turn left.', 'Seat F3-D01 is the first dual-monitor workstation.'],
    walkTime: '1 min 00 sec (48 m)',
  },
  {
    id: 'F3-D02', floorId: 'F3', floorName: 'Level 3 Group & Tech Zone', zone: 'Dual-Monitor Pods',
    row: 2, col: 2, status: 'free', socket: true, window: false, quiet: false, accessible: true, groupStudy: true,
    directions: ['Exit the Level 3 lift and turn left.', 'Seat F3-D02 is the height-adjustable monitor pod.'],
    walkTime: '1 min 05 sec (50 m)',
  },
];

export const INITIAL_HOLDS = [
  { seatId: 'F2-A01', remainingSec: 12 * 60, checkedIn: false },
  { seatId: 'F2-B01', remainingSec: 9 * 60 + 30, checkedIn: false },
];

export const INITIAL_HISTORY = [
  { id: 'H1', seatId: 'F2-A04', floorName: 'Level 2 Quiet Study', date: 'Yesterday', duration: '2h 15m', status: 'Checked In' },
  { id: 'H2', seatId: 'F3-C01', floorName: 'Level 3 Group & Tech Zone', date: '3 days ago', duration: '1h 40m', status: 'Completed' },
];