import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Importa el ícono Close
import { CalendarStyled } from "../../../styles/AvailabilityCalendarStyle";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";

const ResultsDialog = ({
  open,
  onClose,
  events,
  isEditing,
  handleStartEditing,
  handleCancelEditing,
  handleSaveChanges,
  handleCloseResults,
  handleSelectSlot,
  handleSelectEvent,
  defaultDate,
  handleRerunAlgorithm,
  handleConfirmResults,
}) => {
  const localizer = momentLocalizer(moment);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        style: {
          height: "90vh", // Ajusta la altura total del diálogo
          maxHeight: "90vh", // Limita la altura máxima para que no desborde
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle sx={{ backgroundColor: "#e0f7fa", color: "#006064" }}>
        Resultados
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseResults}
          aria-label="close"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ maxHeight: "90vh", backgroundColor: "#f4f6f8" }}
      >
        <CalendarStyled
          localizer={localizer}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          events={events}
          selectable
          views={["week"]}
          defaultView="week"
          timeslots={1} // Aumenta la cantidad de slots por cada intervalo de tiempo
          step={60}
          showMultiDayTimes
          defaultDate={defaultDate || new Date()}
          style={{
            height: "90vh",
            margin: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
              color: "black",
              fontSize: "0.85rem",
              borderRadius: "4px",
              padding: "4px",
            },
          })}
          min={new Date(0, 0, 0, 9, 0, 0)}
          max={new Date(0, 0, 0, 21, 0, 0)}
          dayPropGetter={(date) => {
            const day = date.getDay();
            if (day === 0 || day === 6) {
              return { style: { display: "none" } };
            }
            return {};
          }}
        />
      </DialogContent>

      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        {!isEditing && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleStartEditing} // Comienza el modo de edición
          >
            Editar resultado
          </Button>
        )}
        {isEditing && (
          <Button
            color="error"
            variant="outlined"
            onClick={handleCancelEditing} // Cancela la edición y restaura la copia original
          >
            Cancelar
          </Button>
        )}
        {isEditing && (
          <Button
            onClick={handleSaveChanges}
            color="primary"
            variant="contained"
            // disabled={!canSaveChanges()} // Desactiva el botón si no se pueden guardar los cambios
          >
            Guardar cambios
          </Button>
        )}

        {!isEditing && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRerunAlgorithm}
          >
            Volver a correr algoritmo
          </Button>
        )}
        {!isEditing && (
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmResults}
          >
            Confirmar resultados
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ResultsDialog;
