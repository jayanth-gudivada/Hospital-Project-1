import type { SxProps, Theme } from '@mui/material';

// Shared DataGrid look used by every admin table: a navy header strip with white
// title text. (Paints the background on the header cells directly because this
// build leaves the --DataGrid-containerBackground variable white.)
export const dataGridSx: SxProps<Theme> = {
  border: 'none',
  '--DataGrid-containerBackground': 'hsl(222,44%,8%)',
  '& .MuiDataGrid-columnHeaders': { backgroundColor: 'hsl(222,44%,8%)' },
  '& .MuiDataGrid-columnHeader': { backgroundColor: 'hsl(222,44%,8%)', color: '#fff' },
  '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600, color: '#fff' },
  '& .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton': {
    color: '#fff',
  },
};

// Card wrapper that frames each DataGrid (rounded white surface with a soft shadow).
export const dataGridWrapperSx: SxProps<Theme> = {
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 1,
};
