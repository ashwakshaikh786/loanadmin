
import axios from 'axios';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import ActionMenu from 'components/sections/dashboard/transaction-history/ActionMenu';
import BASE_URL from '../../config';
import { IconButton, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface CurrentUpdate {
  currentupdate_id: number;
  currentupdatename: string;
}

const columns: GridColDef<CurrentUpdate>[] = [
  {
    field: 'id',
    headerName: 'Sr. No',
    width: 100,
  },
//   {
//     field: 'currentupdate_id',
//     headerName: 'Update ID',
//     flex: 1,
//     minWidth: 140,
//   },
  {
    field: 'currentupdatename',
    headerName: 'Update Name',
    flex: 2,
    minWidth: 200,
  },
  {
    field: 'action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
    sortable: false,
    renderHeader: () => <ActionMenu />,
    renderCell: () => <ActionMenu />,
  },

  {
    field: 'action',
    headerName: 'Actions',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 120,
    sortable: false,
    renderCell: (params) => (
      <>
        <IconButton aria-label="edit" onClick={() => console.log('Edit row', params.row)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="view" onClick={() => console.log('View row', params.row)}>
          <VisibilityIcon />
        </IconButton>
      </>
    ),
  },
  
];

const Master = () => {
  const apiRef = useGridApiRef<GridApi>();
  const [updates, setUpdates] = useState<CurrentUpdate[]>([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/telecaller/assign/currentupdate`);
        const fetchedUpdates = res.data.data.map((update: CurrentUpdate) => ({
          id: update.currentupdate_id, // required by DataGrid
          ...update,
        }));
        setUpdates(fetchedUpdates);
      } catch (error) {
        console.error('Failed to fetch current updates:', error);
      }
    };

    fetchUpdates();
  }, []);

  return (
    // <Stack alignItems="center" justifyContent="center">
    //   <Paper sx={{ width: '100%' }}>
    //     <DataGrid
    //       apiRef={apiRef}
    //       density="standard"
    //       columns={columns}
    //       rows={updates}
    //       rowHeight={52}
    //       disableColumnMenu
    //       disableColumnSelector
    //       disableRowSelectionOnClick
    //       pageSizeOptions={[5, 10, 20, 50]}
    //       autoHeight  // ensures the grid adjusts to content height
    //     />
    //   </Paper>
    // </Stack>

    <Stack alignItems="center" justifyContent="center">
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        apiRef={apiRef}
        density="standard"
        columns={columns}
        rows={updates}
        rowHeight={52}
        disableColumnMenu
        disableColumnSelector
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20, 50]}
        autoHeight  // ensures the grid adjusts to content height
      />
    </Paper>
  </Stack>
  );
};

export default Master;

