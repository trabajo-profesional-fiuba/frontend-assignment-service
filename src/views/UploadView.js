import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';

import ActiveUploadView from "./ActiveUploadView";
import ProtectedRoute from '../components/ProtectedRoute';
import ClosedAlert from "../components/ClosedAlert";

const BASE_URL = process.env.REACT_APP_API_URL;

const UploadView = () => {

  const user = useSelector((state) => state.user);
  const cuatrimestre = useSelector((state) => state.user.period_id);

  const [period, setPeriod] = useState(null);
  const [isActive, setIsActive] = useState(false);

  // Efecto para habilitar/deshabilitar etapas del learning path
    useEffect(() => {
      const fetchData = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const response = await axios.get(`${BASE_URL}/api/periods/${cuatrimestre}`, config);
          setPeriod(response.data);
          setIsActive(period.initial_project_active)
          console.log(period)
        } catch (err) {
          console.error("Error al obtener info del period", err);
        }
      };

      fetchData();
    }, []);
  
    return (
        <div>
          {isActive ? <ActiveUploadView /> : <ProtectedRoute><ClosedAlert message="No se aceptan más entregas." /></ProtectedRoute>}
        </div>
      );
  };
  
  export default UploadView;
  