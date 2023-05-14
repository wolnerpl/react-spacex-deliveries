import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import './App.css';

function App() {
    const [todos, setTodos] = useState([]);

    useEffect(()=>{
        axios
            .get('https://api.spacexdata.com/v3/launches')
            .then((res) => setTodos(res.data))
    });

    const columns = [
        {
            field: 'flight_number',
            headerName: '#',
            width: 50,
            sortable: false
        },
        {
            field: 'launch_date_local',
            headerName: 'Launch date',
            width: 500,
            valueFormatter: ({ value }) => new Date(value)
        },
        {
            field: 'mission_name',
            headerName: 'Mission Name',
            width: 300
        },
        {
            field: 'rocket',
            headerName: 'Rocket Name',
            width: 300,
            valueFormatter: ({ value }) => value.rocket_name
        },
        {
            field: 'image',
            headerName: 'Image',
            width: 100,
            valueGetter: (tableData) => tableData.row.links.mission_patch_small,
            renderCell: (params) => {
                return (
                    <>
                        <LazyLoadImage
                            src={params.value}
                            effect="opacity"
                            width={80}
                        />
                    </>
                );
            },
            sortable: false
        },
        {
            field: 'links',
            headerName: 'YouTube',
            width: 200,
            renderCell: (params) => {
                if (params.value.video_link) {
                    return (
                        <Button
                            target="_blank"
                            href={params.value.video_link}
                            variant="contained"
                            startIcon={<YouTubeIcon />}
                        >YouTube</Button>
                    );
                }
                else return (<></>);
            },
            sortable: false,
            align: 'right',
            headerAlign: 'right'
        },
    ];

  return (
      <Container maxWidth="xl">
          <DataGrid
              columns={columns}
              rows={todos}
              initialState={{
                  pagination: {
                      paginationModel: {
                          pageSize: 5,
                      },
                  },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              getRowId={(row) => row.launch_date_unix}
              getRowHeight={() => 100}
          />
      </Container>
  );
}

export default App;
