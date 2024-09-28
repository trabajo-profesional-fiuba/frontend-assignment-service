import React, { useState } from "react";
import { Container, Box, Paper, Typography, Button, DialogTitle, DialogContent, CircularProgress, Dialog, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { styled, useMediaQuery, useTheme } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const StepBlock = ({ title, onRun, isRunDisabled }) => (
  <Box
    sx={{
      textAlign: "center",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      width: "100%",
      maxWidth: "250px",
      margin: "10px",
    }}
  >
    <h3>{title}</h3>
    <ButtonStyled
      variant="contained"
      sx={{ bgcolor: "#007bff", color: "#fff", mb: 1 }}
      onClick={onRun}
      disabled={isRunDisabled}
    >
      Correr
    </ButtonStyled>
  </Box>
);

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
  width: '100%',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: "#0072C6",
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  backgroundColor: "#0072C6",
  color: "#ffffff",
  transition: "background-color 0.3s",
  minWidth: "150px",
  "&:hover": {
    backgroundColor: "#005B9A",
  },
}));

const Algorithms = () => {
  const period = useSelector((state) => state.period);
  const navigate = useNavigate();
  const { cuatrimestre } = useParams();

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleRunStep1 = () => {
    setLoading(true);
    setOpenDialog(true);

    setTimeout(() => {
      setLoading(false);
      navigate(`/dashboard/${cuatrimestre}/groups`);
    }, 2000);
  };

  const handleRunStep2 = () => {
    // Aquí podrías agregar la lógica para manejar el segundo paso
  };

  const handleRunStep3 = () => {
    // Aquí podrías agregar la lógica para manejar el tercer paso
  };

  return (
    <Container maxWidth={false} sx={{ overflow: "hidden" }}> 
        <Title variant="h4">Algoritmos de asignación</Title>

        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <StepBlock
            title="Armar grupos"
            onRun={handleRunStep1}
            isRunDisabled={period.groups_assignment_completed} // Deshabilitar si ya se completó
          />
          <ArrowForwardIcon sx={{ fontSize: { xs: 30, md: 50 }, mx: 2 }} />
          <StepBlock
            title="Asignar tema y tutor a cada grupo"
            onRun={handleRunStep2}
            isRunDisabled={period.topics_tutors_assignment_completed} // Deshabilitar si ya se completó
          />
          <ArrowForwardIcon sx={{ fontSize: { xs: 30, md: 50 }, mx: 2 }} />
          <StepBlock
            title="Asignar fecha de presentación"
            onRun={handleRunStep3}
            isRunDisabled={period.presentation_dates_assignment_completed} // Deshabilitar si ya se completó
          />
        </Container>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
        sx={{
          height: '100%',
          maxHeight: '100vh',
        }}
      >
        <DialogTitle>
          {!loading && "Grupos Formados"}
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            minHeight: '300px',
            maxHeight: '100vh',
            minWidth: '300px',
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Armando grupos...</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Algorithms;
