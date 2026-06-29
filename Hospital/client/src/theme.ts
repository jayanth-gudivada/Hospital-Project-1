import { createTheme } from '@mui/material/styles';

// Doclab palette, ported from the original CSS design tokens.
const theme = createTheme({
  palette: {
    primary: { main: 'hsl(182, 100%, 35%)', dark: 'hsl(186, 72%, 24%)', contrastText: '#ffffff' },
    secondary: { main: 'hsl(186, 72%, 24%)' },
    error: { main: 'hsl(0, 72%, 51%)', dark: 'hsl(0, 72%, 42%)' },
    background: { default: 'hsl(187, 25%, 94%)', paper: '#ffffff' },
    text: { primary: 'hsl(222, 44%, 12%)', secondary: 'hsl(0, 0%, 40%)' },
  },
  typography: {
    fontFamily: "'Rubik', system-ui, sans-serif",
    // Sleeker, lighter headings: lower weights + tighter tracking so titles
    // read clean and minimal rather than heavy/bulky. Sizes use clamp() so they
    // scale fluidly with the viewport (min, preferred-vw, max).
    h1: { fontWeight: 600, letterSpacing: '-1px', fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1.15 },
    h2: { fontWeight: 600, letterSpacing: '-0.5px', fontSize: 'clamp(1.9rem, 4.2vw, 3rem)', lineHeight: 1.2 },
    h3: { fontWeight: 600, letterSpacing: '-0.5px', fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)', lineHeight: 1.25 },
    h4: { fontWeight: 500, letterSpacing: '-0.4px', fontSize: 'clamp(1.4rem, 2.6vw, 1.85rem)', lineHeight: 1.3 },
    h5: { fontWeight: 500, letterSpacing: '-0.2px', fontSize: 'clamp(1.15rem, 2vw, 1.5rem)', lineHeight: 1.35 },
    h6: { fontWeight: 500, letterSpacing: '-0.1px', fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', lineHeight: 1.4 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    body1: { letterSpacing: '0.1px', fontSize: 'clamp(0.9rem, 1.1vw, 1rem)' },
    body2: { letterSpacing: '0.1px', fontSize: 'clamp(0.8rem, 1vw, 0.9rem)' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
});

export default theme;
