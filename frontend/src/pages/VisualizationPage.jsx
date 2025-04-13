import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Chip,
  Stack
} from '@mui/material';

const VisualizationPage = () => {
  const [chartType, setChartType] = useState('bar');
  const [prompt, setPrompt] = useState('');

  // Chart data configuration
  const getChartOption = () => ({
    xAxis: {
      type: 'category',
      data: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      name: 'Months',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: 'Revenue ($)',
      nameLocation: 'middle',
      nameGap: 30
    },
    series: [{
      data: [3349, 4200, 3800, 4500, 5100, 4800, 4900, 5300, 4700, 5100, 5800, 7200],
      type: chartType,
      itemStyle: { color: '#1976d2' },
      smooth: true
    }],
    tooltip: { trigger: 'axis' }
  });

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: 'auto' }}>
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={3}>
          {/* Quick Summary */}
          <Paper sx={{ 
            p: 3,
            mb: 2,
            borderRadius: '16px',
            boxShadow: 3
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Summary
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              "Revenue grew 15% in Q4, with December as the top month due to holiday demand. 
              Sales dipped in January, likely from a post-holiday slowdown."
            </Typography>
          </Paper>

          {/* View Database Button */}
          <Button 
            variant="contained" 
            fullWidth
            sx={{ 
              height: 35,
              borderRadius: '12px',
              boxShadow: 3,
              textTransform: 'none',
              fontSize: '1rem'
            }}
            onClick={() => console.log('View Database clicked')}
          >
            View Database
          </Button>
        </Grid>

        {/* Middle Column - Main Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            height: 500,
            borderRadius: '16px',
            boxShadow: 3
          }}>
            <ReactECharts
              option={getChartOption()}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </Paper>
        </Grid>

        {/* Right Column - Chart Types */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ 
            p: 3,
            borderRadius: '16px',
            boxShadow: 3
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Chart Types
            </Typography>
            <List dense>
              {['bar', 'line', 'scatter'].map((type) => (
                <ListItem 
                  button 
                  key={type}
                  selected={chartType === type}
                  onClick={() => setChartType(type)}
                  sx={{ borderRadius: '8px' }}
                >
                  <ListItemText 
                    primary={`${type.charAt(0).toUpperCase() + type.slice(1)} Chart`} 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* User Prompt Section */}
      <Box sx={{ 
        mt: 4,
        position: 'sticky',
        bottom: 20,
        zIndex: 1
      }}>
        
          <Stack spacing={2}>
            {/* Prompt Suggestions */}
            <Stack direction="row" spacing={1}>
              <Chip 
                label="Prompt suggestions" 
                onClick={() => setPrompt('Prompt suggestions')}
                sx={{ borderRadius: '8px' }}
              />
              <Chip
                label="Prompt suggestions"
                onClick={() => setPrompt('Prompt Suggestions')}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>
            <Paper sx={{ 
          p: 2,
          borderRadius: '16px',
          boxShadow: 3,
        }}>
            {/* Input Field */}
            <TextField
              fullWidth
              placeholder="What would you like to visualize?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: { 
                  borderRadius: '8px',
                  '& fieldset': { borderColor: 'divider' }
                }
              }}
            />
             </Paper>
          </Stack>
       
      </Box>
    </Box>
  );
};

export default VisualizationPage;