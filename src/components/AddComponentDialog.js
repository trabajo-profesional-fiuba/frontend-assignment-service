import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Button, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import MySnackbar from '../components/UI/MySnackBar';
import { addTopic } from '../api/handleTopics'
import { setTopics } from '../redux/slices/topicsSlice';

const AddTopicDialog = ({ open, handleClose }) => {
  const [newTopic, setNewTopic] = useState({ name: '', category: '' });

  const dispatch = useDispatch()

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const user = useSelector((state) => state.user);
  const topics = Object.values(useSelector((state) => state.topics))
  .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
  .filter(item => Object.keys(item).length > 0); // Elimina objetos vacíos  console.log(topics)
  const handleAddTopic = async () => {
    try {
      const topic = await addTopic(newTopic, user)
      setTopics([...topics, topic]);
      dispatch(setTopics(topic));
      setNewTopic({ name: '', category: '' })
      setNotification({
        open: true,
        message: "Tema agregado éxitosamente",
        status: "success",
      });
      handleClose(true)
    } catch (err) {
      console.error(`Error when adding new topic: ${err}`)
      setNotification({
        open: true,
        message: "Error al agregar el tema. Por favor, vuelva a intentar más tarde.",
        status: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Nuevo Tema</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Título"
            value={newTopic.name}
            onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Categoría"
            value={newTopic.category}
            onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleAddTopic} color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
    <MySnackbar
      open={notification.open}
      handleClose={handleSnackbarClose}
      message={notification.message}
      status={notification.status}
    />
    </>
  );
};

export default AddTopicDialog;
