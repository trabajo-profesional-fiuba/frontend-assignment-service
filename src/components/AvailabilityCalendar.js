import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";

import MySnackbar from "./UI/MySnackBar";
import EventModal from "./EventModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { sendAvailability } from "../api/sendAvailability";
import { CalendarStyled, AvailabilityContainer, ButtonContainer, DescriptionBox } from "../styles/AvailabilityCalendarStyle";

// Localizador de momento
const localizer = momentLocalizer(moment);

const AvailabilityCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { cuatrimestre } = useParams();

  const handleSnackbarOpen = (message, status = "info") => {
    setSnackbarMessage(message);
    setSnackbarStatus(status);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSelectSlot = ({ start, end }) => {
    const isEventOverlap = events.some(
      (event) => start < event.end && end > event.start
    );

    if (isEventOverlap) {
      handleSnackbarOpen(
        "El evento se solapa con otro existente. Por favor, selecciona un intervalo diferente.",
        "error"
      );
      return;
    }

    setSelectedSlot({ start, end });
    setModalOpen(true);
  };

  const handleConfirmEvent = () => {
    if (selectedSlot) {
      setEvents((prevEvents) => [
        ...prevEvents,
        { start: selectedSlot.start, end: selectedSlot.end },
      ]);
      handleSnackbarOpen(
        "Bloque de disponibilidad creado exitosamente.",
        "success"
      );
      setModalOpen(false);
    }
  };

  const handleSelectEvent = (event) => {
    setEventToDelete(event);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteEvent = () => {
    if (eventToDelete) {
      setEvents((prevEvents) =>
        prevEvents.filter(
          (event) =>
            event.start !== eventToDelete.start ||
            event.end !== eventToDelete.end
        )
      );
      handleSnackbarOpen(
        "Bloque de disponibilidad eliminado exitosamente.",
        "success"
      );
    }
    setConfirmDeleteOpen(false);
  };

  const onSubmitEvents = async () => {
    try {
      await sendAvailability(user, events, cuatrimestre);
      handleSnackbarOpen("Disponibilidad enviada exitosamente.", "success");
      setTimeout(() => {
        navigate(`/dashboard/${cuatrimestre}`); 
      }, 1500); 
    } catch (error) {
      handleSnackbarOpen("Error al enviar la disponibilidad.", "error");
    }
  };

  return (
    <AvailabilityContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Selecciona tu disponibilidad
      </Typography>

      {/* Descripción del Calendario */}
      <DescriptionBox>
        <Typography variant="body1" align="justify" gutterBottom>
          En este calendario podrás seleccionar los intervalos de tiempo que estás
          disponibles para que los grupos realicen sus presentaciones. Haz clic en
          cualquier espacio en blanco para agregar un intervalo de disponibilidad.
          Si deseas crear un intervalo que dure más de 1 hora, simplemente arrastra
          el mouse desde el inicio hasta el final del intervalo.
          Si necesitas eliminar un intervalo existente, simplemente selecciónalo de nuevo.
        </Typography>
      </DescriptionBox>

      <CalendarStyled
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={["week"]}
        defaultView="week"
        step={60}
        showMultiDayTimes
        defaultDate={new Date()}
        style={{ height: "500px", margin: "50px" }}
        min={new Date(0, 0, 0, 9, 0, 0)} // Comienza a las 9 AM
        max={new Date(0, 0, 0, 21, 0, 0)} // Termina a las 9 PM
        components={{
          month: {
            header: () => null,
          },
        }}
        dayPropGetter={(date) => {
          const day = date.getDay();
          if (day === 0 || day === 6) {
            // sábado y domingo
            return { style: { display: "none" } }; // Ocultar este día
          }
          return {};
        }}
        onNavigation={(date) => {
          const day = date.getDay();
          if (day === 0 || day === 6) {
            return false;
          }
        }}
      />
      <ButtonContainer>
        <Button variant="contained" color="primary" onClick={onSubmitEvents}>
          Enviar
        </Button>
      </ButtonContainer>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmEvent}
      />

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteEvent}
      />

      <MySnackbar
        message={snackbarMessage}
        status={snackbarStatus}
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
      />
    </AvailabilityContainer>
  );
};

export default AvailabilityCalendar;