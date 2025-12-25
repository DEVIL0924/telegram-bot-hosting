import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography,
  Button, Chip, TextField, Select, MenuItem
} from '@mui/material';
import { PlayArrow, Stop, Code, Add } from '@mui/icons-material';

const Dashboard = () => {
  const [bots, setBots] = useState([]);
  const [newBot, setNewBot] = useState({
    name: '',
    language: 'python',
    code: ''
  });

  const createBot = async () => {
    const response = await fetch('/api/bots/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBot)
    });
    const bot = await response.json();
    setBots([...bots, bot]);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Telegram Bot Hosting
      </Typography>
      
      {/* Create Bot Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create New Bot
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bot Name"
                value={newBot.name}
                onChange={(e) => setNewBot({...newBot, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Select
                fullWidth
                value={newBot.language}
                onChange={(e) => setNewBot({...newBot, language: e.target.value})}
              >
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="php">PHP</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={5}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={createBot}
              >
                Create Bot
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bots List */}
      <Grid container spacing={3}>
        {bots.map((bot) => (
          <Grid item xs={12} md={6} key={bot.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{bot.name}</Typography>
                  <Chip
                    label={bot.status}
                    color={bot.status === 'running' ? 'success' : 'default'}
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  Language: {bot.language}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    startIcon={<PlayArrow />}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  >
                    Start
                  </Button>
                  <Button
                    startIcon={<Stop />}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  >
                    Stop
                  </Button>
                  <Button
                    startIcon={<Code />}
                    variant="outlined"
                  >
                    Edit Code
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
