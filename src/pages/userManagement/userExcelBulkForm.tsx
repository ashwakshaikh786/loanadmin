
import {
    Button,
    Paper,
    Typography,
    Stack,
    Grid,
    Divider,
} from '@mui/material';
import { useState, ChangeEvent, FormEvent } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import BASE_URL from '../../config';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type RegisterProps = {
    onBackToList: () => void;
};

const Excelform = ({ onBackToList }: RegisterProps) => {
    const [excelFile, setExcelFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setExcelFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();

        if (!excelFile) {
            Swal.fire('Error', 'Please select an Excel file to upload', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('excelFile', excelFile);

        try {
            const response = await axios.post(
                `${BASE_URL}/api/upload/uploadexcel`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                Swal.fire('Success!', 'File uploaded successfully!', 'success');
                setExcelFile(null); // reset file
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
            <Paper sx={{ px: 4, py: 4, width: '100%'}}>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 3, position: 'relative' }}
                >
                    <Grid item>
                        <Typography variant="h4" align="left">
                            Upload Customer (Excel)
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: 2 }}
                            startIcon={<ArrowBackIcon />}
                            onClick={onBackToList}
                        >
                            Back to List
                        </Button>
                    </Grid>
                </Grid>


                <Divider sx={{ my: 2 }}>Upload Excel</Divider>

                <form onSubmit={handleUpload} encType="multipart/form-data">
  <label htmlFor="excel-upload">
    <input
      id="excel-upload"
      type="file"
      accept=".xlsx, .xls"
      onChange={handleFileChange}
      required
      style={{
        display: 'none',
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginTop: '10px',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    />
     <Button
      component="span"
      variant="outlined"
      fullWidth
      sx={{ mt: 2, textTransform: 'none' ,color:"#000",textAlign:"start"}}
    >
      {excelFile ? excelFile.name : 'Upload Excel File (.xls or .xlsx)'}
    </Button>
  </label>

  <Typography variant="caption" color="text.secondary">
    Upload Excel file (.xls, .xlsx)
  </Typography>

  <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
    Upload
  </Button>
</form>

            </Paper>
        </Stack>
    );
};

export default Excelform;
