import React from "react";
import {  Stack, Pagination, Select, MenuItem } from "@mui/material";
import { TableFooterProps } from './types'


const TableFooter: React.FC<TableFooterProps> = ({
    isPaginationAllowed,
    filteredData,
    itemsPerPage,
    currentPage,
    isLoading,
    handlePageChange,
    handleValuePerPage,
}) => {
    if (!isPaginationAllowed || isLoading) return null;

    return (

           
        <Stack direction="row" sx={{ gap: "4rem", margin: "2rem" }} justifyContent="center">
            <Pagination
                variant="outlined"
                shape="rounded"
                count={Math.ceil(filteredData?.length / itemsPerPage)}
                page={currentPage}
                onChange={(_, page) => handlePageChange(page)}
                sx={{ background: "#ffffff" }}
               
            />

            <Select
                value={itemsPerPage}
                onChange={handleValuePerPage}
                sx={{
                    width: "7rem",
                    height: "2rem",
                    fontSize: "10px",
                    background: "#ffffff",
                }}
                name="Currency"
            >
                <MenuItem value={10}>10 Per Page</MenuItem> {/* ✅ Ensure values are numbers */}
                <MenuItem value={20}>20 Per Page</MenuItem>
                <MenuItem value={30}>30 Per Page</MenuItem>
            </Select>
        </Stack>

    
    );
};

export default TableFooter;
