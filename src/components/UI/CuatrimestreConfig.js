import React from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Paper,
  Box,
  Button,
  Divider
} from '@mui/material';
import { styled } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { togglePeriodSetting } from '../../redux/periodSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#f0f0f0',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
}));

const CuatrimestreConfig = () => {
  const settings = useSelector((state) => state.period); // Ajuste para obtener el estado de Redux
  const dispatch = useDispatch(); // Si quieres manejar el estado con Redux
  
  const handleToggle = (field) => {
    dispatch(togglePeriodSetting({ field }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Configuración del Cuatrimestre
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Configuración</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Mapea los campos del estado y crea una fila por cada uno */}
            <TableRow>
              <TableCell>Formulario de inscripción de grupos</TableCell>
              <TableCell align="right">
                <Switch
                  checked={settings.form_active}
                  onChange={() => handleToggle('form_active')}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Entrega de Anteproyecto</TableCell>
              <TableCell align="right">
                <Switch
                  checked={settings.initial_project_active}
                  onChange={() => handleToggle('initial_project_active')}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Entrega Intermedia</TableCell>
              <TableCell align="right">
                <Switch
                  checked={settings.intermediate_project_active}
                  onChange={() => handleToggle('intermediate_project_active')}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Entrega Final</TableCell>
              <TableCell align="right">
                <Switch
                  checked={settings.final_project_active}
                  onChange={() => handleToggle('final_project_active')}
                  color="primary"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </StyledTableContainer>
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => alert("Configuraciones guardadas!")}> 
          Guardar
        </Button>
      </Box> */}
    </Container>
  );
};

export default CuatrimestreConfig;