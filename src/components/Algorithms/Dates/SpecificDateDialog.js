import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const SpecificDateDialog = ({
  open,
  onClose,
  groups,
  period,
  tutor,
  topic,
  evaluador,
  setEvaluador,
  selectedDateTime,
  setSelectedDateTime,
  selectedHour,
  setSelectedHour,
  handleAssignDate,
  getTutorNameById,
  hours,
  filteredTutors,
  group,
  setGroup,
  setTutor,
  setTopic,
}) => {
  const [isAssignDisabled, setIsAssignDisabled] = useState(true);

  // Verifica si todos los campos necesarios están completos para habilitar el botón de Asignar
  useEffect(() => {
    setIsAssignDisabled(
      !(
        group &&
        selectedDateTime &&
        selectedHour &&
        evaluador
      )
    );
  }, [group, selectedDateTime, selectedHour, evaluador]);

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  };

  const handleCancel = () => {
    // Restablece los valores de todos los campos
    setGroup("");
    setTutor("");
    setTopic("");
    setEvaluador("");
    setSelectedDateTime(null);
    setSelectedHour("");
    onClose(); // Cierra el diálogo
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Asignar Fecha a Grupo</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Selecciona un Grupo:
            </Typography>
            <Select
              fullWidth
              value={group?.id || ""}
              onChange={(e) => {
                const selectedGroup = groups.find(
                  (g) => g.id === e.target.value
                );
                setGroup(selectedGroup);

                const selectedTutor = getTutorNameById(
                  selectedGroup.tutor_period_id,
                  period.id
                );
                setTutor(selectedTutor ? selectedTutor : "");
                setTopic(selectedGroup.topic.name);
              }}
              displayEmpty
              renderValue={(selected) => {
                const selectedGroup = groups.find((g) => g.id === selected);
                return selectedGroup ? `Grupo ${selectedGroup.id}` : "Selecciona un grupo";
              }}
            >
              <MenuItem value="" disabled>
                Selecciona un grupo
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {`Grupo ${group.id}`}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Tutor"
              value={tutor || ""}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tema"
              value={topic || ""}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Selecciona un Evaluador:
            </Typography>
            <Select
              fullWidth
              value={evaluador || ""}
              onChange={(e) => setEvaluador(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Selecciona un evaluador
              </MenuItem>
              {filteredTutors.map((tutor) => (
                <MenuItem key={tutor.id} value={tutor.id}>
                  {`${tutor.name} ${tutor.last_name}`}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha"
                value={selectedDateTime}
                onChange={(newValue) => setSelectedDateTime(newValue.startOf("day"))}
                format="DD/MM/YYYY"
                minDate={dayjs()}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <Select
              value={selectedHour || ""}
              onChange={handleHourChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Selecciona la Hora
              </MenuItem>
              {hours.map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleAssignDate}
          color="primary"
          variant="contained"
          disabled={isAssignDisabled}
        >
          Asignar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpecificDateDialog;
