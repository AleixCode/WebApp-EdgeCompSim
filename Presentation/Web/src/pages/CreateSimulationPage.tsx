import { useState } from 'react';
import Box from '@mui/joy/Box';
import Tab from '@mui/joy/Tab';
import Tabs from '@mui/joy/Tabs';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Grid from '@mui/joy/Grid';
import { TabList } from '@mui/joy';

interface Job {
  cpu: number;
  mem: number;
  hdd: number;
  probability: number;
}

interface JobDistribution {
  initial_time: number;
  final_time: number;
  probability: number;
}

interface Server {
  cpu: number;
  mem: number;
  hdd: number;
  availability: string;
}

interface SimulationData {
  name: '',
  time: 0,
  exec_time: 0,
  seed_users: 0,
  seed_servers: 0,
  type_placement: 0, // 0, 1, 2
}

export default function CreateSimulation() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    time: 0,
    exec_time: 0,
    seed_users: 0,
    seed_servers: 0,
    type_exec: 0,
    type_placement: 0,
  });
  const [possibleJobs, setPossibleJobs] = useState<Job[]>([]);
  const [jobDistributions, setJobDistributions] = useState<JobDistribution[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const [newJob, setNewJob] = useState<Job>({ cpu: 0, mem: 0, hdd: 0, probability: 0 });
  const [newDist, setNewDist] = useState<JobDistribution>({ initial_time: 0, final_time: 0, probability: 0 });
  const [newServer, setNewServer] = useState<Server>({ cpu: 0, mem: 0, hdd: 0, availability: 'H' });

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateDistributions = (): string | null => {
    const totalProbability = jobDistributions.reduce((sum, d) => sum + d.probability, 0);
    if (Math.abs(totalProbability - 1) > 0.001)
      return 'Total probability in job distributions must be 1';

    const coveredRange = new Set<number>();
    for (const dist of jobDistributions) {
      for (let i = dist.initial_time; i <= dist.final_time; i++) {
        coveredRange.add(i);
      }
    }
    for (let i = 0; i <= formData.time; i++) {
      if (!coveredRange.has(i))
        return 'Time range is not fully covered in job distributions';
    }
    return null;
  };

  const validateJobs = (): string | null => {
    const totalProbability = possibleJobs.reduce((sum, j) => sum + j.probability, 0);
    return Math.abs(totalProbability - 1) < 0.001
      ? null
      : 'Total probability in possible jobs must be 1';
  };

  const isValid = () => {
    return (
      formData.name !== '' &&
      formData.time > 0 &&
      formData.exec_time > 0 &&
      !validateJobs() &&
      !validateDistributions()
    );
  };

  const handleCreateSimulation = () => {
    const jobError = validateJobs();
    const distError = validateDistributions();
    const errs: string[] = [];
    if (jobError) errs.push(jobError);
    if (distError) errs.push(distError);
    setErrors(errs);
    if (errs.length === 0) {
      console.log('Creating simulation with:', {
        ...formData,
        possibleJobs,
        jobDistributions,
        servers,
      });
    }
  };

  return (
    <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
     <Typography level="h4" gutterBottom>
        Create Simulation
      </Typography>

      <Tabs value={tabIndex} onChange={(_, newValue) => newValue !== null && setTabIndex(Number(newValue))}>
  <TabList>
    <Tab>General</Tab>
    <Tab>Possible Jobs</Tab>
    <Tab>Job Distributions</Tab>
    <Tab>Servers</Tab>
  </TabList>
</Tabs>


      <Divider sx={{ my: 2 }} />

      {/* General Tab */}
      {tabIndex === 0 && (
        <Stack spacing={2}>
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Time"
            value={formData.time}
            onChange={(e) => handleChange('time', +e.target.value)}
          />
          <Input
            type="number"
            placeholder="Execution Time"
            value={formData.exec_time}
            onChange={(e) => handleChange('exec_time', +e.target.value)}
          />
          <Input
            type="number"
            placeholder="Seed Users (optional)"
            value={formData.seed_users}
            onChange={(e) => handleChange('seed_users', +e.target.value)}
          />
          <Input
            type="number"
            placeholder="Seed Servers (optional)"
            value={formData.seed_servers}
            onChange={(e) => handleChange('seed_servers', +e.target.value)}
          />

          <Select
            value={formData.type_exec}
            onChange={(_, v) => handleChange('type_exec', v)}
          >
            <Option value={0}>Type 0</Option>
            <Option value={1}>Type 1</Option>
            <Option value={2}>Type 2</Option>
            <Option value={3}>Type 3</Option>
          </Select>

          <Select
            value={formData.type_placement}
            onChange={(_, v) => handleChange('type_placement', v)}
          >
            <Option value={0}>Placement 0</Option>
            <Option value={1}>Placement 1</Option>
            <Option value={2}>Placement 2</Option>
            <Option value={3}>Placement 3</Option>
          </Select>
        </Stack>
      )}

      {/* Possible Jobs Tab */}
      {tabIndex === 1 && (
        <Stack spacing={2}>
          <Typography level="title-md">Add Possible Job</Typography>
          <Grid container spacing={1}>
            <Grid xs={3}>
              <Input
                type="number"
                placeholder="CPU"
                value={newJob.cpu}
                onChange={(e) =>
                  setNewJob({ ...newJob, cpu: +e.target.value })
                }
              />
            </Grid>
            <Grid xs={3}>
              <Input
                type="number"
                placeholder="Memory"
                value={newJob.mem}
                onChange={(e) =>
                  setNewJob({ ...newJob, mem: +e.target.value })
                }
              />
            </Grid>
            <Grid xs={3}>
              <Input
                type="number"
                placeholder="HDD"
                value={newJob.hdd}
                onChange={(e) =>
                  setNewJob({ ...newJob, hdd: +e.target.value })
                }
              />
            </Grid>
            <Grid xs={3}>
              <Input
                type="number"
                placeholder="Probability"
                value={newJob.probability}
                onChange={(e) =>
                  setNewJob({ ...newJob, probability: +e.target.value })
                }
              />
            </Grid>
          </Grid>
          <Button onClick={() => setPossibleJobs([...possibleJobs, newJob])}>
            Add Job
          </Button>
          <List>
            {possibleJobs.map((job, i) => (
              <ListItem key={i}>
                {`CPU: ${job.cpu}, MEM: ${job.mem}, HDD: ${job.hdd}, Prob: ${job.probability}`}
              </ListItem>
            ))}
          </List>
        </Stack>
      )}

      {/* Job Distributions Tab */}
      {tabIndex === 2 && (
        <Stack spacing={2}>
          <Typography level="title-md">Add Job Distribution</Typography>
          <Grid container spacing={1}>
            <Grid xs={4}>
              <Input
                type="number"
                placeholder="Initial Time"
                value={newDist.initial_time}
                onChange={(e) =>
                  setNewDist({ ...newDist, initial_time: +e.target.value })
                }
              />
            </Grid>
            <Grid xs={4}>
              <Input
                type="number"
                placeholder="Final Time"
                value={newDist.final_time}
                onChange={(e) =>
                  setNewDist({ ...newDist, final_time: +e.target.value })
                }
              />
            </Grid>
            <Grid xs={4}>
              <Input
                type="number"
                placeholder="Probability"
                value={newDist.probability}
                onChange={(e) =>
                  setNewDist({ ...newDist, probability: +e.target.value })
                }
              />
            </Grid>
          </Grid>
          <Button onClick={() => setJobDistributions([...jobDistributions, newDist])}>
            Add Distribution
          </Button>
          <List>
            {jobDistributions.map((dist, i) => (
              <ListItem key={i}>
                {`[${dist.initial_time}-${dist.final_time}], Prob: ${dist.probability}`}
              </ListItem>
            ))}
          </List>
        </Stack>
      )}

      {/* Servers Tab */}
      {tabIndex === 3 && (
        <Stack spacing={2}>
          <Typography level="title-md">Add Server</Typography>
          <Grid container spacing={1}>
            <Grid xs={3}>
              <Input
                type="number"
                placeholder="CPU"
                value={newServer.cpu}
                onChange={(e) =>
                  setNewServer({ ...newServer, cpu: +e.target.value })
                }
              />
            </Grid>
            <Grid xs={3}>
              <Input
                type="number"
                placeholder="MEM"
                value={newServer.mem}
                onChange={(e) =>
                  setNewServer({ ...newServer, mem: +e.target.value })
                }
              />
            </Grid>
            <Grid xs={3}>
              <Input
                type="number"
                placeholder="HDD"
                value={newServer.hdd}
                onChange={(e) =>
                  setNewServer({ ...newServer, hdd: +e.target.value })
                }
              />
            </Grid>
            <Grid xs={3}>
              <Select
                value={newServer.availability}
                onChange={(_, v) => {
                  if (v !== null) setNewServer({ ...newServer, availability: v });
                }}
              >
                <Option value="H">High</Option>
                <Option value="M">Medium</Option>
                <Option value="L">Low</Option>
              </Select>
            </Grid>
          </Grid>
          <Button onClick={() => setServers([...servers, newServer])}>
            Add Server
          </Button>
          <List>
            {servers.map((s, i) => (
              <ListItem key={i}>
                {`CPU: ${s.cpu}, MEM: ${s.mem}, HDD: ${s.hdd}, Avail: ${s.availability}`}
              </ListItem>
            ))}
          </List>
        </Stack>
      )}

      {errors.length > 0 && (
        <Box mt={2} sx={{ color: 'danger.plainColor' }}>
          {errors.map((err, i) => (
            <Typography key={i} color="danger" level="body-sm">
              {err}
            </Typography>
          ))}
        </Box>
      )}

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button onClick={handleCreateSimulation} disabled={!isValid()} color="primary">
          Create Simulation
        </Button>
      </Box>
    </Sheet>
  );
}
