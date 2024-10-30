import React from "react";
import { Button, Grid } from "@mui/material";

const ButtonSection = ({ handleSelectEvaluators, handleAssignEspecificDate, handleRun, period }) => (
//   <Grid container item xs={12} justifyContent="flex-end" gap={3}>
//     <Button variant="outlined" onClick={() => setOpenEvaluatorDialog(true)}>
//       Seleccionar evaluadores
//     </Button>
//     <Button variant="outlined" onClick={() => setAssignDateOpenDialog(true)}>
//       Asignar fecha y hora a grupo
//     </Button>
//     <Button variant="contained" onClick={handleRun} disabled={period.presentation_dates_assignment_completed}>
//       Correr
//     </Button>
//   </Grid>

<Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 3, // Espacio entre los botones
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSelectEvaluators}
            sx={{
              padding: "6px 26px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.07)",
              transition: "all 0.3s ease",
            }}
          >
            Seleccionar evaluadores
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAssignEspecificDate}
            sx={{
              padding: "6px 26px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.07)",
              transition: "all 0.3s ease",
            }}
          >
            Asignar fecha y hora a grupo
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleRun}
            disabled={period.presentation_dates_assignment_completed}
            sx={{
              padding: "6px 26px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            Correr
          </Button>
        </Grid>
);

export default ButtonSection;
