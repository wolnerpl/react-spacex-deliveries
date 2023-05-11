import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, InputLabel, Pagination } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [todosPerPage, setTodosPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=>{
        axios
            .get('https://api.spacexdata.com/v3/launches')
            .then((res) => setTodos(res.data))
    });

    const numOfTotalPages = Math.ceil(todos.length / todosPerPage);
    const pages = [...Array(numOfTotalPages + 1).keys()].slice(1);

    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

    const visibleTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

    const columns = [
        { field: 'mission_name', headerName: 'Mission Name', width: 200 },
    ];

  return (
      <>
          <InputLabel id="demo-simple-select-label">Results on page:</InputLabel>
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={todosPerPage}
              onChange={(e) => setTodosPerPage(e.target.value)}
          >
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="30">30</MenuItem>
              <MenuItem value="50">50</MenuItem>
          </Select>
          <DataGrid
              columns={columns}
              rows={visibleTodos}
              initialState={{
                  pagination: {
                      paginationModel: {
                          pageSize: 5,
                      },
                  },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
              getRowId={(row) => row.launch_date_unix}
          />
          <div>
          {
            visibleTodos.map((todo, i) => <p key={i}>{todo.mission_name}</p>)
          }
          </div>
          <Pagination
              count={numOfTotalPages}
              page={currentPage}
              onChange={(event,newPage) => setCurrentPage(newPage)}
          />
      </>
  );
}

export default App;
