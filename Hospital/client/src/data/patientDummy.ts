// Dummy data powering the patient dashboard — swap for real API data later.

export type Newsletter = { title: string; source: string; href: string };
export type AppointmentStatus = 'approved' | 'pending';
export type Appointment = { day: number; doctor: string; specialty: string; time: string; status: AppointmentStatus };
export type RejectedAppointment = { id: string; doctor: string; date: string; reason: string };
export type NearestLocation = { name: string; address: string; distance: string };
export type Prescription = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  medicines: string[];
  notes: string;
};

// The highlighted upcoming visit shown in the hero card.
export const nextAppointment = {
  doctor: 'Dr. Meera Sharma',
  specialty: 'General Physician',
  dateLabel: 'Thu, Jul 3',
  time: '10:30 AM',
  location: 'City Care Hospital, Kolkata',
  status: 'Approved',
};

// Appointments for the current month — drive both the calendar tints and the day detail.
export const appointments: Appointment[] = [
  { day: 3, doctor: 'Dr. Meera Sharma', specialty: 'General Physician', time: '10:30 AM', status: 'approved' },
  { day: 9, doctor: 'Dr. Anita Rao', specialty: 'Cardiology', time: '02:00 PM', status: 'pending' },
  { day: 12, doctor: 'Dr. Rohan Das', specialty: 'Dermatology', time: '11:15 AM', status: 'approved' },
  { day: 18, doctor: 'Dr. Kiran Shah', specialty: 'ENT', time: '09:45 AM', status: 'pending' },
  { day: 21, doctor: 'Dr. Neha Gupta', specialty: 'Pediatrics', time: '04:30 PM', status: 'approved' },
  { day: 27, doctor: 'Dr. Sameer Roy', specialty: 'Orthopedics', time: '01:00 PM', status: 'pending' },
];

// Rejected appointments called out in their own card.
export const rejectedAppointments: RejectedAppointment[] = [
  { id: 'rej-1', doctor: 'Dr. Anita Rao (Cardiology)', date: '05 Jun 2026', reason: 'Doctor unavailable — please rebook.' },
  { id: 'rej-2', doctor: 'Dr. Vikram Nair (Orthopedics)', date: '14 Jun 2026', reason: 'Slot no longer available.' },
];

// Closest facility summarised on the dashboard (full map lives under Locations).
export const nearestLocation: NearestLocation = {
  name: 'City Care Hospital',
  address: '44 Park Street, Kolkata 700016',
  distance: '2.1 km',
};

// Reference health reads shown as external links.
export const newsletters: Newsletter[] = [
  { title: 'Intermittent fasting and heart health', source: 'Harvard Health Letter', href: 'https://www.health.harvard.edu/' },
  { title: 'Managing blood pressure at home', source: 'Mayo Clinic Health Letter', href: 'https://www.mayoclinic.org/healthy-lifestyle' },
  { title: 'What your sleep says about you', source: 'Johns Hopkins Health Alerts', href: 'https://www.hopkinsmedicine.org/health' },
  { title: 'Everyday habits for a healthy gut', source: 'Cleveland Clinic Health Essentials', href: 'https://health.clevelandclinic.org/' },
  { title: 'Staying active as you age', source: 'NIH News in Health', href: 'https://newsinhealth.nih.gov/' },
];

// Prescription history written up by doctors on past visits.
export const prescriptions: Prescription[] = [
  {
    id: 'rx-1',
    doctor: 'Dr. Meera Sharma',
    specialty: 'General Physician',
    date: '20 May 2026',
    medicines: ['Paracetamol 500mg', 'Cetirizine 10mg', 'Vitamin C'],
    notes: 'Take after meals for 5 days. Return if fever persists beyond 3 days.',
  },
  {
    id: 'rx-2',
    doctor: 'Dr. Anita Rao',
    specialty: 'Cardiology',
    date: '02 Apr 2026',
    medicines: ['Atorvastatin 10mg', 'Aspirin 75mg'],
    notes: 'Once daily at night. Review lipid profile after 3 months.',
  },
];
