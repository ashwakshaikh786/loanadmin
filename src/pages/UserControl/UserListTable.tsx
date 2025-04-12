import { useEffect, useState } from 'react';
import axios from 'axios';
import Chip from '@mui/material/Chip';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import ActionMenu from 'components/sections/dashboard/transaction-history/ActionMenu';
import BASE_URL from '../../config';

import {
  Paper, 
  Stack,
} from '@mui/material';

interface User {
  _id: number;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  address: string;
  username: string;
  role_name: string;
  dob: string;
}

interface UserListTableProps {
  searchText: string;
}

const columns: GridColDef<User>[] = [
  {
    field: 'id',
    headerName: 'Sr. No',
    width: 100,
  },
  {
    field: 'first_name',
    headerName: 'First Name',
    flex: 1.5,
    minWidth: 140,
  },
  {
    field: 'last_name',
    headerName: 'Last Name',
    flex: 1.5,
    minWidth: 140,
  },
  {
    field: 'mobile',
    headerName: 'Mobile',
    flex: 1.5,
    minWidth: 140,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 2,
    minWidth: 200,
  },
  {
    field: 'address',
    headerName: 'Address',
    flex: 2,
    minWidth: 200,
  },
  {
    field: 'username',
    headerName: 'Username',
    flex: 1.5,
    minWidth: 140,
  },
  {
    field: 'role_name',
    headerName: 'Role',
    flex: 1.5,
    minWidth: 140,
    renderCell: (params) => (
      <Chip label={params.value} color="primary" size="small" />
    ),
  },
  {
    field: 'dob',
    headerName: 'DOB',
    flex: 1.5,
    minWidth: 140,
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
];

const UserListTable = ({ searchText }: UserListTableProps) => {
  const apiRef = useGridApiRef<GridApi>();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/userfetch`);
        const fetchedUsers = res.data.data.map((user: User, index: number) => ({
          id: index + 1,
          ...user,
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    apiRef.current.setQuickFilterValues(
      searchText.split(/\b\W+\b/).filter((word) => word !== '')
    );
  }, [searchText]);

  return (
    <>
      <Stack alignItems="center" justifyContent="center" >
        <Paper sx={{ width: '100%' }}>
          <DataGrid
            apiRef={apiRef}
            density="standard"
            columns={columns}
            rows={users}
            rowHeight={52}
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            slots={{ pagination: DataGridFooter }}
            pageSizeOptions={[5]}
            autoHeight  // ✅ Add this line
          />
        </Paper>
      </Stack>
    </>
  );
};

export default UserListTable;
