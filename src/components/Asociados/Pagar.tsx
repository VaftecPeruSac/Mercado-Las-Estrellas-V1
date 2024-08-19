import React, { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    TextField,
    Grid,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    FormControl
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface PropsPagar {
    open: boolean;
    onClose: () => void;
}

const Pagar: React.FC<PropsPagar> = ({ open, onClose }) => {
    const [anio, setAnio] = useState<string>('');
    const [mes, setMes] = useState<string>('');
    const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);

    const manejarCheckCambio = (servicio: string) => {
        setItemsSeleccionados(prev =>
            prev.includes(servicio) ? prev.filter(item => item !== servicio) : [...prev, servicio]
        );
    };

    const manejarAnioCambio = (evento: SelectChangeEvent<string>) => {
        setAnio(evento.target.value as string);
    };

    const manejarMesCambio = (evento: SelectChangeEvent<string>) => {
        setMes(evento.target.value as string);
    };

    return (
        <Modal open={open} onClose={onClose}
            aria-labelledby="modal-titulo"
            aria-describedby="modal-descripcion"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Card sx={{
                width: '80%',
                maxWidth: 800,
                padding: 3,
                bgcolor: '#f0f0f0',
                boxShadow: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Box sx={{ backgroundColor: '#4CAF50', p: 2, color: '#fff', borderRadius: 1 }}>
                    <Typography
                        id="modal-titulo"
                        variant="h6"
                        component="h2"
                        sx={{ textAlign: 'center' }}
                    >
                        Registrar Cuota
                    </Typography>
                </Box>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <TextField
                        label="Buscar Socio"
                        variant="outlined"
                        fullWidth
                        sx={{ mr: 2 }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: 1,
                            padding: '4px 8px'
                        }}
                    >
                        <Typography variant="body2" color="textSecondary">
                            Todos
                        </Typography>
                        <CheckCircle sx={{ ml: 1, color: '#4caf50' }} />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} md={3}>
                            <FormControl fullWidth >
                                <InputLabel>Año</InputLabel>
                                <Select
                                    value={anio}
                                    onChange={manejarAnioCambio}
                                    label="Año"
                                >
                                    {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012].map(año => (
                                        <MenuItem key={año} value={año}>{año}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Mes</InputLabel>
                                <Select
                                    value={mes}
                                    onChange={manejarMesCambio}
                                    label="Mes"
                                >
                                    {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(mesNombre => (
                                        <MenuItem key={mesNombre} value={mesNombre}>{mesNombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'black' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Servicio</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Seleccionar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {['Servicio 1', 'Servicio 2', 'Servicio 3'].map(servicio => (
                                    <TableRow key={servicio}>
                                        <TableCell>{servicio}</TableCell>
                                        <TableCell>$100</TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={itemsSeleccionados.includes(servicio)}
                                                        onChange={() => manejarCheckCambio(servicio)}
                                                    />
                                                }
                                                label=""
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                        variant="outlined"
                        sx={{
                            color: "#4CAF50",
                            borderColor: "#4CAF50",
                            mr: 1,
                            '&:hover': {
                                backgroundColor: "#e0f2f1",
                            },
                        }}
                        onClick={onClose}
                    >
                        Cerrar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            '&:hover': {
                                backgroundColor: "#388E3C",
                            },
                        }}
                        onClick={() => { /* Acción de confirmación aquí */ }}
                    >
                        Registrar
                    </Button>
                </Box>
            </Card>
        </Modal>
    );
};

export default Pagar;
