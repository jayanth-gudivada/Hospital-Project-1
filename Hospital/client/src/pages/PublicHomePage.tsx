import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  IconButton,
  Stack,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Alert,
  Link,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { listHospitals, type Hospital } from '../api/hospitals';

const services = [
  {
    title: 'Psychiatry',
    text: 'The study and treatment of mental disorders, focusing on emotional well-being and psychological health.',
    icon: '/assets/images/icon-1.png',
    href: 'https://www.psychiatry.org/patients-families/what-is-psychiatry',
  },
  {
    title: 'Orthopedics',
    text: 'Focuses on musculoskeletal health, treating bone and joint issues to enhance mobility and well-being.',
    icon: '/assets/images/icon-4.png',
    href: 'https://www.medicalnewstoday.com/articles/what-is-orthopedics',
  },
  {
    title: 'Gynecology',
    text: "Cares for women's reproductive health, covering female-specific conditions and treatments.",
    icon: '/assets/images/icon-2.png',
    href: 'https://www.news-medical.net/health/What-is-Gynecology.aspx',
  },
  {
    title: 'Pulmonology',
    text: 'Specializes in respiratory conditions, emphasizing lung health and improved breathing.',
    icon: '/assets/images/icon-3.png',
    href: 'https://www.verywellhealth.com/what-is-pulmonology-5081298',
  },
];

const specialists = [
  { title: 'Psychiatry', icon: '/assets/images/icon-1.png', href: 'https://www.psychiatry.org/patients-families/what-is-psychiatry' },
  { title: 'Gynecology', icon: '/assets/images/icon-2.png', href: 'https://www.news-medical.net/health/What-is-Gynecology.aspx' },
  { title: 'Pulmonology', icon: '/assets/images/icon-4.png', href: 'https://www.verywellhealth.com/what-is-pulmonology-5081298' },
  { title: 'Orthopedics', icon: '/assets/images/icon-5.png', href: 'https://www.medicalnewstoday.com/articles/what-is-orthopedics' },
  { title: 'Pediatrics', icon: '/assets/images/icon-6.png', href: 'https://www.news-medical.net/health/What-is-Pediatrics.aspx' },
  { title: 'Osteology', icon: '/assets/images/icon-7.png', href: 'https://www.thoughtco.com/osteology-definition-and-applications-4588264' },
];

const blogPosts = [
  {
    title: 'Could intermittent fasting reduce breast cancer?',
    date: '19 January, 2023',
    text: 'Breast cancer is the most frequent malignancy amongst women. Previous epidemiological studies identified obesity as a risk factor for BC.',
    href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9920353/',
  },
  {
    title: 'Give children more autonomy during the pandemic',
    date: '30 January, 2021',
    text: 'Autonomy-supportive parenting behavior is positively associated both with better child well-being and higher parental need fulfillment.',
    href: 'https://www.medicalnewstoday.com/articles/give-children-more-autonomy-during-the-pandemic-says-study',
  },
  {
    title: 'How do binge eating and drinking impact the liver?',
    date: '31 January, 2021',
    text: 'A study found that eating foods high in carbohydrates while consuming alcohol was associated with increased liver fat.',
    href: 'https://www.medicalnewstoday.com/articles/how-do-binge-eating-and-drinking-impact-the-liver',
  },
];

export default function PublicHomePage() {
  const [location, setLocation] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
  const [results, setResults] = useState<Hospital[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleLocationChange(value: string) {
    setLocation(value);
    // Clearing the box dismisses the previous results instead of showing
    // "No hospitals found for “”".
    if (!value.trim()) {
      setResults(null);
      setError('');
    }
  }

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const term = location.trim();
    if (!term) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await listHospitals({ search: term, limit: 100 });
      setSearchedTerm(term);
      setResults(res.items);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      {/* Header */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'hsl(222,44%,8%)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box component="img" src="/logo.svg" alt="Doclab" sx={{ height: 34 }} />
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" href="#services">Services</Button>
            <Button color="inherit" href="#blog">Blog</Button>
            <Button variant="contained" component={RouterLink} to="/login">
              Login
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero + search */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(180deg, hsla(187,25%,94%,0.9), hsla(187,25%,94%,0.6)), url(/assets/images/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography variant="overline" color="primary.dark" sx={{ fontWeight: 600, letterSpacing: 1.5 }}>
                Welcome To Doclab
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontWeight: 600, lineHeight: 1.1, mb: 3, letterSpacing: '-1px', fontSize: 'clamp(2.4rem, 6vw, 3.6rem)' }}
              >
                Find Nearest<br />Doctor.
              </Typography>

              <Card sx={{ borderRadius: 3, p: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Search hospitals by location.
                  </Typography>
                  <Box component="form" onSubmit={handleSearch}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      <TextField
                        fullWidth
                        placeholder="Location"
                        value={location}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOnIcon color="primary" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SearchIcon />}
                        disabled={loading}
                        sx={{ px: 4, whiteSpace: 'nowrap' }}
                      >
                        Find Now
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
              <Box component="img" src="/assets/images/hero-banner.png" alt="hero" sx={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
          </Box>

          {/* Search results */}
          {(loading || error || results) && (
            <Box sx={{ mt: 4 }}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              )}
              {error && <Alert severity="error">{error}</Alert>}
              {results && !loading && (
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ p: 2, bgcolor: 'hsl(222,44%,8%)', color: '#fff' }}>
                    <Typography variant="h6">
                      {results.length
                        ? `${results.length} hospital(s) matching “${searchedTerm}”`
                        : `No hospitals found for “${searchedTerm}”`}
                    </Typography>
                  </Box>
                  {results.length > 0 && (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Name</b></TableCell>
                          <TableCell><b>Location</b></TableCell>
                          <TableCell><b>Address</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.map((h) => (
                          <TableRow key={h._id} hover>
                            <TableCell>{h.name}</TableCell>
                            <TableCell>{h.location}</TableCell>
                            <TableCell>{h.address}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Paper>
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Services */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="services">
        <Typography variant="h4" sx={{ mb: 5, textAlign: 'center' }}>
          Our Services
        </Typography>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
          {services.map((s) => (
            <Card key={s.title} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Box component="img" src={s.icon} alt={s.title} sx={{ width: 64, height: 64 }} />
                  <Typography variant="h6">{s.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.text}</Typography>
                  <Box>
                    <IconButton
                      aria-label={s.title}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* About */}
      <Box sx={{ bgcolor: '#fff', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'center' }}>
            <Box>
              <Typography variant="overline" color="primary.dark" sx={{ fontWeight: 700 }}>About Us</Typography>
              <Typography variant="h4" sx={{ mb: 2 }}>Experienced Workers</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Experienced doctors bring a wealth of knowledge and skill to the team, driving efficiency and quality.
              </Typography>
              <Typography color="text.secondary">
                Our vision is to establish a network of healthcare facilities that provide accessible, high-quality
                medical services to diverse communities, ensuring well-being through innovation and compassion.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box component="img" src="/assets/images/srikar.jpg" alt="about" sx={{ maxWidth: '100%', borderRadius: 3 }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Specialist listing */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="overline" color="primary.dark" sx={{ fontWeight: 700 }}>Doctors Listing</Typography>
        <Typography variant="h4" sx={{ mb: 4 }}>Browse by specialist</Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' } }}>
          {specialists.map((s) => (
            <Card
              key={s.title}
              component="a"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: 3, p: 2, textAlign: 'center', textDecoration: 'none', transition: '0.2s', '&:hover': { boxShadow: 4 } }}
            >
              <Box component="img" src={s.icon} alt={s.title} sx={{ width: 56, height: 56 }} />
              <Typography variant="subtitle2" sx={{ mt: 1 }}>{s.title}</Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Blog */}
      <Box sx={{ bgcolor: '#fff', py: 8 }} id="blog">
        <Container maxWidth="lg">
          <Typography variant="overline" color="primary.dark" sx={{ fontWeight: 700, textAlign: 'center', display: 'block' }}>
            News & Article
          </Typography>
          <Typography variant="h4" sx={{ mb: 5, textAlign: 'center' }}>Latest Articles</Typography>
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
            {blogPosts.map((b) => (
              <Card key={b.title} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">{b.date}</Typography>
                  <Typography variant="h6" sx={{ my: 1 }}>{b.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{b.text}</Typography>
                  <Link href={b.href} target="_blank" rel="noopener noreferrer" underline="hover">
                    Read More →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'hsl(222,44%,8%)', color: '#fff', py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            © Doclab 2023 | All Rights Reserved by Jayanth &amp; Co.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
