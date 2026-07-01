import { useMemo, useState } from 'react';
import { Box, Typography, Stack, Chip, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { appointments, type Appointment, type AppointmentStatus } from '../../data/patientDummy';
import SectionCard from './SectionCard';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Each status maps to a legend label and the theme palette colour used to tint it.
const STATUS: Record<AppointmentStatus, { label: string; color: 'success' | 'warning' }> = {
  approved: { label: 'Approved', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
};

// Month-view calendar: a fixed-width grid on the left (so cells stay square) and
// the selected day's appointments on the right, filling the wide card cleanly.
export default function AppointmentsCalendar() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Group appointments by day (only meaningful on the real current month).
  const byDay = useMemo(() => {
    const map: Record<number, Appointment[]> = {};
    for (const a of appointments) (map[a.day] ??= []).push(a);
    return map;
  }, []);

  // Default the detail view to today's appointments, else the first upcoming one.
  const [selectedDay, setSelectedDay] = useState<number>(
    byDay[today.getDate()] ? today.getDate() : appointments[0].day,
  );

  const cells = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedList = isCurrentMonth ? byDay[selectedDay] ?? [] : [];
  const selectedLabel = new Date(today.getFullYear(), today.getMonth(), selectedDay).toLocaleDateString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <SectionCard icon={<CalendarMonthIcon />} title="Appointments">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2.5 }}>
        {/* Calendar block — capped width keeps day cells square, not stretched. */}
        <Box sx={{ width: { xs: '100%', lg: 340 }, flexShrink: 0 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {monthName} {year}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" aria-label="Previous month" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="Next month" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
            {WEEKDAYS.map((d) => (
              <Typography key={d} variant="caption" sx={{ textAlign: 'center', fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
                {d}
              </Typography>
            ))}

            {cells.map((day, i) => {
              if (day === null) return <Box key={`blank-${i}`} />;
              const appt = isCurrentMonth ? byDay[day] : undefined;
              const color = appt ? STATUS[appt[0].status].color : undefined;
              const isToday = isCurrentMonth && day === today.getDate();
              const isSelected = isCurrentMonth && day === selectedDay && !!appt;
              return (
                <Box
                  key={day}
                  onClick={appt ? () => setSelectedDay(day) : undefined}
                  sx={(t) => ({
                    position: 'relative',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    fontSize: '0.78rem',
                    fontWeight: color || isToday ? 600 : 400,
                    cursor: appt ? 'pointer' : 'default',
                    border: isToday || isSelected ? '2px solid' : '1px solid',
                    borderColor: isToday
                      ? t.palette.primary.main
                      : isSelected && color
                        ? t.palette[color].main
                        : 'transparent',
                    backgroundColor: color
                      ? alpha(t.palette[color].main, t.palette.mode === 'dark' ? 0.28 : 0.16)
                      : alpha(t.palette.text.primary, t.palette.mode === 'dark' ? 0.04 : 0.02),
                    transition: 'background-color 0.15s',
                    '&:hover': color ? { backgroundColor: alpha(t.palette[color].main, 0.32) } : undefined,
                  })}
                >
                  {day}
                  {color && (
                    <Box
                      sx={(t) => ({
                        position: 'absolute',
                        bottom: 3,
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: t.palette[color].main,
                      })}
                    />
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Legend */}
          <Stack direction="row" spacing={2} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
            {Object.values(STATUS).map((s) => (
              <Stack key={s.label} direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                <Box sx={(t) => ({ width: 10, height: 10, borderRadius: '50%', bgcolor: t.palette[s.color].main })} />
                <Typography variant="caption" color="text.secondary">
                  {s.label}
                </Typography>
              </Stack>
            ))}
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <Box sx={(t) => ({ width: 10, height: 10, borderRadius: '50%', border: '2px solid', borderColor: t.palette.primary.main })} />
              <Typography variant="caption" color="text.secondary">
                Today
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Selected day's appointments — fills the space beside the calendar. */}
        <Box sx={{ flexGrow: 1, minWidth: 0, borderLeft: { lg: '1px solid' }, borderColor: { lg: 'divider' }, pl: { lg: 2.5 } }}>
          <Typography variant="overline" color="text.secondary">
            {selectedLabel}
          </Typography>
          {selectedList.length ? (
            <Stack spacing={1} sx={{ mt: 0.5 }}>
              {selectedList.map((a, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  sx={{ alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
                >
                  <Box>
                    <Typography variant="subtitle2">{a.doctor}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {a.specialty} · {a.time}
                    </Typography>
                  </Box>
                  <Chip size="small" label={STATUS[a.status].label} color={STATUS[a.status].color} variant="outlined" />
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              No appointments on this day.
            </Typography>
          )}
        </Box>
      </Box>
    </SectionCard>
  );
}
