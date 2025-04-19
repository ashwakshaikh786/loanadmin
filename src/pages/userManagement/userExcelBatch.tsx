import {
    Button,
    Paper,
    Typography,
    Stack,
    Grid,
    Divider,
    TextField,
    MenuItem,
    Chip,
    Select,
    InputLabel,
    FormControl,
    SelectChangeEvent,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import BASE_URL from '../../config';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type RegisterProps = {
    onBackToList: () => void;
};

type Agent = {
    user_id: string;
    username: string;
};

const Excelform = ({ onBackToList }: RegisterProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [batchName, setBatchName] = useState<string>('');
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [loading, setLoading] = useState({
        agents: false,
    });
    const UserId = sessionStorage.getItem('user_id') || 'UserId';
    const fetchAgents = async () => {
        setLoading(prev => ({ ...prev, agents: true }));
        try {
            const res = await axios.get(`${BASE_URL}/api/user/agentroles`);
            setAgents(res.data?.data || []);
        } finally {
            setLoading(prev => ({ ...prev, agents: false }));
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setExcelFile(e.target.files[0]);
        }
    };

    const handleAgentChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setSelectedAgents(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();

        if (!excelFile) {
            Swal.fire('Error', 'Please select an Excel file to upload', 'error');
            return;
        }

        if (!batchName) {
            Swal.fire('Error', 'Please enter a batch name', 'error');
            return;
        }

        if (selectedAgents.length === 0) {
            Swal.fire('Error', 'Please select at least one agent', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('excelFile', excelFile);
        formData.append('batch_name', batchName);
        formData.append('created_at', UserId);
        selectedAgents.forEach(agentId => {
            formData.append('agents[]', agentId);
        });

        try {
            const response = await axios.post(
                `${BASE_URL}/api/upload/uploadbatchexcel`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                Swal.fire('Success!', 'File uploaded successfully!', 'success');
                setExcelFile(null);
                setBatchName('');
                setSelectedAgents([]);
            } else {
                Swal.fire('Error', response.data.message || 'Upload failed', 'error');
            }
        } catch (error) {
            console.error('Upload failed', error);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    return (
        <Stack alignItems="center" justifyContent="center" px={1} py={4}>
            <Paper sx={{ 
                px: isMobile ? 2 : 4, 
                py: isMobile ? 3 : 4, 
                width: '100%',
                maxWidth: 800,
                margin: '0 auto'
            }}>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Grid item xs={12} sm={8}>
                        <Typography variant={isMobile ? 'h5' : 'h4'} align="left">
                            Upload Customer (Excel)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Button
                            variant="contained"
                            sx={{ 
                                borderRadius: 2,
                                width: isMobile ? '100%' : 'auto',
                                py: 1.5
                            }}
                            startIcon={<ArrowBackIcon />}
                            onClick={onBackToList}
                        >
                            {isMobile ? 'Back' : 'Back to List'}
                        </Button>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }}>Upload Excel</Divider>

                <form onSubmit={handleUpload} encType="multipart/form-data">
                    <Grid container spacing={3}>
                        {/* Batch Name and Agent Selection in one row on desktop */}
                        <Grid item container spacing={3} xs={12}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Batch Name"
                                    name="batch_name"
                                    value={batchName}
                                    onChange={(e) => setBatchName(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    size={isMobile ? 'small' : 'medium'}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="agents-label" >Agents *</InputLabel>
                                    <Select
                                        labelId="agents-label"
                                        id="agents-select"
                                        multiple
                                        value={selectedAgents}
                                        onChange={handleAgentChange}
                                        renderValue={(selected) => (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                {selected.map((value) => {
                                                    const agent = agents.find(a => a.user_id === value);
                                                    return (
                                                        <Chip 
                                                            key={value} 
                                                            label={agent ? agent.username : value} 
                                                            size="small" 
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                        label="Agents *"
                                        required
                                        size={isMobile ? 'small' : 'medium'}
                                    >
                                        {agents.map((agent) => (
                                            <MenuItem key={agent.user_id} value={agent.user_id}>
                                                {agent.username}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Excel Upload Field */}
                        <Grid item xs={12}>
                            <label htmlFor="excel-upload">
                                <input
                                    id="excel-upload"
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    required
                                    style={{ display: 'none' }}
                                />
                                <Button
                                    component="span"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ 
                                        textTransform: 'none',
                                        color: "#000",
                                        textAlign: "start",
                                        justifyContent: 'flex-start',
                                        py: 1.5,
                                        height: isMobile ? 48 : 56
                                    }}
                                >
                                    {excelFile ? excelFile.name : 'Upload Excel File (.xls or .xlsx)'}
                                </Button>
                            </label>
                            <Typography variant="caption" color="text.secondary">
                                Upload Excel file (.xls, .xlsx)
                            </Typography>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                fullWidth 
                                sx={{ 
                                    mt: 1,
                                    py: 1.5,
                                    height: isMobile ? 48 : 56
                                }}
                                disabled={loading.agents}
                            >
                                Upload
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Stack>
    );
};

export default Excelform;