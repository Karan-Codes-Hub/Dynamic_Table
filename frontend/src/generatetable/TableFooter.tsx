import React from "react";
import { Stack, Pagination, Select, MenuItem, useMediaQuery } from "@mui/material";
import { TableFooterProps } from './types';

const TableFooter: React.FC<TableFooterProps> = ({
    isPaginationAllowed,
    filteredData,
    itemsPerPage,
    currentPage,
    isLoading,
    handlePageChange,
    handleValuePerPage,
    renderFullScreenButton,
    pageOptions
}) => {
 
    if (!isPaginationAllowed || isLoading) return null;

    if(filteredData?.length < pageOptions[0].value) return null;
    
    const isSmallScreen = useMediaQuery('(max-width:928px)');
    
    const ContentInformationArea = () => (
        <div className="d-flex align-items-center justify-content-end" style={{ gap: '0.5rem' }}>

            <span className="text-black font-weight-medium">Rows per page</span>
            <Select
                value={itemsPerPage}
                onChange={handleValuePerPage}
                sx={{
                    width: "7rem",
                    height: "3rem",
                    fontSize: "14px",
                }}
                name="Currency"
            >
                {pageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>

            <span className="text-grey font-weight-medium">out of {filteredData?.length} entries</span>
        </div>
    );

    if (isSmallScreen) {
        // Small screens: Pagination on first row, others on second row
        return (
            <Stack spacing={2} sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <div className="d-flex justify-content-center">
                    <Pagination
                        variant="outlined"
                        shape="rounded"
                        count={Math.ceil(filteredData?.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(_, page) => handlePageChange(page)}
                        sx={{
                            '& .Mui-selected': {
                                color: '#1890FF',
                                borderColor: '#1890FF',
                              
                            },
                        }}
                    />
                </div>
                <div className="d-flex justify-content-between align-items-center px-2">
                    {ContentInformationArea()}
                    {renderFullScreenButton && renderFullScreenButton()}
                </div>
            </Stack>
        );
    }

    // Large screens: everything in one row
    return (
        <Stack
            direction="row"
            sx={{
                marginTop: "1rem",
                marginBottom: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
                display: "flex",
                zIndex:1000
            }}
        >
                        <div className="w-50 d-flex align-items-center">

                        {ContentInformationArea()}
                        </div>
            <div className="w-50 d-flex justify-content-center align-items-center">
               
                <Pagination
                    variant="outlined"
                    shape="rounded"
                    count={Math.ceil(filteredData?.length / itemsPerPage)}
                    page={currentPage}
                    onChange={(_, page) => handlePageChange(page)}
                    sx={{
                        '& .Mui-selected': {
                            color: '#1890FF',
                            borderColor: '#1890FF',
                           
                        },
                    }}
                />
            </div>
            <div className="w-50 d-flex justify-content-end align-items-center">
                { renderFullScreenButton && renderFullScreenButton()}
            </div>
        </Stack>
    );
};

export default TableFooter;
