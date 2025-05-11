// src/components/SimulationForm.tsx
import React from 'react';
import {
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';

export interface SimulationData {
  name: string;
  time: number;
  exec_time: number;
  seed_users?: number;
  seed_servers?: number;
  type_placement: number;
}

interface SimulationFormProps {
  formData: SimulationData;
  handleChange: (field: keyof SimulationData, value: string | number) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  formData,
  handleChange,
  onSubmit,
}) => {
  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <CardContent>
        <form onSubmit={onSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />

            <TextField
              label="Time"
              type="number"
              value={formData.time}
              onChange={(e) => handleChange('time', Number(e.target.value))}
              required
            />

            <TextField
              label="Execution Time"
              type="number"
              value={formData.exec_time}
              onChange={(e) => handleChange('exec_time', Number(e.target.value))}
              required
            />

            <TextField
              label="Seed Users"
              type="number"
              value={formData.seed_users ?? ''}
              onChange={(e) => handleChange('seed_users', Number(e.target.value))}
            />

            <TextField
              label="Seed Servers"
              type="number"
              value={formData.seed_servers ?? ''}
              onChange={(e) => handleChange('seed_servers', Number(e.target.value))}
            />

            <FormControl fullWidth required>
              <InputLabel>Placement Type</InputLabel>
              <Select
                value={formData.type_placement}
                onChange={(e) => handleChange('type_placement', Number(e.target.value))}
                label="Placement Type"
              >
                <MenuItem value={0}>Type 0</MenuItem>
                <MenuItem value={1}>Type 1</MenuItem>
                <MenuItem value={2}>Type 2</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimulationForm;
