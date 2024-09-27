import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTableData } from "../../api/handleTableData";
import { useParams } from "react-router-dom";
import { Box } from "@mui/system";

// Componente para la tabla de grupos
const GroupDataTable = () => {
  // Obtener la lista de topics desde Redux
  const topics = Object.values(useSelector((state) => state.topics)); // Asume que el slice de Redux tiene los topics
  const tutors = Object.values(useSelector((state) => state.tutors)); // Asume que el slice de Redux tiene los topics
  const [loading, setLoading] = useState(false)

  // Función para obtener el nombre del topic por su id
  const getTopicNameById = (id) => {
    const topic = topics.find((t) => t.id === id);
    return topic ? topic.name : "Desconocido"; // Si no encuentra el topic, mostrar 'Desconocido'
  };

  // Función para obtener el nombre del tutor por su id
  const getTutorNameById = (id) => {
    const tutor = tutors.find((t) => t.periods[0].id === id);
    return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el topic, mostrar 'Sin asignar'
  };

  const { cuatrimestre } = useParams(); // Captura del cuatrimestre
  const user = useSelector((state) => state.user);
  const [groups, setGroups] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true)
      const endpoint = `/groups/?period=${cuatrimestre}`;
      const responseData = await getTableData(endpoint, user);
      console.log(responseData);
      const sortedGroups = responseData.sort((a, b) => a.id - b.id);
      setGroups(sortedGroups); // Actualiza los datos de los grupos
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Grupo número</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Padrón</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tutor</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tema asignado</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Preferencia 1</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Preferencia 2</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Preferencia 3</TableCell>
          </TableRow>
        </TableHead>
        {loading ? (       
          // Mostrar CircularProgress dentro del cuerpo de la tabla
          <TableRow>
              <TableCell colSpan={10} align="center">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>) : (
          <TableBody>
          {groups.map((group) => (
            <React.Fragment key={group.id}>
              {/* Fila de separación visual */}
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell colSpan={10} align="center"></TableCell>
              </TableRow>

              {/* Fila del grupo */}
              <TableCell rowSpan={group.students.length + 1} align="center">
                {group.id}
              </TableCell>

              {/* Iterar sobre los estudiantes del grupo */}
              {group.students.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.last_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.id}</TableCell>
                  <>
                  {index === 0 && (
                    <TableCell rowSpan={group.students.length} align="center">
                    {getTutorNameById(group.tutor_period_id) || "Sin asignar"}{" "}
                    {/* Mostrar el tutor del grupo */}
                  </TableCell>
                  )}
                  {index === 0 && (
                    <TableCell rowSpan={group.students.length} align="center">
                    {group.topic_id ? getTopicNameById(group.topic_id) : "Sin asignar"}{" "}
                    {/* Mostrar el tema asignado del grupo */}
                  </TableCell>
                  )}
                  </>
                  {/* Mostrar preferencias o topic_id dependiendo de si preferred_topics está vacío */}
                  {index === 0 && (
                    <>
                      {group.preferred_topics.length === 0 ? (
                        <TableCell
                          rowSpan={group.students.length}
                          colSpan={3}
                          align="center"
                        >
                          {getTopicNameById(group.topic_id)}{" "}
                          {/* Mostrar nombre del topic */}
                        </TableCell>
                      ) : (
                        <>
                          <TableCell rowSpan={group.students.length}>
                            {getTopicNameById(group.preferred_topics[0]) || ""}
                          </TableCell>
                          <TableCell rowSpan={group.students.length}>
                            {getTopicNameById(group.preferred_topics[1]) || ""}
                          </TableCell>
                          <TableCell rowSpan={group.students.length}>
                            {getTopicNameById(group.preferred_topics[2]) || ""}
                          </TableCell>
                        </>
                      )}
                    </>
                  )}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>)}
      </Table>
    </TableContainer>
  );
};

export default GroupDataTable;