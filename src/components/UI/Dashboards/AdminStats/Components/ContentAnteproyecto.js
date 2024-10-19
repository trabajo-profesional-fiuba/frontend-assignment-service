import React, { useState } from "react";
import {
  Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Grid, Paper,
  IconButton, Select, MenuItem } from "@mui/material";
import StatCard from "./StatCard";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";
import { updateGroup } from "../../../../../api/updateGroups";
import { setGroups } from "../../../../../redux/slices/groupsSlice";

const ContentAnteproyecto = ({
  loadingAnteproyectos,
  deliveries,
  downloadFile,
}) => {
  let groupsData = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);
  const [selectedReviewers, setSelectedReviewers] = useState({});
  const dispatch = useDispatch();

  if (loadingAnteproyectos || groupsData.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  const getGroupById = (id) => {
    console.log(groupsData);
    const group = groupsData?.find((g) => g.id === id);
    console.log(group);
    return group ? group : null;
  };
  const handleReviewerChange = async (deliveryId, reviewerId) => {
    //TODO: Enviar al back el revisor asignado
    console.log(selectedReviewers);
    console.log(deliveryId, reviewerId);
    setSelectedReviewers({
      ...selectedReviewers,
      [deliveryId]: reviewerId,
    });
    // Obtener el grupo y crear una copia modificable
    const updatedGroup = { ...getGroupById(parseInt(deliveryId, 10)) };

    if (updatedGroup) {
      // Asignar el reviewerId a la copia del grupo
      updatedGroup.reviewer_id = reviewerId;

      // Llamar al backend para actualizar el grupo
      await updateGroup(user, period, updatedGroup);

      // Crear una nueva lista de grupos actualizados
      const updatedGroups = groupsData.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group
      );

      // Despachar la actualización solo del grupo modificado en Redux
      dispatch(setGroups(updatedGroups));
    }
  };

  // Función para obtener el nombre del tutor por su id
  const getTutorNameById = (id) => {
    const tutor = tutors.find(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.length > 0 &&
        t.tutor_periods[0].id === id
    );
    return tutor ? `${tutor.name} ${tutor.last_name}` : "Sin asignar";
  };

  function getGroup(path) {
    const parts = path.split("/");
    return parts[1]; // Devuelve el grupo
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div>
      {groupsData && (
        <Box mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Grupos que entregaron"
                value={loadingAnteproyectos ? -1 : deliveries.length}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Grupos que faltan entregar"
                value={
                  loadingAnteproyectos
                    ? -1
                    : groupsData.length - deliveries.length
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de grupos"
                value={loadingAnteproyectos ? -1 : groupsData.length}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Grupo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Archivo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Fecha de Entrega
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descargar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingAnteproyectos ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              deliveries.map((entrega, index) => (
                <TableRow key={index}>
                  <TableCell>{getGroup(entrega.name)}</TableCell>
                  <TableCell>
                    {getTutorNameById(
                      groupsData.find(
                        (g) => parseInt(getGroup(entrega.name)) === g.id
                      )?.tutor_period_id
                    )}
                  </TableCell>
                  <TableCell>
                    {
                      groupsData.find(
                        (g) => parseInt(getGroup(entrega.name)) === g.id
                      )?.pre_report_title
                    }
                  </TableCell>

                  <TableCell>{formatDate(entrega.last_modified)}</TableCell>
                  <TableCell>
                    <Select
                      value={
                        selectedReviewers[getGroup(entrega.name)]
                          ? selectedReviewers[getGroup(entrega.name)]
                          : getGroupById(parseInt(getGroup(entrega.name), 10))
                              ?.reviewer_id === 0
                          ? ""
                          : getGroupById(parseInt(getGroup(entrega.name), 10))
                              ?.reviewer_id
                      }
                      onChange={(e) =>
                        handleReviewerChange(
                          getGroup(entrega.name),
                          e.target.value
                        )
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Seleccionar Revisor
                      </MenuItem>
                      {tutors.map((tutor) => (
                        <MenuItem key={tutor.id} value={tutor.id}>
                          {tutor.name} {tutor.last_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => downloadFile(getGroup(entrega.name))}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContentAnteproyecto;
