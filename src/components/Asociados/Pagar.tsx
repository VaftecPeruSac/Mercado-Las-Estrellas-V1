import React from 'react';
import { Modal, Box, Typography, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Card } from '@mui/material';
import { Payment } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';

interface PagarProps {
    open: boolean;
    handleClose: () => void;
}

const Pagar: React.FC<PagarProps> = ({ open, handleClose }) => {
    const [metodoPago, setMetodoPago] = React.useState<string>('');

    const handleMetodoPagoChange = (event: SelectChangeEvent<string>) => {
        setMetodoPago(event.target.value as string);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Card sx={{
                width: '80%',
                maxWidth: 600,
                padding: 3,
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                overflow: 'auto'
            }}>
                <Typography id="modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', mb: 2 }}>
                    <Payment sx={{ mr: 1 }} /> Realizar Pago
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Monto"
                                type="number"
                                required
                                InputProps={{ startAdornment: <span>S/</span> }}
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="metodo-pago-label">Método de Pago</InputLabel>
                                <Select
                                    labelId="metodo-pago-label"
                                    label="Método de Pago"
                                    value={metodoPago}
                                    onChange={handleMetodoPagoChange}
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                >
                                    <MenuItem value="efectivo">Efectivo</MenuItem>
                                    <MenuItem value="tarjeta">Tarjeta</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                color: '#4CAF50',
                                borderColor: '#4CAF50',
                                width: '120px',
                                mr: 1
                            }}
                            onClick={handleClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                width: '120px'
                            }}
                        >
                            Pagar
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Modal>
    );
};

export default Pagar;
