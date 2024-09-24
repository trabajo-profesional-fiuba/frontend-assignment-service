import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from "react-redux";

import {
  Container,
  Button,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const DropzoneBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #cccccc',
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  color: 'rgba(0, 0, 0, 0.6)',
  marginBottom: theme.spacing(2),
}));

const BASE_URL = process.env.REACT_APP_API_URL;

const UploadCSVForm = ({ formType }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar el diálogo
  const navigate = useNavigate();

  const { cuatrimestre } = useParams(); // Captura del cuatrimestre

  const user = useSelector((state) => state.user);

  // Effecto para redireccionar si la carga fue exitosa
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/admin'); // Redirige a la homepage
      }, 3000); // Espera 3 segundos antes de redirigir

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
      setFileError('');
    } else {
      setFileError('Por favor cargue un archivo CSV.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.csv',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('Por favor cargue un archivo CSV.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    const apiUrl = `${BASE_URL}/${formType}/upload?period_id=${cuatrimestre}`;
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'text/csv',
          Authorization: `Bearer ${user.token}`
        },
      });
      //Check this since it's a temporary fix for server behavior
      if (response.status === 201) {
        setResponseMessage(`Archivo de ${formType} cargado con éxito`);
        setIsSuccess(true);
      } else {
        setResponseMessage(`Hubo un problema al cargar el archivo de ${formType}`);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(`Error al cargar el archivo de ${formType}`, error);
      setResponseMessage(`Error al cargar el archivo de ${formType}`);
      setIsSuccess(false);
    } finally {
      setOpenDialog(true); // Abre el diálogo al finalizar
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (isSuccess) {
      navigate('/admin'); // Redirige a la homepage al cerrar el diálogo
    }
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Box textAlign="center">
          <Title variant="h5">
            {formType === 'students' && 'Cargar Archivo de Alumnos'}
            {formType === 'topics' && 'Cargar Archivo de Temas'}
            {formType === 'tutors' && 'Cargar Archivo de Tutores'}
          </Title>
        </Box>

        <form onSubmit={handleSubmit}>
          <DropzoneBox {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Suelta el archivo aquí...</p>
            ) : (
              <p>Arrastra y suelta el archivo aquí, o haz clic para seleccionar el archivo CSV</p>
            )}
          </DropzoneBox>
          {selectedFile && (
            <Typography variant="body1">
              Archivo seleccionado: {selectedFile.name}
            </Typography>
          )}
          {fileError && (
            <Typography variant="body2" color="error">
              {fileError}
            </Typography>
          )}
          <ButtonStyled variant="contained" color="primary" type="submit" fullWidth>
            Enviar
          </ButtonStyled>
        </form>

        {/* Diálogo de respuesta */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{isSuccess ? "Éxito" : "Error"}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {responseMessage}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </Container>
  );
};

export default UploadCSVForm;