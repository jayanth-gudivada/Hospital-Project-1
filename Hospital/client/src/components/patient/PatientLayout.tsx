import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/GridView';
import EventIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import PlaceIcon from '@mui/icons-material/Place';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/MessageOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch, useAuth } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';
import ThemeToggle from '../ThemeToggle';

const DRAWER_WIDTH = 248;

// Shared pill style for the top-bar controls (theme toggle + notifications) so
// they read as one consistent set rather than two mismatched icons.
const controlChipSx = {
  color: 'text.secondary',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
};

// Sidebar entries; only Dashboard is real, the rest are placeholders for now.
const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'profile', label: 'Profile', icon: <PersonIcon /> },
  { key: 'appointments', label: 'Appointments', icon: <EventIcon /> },
  { key: 'prescriptions', label: 'Prescriptions', icon: <MedicationIcon /> },
  { key: 'locations', label: 'Locations', icon: <PlaceIcon /> },
  { key: 'health', label: 'Health Reads', icon: <ArticleIcon /> },
  { key: 'messages', label: 'Messages', icon: <ChatIcon /> },
];

// Time-of-day greeting for the top bar, with a matching emoji per part of day.
function greetingFor(date: Date) {
  const h = date.getHours();
  if (h < 5) return { text: 'Good night', emoji: '🌙' };
  if (h < 12) return { text: 'Good morning', emoji: '🌅' };
  if (h < 17) return { text: 'Good afternoon', emoji: '☀️' };
  if (h < 21) return { text: 'Good evening', emoji: '🌆' };
  return { text: 'Good night', emoji: '🌙' };
}

// Long-form current date, e.g. "Thursday, 2 July".
function formatToday(date: Date) {
  return date.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long' });
}

// A short line under the greeting that reflects the page the user is on, so the
// top bar isn't stuck saying "health overview" on Profile or Locations.
function subtitleFor(pathname: string) {
  if (pathname.startsWith('/patient/profile')) return 'Keep your personal details up to date.';
  if (pathname.startsWith('/patient/locations') || pathname.startsWith('/patient/consult'))
    return 'Find and consult a hospital near you.';
  return "Here's your health overview.";
}

// Dedicated patient shell: a dark sidebar (permanent on desktop, drawer on mobile)
// plus a top bar with greeting, search, theme toggle, and notifications.
export default function PatientLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Gate the portal until the profile is completed. profileFill === 1 means the
  // user hasn't filled it yet; we let them onto the Profile screen itself so they
  // can, but block every other patient page with a modal prompt.
  const needsProfile = user?.profileFill === 1 && location.pathname !== '/patient/profile';
  const { toast, showToast, hideToast } = useToast();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('dashboard');

  // Keep the sidebar highlight in sync with the URL so direct navigation (bottom
  // profile card, completion-gate dialog) lights up the right entry too.
  useEffect(() => {
    if (location.pathname === '/patient/profile') setActive('profile');
    else if (location.pathname.startsWith('/patient/locations') || location.pathname.startsWith('/patient/consult'))
      setActive('locations');
    else if (location.pathname === '/patient') setActive('dashboard');
  }, [location.pathname]);

  // Re-render every minute so the greeting/date track the real clock.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const greeting = greetingFor(now);

  const firstName = user?.firstName || 'Patient';
  const initial = firstName.charAt(0).toUpperCase();

  // Dashboard is a real route; the rest are placeholders until their pages exist.
  function handleNav(key: string, label: string) {
    setActive(key);
    setMobileOpen(false);
    if (key === 'dashboard') navigate('/patient');
    else if (key === 'profile') navigate('/patient/profile');
    else if (key === 'locations') navigate('/patient/locations');
    else showToast(`${label} — coming soon`, 'info');
  }

  function handleLogout() {
    dispatch(logout());
    navigate('/', { replace: true });
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'hsl(222, 44%, 8%)', color: '#fff' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Box component="img" src="/logo.svg" alt="Doclab" sx={{ height: 28 }} />
      </Box>

      <List sx={{ px: 1.25, flexGrow: 1 }}>
        {NAV.map((item) => (
          <ListItemButton
            key={item.key}
            selected={active === item.key}
            onClick={() => handleNav(item.key, item.label)}
            sx={{
              borderRadius: 2,
              mb: 0.25,
              py: 0.75,
              color: 'rgba(255,255,255,0.7)',
              '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 34, '& svg': { fontSize: 20 } },
              '& .MuiListItemText-primary': { fontSize: '0.875rem' },
              '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      {/* Profile + logout pinned to the bottom of the sidebar. */}
      <Box sx={{ p: 1.25, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {/* The profile card opens the Profile screen (personal details + family). */}
        <Tooltip title="View profile" placement="top">
          <ListItemButton
            onClick={() => {
              setMobileOpen(false);
              navigate('/patient/profile');
            }}
            sx={{ borderRadius: 2, px: 1, py: 0.75, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', minWidth: 0, width: '100%' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.9rem' }}>{initial}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ color: '#fff' }}>{firstName}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }} noWrap>
                  {user?.email || 'patient@doclab.io'}
                </Typography>
              </Box>
            </Stack>
          </ListItemButton>
        </Tooltip>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 0.75,
            color: 'rgba(255,255,255,0.7)',
            '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 34, '& svg': { fontSize: 20 } },
            '& .MuiListItemText-primary': { fontSize: '0.875rem' },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isDesktop ? (
        <Box component="nav" sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}>
          <Box sx={{ position: 'fixed', width: DRAWER_WIDTH, height: '100vh' }}>{drawer}</Box>
        </Box>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' } }}
        >
          {drawer}
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar: avatar + greeting on the left, a matched set of control chips
            on the right, with a hairline divider separating it from the content. */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 2 },
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 1.5 },
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {!isDesktop && (
            <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          )}

          {/* Greeting avatar — hidden on the smallest screens to save width. */}
          <Avatar
            sx={{
              display: { xs: 'none', sm: 'flex' },
              bgcolor: 'primary.main',
              width: 44,
              height: 44,
              fontSize: '1.1rem',
              flexShrink: 0,
            }}
          >
            {initial}
          </Avatar>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography noWrap variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.15rem' } }}>
              {greeting.text}, {firstName} {greeting.emoji}
            </Typography>
            <Typography noWrap variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {formatToday(now)} · {subtitleFor(location.pathname)}
            </Typography>
          </Box>

          {/* Both controls share one pill treatment so they read as a set. */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
            <ThemeToggle size="small" sx={controlChipSx} />
            <Tooltip title="Notifications">
              <IconButton
                size="small"
                onClick={() => showToast('No new notifications', 'info')}
                sx={controlChipSx}
              >
                <Badge color="error" variant="dot">
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Box sx={{ px: { xs: 2, md: 3 }, pb: 3, flexGrow: 1 }}>{children}</Box>
      </Box>

      {/* Profile-completion gate: non-dismissable until the user fills their profile.
          With no onClose, backdrop-click and ESC are both no-ops. */}
      <Dialog open={needsProfile} maxWidth="xs" fullWidth>
        <DialogTitle>Complete your profile</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Welcome{firstName ? `, ${firstName}` : ''}! Before you start using the portal, please fill
            in your profile details. It only takes a minute.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setMobileOpen(false);
              navigate('/patient/profile');
            }}
          >
            Go to Profile
          </Button>
        </DialogActions>
      </Dialog>

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}
