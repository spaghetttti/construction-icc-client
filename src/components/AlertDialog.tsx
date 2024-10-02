import { useState } from 'react';

// material-ui
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// ==============================|| REUSABLE ALERT DIALOG WITH ERROR HANDLING ||============================== //

interface AlertDialogProps {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => Promise<any>; // The handler passed as prop for confirmation action (async)
  openButtonText: string; // The text for the button that opens the dialog
  errorMessage?: string; // Optional error message to display
}

export default function AlertDialog({ title, description, confirmText, cancelText, onConfirm, openButtonText }: AlertDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <Button color="error" variant="contained" onClick={handleClickOpen}>
        {openButtonText}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>
              {cancelText}
            </Button>
            <Button variant="contained" onClick={handleConfirm}>
              {confirmText}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
