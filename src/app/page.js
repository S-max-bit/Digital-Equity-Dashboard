'use client';

import { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { Line } from 'react-chartjs-2';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Map = dynamic(() => import('../components/Maps'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '400px', width: '100%' }}>Loading map...</div>
  ),
});

export default function Dashboard() {
  const digitalLiteracyData = [
    { programName: "Basic Computer Skills", participants: 150 },
    { programName: "Internet Safety", participants: 200 },
    { programName: "Digital Workplace", participants: 175 },
    { programName: "Online Banking", participants: 125 },
    { programName: "Social Media Skills", participants: 225 },
  ];

  const broadbandData = [
    {
      id: 1,
      region: "Honolulu",
      lat: 21.3069,
      lng: -157.8583,
      coverage: 95,
      provider: "Hawaiian Telcom",
      speed: "1 Gbps"
    },
    {
      id: 2,
      region: "Hilo",
      lat: 19.7241,
      lng: -155.0868,
      coverage: 82,
      provider: "Spectrum",
      speed: "500 Mbps"
    },
    {
      id: 3,
      region: "Kailua",
      lat: 21.4022,
      lng: -157.7394,
      coverage: 88,
      provider: "Hawaiian Telcom",
      speed: "750 Mbps"
    },
    {
      id: 4,
      region: "Kahului",
      lat: 20.8893,
      lng: -156.4729,
      coverage: 85,
      provider: "Spectrum",
      speed: "400 Mbps"
    },
    {
      id: 5,
      region: "Kona",
      lat: 19.6400,
      lng: -155.9969,
      coverage: 80,
      provider: "Hawaiian Telcom",
      speed: "300 Mbps"
    }
  ];

  const planAssets = [
    {
      id: 1,
      assetName: "Honolulu Digital Hub",
      descriptionOfServices: "Free computer access, digital literacy training, and workforce development programs",
      geographicArea: "Honolulu",
      typeOfEntity: "Government"
    },
    {
      id: 2,
      assetName: "Maui Tech Center",
      descriptionOfServices: "Technology education and digital skills training for all ages",
      geographicArea: "Kahului",
      typeOfEntity: "Non-profit"
    },
    {
      id: 3,
      assetName: "Big Island Digital Access Point",
      descriptionOfServices: "Public internet access and digital literacy programs",
      geographicArea: "Hilo",
      typeOfEntity: "Public-Private Partnership"
    },
    {
      id: 4,
      assetName: "Kauai Connected",
      descriptionOfServices: "Mobile digital literacy training unit serving rural communities",
      geographicArea: "Island-wide",
      typeOfEntity: "Non-profit"
    },
    {
      id: 5,
      assetName: "Windward Tech Lab",
      descriptionOfServices: "STEM education and digital skills training for youth",
      geographicArea: "Kailua",
      typeOfEntity: "Educational"
    },
    {
      id: 6,
      assetName: "Kona Community Tech Center",
      descriptionOfServices: "Digital inclusion programs and internet access for seniors",
      geographicArea: "Kona",
      typeOfEntity: "Non-profit"
    },
    {
      id: 7,
      assetName: "Hawaii Digital Literacy Coalition",
      descriptionOfServices: "Coordinating digital literacy programs across islands",
      geographicArea: "Statewide",
      typeOfEntity: "Non-profit"
    },
    {
      id: 8,
      assetName: "Pacific Digital Academy",
      descriptionOfServices: "Advanced digital skills and coding bootcamps",
      geographicArea: "Honolulu",
      typeOfEntity: "Educational"
    }
  ];

  const literacyChartData = {
    labels: digitalLiteracyData.map((program) => program.programName),
    datasets: [
      {
        label: 'Participants in Literacy Programs',
        data: digitalLiteracyData.map((program) => program.participants),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Digital Equity Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Broadband Coverage</Typography>
              <Typography variant="h3">{broadbandData.length} Regions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Digital Literacy Programs</Typography>
              <Typography variant="h3">{digitalLiteracyData.length} Programs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Plan Assets</Typography>
              <Typography variant="h3">{planAssets.length} Assets</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box sx={{ marginTop: '2rem' }}>
        <Typography variant="h6">Digital Literacy Program Participation</Typography>
        <Line data={literacyChartData} />
      </Box>

      {/* Map */}
      <Box sx={{ marginTop: '2rem', height: '400px' }}>
        <Typography variant="h6">Broadband Coverage Map</Typography>
        <Map data={broadbandData} />
      </Box>

      {/* New Plan Assets List */}
      <Box sx={{ marginTop: '2rem' }}>
        <Typography variant="h6">Digital Equity Plan Assets</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {planAssets.map((asset) => (
            <Grid item xs={12} sm={6} md={4} key={asset.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{asset.assetName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {asset.descriptionOfServices || 'No description available'}
                  </Typography>
                  <Typography variant="body2">
                    Area: {asset.geographicArea}
                  </Typography>
                  <Typography variant="body2">
                    Type: {asset.typeOfEntity}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
