import { useEffect, useState, ChangeEvent } from 'react';
import {
  Paper,
  Stack,
  Typography,
  Button,
  Checkbox,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '../../config';
import { SelectChangeEvent } from '@mui/material/Select';

interface User {
  _id: number;
  first_name: string;
  last_name: string;
  mobile: string;
  created_date: string;
}

interface Agent {
  id: number;
  name: string;
}

const CustomerAssignList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectCount, setSelectCount] = useState<number>(0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [filterText, setFilterText] = useState<string>('');

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/fetchexcel`);
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/fetchagent`);
        setAgents(res.data.data);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };
    fetchAgents();
  }, []);

  // Handle checkbox
  const handleCheckboxChange = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // Handle count input change
  const handleSelectCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const count = Number(e.target.value);
    setSelectCount(count);
    const autoSelectIds = filteredUsers.slice(0, count).map((user) => user._id);
    setSelectedUserIds(autoSelectIds);
  };

  // Handle agent change
  const handleAgentChange = (e: SelectChangeEvent) => {
    setSelectedAgent(Number(e.target.value));
  };

  // Handle search filter
  useEffect(() => {
    const lowerText = filterText.toLowerCase();
    const filtered = users.filter(
      (user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(lowerText) ||
        user.mobile.toLowerCase().includes(lowerText) ||
        user.created_date?.toLowerCase().includes(lowerText)
    );
    setFilteredUsers(filtered);
  }, [filterText, users]);

  // Submit handler
  const handleSubmit = async () => {
    const selectedUsers = users.filter((user) =>
      selectedUserIds.includes(user._id)
    );

    if (!selectedAgent) return alert('Please select an agent');

    try {
      const res = await axios.post(`${BASE_URL}/api/user/assign`, {
        users: selectedUsers,
        agentId: selectedAgent,
      });

      if (res.data.success) alert('Users assigned successfully!');
      else alert('Assignment failed');
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  return (
    <Stack alignItems="center" px={1} py={4}>
      <Paper sx={{ px: 4, py: 4, width: '100%', maxWidth: 1000 }}>
        <Typography variant="h5" gutterBottom>
          Assign Customers to Agent
        </Typography>

        <Grid container spacing={2} alignItems="center" mb={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Filter by name, number or date"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              type="number"
              label="Auto-select count"
              value={selectCount}
              onChange={handleSelectCountChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Select Agent</InputLabel>
              <Select value={selectedAgent ?? ''} onChange={handleAgentChange} label="Select Agent">
                {agents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {filteredUsers.map((user) => (
            <Grid
              item
              xs={12}
              key={user._id}
              sx={{ borderBottom: '1px solid #eee', pb: 1 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Checkbox
                  checked={selectedUserIds.includes(user._id)}
                  onChange={() => handleCheckboxChange(user._id)}
                />
                <Typography>
                  {user.first_name} {user.last_name} — {user.mobile} — {user.created_date}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 3 }}
        >
          Submit Selected
        </Button>
      </Paper>
    </Stack>
  );
};

export default CustomerAssignList;
