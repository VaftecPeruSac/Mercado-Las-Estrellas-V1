import React, { useState, ChangeEvent } from "react";
import {
    Box,
    Button,
    Modal,
    TextField,
    Grid,
    Typography,
    Card,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    IconButton,
    FormHelperText,
    Tabs,
    Tab
} from "@mui/material";
import { AccountCircle, Dns, Phone, Email, Home, Business, Person, Event, Add, MonetizationOn } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";



interface AgregarProps {
    open: boolean;
    handleClose: () => void;
}

const Agregar: React.FC<AgregarProps> = ({ open, handleClose }) => {

    // Estado para el contenido de las pestañas
    const [activeTab, setActiveTab] = useState(0);

    // Datos del formulario
    const [estado, setEstado] = useState("Activo");
    const [cuota, setCuota] = useState("");
    const [dni, setDni] = useState("");
    const [telefono, setTelefono] = useState("");
    const [gmail, setGmail] = useState("");
    const [correo, setCorreo] = useState("");
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [fecha, setFecha] = useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!nombre) newErrors.nombre = "Nombre y apellido son obligatorios";
        if (!dni || !/^\d{8}$/.test(dni)) newErrors.dni = "DNI debe ser numérico y tener 8 caracteres";
        if (!telefono || !/^\d{9}$/.test(telefono)) newErrors.telefono = "Teléfono debe ser numérico y tener 9 caracteres";
        if (!correo || !/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(correo)) newErrors.correo = "Correo debe ser un Gmail válido";
        if (!direccion) newErrors.direccion = "Dirección es obligatoria";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEstadoChange = (event: SelectChangeEvent<string>) => {
        setEstado(event.target.value);
    };

    const handleCuotaChange = (event: SelectChangeEvent<string>) => {
        setCuota(event.target.value);
    };



    const handleSubmit = () => {
        if (validateForm()) {
            // Aquí iría la lógica para enviar los datos
            console.log("Formulario válido");
            limpiarCampos();
            handleClose();
        }
    };

    const manejarDniCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        // Permitir solo números y restringir a una longitud mínima
        const regex = /^\d{0,8}$/; // Solo números, hasta 8 dígitos
        if (regex.test(valor)) {
            setDni(valor);
        }
    };

    const manejarTelefonoCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        // Permitir solo números y restringir a una longitud mínima
        const regex = /^[0-9]{0,9}$/; // Solo números, hasta 9 dígitos
        if (regex.test(valor)) {
            setTelefono(valor);
        }
    };

    const manejarCambioCorreo = (event: ChangeEvent<HTMLInputElement>) => {
        const valor = event.target.value;
        const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Valida que sea un Gmail
        setCorreo(valor);

        if (!regex.test(valor)) {
            console.error("Por favor ingrese un correo válido de Gmail.");
        }
    };

    const manejarNombreCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        // Permitir solo caracteres alfabéticos y espacios
        if (/^[a-zA-Z\s]*$/.test(valor)) {
            setNombre(valor);
        }
    };

    const handleCloseModal = () => {
        limpiarCampos();
        handleClose();
    };

    const limpiarCampos = () => {
        setEstado("Activo");
        setCuota("");
        setDni("");
        setTelefono("");
        setCorreo("");
        setNombre("");
        setDireccion("");
        setErrors({});
        setFecha("")
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        // Validar el formato de fecha YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
            setFecha(valor);
        }
    };

    // Cambiar entre pestañas
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <>
                        <Typography sx={{ mt: 2, mb: 2, color: "#333", textAlign: 'center' }}>
                            Leer detenidamente los campos obligatorios antes de escribir. (*)
                        </Typography>
                        <Box component="form" noValidate autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Escribir nombre y apellido (*)"
                                        required
                                        value={nombre}
                                        onChange={manejarNombreCambio}
                                        InputProps={{
                                            startAdornment: (
                                                <AccountCircle sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                        error={!!errors.nombre}
                                        helperText={errors.nombre}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Fecha de Registro"
                                        type="date"
                                        value={fecha}
                                        onChange={handleDateChange}
                                        sx={{ mt: 2 }}
                                        InputProps={{
                                            startAdornment: (
                                                <Event sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Correo"
                                        sx={{ mt: 2 }}
                                        value={correo}
                                        onChange={manejarCambioCorreo}
                                        InputProps={{
                                            startAdornment: (
                                                <Email sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                        error={!!errors.correo}
                                        helperText={errors.correo}
                                    />
                                    <FormControl fullWidth required sx={{ mt: 2 }}>
                                        <InputLabel id="estado-label">Estado</InputLabel>
                                        <Select
                                            labelId="estado-label"
                                            label="Estado"
                                            value={estado}
                                            onChange={handleEstadoChange}
                                            startAdornment={<Person sx={{ mr: 1, color: 'gray' }} />}
                                        >
                                            <MenuItem value="Activo">Activo</MenuItem>
                                            <MenuItem value="Inactivo">Inactivo</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="DNI (*)"
                                        required
                                        value={dni}
                                        onChange={manejarDniCambio}
                                        InputProps={{
                                            startAdornment: (
                                                <Dns sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                        error={!!errors.dni}
                                        helperText={errors.dni}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Teléfono (*)"
                                        sx={{ mt: 2 }}
                                        required
                                        value={telefono}
                                        onChange={manejarTelefonoCambio}
                                        InputProps={{
                                            startAdornment: (
                                                <Phone sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                        error={!!errors.telefono}
                                        helperText={errors.telefono}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Dirección (*)"
                                        sx={{ mt: 2 }}
                                        required
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <Home sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                        error={!!errors.direccion}
                                        helperText={errors.direccion}
                                    />
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel id="cuota-label">Agregar Cuota Extraordinaria</InputLabel>
                                        <Select
                                            labelId="cuota-label"
                                            label="Agregar Cuota Extraordinaria"
                                            value={cuota}
                                            onChange={handleCuotaChange}
                                            startAdornment={<MonetizationOn sx={{ mr: 1, color: 'gray' }} />}
                                        >
                                            <MenuItem value="Fumigacion">Fumigación - S/65</MenuItem>
                                            <MenuItem value="Luz">Luz - S/20</MenuItem>
                                            <MenuItem value="Agua">Agua - S/18</MenuItem>
                                            <MenuItem value="Limpieza">Limpieza - S/15</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="tipo-persona-label">Tipo Persona</InputLabel>
                                        <Select
                                            labelId="tipo-persona-label"
                                            label="Tipo Persona"
                                            value=""
                                            onChange={() => { }}
                                            startAdornment={<Person sx={{ mr: 1, color: 'gray' }} />}
                                        >
                                            <MenuItem value="Natural">Natural</MenuItem>
                                            <MenuItem value="Juridica">Jurídica</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        label="Sexo"
                                        sx={{ mt: 2 }}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <Person sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Inquilino"
                                        sx={{ mt: 2 }}
                                        InputProps={{
                                            startAdornment: (
                                                <Person sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Block"
                                        sx={{ mt: 2 }}
                                        InputProps={{
                                            startAdornment: (
                                                <Business sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Giro de Negocio"
                                        sx={{ mt: 2 }}
                                        InputProps={{
                                            startAdornment: (
                                                <Business sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Monto Actual"
                                        value="S/ 158.00"
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: (
                                                <MonetizationOn sx={{ mr: 1, color: 'gray' }} />
                                            ),
                                        }}
                                        sx={{ bgcolor: "#F0F0F0", mt: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: "#4CAF50",
                                    borderColor: "#4CAF50",
                                    width: "100px",
                                    mr: 1,
                                    '&:hover': {
                                        backgroundColor: "#e0f2f1",
                                    },
                                }}
                                onClick={handleCloseModal}
                            >
                                Cerrar
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#4CAF50",
                                    color: "#fff",
                                    width: "100px",
                                    '&:hover': {
                                        backgroundColor: "#388E3C",
                                    },
                                }}
                                onClick={handleSubmit}
                            >
                                Registrar
                            </Button>
                        </Box> */}
                        </Box>
                    </>

                );
            case 1:
                return (
                    <Typography>Contenido de la pestaña 2</Typography>
                );
            case 2:
                return (
                    <Typography>Contenido de la pestaña 3</Typography>
                );
            default:
                return <Typography>Seleccione una pestaña</Typography>;
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Card
                sx={{
                    width: "900px",
                    p: 3,
                    bgcolor: "#f0f0f0",
                    boxShadow: 24,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Box sx={{ backgroundColor: "#4CAF50", p: 2, color: "#fff", borderRadius: 1 }}>
                    <Typography
                        id="modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ textAlign: 'center' }}
                    >
                        Registrar Nuevo Socio
                    </Typography>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                        <Tab label="Registro Usuario" />
                        <Tab label="Asignar Puesto" />
                        <Tab label="Registrar Cuota Extraordinaria" />
                        <Tab label="Registro pagos" />
                    </Tabs>
                </Box>
                {renderTabContent()}

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button
                        variant="outlined"
                        sx={{
                            color: "#4CAF50",
                            borderColor: "#4CAF50",
                            width: "100px",
                            mr: 1,
                            '&:hover': {
                                backgroundColor: "#e0f2f1",
                            },
                        }}
                        onClick={handleCloseModal}
                    >
                        Cerrar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            width: "100px",
                            '&:hover': {
                                backgroundColor: "#388E3C",
                            },
                        }}
                        onClick={handleSubmit}
                    >
                        Registrar
                    </Button>
                </Box>


            </Card>
        </Modal>
    );
};

export default Agregar;
