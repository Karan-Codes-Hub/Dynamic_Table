import React, { useState, useEffect }  from 'react';
import {
    forwardRef,
    Ref,
    useImperativeHandle,
    useRef,
  } from 'react';
import style2 from './Styles/style2.module.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensityLargeIcon from '@mui/icons-material/DensityLarge';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Popover, Typography, Tooltip } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { formatDate, formatNumberForCurrency } from './utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    ArrayColumnRendererProps,
    Column,
    ResizableItem,
    CheckedItems,
    GenerateTableProps,
    Transformation,
    DropResult,
   

} from "./types";
import TableFooter from './TableFooter';
import TableBody from './TableBody';
import { AddCircle, Delete } from "@mui/icons-material";
import { filter, set } from 'lodash';
export interface TextInputRef {
    rowExpand: (rowindex: number | null) => void;
    getSelectedRows : () => any[];
    getFilterItems : () => any;
}

  
const GenerateTable: React.FC<GenerateTableProps> = ({
    isHiddenColumnsAllowed,
    enableDragandDrop,
    isPaginationAllowed,
    isScrollAllowed,
    isSearchAllowed,
    canDoubleClick,
    handleDoubleClick,
    Data,
    DataColumns,
    setDataColumns,
    isFullScreenAllowed,
    canDownloadData,
    canResizeRows,
    isStickyHeaderEnabled,
    canExpandRow,
    ExpandedRowComponent,
    handleExpandedRow,
    handleEdit,
    customRowStyle,
    isCustomRowStyle,
    isRowSelectionAllowed,
    virtualization,
    eventList,
    isLoading,
    sorting,
    filterType

},    ref: Ref<TextInputRef>,) => {
    const initialData = Data;
    const columns = DataColumns;
    const setColumns = setDataColumns;
    const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
    const [filteredData, setFilteredData] = useState<any[]>(Data);
    const [data, setData] = useState<any[]>(filteredData);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const currentPageData = data?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // const [viewMoreState, setViewMoreState] = useState<{ [key: string]: any }>({});
    const [activeSortColumn, setActiveSortColumn] = useState<Column | null>(null);
    const [sortOrder, setSortOrder] = useState<{ [key: string]: string }>({});
    // const [filterType, setFilterType] = useState<string>('');
    // const [filterValue, setFilterValue] = useState<string>('');
    const [columnFilters, setColumnFilters] = useState<{ [key: string]: any }>({});
    const [columnSearchItems, setColumnSearchItems] = useState<{ [key: string]: string }>({});
    // const [columnSearchterm, setColumnSearchterm] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    // const entryBoxRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    // const [isArrowDown, setIsArrowDown] = useState<boolean>(true);
    const [activeColumn, setActiveColumn] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false);
    // const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    // const [tableColumns, setTableColumns] = useState<Column[]>(columns);
    const [updatedTransformations, setUpdatedTransformations] = useState<any[]>([]);
    // const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
    // const [columnWidth, setColumnWidth] = useState<number>(150);
    // const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({});
    const [variableSize, setVariableSize] = useState<number>(1);
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const tableRef = useRef<HTMLDivElement>(null);
    const [startIndex, setStartIndex] = useState(0);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const[filterItems, setFilterItems] = useState<any>({});
    const resizableObject: ResizableItem[] = [
        {
            id: 1,
            title: "Min",
            icon: <DensitySmallIcon />,
            height: 40,
        },
        {
            id: 2,
            title: "Min",
            icon: <DensityMediumIcon />,
            height: 60,
        },
        {
            id: 3,
            title: "Min",
            icon: <DensityLargeIcon />,
            height: 80,
        }
    ];
    const transformations: Transformation[] = [];
    // const transformations: Transformation[] = [
    //     {
    //         type: "highlight",
    //         conditon: "{day_past_due}>[0]",
    //         apply_on: ["all"],
    //         moified_style: {
    //             color: "red",
    //         },
    //     },
    //     {
    //         type: "highlight",
    //         conditon: "{age}>[30]",
    //         apply_on: ["all"],
    //         moified_style: {
    //             color: "red",
    //         },
    //     },
    // ];

    // const getUniqueValues = (key: string): any[] => {
    //     const values = initialData.map(item => item[key]);
    //     const flattenedValues = Array.isArray(values[0]) ? values.flat() : values;
    //     return [...new Set(flattenedValues)];
    // };

    // const handleColumnClick = (index: number) => {
    //     setActiveColumn(index.toString());
    //     setIsModalVisible(true);
    // };

    // const handleButtonClick = () => {
    //     setIsColumnModalOpen(!isColumnModalOpen);
    // };

    // const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setNumberOfRows(e.currentTarget.textContent);
    // };
    
    const toggleColumnVisibility = (columnName: string) => {
        setDataColumns(columns.map(column =>
            column.name === columnName ? { ...column, visible: !column.visible } : column
        ));
    };
    const rowExpand = (rowindex : number | any ) =>{
        console.log("rowindex is " , rowindex)
        setExpandedRow(rowindex);
        //also ask for the componwnt needed to be displayed 
        //and setv it here only , and set in the child component 
    }
    const getSelectedRows = () =>{
        return selectedRows;
    }
    useImperativeHandle(ref, () => ({
        rowExpand : (rowindex : number | null) =>{
            rowExpand(rowindex);
        } ,
        getSelectedRows : getSelectedRows,
        getFilterItems : () => filterItems,

      }));
    const handleValuePerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
        setItemsPerPage(event.target.value as number);
        setCurrentPage(1);
    };

    const handleIconClick = (columnIndex: string) => {
        if (activeColumn === columnIndex) {
            setActiveColumn(null);
            setIsModalVisible(false);
        } else {
            setActiveColumn(columnIndex);
            setIsModalVisible(true);
        }
    };
    const renderArrowIcon = (column: Column) => {
        let columnName = column.name;
        return activeColumn === columnName ? (
            <KeyboardArrowUpIcon onClick={() => handleIconClick(columnName)} style={{ cursor: 'pointer' }} />
        ) : (
            <div style={{ position: 'relative', display: 'inline-block' }}>
                {checkedItems[column.key]?.length > 0 && (
                    <span className={style2.arrowCount}>
                        {`(${checkedItems[column.key]?.length})` || `(${columnFilters[column.key]?.length})`}
                    </span>
                )}
                {columnFilters.hasOwnProperty(column.key) && (
                    <span className={style2.arrowCount}>
                        {'(1)'}
                    </span>
                )}
                <KeyboardArrowDownIcon
                    onClick={() => handleIconClick(columnName)}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsColumnModalOpen(false);
            }
        };

        if (isColumnModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isColumnModalOpen]);

    const handlePageChange = ( page: number) => {
    
        setCurrentPage(page);
    };

    const handleSortIconClick = (column: Column) => {
        let newOrder = '';
        if (sortOrder[column.name] === 'ascending') {
            newOrder = 'descending';
        } else if (sortOrder[column.name] === 'descending') {
            newOrder = '';
        } else {
            newOrder = 'ascending';
        }

        setSortOrder({ [column.name]: newOrder });
        setActiveSortColumn(column);

        if (newOrder === 'ascending' || newOrder === 'descending') {
            handleSort(column, newOrder);
        } else {
            handleSort(null, null);
        }
    };

    const renderSortIcon1 = (column: Column) => {
        const currentOrder = sortOrder[column.name];

        if (currentOrder === 'ascending') {
            return (
                <Tooltip title={`Sorted "${column.name}" by ascending order`} placement='top'>
                    <ArrowUpwardIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSortIconClick(column)}
                    />
                </Tooltip>
            );
        } else if (currentOrder === 'descending') {
            return (
                <Tooltip title={`Sorted "${column.name}" by descending order`} placement='top'>
                    <ArrowDownwardIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSortIconClick(column)}
                    />
                </Tooltip>
            );
        } else {
            return (
                <Tooltip title={`Sort "${column.name}" by ascending order`} placement='top'>
                    <ImportExportIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSortIconClick(column)}
                    />
                </Tooltip>
            );
        }
    };

    const renderSortIcon = (column: Column) => {
        const sortEntry = sortColumns.find((c) => c.column.key === column.key);
        
        if (!sortEntry) {
            return (
                <Tooltip title={`Sort "${column.name}" by ascending order`} placement="top">
                    <ImportExportIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleSort(column)}
                    />
                </Tooltip>
            );
        }
    
        const sortIndex = sortColumns.findIndex((c) => c.column.key === column.key) + 1; // Position in multi-sort order
    
        return (
            <Tooltip title={`Sorted as ${sortIndex} priority: ${sortEntry.order} order`} placement="top">
                <span style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => toggleSort(column)}>
                    {sortEntry.order === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                    <span style={{ fontSize: "12px", marginLeft: "4px", fontWeight: "bold" }}> {sortIndex}</span> {/* Priority Indicator */}
                </span>
            </Tooltip>
        );
    };
    
    const handleSort = (column: Column | null, order: string | null) => {
        if (!column?.name || !order) {
            setData(filteredData);
            return;
        }
    
        let newFilteredData = filteredData?.length === initialData.length ? initialData : filteredData;
    
        const sortedData = [...newFilteredData].sort((a, b) => {
            let valueA = a[column.key];
            let valueB = b[column.key];
    
            // If column type is "component", sort using the `.data` property
            if (column.type === "component") {
                valueA = valueA?.data ?? "";
                valueB = valueB?.data ?? "";
            }
    
            if (column.type === "date") {
                valueA = formatDate(valueA);
                valueB = formatDate(valueB);
    
                if (valueA === null || valueB === null) {
                    return 0;
                }
    
                const dateA = new Date(valueA.split('-').reverse().join('-')).getTime();
                const dateB = new Date(valueB.split('-').reverse().join('-')).getTime();
                return order === "ascending" ? dateA - dateB : dateB - dateA;
            } 
            
            if (valueA === null || valueB === null) {
                if (valueA === null && valueB === null) return 0;
                return valueA === null ? 1 : -1;
            }
    
            if (typeof valueA === "string" && typeof valueB === "string") {
                return order === "ascending"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }
    
            if (typeof valueA === "number" && typeof valueB === "number") {
                return order === "ascending" ? valueA - valueB : valueB - valueA;
            }
    
            return 0;
        });
    
        setData(sortedData);
    };
    

    // const toggleViewMore = (rowIndex: string, columnKey: string) => {
    //     setViewMoreState((prev) => ({
    //         ...prev,
    //         [rowIndex]: {
    //             ...prev[rowIndex],
    //             [columnKey]: !prev[rowIndex]?.[columnKey]
    //         }
    //     }));
    // }
    //Just to test unusual string filter logic
    const handleFilterChangeNew = (
        updatedColumnKey: string,
        updatedFilterType: string,
        updatedFilterValue: any,
        index: number
    ) => {
        setFilterItems((prevFilters: any) => {
            const newFilters = {
                ...prevFilters,
                [updatedColumnKey]: {
                    ...prevFilters[updatedColumnKey],
                    filterArray: prevFilters[updatedColumnKey]?.filterArray?.map((filter: any, i: number) =>
                        i === index ? { ...filter, filterType: updatedFilterType, filterValue: updatedFilterValue } : filter
                    ) || [],
                },
            };
    
            // Remove empty filter values
            newFilters[updatedColumnKey].filterArray = newFilters[updatedColumnKey].filterArray.filter(
                (filter: any) => filter.filterValue !== "" || filter.filterType !== ""
            );
    
            // If all filters are removed, delete the column key entry
            if (newFilters[updatedColumnKey].filterArray.length === 0) {
                delete newFilters[updatedColumnKey];
            }
    
            return newFilters;
        });
    };
    
    const handleFilterChange = (updatedColumnKey: string, updatedFilterType: string, updatedFilterValue: any) => {
        setFilterItems((prevFilters : any) => {
            const newFilters : any = {
                ...prevFilters,
                [updatedColumnKey]: {
                    filterType: updatedFilterType,
                    filterValue: updatedFilterValue,
                },
            };

            if (!updatedFilterValue || (Array.isArray(updatedFilterValue) && updatedFilterValue.every((v) => v === ''))) {
                delete newFilters[updatedColumnKey];
            }

            // applyAllFilters(newFilters);
            return newFilters;
        });
        setColumnFilters((prevFilters) => {
            const newFilters = {
                ...prevFilters,
                [updatedColumnKey]: {
                    filterType: updatedFilterType,
                    filterValue: updatedFilterValue,
                },
            };

            if (!updatedFilterValue || (Array.isArray(updatedFilterValue) && updatedFilterValue.every((v) => v === ''))) {
                delete newFilters[updatedColumnKey];
            }

            // applyAllFilters(newFilters);
            return newFilters;
        });
    };


    const handleCheckboxChange = (columnKey: string, value: any) => {
        setCurrentPage(1);
        filterType == "advanced" ? (
        setFilterItems((prev : any) => {
            const updated = { ...prev };

            if (!updated[columnKey]) {
                updated[columnKey] = [];
            }

            if (updated[columnKey].includes(value)) {
                updated[columnKey] = updated[columnKey].filter((item : any) => item !== value);
            } else {
                updated[columnKey].push(value);
            }

        
            return updated;
        }))
        :
        setCheckedItems((prev) => {
            const updated = { ...prev };

            if (!updated[columnKey]) {
                updated[columnKey] = [];
            }

            if (updated[columnKey].includes(value)) {
                updated[columnKey] = updated[columnKey].filter((item) => item !== value);
            } else {
                updated[columnKey].push(value);
            }

            if (updated[columnKey].length === 0) {
                delete updated[columnKey];
            }

            filterData(updated);
            return updated;
        })
    
    };

    const handleClearFilter = (column: Column) => {
        if ((column.type === 'number' || column.type === 'array' ) && filterType != "advanced") {
            setColumnFilters((prevFilters) => {
                const updatedFilters = { ...prevFilters };
                delete updatedFilters[column.key];
                filterData(checkedItems);
                return updatedFilters;
            });
        }
        setCurrentPage(1);
        filterType == "simple" ? (

        setCheckedItems((prevState) => {
            const updatedState = { ...prevState };
            delete updatedState[column.key];
            filterData(updatedState);
            handleIconClick(column?.name);
            return updatedState;
        })
    )
        : 
        setFilterItems((prevState : any) => {
            const updatedState = { ...prevState };
            delete updatedState[column.key];
            advancedFilterData(updatedState);
            handleIconClick(column?.name);
            return updatedState;
        });
    };

    const [sortColumns, setSortColumns] = useState<Array<{ column: Column; order: "asc" | "desc" }>>([]);


    const filterData = (filters: { [key: string]: any }, searchTerm?: string) => {
        
      
        let filteredData = [...initialData];

        // Preprocess column filters for quicker lookup
        const columnFilterConditions = Object.entries(columnFilters).map(([columnKey, { filterType, filterValue }]) => {
            return { columnKey, filterType, filterValue };
        });

        // Preprocess custom filters
        const customFilters = Object.entries(filters).map(([columnKey, filterValues]) => {
            return { columnKey, filterValues };
        });

        // Process all filters in a single loop
        filteredData = filteredData.filter((row) => {
            // Apply column filters
            const columnFilterValid = columnFilterConditions.every(({ columnKey, filterType, filterValue }) => {
                const column = columns.find((col) => col.key === columnKey);
                if (!column) return true; // Skip if column doesn't exist
            
                const columnType = column.type;
                const rowValue = columnType === "component"
                    ? row[columnKey]?.data // Extract data if it's a component column
                    : columnType === "number"
                    ? Number(row[columnKey]) // Convert to number if applicable
                    : row[columnKey];
            
                const evaluateCondition = (value: any) => {
                    const numericValue = Number(value);
                    if (isNaN(numericValue)) return false;
            
                    switch (filterType) {
                        case "equals":
                            return numericValue === filterValue;
                        case "greater_than":
                            return numericValue > filterValue;
                        case "less_than":
                            return numericValue < filterValue;
                        case "inclusive_range": {
                            const [min, max] = filterValue;
                            return numericValue >= min && numericValue <= max;
                        }
                        case "exclusive_range": {
                            const [exclusiveMin, exclusiveMax] = filterValue;
                            return numericValue > exclusiveMin && numericValue < exclusiveMax;
                        }
                        default:
                            return true;
                    }
                };
            
                if (Array.isArray(rowValue)) {
                    return rowValue.some((value) => evaluateCondition(value));
                }
                return evaluateCondition(rowValue);
            });
            

            if (!columnFilterValid) return false; // Skip row if it doesn't match column filters

            // Apply custom filters
            const customFilterValid = customFilters.every(({ columnKey, filterValues }) => {
                const column = columns.find((col) => col.key === columnKey);
                if (!column) return true;
        
                const rowValue = column.type === "component"
                    ? row[columnKey]?.data // Extract data for component columns
                    : row[columnKey];
        
                if (Array.isArray(filterValues)) {
                    return filterValues.includes(String(rowValue));
                } else if (typeof filterValues === "object") {
                    const { start, end } = filterValues;
                    const rowDate = new Date(rowValue);
                    return (!start || rowDate >= new Date(start)) && (!end || rowDate <= new Date(end));
                }
                return true;
            });

            if (!customFilterValid) return false; // Skip row if it doesn't match custom filters

            // Apply search term filter (if applicable)
           
            if ( searchTerm) {
            
                // const lowercasedSearchTerm = e?.target.value.toLowerCase();
                const lowercasedSearchTerm = searchTerm?.toLowerCase();
                const searchMatch = columns.some((column) => {
                    const cellValue = column.type === "component" 
                        ? row[column.key]?.data // Extract data if it's a component column
                        : row[column.key];       // Otherwise, use direct value
            
                    return (
                        cellValue && String(cellValue).toLowerCase().includes(lowercasedSearchTerm)
                    );
                });
            
                if (!searchMatch) return false; // Skip row if it doesn't match search term
            }
            

            return true;
        });
        if (activeSortColumn && sortOrder[activeSortColumn.name] && sorting == "single") {
            filteredData = handleSortInternal(filteredData, activeSortColumn, sortOrder[activeSortColumn.name]);
        }
        // Apply sorting (if needed)
        if (sortColumns.length > 0 && sorting == "multi") {
            filteredData =  handleMultiSort(filteredData, sortColumns) ;
        }
        
        setFilteredData(filteredData);
        setStartIndex(0);
        setData(filteredData);
    };
    const handleMultiSort = (data: any[], sortColumns: Array<{ column: Column; order: "asc" | "desc" }>) => {
        return [...data].sort((a, b) => {
            for (const { column, order } of sortColumns) {
                const key = column.key;
               
                const valueA = column?.type === "component" ? a[key]?.data : a[key];
                const valueB =  column?.type === "component" ? b[key]?.data : b[key];
    
                // Handle different data types
                const compare = (valA: any, valB: any) => {
                    if (typeof valA === "number" && typeof valB === "number") {
                        return valA - valB;
                    }
                    return String(valA).localeCompare(String(valB));
                };
    
                // Apply sorting logic
                const comparison = compare(valueA, valueB);
                if (comparison !== 0) {
                    return order === "asc" ? comparison : -comparison;
                }
            }
            return 0; // If all columns match, maintain order
        });
    };
    const toggleSort = (column: Column) => {
        setSortColumns((prev) => {
            const existingIndex = prev.findIndex((c) => c.column.key === column.key);
    
            if (existingIndex !== -1) {
                // Toggle between ascending, descending, and removing sorting
                const newSortColumns = [...prev];
                if (newSortColumns[existingIndex].order === "asc") {
                    newSortColumns[existingIndex].order = "desc";
                } else {
                    newSortColumns.splice(existingIndex, 1); // Remove sorting for this column
                }
                return newSortColumns;
            } else {
                // Add new column sorting with highest priority
                return [...prev, { column, order: "asc" }];
            }
        });
    };
    useEffect(() => {
        filterData(checkedItems, searchTerm);
    }, [sortColumns]);
    

    const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value; 
    
        setSearchTerm(newSearchTerm); 
        setCurrentPage(1); 
    
      
        filterData(checkedItems, newSearchTerm);
    };
    

    const handleSortInternal = (data: any[], column: Column, order: string) => {
        return [...data].sort((a, b) => {
            if (column.type === 'date') {
                const valueA = formatDate(a[column.key]);
                const valueB = formatDate(b[column.key]);

                // Check if either valueA or valueB is null or invalid
                if (valueA === null || valueB === null) {
                    return 0;
                }

                // Proceed with date conversion if the values are valid
                const dateA = new Date(valueA.split('-').reverse().join('-')).getTime();
                const dateB = new Date(valueB.split('-').reverse().join('-')).getTime();

                return order === 'ascending' ? dateA - dateB : dateB - dateA;
            } else {
                const valueA = a[column.key];
                const valueB = b[column.key];

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return order === 'ascending'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return order === 'ascending' ? valueA - valueB : valueB - valueA;
                }

                return 0;
            }
        });
    };



    // const ObjectColumnRenderer: React.FC<ObjectColumnRendererProps> = ({ item, column, index }) => {
    //     const [popoverData, setPopoverData] = useState<{ anchorEl: HTMLElement | null; content: string[] | null }>({
    //         anchorEl: null,
    //         content: null,
    //     });

    //     const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, data: string[]) => {
    //         setPopoverData({
    //             anchorEl: event.currentTarget,
    //             content: data,
    //         });
    //     };

    //     const handlePopoverClose = () => {
    //         setPopoverData({
    //             anchorEl: null,
    //             content: null,
    //         });
    //     };

    //     const open = Boolean(popoverData.anchorEl);

    //     // Handle the content generation from the column key and sub_key
    //     const content = Array.isArray(item?.[column.key])
    //         ? item[column.key]
    //             .map((subItem: Record<string, any>) => subItem?.[column.sub_key!] === "" ? "null" : subItem?.[column.sub_key!] ?? "No Data")
    //             .filter(Boolean)
    //         : ["No Data"];

    //     return (
    //         <td key={index}>
    //             <div className="table-cell">
    //                 <div className="row-content">{content.slice(0, 2).join(", ")}</div>
    //                 <button
    //                     onClick={(e) => handlePopoverOpen(e, content)}
    //                     className="view-more-button"
    //                 >
    //                     View More
    //                 </button>
    //                 <Popover
    //                     open={open}
    //                     anchorEl={popoverData.anchorEl}
    //                     onClose={handlePopoverClose}
    //                     anchorOrigin={{
    //                         vertical: "bottom",
    //                         horizontal: "left",
    //                     }}
    //                     transformOrigin={{
    //                         vertical: "top",
    //                         horizontal: "left",
    //                     }}
    //                 >
    //                     <Typography sx={{ padding: "10px", maxWidth: "300px", wordBreak: "break-word" }}>
    //                         {content?.join(", ")}
    //                     </Typography>
    //                 </Popover>
    //             </div>
    //         </td>
    //     );
    // };
    const ArrayColumnRenderer: React.FC<ArrayColumnRendererProps> = ({ item, column, index }) => {
        const [popoverData, setPopoverData] = useState<{ anchorEl: HTMLElement | null; content: string[] | null }>({
            anchorEl: null,
            content: null,
        });

        const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, data: string[]) => {
            setPopoverData({
                anchorEl: event.currentTarget,
                content: data,
            });
        };

        const handlePopoverClose = () => {
            setPopoverData({
                anchorEl: null,
                content: null,
            });
        };

        // Extract data based on subKey if it exists
        const data = column.subKey
            ? item[column.key]?.map((subItem: Record<string, any>) => subItem?.[column.subKey!] ?? 'null').filter(Boolean)
            : item[column.key];

        const open = Boolean(popoverData.anchorEl);

        return (
            <td key={index}>
                {Array.isArray(item[column.key]) && item[column.key]?.length > 4 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div>{data?.slice(0, 4).join(', ')}</div>
                        <button
                            onClick={(e) => handlePopoverOpen(e, data)}
                            style={{
                                cursor: 'pointer',
                                color: '#203F77',
                                border: 'none',
                                background: 'none',
                                padding: '0',
                                marginTop: '5px',
                            }}
                        >
                            View More
                        </button>
                        <Popover
                            open={open}
                            anchorEl={popoverData.anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <Typography sx={{ padding: '10px', maxWidth: '300px', wordBreak: 'break-word' }}>
                                {popoverData.content?.join(', ')}
                            </Typography>
                        </Popover>
                    </div>
                ) : (
                    item[column.key]?.join(', ')
                )}
            </td>
        );
    };
    // const [filterItems, setFilterItems] = useState<any[]>([]);
    // const handleCheckboxChangeNew = (column: Column, value: any) => {
    //     let columnKey  = column.key;
    //     setFilterItems((prev) => {
    //         const updatedFilterItems = { ...prev };
    
    //         // Ensure the columnKey exists
    //         if (!updatedFilterItems[columnKey]) {
    //             updatedFilterItems[columnKey] = { columnType: column.type, filterlist: [] };
    //         }
    
    //         const filterList = updatedFilterItems[columnKey].filterlist;
    //         const valueIndex = filterList.indexOf(value);
    
    //         if (valueIndex !== -1) {
    //             // If value exists, remove it
    //             filterList.splice(valueIndex, 1);
    //         } else {
    //             // If value doesn't exist, add it
    //             filterList.push(value);
    //         }
    
    //         return { ...updatedFilterItems };
    //     });
    // };
    // useEffect(() => {
    //     console.log(filterItems, "filterItems");
    // }, [filterItems]);
    
   
    const handleFilterChangeNew2 = (updatedColumnKey: string, updatedFilterType: string, updatedFilterValue: any) => {

        setFilterItems((prevFilters : any) => {
            const newFilters : any = {
                ...prevFilters,
                [updatedColumnKey]: {
                    filterType: updatedFilterType,
                    filterValue: updatedFilterValue,
                },
            };

            if (!updatedFilterValue || (Array.isArray(updatedFilterValue) && updatedFilterValue.every((v) => v === ''))) {
                delete newFilters[updatedColumnKey];
            }

            // applyAllFilters(newFilters);
            return newFilters;
        });
    }
    const renderModalContent = (column: Column) => {
        const columnKey = column.key;
        let columnType = column.type;
        let filterType = String(column.filter); // Only relevant if columnType === "component"
        const searchTerm = columnSearchItems[column.name] || '';
    
        // Adjust type if it's a component column with a defined filter
        if (columnType === 'component' && filterType) {
            columnType = filterType; // Treat it as "string" or "number"
        }
    
        const filterValues = (values: any[]) => {
            return values.filter((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
        };
        if(columnType == "string" && column.filterContent){
            const filteredValues = filterValues(column.filterContent);
            return filteredValues.map((value, index) => (
                <div className="d-flex align-items-center mb-2" key={index}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={() => handleCheckboxChange(columnKey, value)}
                        checked={checkedItems[columnKey]?.includes(value)}
                    />
                    <label className="form-check-label ms-2">{value}</label>
                </div>
            ));
        }
        if (columnType === 'string') {
            // Handling both standard string columns and component-based strings
            const uniqueValues = [...new Set(
                initialData.map((row) => column.type === 'component' ? row[columnKey]?.data : row[columnKey])
            )].filter(Boolean);
            const filteredValues = filterValues(uniqueValues);
    
            return filteredValues.map((value, index) => (
                <div className="d-flex align-items-center mb-2" key={index}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={() => handleCheckboxChange(columnKey, value)}
                        checked={checkedItems[columnKey]?.includes(value)}
                    />
                    <label className="form-check-label ms-2">{value}</label>
                </div>
            ));
        }
    
    
        if (columnType === 'number' || columnType === 'array') {
            // Handling both standard number columns and component-based numbers
            const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, columnKey: string) => {
                const newFilterType = e.target.value;
               
                setColumnFilters((prevFilters) => ({
                    ...prevFilters,
                    [columnKey]: {
                        ...prevFilters[columnKey],
                        filterType: newFilterType,
                        filterValue: newFilterType === 'inclusive_range' || newFilterType === 'exclusive_range' ? ['', ''] : '',
                    },
                }));
                setFilterItems((prevFilters : any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        ...prevFilters[columnKey],
                        filterType: newFilterType,
                        filterValue: newFilterType === 'inclusive_range' || newFilterType === 'exclusive_range' ? ['', ''] : '',
                    },
                })); 
    
                if (!newFilterType) {
                    handleFilterChange(columnKey, '', '');
                }
            };
    
            const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>, columnKey: string) => {
                const value = e.target.value;
                const { filterType } = columnFilters[columnKey] || {};
    
                if (filterType === 'inclusive_range' || filterType === 'exclusive_range') {
                    const index = e.target.placeholder === 'Min Value' ? 0 : 1;
                    const updatedFilterValue = Array.isArray(columnFilters[columnKey]?.filterValue)
                        ? [...columnFilters[columnKey]?.filterValue]
                        : ['', ''];
    
                    updatedFilterValue[index] = value ? Number(value) : '';
    
                    setColumnFilters((prevFilters) => ({
                        ...prevFilters,
                        [columnKey]: { ...prevFilters[columnKey], filterValue: updatedFilterValue },
                    }));
    
                    handleFilterChange(columnKey, filterType, updatedFilterValue);
                } else {
                    const numericValue = value ? Number(value) : '';
                    setColumnFilters((prevFilters) => ({
                        ...prevFilters,
                        [columnKey]: { ...prevFilters[columnKey], filterValue: numericValue },
                    }));
    
                    handleFilterChange(columnKey, filterType, numericValue);
                }
            };
    
            return (
                <div className="mb-3">
                    <select
                        className="form-select"
                        onChange={(e) => handleFilterTypeChange(e, columnKey)}
                        value={columnFilters[columnKey]?.filterType || ''}
                    >
                        <option value="">Select Filter</option>
                        <option value="equals">Equals</option>
                        <option value="greater_than">Greater Than</option>
                        <option value="less_than">Less Than</option>
                        <option value="inclusive_range">Inclusive of Range</option>
                        <option value="exclusive_range">Exclusive of Range</option>
                    </select>
    
                    {columnFilters[columnKey]?.filterType && (
                        <>
                            {(columnFilters[columnKey]?.filterType === 'inclusive_range' ||
                                columnFilters[columnKey]?.filterType === 'exclusive_range') ? (
                                <div className="d-flex gap-3 mt-3">
                                    <div className="w-50">
                                        <label className="form-label">Min Value</label>
                                        <input
                                            type="number"
                                            placeholder="Min Value"
                                            className="form-control"
                                            onChange={(e) => handleFilterValueChange(e, columnKey)}
                                            value={columnFilters[columnKey]?.filterValue?.[0] || ''}
                                        />
                                    </div>
                                    <div className="w-50">
                                        <label className="form-label">Max Value</label>
                                        <input
                                            type="number"
                                            placeholder="Max Value"
                                            className="form-control"
                                            onChange={(e) => handleFilterValueChange(e, columnKey)}
                                            value={columnFilters[columnKey]?.filterValue?.[1] || ''}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <input
                                    type="number"
                                    placeholder="Enter Value"
                                    className="form-control mt-3"
                                    onChange={(e) => handleFilterValueChange(e, columnKey)}
                                    value={columnFilters[columnKey]?.filterValue || ''}
                                />
                            )}
                        </>
                    )}
                </div>
            );
        } 
    
       
        else if (columnType === 'date') {
            // Handle date type
            const selectedRange = filterItems[columnKey] || {};  
            const startDate = selectedRange?.start || '';  
            const endDate = selectedRange?.end || '';          
            return (
                <div
                   className={style2.container2}
                >
                    <div
                       className={style2.inputGroup2}
                       >
                    
                        <label
                          className={style2.label2}
                        >
                            Start Date
                        </label>
                        <input
                            type="date"
                            className={style2.input2}
                            value={startDate} 
                            onChange={(e) => handleDateFilterChange(columnKey, 'start', e.target.value)}
                        />
                    </div>
                    <div
                        className={style2.inputGroup2}
                    >
                        <label
                             className={style2.label2}
                        >
                            End Date
                        </label>
                        <input
                            type="date"
                            className={style2.input2}
                            value={endDate}  
                            onChange={(e) => handleDateFilterChange(columnKey, 'end', e.target.value)}
                        />
                    </div>
                </div>
            );
        }
        //multiple adding in the filter for specific column
        else if (columnType === 'unusual_string'){
            //set the type pf filtering, match all or match any
            //when this drop down is changed, clearing filter value and filter type  
            const handleFilterWayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                const newFilterWay = e.target.value;
        
                setFilterItems((prevFilters: any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        filterWay: newFilterWay,
                        filterArray: [{ filterType: "", filterValue: "" }], // Initialize with one empty filter
                    },
                }));
            };
        
            // Handle Filter Type Change for a Specific Filter in the Array
            const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
                const newFilterType = e.target.value;
        
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = JSON.parse(JSON.stringify(prevFilters)); // Deep copy
                    updatedFilters[columnKey].filterArray[index].filterType = newFilterType;
                    updatedFilters[columnKey].filterArray[index].filterValue = ""; // Reset value when filter type changes
                    return updatedFilters;
                });
            };
        
            // Handle Filter Value Change for a Specific Filter in the Array
            const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
                const value = e.target.value;
                console.log(value, "filterValue");
            
                setFilterItems((prevFilters: any) => {
                    return {
                        ...prevFilters,
                        [columnKey]: {
                            ...prevFilters[columnKey],
                            filterArray: prevFilters[columnKey].filterArray.map((filter: any, i: number) =>
                                i === index ? { ...filter, filterValue: value } : filter
                            ),
                        },
                    };
                });
            
                const filterType = filterItems[columnKey]?.filterArray[index]?.filterType || "";
                handleFilterChangeNew(columnKey, filterType, value, index);
            };
            
        
            // Add a New Filter
            const addFilter = () => {
                setFilterItems((prevFilters: any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        ...prevFilters[columnKey],
                        filterArray: [
                            ...prevFilters[columnKey].filterArray,
                            { filterType: "", filterValue: "" },
                        ],
                    },
                }));
            };
        
            // Remove a Specific Filter
            const removeFilter = (index: number) => {
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = JSON.parse(JSON.stringify(prevFilters)); // Deep copy
                    updatedFilters[columnKey].filterArray.splice(index, 1);
                    return updatedFilters;
                });
            };
        
            return (
                <div className="mb-3">
                    {/* Filter Way Selection */}
                    <select
                        className="form-select"
                        onChange={handleFilterWayChange}
                        value={filterItems[columnKey]?.filterWay || ""}
                    >
                        <option value="">Select Filter</option>
                        <option value="match_all">Match All</option>
                        <option value="match_any">Match Any</option>
                    </select>
        
                    {/* Render Filters When Filter Way is Selected */}
                    {filterItems[columnKey]?.filterWay &&
                        filterItems[columnKey].filterArray.map((filter: any, index: any) => (
                            <div key={index} className="mt-3">
                                <div className="d-flex flex-column gap-2">
                                    {/* Filter Type Selection */}
                                    <select
                                        className="form-select"
                                        onChange={(e) => handleFilterTypeChange(e, index)}
                                        value={filter.filterType || ""}
                                    >
                                        <option value="">Select Filter</option>
                                        <option value="starts_with">Starts With</option>
                                        <option value="ends_with">Ends With</option>
                                        <option value="contains">Contains</option>
                                        <option value="not_contains">Not Contains</option>
                                        <option value="equals">Equals</option>
                                        <option value="not_equals">Not Equals</option>
                                    </select>

                                    {/* Filter Value Input */}
                                    {filter.filterType && (
                                        <input
                                            type="text"
                                            placeholder="Enter Value"
                                            className="form-control"
                                            onChange={(e) => handleFilterValueChange(e, index)}
                                            value={filter.filterValue || ""}
                                        />
                                    )}
                                </div>

                                {/* Add / Remove Buttons (Now Below the Fields) */}
                                <div className="d-flex gap-2 mt-2">
                                    <button className="btn btn-success w-50" onClick={addFilter}>
                                        <AddCircle /> Add
                                    </button>
                                    {index > 0 && (
                                        <button className="btn btn-danger w-50" onClick={() => removeFilter(index)}>
                                            <Delete /> Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            );
        }
        else if (columnType === 'unusual_string2'){
            //set the type pf filtering, match all or match any
            //when this drop down is changed, clearing filter value and filter type  
            const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, columnKey: string) => {
                const newFilterType = e.target.value;
            
               
            
                setFilterItems((prevFilters: any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        ...prevFilters[columnKey],
                        filterType: newFilterType,
                        filterValue: '',
                    },
                }));
            
                if (!newFilterType) {
                    handleFilterChangeNew2(columnKey, '', '');
                }
            };
            
            const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>, columnKey: string) => {
                const value = e.target.value;
                const { filterType } = filterItems[columnKey] || {};
            
                if (
                    filterType === 'starts_with' ||
                    filterType === 'ends_with' ||
                    filterType === 'contains' ||
                    filterType === 'not_contains' ||
                    filterType === 'equals' ||
                    filterType === 'not_equals'
                ) {
                    setFilterItems((prevFilters: any) => ({
                        ...prevFilters,
                        [columnKey]: { ...prevFilters[columnKey], filterValue: value },
                    }));
            
                    handleFilterChangeNew2(columnKey, filterType, value);
                }
            };
            
            return (
                <div className="mb-3">
                    <select
                        className="form-select"
                        onChange={(e) => handleFilterTypeChange(e, columnKey)}
                        value={filterItems[columnKey]?.filterType || ''}
                    >
                        <option value="">Select Filter</option>
                        <option value="starts_with">Starts With</option>
                        <option value="ends_with">Ends With</option>
                        <option value="contains">Contains</option>
                        <option value="not_contains">Not Contains</option>
                        <option value="equals">Equals</option>
                        <option value="not_equals">Not Equals</option>
                    </select>
            
                    {filterItems[columnKey]?.filterType && (
                        <input
                            type="text"
                            placeholder="Enter Value"
                            className="form-control mt-3"
                            onChange={(e) => handleFilterValueChange(e, columnKey)}
                            value={filterItems[columnKey]?.filterValue || ''}
                        />
                    )}
                </div>
            );
            
        }
 

        return <div className="text-center">No options available</div>;
    };
    // render advanced modal content
    //multiple filter logi for every column
    const advancedFilterData =(filterItems : any) =>{
        let filteredData   = applyFilters(initialData, filterItems);
        filteredData = filteredData.filter((row) => {
        if ( searchTerm) {
            
            // const lowercasedSearchTerm = e?.target.value.toLowerCase();
            const lowercasedSearchTerm = searchTerm?.toLowerCase();
            const searchMatch = columns.some((column) => {
                const cellValue = column.type === "component" 
                    ? row[column.key]?.data // Extract data if it's a component column
                    : row[column.key];       // Otherwise, use direct value
        
                return (
                    cellValue && String(cellValue).toLowerCase().includes(lowercasedSearchTerm)
                );
            });
        
            if (!searchMatch) return false; // Skip row if it doesn't match search term
        }
        

        return true;
    });
    if (activeSortColumn && sortOrder[activeSortColumn.name] && sorting == "single") {
        filteredData = handleSortInternal(filteredData, activeSortColumn, sortOrder[activeSortColumn.name]);
    }
    // Apply sorting (if needed)
    if (sortColumns.length > 0 && sorting == "multi") {
        filteredData =  handleMultiSort(filteredData, sortColumns) ;
    }
    
    setFilteredData(filteredData);
    setStartIndex(0);
    setData(filteredData);

    }
    const applyFilters = (data: any[], filterItems: any) => {
       
        return data.filter((row) => {
            return Object.keys(filterItems).every((columnKey) => {
               
                const filterConfig = typeof filterItems[columnKey] === "object" && filterItems[columnKey] !== null ? filterItems[columnKey] : null;
                const { filterWay, filterArray } = filterConfig;
                let typeOfColumn = columns.find((col) => col.key === columnKey)?.type ;
                const columnType = typeOfColumn == "component" ? columns.find((col) => col.key === columnKey)?.filter : typeOfColumn;

                const columnValue = typeOfColumn === "component" ? row[columnKey]?.data : row[columnKey];   
                // Match All → All conditions must be true
                // Match Any → At least one condition must be true

                const matches =
                filterArray?.length > 0
                    ? filterArray.map((filter: any) => {
                          if (!filter.filterType) return true; // Ignore empty filters
            
                          switch (columnType) {
                              case "string":
                                  return filterString(columnValue, filter);
                              case "number":
                                  return filterNumber(columnValue, filter);
                              case "date":
                                  console.log(filterDate(columnValue, filter),"date");
                                  return filterDate(columnValue, filter);
                              case "array":
                                  return filterArrayValue(columnValue, filter);
                              default:
                                  return false;
                          }
                      })
                    : [filterCheckbox(columnValue, filterItems[columnKey])]; // Ensure it returns an array
                    console.log(matches, "matches");
                

    
                return filterWay === "match_all" ? matches?.every(Boolean) : matches?.some(Boolean);
            });
        });
    };
    
    const filterCheckbox = (columnValue: any, selectedValues: any[]) => {

        if (!Array.isArray(selectedValues) || selectedValues.length === 0) return true; // No filter applied
      
        
        return selectedValues.includes(columnValue); // Match single value
    };
    
    const filterString = (value: string, filter: any) => {
        const { filterType, filterValue } = filter;
        if (!filterValue) return true;
    
        switch (filterType) {
            case "equals":
                return value.toLowerCase() === filterValue.toLowerCase();
            case "contains":
                return value.toLowerCase().includes(filterValue.toLowerCase());
            case "starts_with":
                return value.toLowerCase().startsWith(filterValue.toLowerCase());
            case "ends_with":
                return value.toLowerCase().endsWith(filterValue.toLowerCase());
            default:
                return true;
        }
    };
    const filterNumber = (value: number, filter: any) => {
        const { filterType, filterValue } = filter;
        if (filterValue === "") return true;
    
        switch (filterType) {
            case "equals":
                return value === Number(filterValue);
            case "greater_than":
                return value > Number(filterValue);
            case "less_than":
                return value < Number(filterValue);
            case "inclusive_range":
                return value >= Number(filterValue[0]) && value <= Number(filterValue[1]);
            case "exclusive_range":
                return value > Number(filterValue[0]) && value < Number(filterValue[1]);
            default:
                return true;
        }
    };
   
    const filterDate = (value: Date, filter: any) => {
        const { filterType, filterValue } = filter;
       
        if (!filterValue) return true;

    
        const dateValue = new Date(value);
        const filterDate = new Date(filterValue);
        const filterDateStart = new Date(filterValue[0]);
        const filterDateEnd = new Date(filterValue[1]);
        switch (filterType) {
            case "is_date":
                return dateValue.toDateString() === filterDate.toDateString();
            case "before_date":
                return dateValue < filterDate;
            case "after_date":
                return dateValue > filterDate;
            case "date_between":
                return dateValue >= filterDateStart && dateValue <= filterDateEnd;
            default:
                return true;
        }
    };
    const filterArrayValue = (value: any[], filter: any) => {
        const { filterType, filterValue } = filter;
        if (!filterValue) return true;
    
        switch (filterType) {
            case "includes":
                return value.includes(filterValue);
            case "excludes":
                return !value.includes(filterValue);
            case "length_equals":
                return value.length === Number(filterValue);
            case "length_greater_than":
                return value.length > Number(filterValue);
            case "length_less_than":
                return value.length < Number(filterValue);
            default:
                return true;
        }
    };
            
    
    const renderAdvancedModalContent = (column: Column) => {
        const columnKey = column.key;
        let columnType = column.type;
        let filterType = String(column.filter); // Only relevant if columnType === "component"
        const searchTerm = columnSearchItems[column.name] || '';
        //when there is checkbox a array is formed against the column key consisting of all the checked items
        //in other cases an object is formed against the column key consisting of all the match_way and filterValues array 


        if (columnType === 'component' && filterType) {
            columnType = filterType; // Treat it a
        }
    
        const filterValues = (values: any[]) => {
            return values.filter((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
        };
        //if type is checkbox but modal content is given 
        //render checkboxes with the all the content provided 
        if(columnType == "checkbox" && column.filterContent){
            const filteredValues = filterValues(column.filterContent);
            return filteredValues.map((value, index) => (
                <div className="d-flex align-items-center mb-2" key={index}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={() => handleCheckboxChange(columnKey, value)}
                        checked={filterItems[columnKey]?.includes(value)}
                    />
                    <label className="form-check-label ms-2">{value}</label>
                </div>
            ));
        }//if type is checkbox but modal content is not given 
        //render checkboxes with unique values of the column

        if (columnType === "checkbox") {
            // Handling both standard string columns and component-based strings
            const uniqueValues = [...new Set(
                initialData.map((row) => column.type === 'component' ? row[columnKey]?.data : row[columnKey])
            )].filter(Boolean);
            const filteredValues = filterValues(uniqueValues);
    
            return filteredValues.map((value, index) => (
                <div className="d-flex align-items-center mb-2" key={index}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={() => handleCheckboxChange(columnKey, value)}
                        checked={filterItems[columnKey]?.includes(value)}
                    />
                    <label className="form-check-label ms-2">{value}</label>
                </div>
            ));
        }
        if (columnType === 'string'){
            //set the type pf filtering, match all or match any
            //when this drop down is changed, clearing filter value and filter type  
            const handleFilterWayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                const newFilterWay = e.target.value;
        
                setFilterItems((prevFilters: any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        filterWay: newFilterWay,
                        filterArray: [{ filterType: "", filterValue: "" }], // Initialize with one empty filter
                    },
                }));
            };
        
            // Handle Filter Type Change for a Specific Filter in the Array
            const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
                const newFilterType = e.target.value;
        
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = JSON.parse(JSON.stringify(prevFilters)); // Deep copy
                    updatedFilters[columnKey].filterArray[index].filterType = newFilterType;
                    updatedFilters[columnKey].filterArray[index].filterValue = ""; // Reset value when filter type changes
                    return updatedFilters;
                });
            };
        
            // Handle Filter Value Change for a Specific Filter in the Array
            const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
                const value = e.target.value;
                console.log(value, "filterValue");
            
                setFilterItems((prevFilters: any) => {
                    return {
                        ...prevFilters,
                        [columnKey]: {
                            ...prevFilters[columnKey],
                            filterArray: prevFilters[columnKey].filterArray.map((filter: any, i: number) =>
                                i === index ? { ...filter, filterValue: value } : filter
                            ),
                        },
                    };
                });
            
                const filterType = filterItems[columnKey]?.filterArray[index]?.filterType || "";
                handleFilterChangeNew(columnKey, filterType, value, index);
            };
            
        
            // Add a New Filter
            const addFilter = () => {
                setFilterItems((prevFilters: any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        ...prevFilters[columnKey],
                        filterArray: [
                            ...prevFilters[columnKey].filterArray,
                            { filterType: "", filterValue: "" },
                        ],
                    },
                }));
            };
        
            // Remove a Specific Filter
            const removeFilter = (index: number) => {
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = JSON.parse(JSON.stringify(prevFilters)); // Deep copy
                    updatedFilters[columnKey].filterArray.splice(index, 1);
                    return updatedFilters;
                });
            };
        
            return (
                <div className="mb-3">
                    {/* Filter Way Selection */}
                    <select
                        className="form-select"
                        onChange={handleFilterWayChange}
                        value={filterItems[columnKey]?.filterWay || ""}
                    >
                        <option value="">Select Filter</option>
                        <option value="match_all">Match All</option>
                        <option value="match_any">Match Any</option>
                    </select>
        
                    {/* Render Filters When Filter Way is Selected */}
                    {filterItems[columnKey]?.filterWay &&
                        filterItems[columnKey].filterArray.map((filter: any, index: any) => (
                            <div key={index} className="mt-3">
                                <div className="d-flex flex-column gap-2">
                                    {/* Filter Type Selection */}
                                    <select
                                        className="form-select"
                                        onChange={(e) => handleFilterTypeChange(e, index)}
                                        value={filter.filterType || ""}
                                    >
                                        <option value="">Select Filter</option>
                                        <option value="starts_with">Starts With</option>
                                        <option value="ends_with">Ends With</option>
                                        <option value="contains">Contains</option>
                                        <option value="not_contains">Not Contains</option>
                                        <option value="equals">Equals</option>
                                        <option value="not_equals">Not Equals</option>
                                    </select>

                                    {/* Filter Value Input */}
                                    {filter.filterType && (
                                        <input
                                            type="text"
                                            placeholder="Enter Value"
                                            className="form-control"
                                            onChange={(e) => handleFilterValueChange(e, index)}
                                            value={filter.filterValue || ""}
                                        />
                                    )}
                                </div>

                                {/* Add / Remove Buttons (Now Below the Fields) */}
                                <div className="d-flex gap-2 mt-2">
                                    <button className="btn btn-success" onClick={addFilter}>
                                        <AddCircle /> Add
                                    </button>
                                    {index > 0 && (
                                        <button className="btn btn-danger " onClick={() => removeFilter(index)}>
                                            <Delete /> Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            );
        }
        if (columnType === "number" || columnType === "array") {
            // Handle "Match All" / "Match Any" Selection
            const handleFilterWayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                const newFilterWay = e.target.value;
        
                setFilterItems((prevFilters: any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        filterWay: newFilterWay,
                        filterArray: [{ filterType: "", filterValue: "" }], // Initialize with one empty filter
                    },
                }));
            };
        
            // Handle Filter Type Change for a Specific Filter in the Array
            const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
                const newFilterType = e.target.value;
        
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = { ...prevFilters };
                    updatedFilters[columnKey] = {
                        ...updatedFilters[columnKey],
                        filterArray: updatedFilters[columnKey]?.filterArray?.map((filter: any, i: number) =>
                            i === index
                                ? {
                                      ...filter,
                                      filterType: newFilterType,
                                      filterValue:
                                          newFilterType === "inclusive_range" || newFilterType === "exclusive_range"
                                              ? ["", ""]
                                              : "",
                                  }
                                : filter
                        ) || [],
                    };
                    return updatedFilters;
                });
            };
        
            // Handle Filter Value Change for a Specific Filter in the Array
            const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, rangeIndex?: number) => {
                const value = e.target.value;
        
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = { ...prevFilters };
                    updatedFilters[columnKey] = {
                        ...updatedFilters[columnKey],
                        filterArray: updatedFilters[columnKey]?.filterArray?.map((filter: any, i: number) => {
                            if (i === index) {
                                if (filter.filterType === "inclusive_range" || filter.filterType === "exclusive_range") {
                                    const updatedRange = [...(filter.filterValue || ["", ""])];
                                    updatedRange[rangeIndex || 0] = value;
                                    return { ...filter, filterValue: updatedRange };
                                } else {
                                    return { ...filter, filterValue: value };
                                }
                            }
                            return filter;
                        }),
                    };
                    return updatedFilters;
                });
            };
        
            // Add a New Filter
            const addFilter = () => {
                setFilterItems((prevFilters: any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        ...prevFilters[columnKey],
                        filterArray: [...(prevFilters[columnKey]?.filterArray || []), { filterType: "", filterValue: "" }],
                    },
                }));
            };
        
            // Remove a Specific Filter
            const removeFilter = (index: number) => {
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = { ...prevFilters };
                    updatedFilters[columnKey].filterArray.splice(index, 1);
                    if (updatedFilters[columnKey].filterArray.length === 0) {
                        delete updatedFilters[columnKey];
                    }
                    return updatedFilters;
                });
            };
        
            return (
                <div className="mb-3">
                    {/* Filter Way Selection */}
                    <select
                        className="form-select"
                        onChange={handleFilterWayChange}
                        value={filterItems[columnKey]?.filterWay || ""}
                    >
                        <option value="">Select Filter</option>
                        <option value="match_all">Match All</option>
                        <option value="match_any">Match Any</option>
                    </select>
        
                    {/* Render Filters When Filter Way is Selected */}
                    {filterItems[columnKey]?.filterWay &&
                        filterItems[columnKey].filterArray?.map((filter: any, index: number) => (
                            <div key={index} className="mt-3">
                                <div className="d-flex flex-column gap-2">
                                    {/* Filter Type Selection */}
                                    <select
                                        className="form-select"
                                        onChange={(e) => handleFilterTypeChange(e, index)}
                                        value={filter.filterType || ""}
                                    >
                                        <option value="">Select Filter</option>
                                        <option value="equals">Equals</option>
                                        <option value="greater_than">Greater Than</option>
                                        <option value="less_than">Less Than</option>
                                        <option value="inclusive_range">Inclusive of Range</option>
                                        <option value="exclusive_range">Exclusive of Range</option>
                                    </select>
        
                                    {/* Filter Value Input */}
                                    {filter.filterType &&
                                        (filter.filterType === "inclusive_range" || filter.filterType === "exclusive_range" ? (
                                            <div className="d-flex gap-3">
                                                <div className="w-50">
                                                    <label className="form-label">Min Value</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Min Value"
                                                        className="form-control"
                                                        onChange={(e) => handleFilterValueChange(e, index, 0)}
                                                        value={filter.filterValue?.[0] || ""}
                                                    />
                                                </div>
                                                <div className="w-50">
                                                    <label className="form-label">Max Value</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Max Value"
                                                        className="form-control"
                                                        onChange={(e) => handleFilterValueChange(e, index, 1)}
                                                        value={filter.filterValue?.[1] || ""}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <input
                                                type="number"
                                                placeholder="Enter Value"
                                                className="form-control"
                                                onChange={(e) => handleFilterValueChange(e, index)}
                                                value={filter.filterValue || ""}
                                            />
                                        ))}
                                </div>
        
                                {/* Add / Remove Buttons (Now Below the Fields) */}
                                <div className="d-flex gap-2 mt-2">
                                    <button className="btn btn-success " onClick={addFilter}>
                                        <AddCircle /> Add
                                    </button>
                                    {index > 0 && (
                                        <button className="btn btn-danger " onClick={() => removeFilter(index)}>
                                            <Delete /> Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            );
        }
        if (columnType === "date") {
            // Default filter structure
            const selectedFilter = filterItems[columnKey] || {
                filterWay: "", // "match_all" or "match_any"
                filterArray: [{ filterType: "", filterValue: "" }], // Default filter structure
            };
        
            // Handle "Match All" / "Match Any" Selection
            const handleFilterWayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                const newFilterWay = e.target.value;
        
                setFilterItems((prevFilters: any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        filterWay: newFilterWay,
                        filterArray: [{ filterType: "", filterValue: "" }], // Initialize with one empty filter
                    },
                }));
            };
        
            // Handle Filter Type Change for a Specific Filter in the Array
            const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
                const newFilterType = e.target.value;
        
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = { ...prevFilters };
                    updatedFilters[columnKey] = {
                        ...updatedFilters[columnKey],
                        filterArray: updatedFilters[columnKey]?.filterArray?.map((filter: any, i: number) =>
                            i === index ? { ...filter, filterType: newFilterType, filterValue: "" } : filter
                        ) || [],
                    };
                    return updatedFilters;
                });
            };
        
            // Handle Filter Value Change for a Specific Filter in the Array
            const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
                const value = e.target.value;
        
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = { ...prevFilters };
                    updatedFilters[columnKey] = {
                        ...updatedFilters[columnKey],
                        filterArray: updatedFilters[columnKey]?.filterArray?.map((filter: any, i: number) =>
                            i === index ? { ...filter, filterValue: value } : filter
                        ) || [],
                    };
                    return updatedFilters;
                });
            };
        
            // Add a New Filter
            const addFilter = () => {
                setFilterItems((prevFilters: any) => ({
                    ...prevFilters,
                    [columnKey]: {
                        ...prevFilters[columnKey],
                        filterArray: [...(prevFilters[columnKey]?.filterArray || []), { filterType: "", filterValue: "" }],
                    },
                }));
            };
        
            // Remove a Specific Filter
            const removeFilter = (index: number) => {
                setFilterItems((prevFilters: any) => {
                    const updatedFilters = { ...prevFilters };
                    updatedFilters[columnKey].filterArray.splice(index, 1);
                    if (updatedFilters[columnKey].filterArray.length === 0) {
                        delete updatedFilters[columnKey];
                    }
                    return updatedFilters;
                });
            };
        
            return (
                <div className={style2.container2}>
                    {/* Filter Way Selection */}
                    <select className={style2.input2} onChange={handleFilterWayChange} value={selectedFilter.filterWay || ""}>
                        <option value="">Select Filter</option>
                        <option value="match_all">Match All</option>
                        <option value="match_any">Match Any</option>
                    </select>
        
                    {/* Render Filters When Filter Way is Selected */}
                    {selectedFilter.filterWay &&
                        selectedFilter.filterArray?.map((filter: any, index: number) => (
                            <div key={index} className={style2.inputGroup2}>
                                {/* Filter Type Selection */}
                                <select
                                    className={style2.input2}
                                    onChange={(e) => handleFilterTypeChange(e, index)}
                                    value={filter.filterType || ""}
                                >
                                    <option value="">Select Condition</option>
                                    <option value="is">Date is</option>
                                    <option value="is_not">Date is not</option>
                                    <option value="before">Date is before</option>
                                    <option value="after">Date is after</option>
                                </select>
        
                                {/* Date Input Field (Only when a condition is selected) */}
                                {filter.filterType && (
                                    <input
                                        type="date"
                                        className={style2.input2}
                                        value={filter.filterValue || ""}
                                        onChange={(e) => handleFilterValueChange(e, index)}
                                    />
                                )}
        
                                {/* Add / Remove Buttons */}
                                <div className="d-flex gap-2 mt-2">
                                    <button className="btn btn-success " onClick={addFilter}>
                                        <AddCircle /> Add
                                    </button>
                                    {index > 0 && (
                                        <button className="btn btn-danger" onClick={() => removeFilter(index)}>
                                            <Delete /> Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            );
        }
        
        return <div className="text-center">No options available</div>;
        

    }
    const handleDateFilterChange = (columnKey: string, rangeType: string, value: string) => {
        console.log(columnKey, rangeType, value, filterItems?.[columnKey]?.[rangeType], "columnKey, rangeType, value");
        setFilterItems((prev : any ) => {
            const updated = { ...prev };
            if (!updated[columnKey]) {
                updated[columnKey] = { start: '', end: '' };
            }
            updated[columnKey][rangeType] = value;
          
            return updated;
        });
    };
   
    const handleColumnDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination || destination.index === source.index) {
            return;
        }
        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(source.index, 1);
        reorderedColumns.splice(destination.index, 0, movedColumn);
        setColumns(reorderedColumns);
    };
    useEffect(() => {
        filterData(checkedItems, searchTerm);
    }, [columnFilters, checkedItems]);

    function parseCondition(transformation: any) {
        const result = transformation.map((item: any) => {
            if (!item.conditon) return null;
            const regex = /\{(.*?)\}([><=!]+)(\{(.*?)\}|\[([^\]]+)\])/;
            const match = item.conditon.match(regex);
            if (match) {
                let compareColumn = match[1];
                let compareCondition = match[2];
                let compareValue = match[3];

                let compareValueType = 'column';

                if (compareValue.startsWith("{") && compareValue.endsWith("}")) {
                    compareValue = compareValue.slice(1, -1);
                } else if (compareValue.startsWith("[") && compareValue.endsWith("]")) {
                    compareValue = compareValue.slice(1, -1);
                    compareValueType = 'number';
                }
                return {
                    compareColumn,
                    compareCondition,
                    compareValue,
                    compareValueType,
                };
            } else {
                return null;
            }
        });
        return result.filter(Boolean);
    }
    function evaluateCondition(itemValue: any, compareCondition: string, compareValue: any) {
        const value = Number(compareValue);
        switch (compareCondition) {
            case '>':
                return itemValue > value;
            case '<':
                return itemValue < value;
            case '>=':
                return itemValue >= value;
            case '<=':
                return itemValue <= value;
            case '==':
                return itemValue == value;
            case '!=':
                return itemValue != value;
            default:
                throw new Error(`Unsupported compare condition: ${compareCondition}`);
        }
    }
    function evaluateConditionWithString(itemValue: any, compareCondition: string, compareValue: any) {
        const extractNumber = (input: any) => {
            if (typeof input === "string") {
                const match = input.match(/-?\d+(\.\d+)?/);
                return match ? parseFloat(match[0]) : NaN;
            }
            return input;
        };

        const evaluateSingleValue = (value: any) => {
            const itemNumericValue = extractNumber(value);
            const compareNumericValue = extractNumber(compareValue);

            switch (compareCondition) {
                case ">":
                    return itemNumericValue > compareNumericValue;
                case "<":
                    return itemNumericValue < compareNumericValue;
                case ">=":
                    return itemNumericValue >= compareNumericValue;
                case "<=":
                    return itemNumericValue <= compareNumericValue;
                case "==":
                    return value == compareValue || itemNumericValue == compareNumericValue;
                case "!=":
                    return value != compareValue && itemNumericValue != compareNumericValue;
                default:
                    throw new Error(`Unsupported compare condition: ${compareCondition}`);
            }
        };

        if (Array.isArray(itemValue)) {
            return itemValue.some((value) => evaluateSingleValue(value));
        }

        return evaluateSingleValue(itemValue);
    }
    const handleTransFormation = (item: any, columnKey: string) => {
        let style = {};
        updatedTransformations?.forEach((transformation: any) => {
            const parsedCondition = parseCondition([transformation])[0];
            const compareColumn = parsedCondition.compareColumn;
            const compareCondition = parsedCondition.compareCondition;
            let compareValue = parsedCondition.compareValue;
            const compareValueType = parsedCondition.compareValueType;

            const typeofColumn = columns.find((column) => column.key === compareColumn);

            if (compareValueType === "column") {
                compareValue = item[compareValue];
            }

            if (
                transformation.type === "highlight" &&
                (transformation.apply_on.includes(columnKey) || transformation.apply_on.includes("all"))
            ) {
                if (typeofColumn?.type === "number") {
                    style = evaluateCondition(
                        item[compareColumn],
                        compareCondition,
                        compareValue
                    )
                        ? transformation.moified_style
                        : {};
                } else if (typeofColumn?.type === "array") {
                    style = evaluateConditionWithString(
                        item[compareColumn],
                        compareCondition,
                        compareValue
                    )
                        ? transformation.moified_style
                        : {};
                }
            }
        });
        return style;
    };

    const addColumnsForTransformation = () => {
        let availableColumns = [...columns.map((column) => column.key)];

        const updatedTransformations = transformations?.map((transformation: any) => {
            let columnsForThisTransformation;

            if (transformation.apply_on.includes("all")) {
                columnsForThisTransformation = availableColumns;
                availableColumns = [];
            } else {
                columnsForThisTransformation = transformation.apply_on.filter((column: string) =>
                    availableColumns.includes(column)
                );
            }

            if (!transformation.apply_on.includes("all")) {
                availableColumns = availableColumns.filter(
                    (column) => !columnsForThisTransformation.includes(column)
                );
            }
            return {
                ...transformation,
                available_columns: columnsForThisTransformation,
            };
        });
        return updatedTransformations;
    };

    const isLastVisibleColumn = (columns: Column[], columnName: string) => {
        const visibleColumns = columns.filter(column => column.visible);
        const columnIndex = visibleColumns.findIndex(column => column.name === columnName);
        return columnIndex === visibleColumns.length - 1;
    };

    useEffect(() => {
        setUpdatedTransformations(addColumnsForTransformation());
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (isModalVisible && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal();
            }
        };

        if (isModalVisible) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isModalVisible]);

    const closeModal = () => {
        setActiveColumn(null);
        setIsModalVisible(false);
    };

    // const getTableClass = () => {
    //     if (externalStyle) {
    //         return externalStyle;
    //     }
    //     return style1;
    // };

    const convertToDisplayDataFormat = () => {
        return data.map(item => {
            let displayItem: { [key: string]: any } = {};

            columns.forEach(column => {
                switch (column.type) {
                    case "string":
                        displayItem[column.name] = item[column.key] ?? "";
                        break;
                    case "date":
                        displayItem[column.name] = item[column.key] ? formatDate(item[column.key]) : "";
                        break;
                    case "boolean":
                        displayItem[column.name] = item[column.key];
                        break;
                    case "number":
                        displayItem[column.name] = item[column.key] ? formatNumberForCurrency(item[column.key]) : "-";
                        break;
                    default:
                        // Skip the cases for "array", "icon", "button", and others
                        break;
                }
            });

            return displayItem;
        });
    };


    const handleDownload = (format: string) => {
        let filename = "table_data";
        if (!data || data.length === 0) {
            alert("No data available to download.");
            return;
        }

        if (format === "csv") {
            const convertArrayToCSV = (data: any[]) => {
                if (!data.length) return "";

                const headers = Object.keys(data[0]).join(",");
                const rows = data.map(row =>
                    Object.values(row).map(value => `"${value}"`).join(",")
                );

                return [headers, ...rows].join("\n");
            };

            const csv = convertArrayToCSV(convertToDisplayDataFormat());
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `${filename}.csv`);
        } else if (format === "excel") {
            const worksheet = XLSX.utils.json_to_sheet(convertToDisplayDataFormat());
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, `${filename}.xlsx`);
        }
    };
    // // @ts-ignore
    // const handleResizeRow = (rowIndex: number, newHeight: number) => {
    //     setRowHeights(prevHeights => ({
    //         ...prevHeights,
    //         [rowIndex]: newHeight
    //     }));
    // };
    const changeSize = () => {
        console.log(resizableObject[variableSize].height, "changeSize");
        setVariableSize((variableSize + 1) % 3);
    };
    const handleSum = (columnKey: string): number =>
        data.reduce((acc, item) => acc + (item[columnKey] !== null && item[columnKey] !== undefined && item[columnKey] !== "" ? Number(item[columnKey]) : 0), 0);

    // Handle Average Calculation
    const handleAvg = (columnKey: string): number => {
        const validValues = data
            .map(item => item[columnKey])
            .filter(value => value !== null && value !== undefined && value !== "" && !isNaN(value))
            .map(Number);
        return validValues.length ? Math.round((handleSum(columnKey) / validValues.length) * 100) / 100 : 0;
    };
    // Handle Min Calculation
    const handleMin = (columnKey: string): number | null => {
        const validValues = data
            .map(item => item[columnKey])
            .filter(value => value !== null && value !== undefined && value !== "" && !isNaN(value))
            .map(Number);
        return validValues.length ? Math.min(...validValues) : null; // Return null if no valid values
    };

    // Handle Max Calculation
    const handleMax = (columnKey: string): number | null => {
        const validValues = data
            .map(item => item[columnKey])
            .filter(value => value !== null && value !== undefined && value !== "" && !isNaN(value))
            .map(Number);
        return validValues.length ? Math.max(...validValues) : null; // Return null if no valid values
    };
    // Handle Count Calculation
    const handleCount = (): number => data.length;
    // Add aggregate functionality object
    const addAggregateFunctionality = {
        sum: {
            title: "Sum",
            aggregateFunction: handleSum,
        },
        avg: {
            title: "Average",
            aggregateFunction: handleAvg,
        },
        min: {
            title: "Min",
            aggregateFunction: handleMin,
        },
        max: {
            title: "Max",
            aggregateFunction: handleMax,
        },
        count: {
            title: "Count",
            aggregateFunction: handleCount,
        }
    };
    // Toggle Fullscreen mode
    const toggleFullScreen = () => {
        if (!isFullScreen) {
            if (tableRef.current?.requestFullscreen) {
                tableRef.current?.requestFullscreen();
            } else if ((tableRef.current as any)?.webkitRequestFullscreen) { /* Safari */
                (tableRef.current as any)?.webkitRequestFullscreen();
            } else if ((tableRef.current as any)?.msRequestFullscreen) { /* IE11 */
                (tableRef.current as any)?.msRequestFullscreen();
            }
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) { /* Safari */
                (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) { /* IE11 */
                (document as any).msExitFullscreen();
            }
            setIsFullScreen(false);
        }
    };
    // const handleOnDragEnd = (result: { source: any; destination: any; }) => {
    //     const { source, destination } = result;

    //     // If there's no destination, do nothing
    //     if (!destination) return;

    //     // Reorder columns
    //     const reorderedColumns = Array.from(columns);
    //     const [movedColumn] = reorderedColumns.splice(source.index, 1);
    //     reorderedColumns.splice(destination.index, 0, movedColumn);
    //     setColumns(reorderedColumns);
    // };

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    // Drag Start - Store the index of dragged column
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };
    // Drag Over - Prevent default to allow drop
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
    // Drop - Reorder the columns
    const handleDrop = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;

        const updatedColumns = [...columns];
        const [movedColumn] = updatedColumns.splice(draggedIndex, 1);
        updatedColumns.splice(index, 0, movedColumn);

        setColumns(updatedColumns);
        setDraggedIndex(null);
    };
    //row selection logic 
    const [allSelected, setAllSelected] = useState(false); // Tracks the "select all" checkbox state
    // Update allSelected state based on selectedRows
    useEffect(() => {
        if (selectedRows?.length === data.length && data.length > 0) {
            setAllSelected(true);
        } else {
            setAllSelected(false);
        }
    }, [selectedRows, data]);
    // Function to handle global checkbox change
    const handleGlobalCheckboxChange = () => {
        if (allSelected) {
            selectedRows && setSelectedRows([]); // Deselect all
        } else {
            selectedRows && setSelectedRows([...data]); // Select all displayed rows
        }
    };
    const handleSingleRowSelectDeselect = (row: any) => {
        if (selectedRows?.includes(row)) {
            setSelectedRows(selectedRows.filter((item) => item !== row));
        } else {
            selectedRows && setSelectedRows([...selectedRows!, row]);
        }
    };
    //virtualization logic when  scroll is allowed
    const rowHeight = resizableObject?.[variableSize!]?.height;
    const visibleRows = Math.ceil(Math.min(800, data?.length * rowHeight) / rowHeight);
    const containerRef = useRef(null);
    const totalRows = data?.length;
    // const containerHeight = visibleRows * rowHeight;
    // const totalHeight = totalRows * rowHeight; // Total height of all rows
    const maxStartIndex = totalRows - visibleRows;
    const handleScroll = () => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        // Check if at the bottom (stop updating startIndex)
        if (scrollTop + clientHeight >= scrollHeight - 1)  {
            setStartIndex(maxStartIndex);
            return;
        }

        // Calculate new start index
        const newStartIndex = Math.floor(scrollTop / rowHeight);

        // Prevent setting startIndex beyond max
        if (newStartIndex <= maxStartIndex ) {
            setStartIndex(newStartIndex);
        }
        console.log(newStartIndex, "newStartIndex");
    };
    useEffect(() => {
        const container = containerRef.current! as HTMLElement;
        if (container && virtualization) {
            container.addEventListener("scroll", handleScroll as EventListener);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, []);
    const visibleData = data.slice(startIndex, Math.min(Math.ceil(startIndex * (visibleRows / 2) + visibleRows), data?.length));
    return (

        <div
            ref={tableRef}
            className={`${style2.tableContainer} ${isFullScreen ? style2.fullScreen : ''} `}
        >
            
            {!isLoading && (
                <div className="d-flex justify-content-center align-items-center  gap-7  ">
                    {/* Search Box */}
                    {isSearchAllowed && (
                        <div className="d-flex align-items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                className="border form-control form-control-sm shadow-sm"
                                value={searchTerm}
                                onChange={(e) => handleSearchValueChange(e)}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex align-items-center gap-3">
                        {/* Download CSV Button */}
                        {canDownloadData && (
                            <>
                                <button
                                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                                    onClick={() => handleDownload('csv')}
                                >
                                    <i className="bi bi-file-earmark-csv"></i> 
                                    Download CSV
                                </button>
                                <button
                                    className="btn btn-outline-success d-flex align-items-center gap-2"
                                    onClick={() => handleDownload('excel')}
                                >
                                    <i className="bi bi-file-earmark-excel"></i> 
                                    Download Excel
                                </button>
                            </>
                        )}
                        {/*handle advanced filter  */}
                         <button onClick={() => advancedFilterData(filterItems)}>
                            Filter Data
                         </button>

                        {/* Resizable Icon */}
                        {canResizeRows && (
                            <div
                                className="p-2 rounded-circle bg-light d-flex justify-content-center align-items-center cursor-pointer"
                                onClick={changeSize}
                            >
                                {resizableObject[variableSize]?.icon}
                            </div>
                        )}
                        {isFullScreenAllowed && (
                            <button
                                className="btn btn-outline-dark d-flex align-items-center gap-2"
                                onClick={toggleFullScreen}
                            >
                                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </button>
                        )}
                    </div>
                    {isHiddenColumnsAllowed && (
                        <div className="position-relative">
                            <button

                                className="btn btn-outline-primary d-flex align-items-center gap-2"
                                onClick={() => setIsColumnModalOpen(!isColumnModalOpen)}
                            >
                                <span>Add Other Parameters</span>
                            </button>

                            {isColumnModalOpen && (
                                <div
                                    ref={modalRef}
                                    className="modal show"
                                    tabIndex={-1}
                                    role="dialog"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        display: 'flex',
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        zIndex: 1050,
                                        width: '180px',
                                        height: '160px',
                                        overflowY: 'scroll',
                                        background: '#FFFFFF',
                                        padding: '16px',

                                    }}
                                >
                                    <div className="modal-content">
                                        <div className="modal-body p-0">
                                            {enableDragandDrop ? (
                                                <div className="list-group" style={{ minHeight: "50px" }}>
                                                    {columns.map((column, index) => (
                                                        <div
                                                            key={column.key}
                                                            draggable={true}
                                                            onDragStart={() => handleDragStart(index)}
                                                            onDragOver={handleDragOver}
                                                            onDrop={() => handleDrop(index)}
                                                            className="d-flex align-items-center gap-2 p-2 list-group-item"
                                                            style={{
                                                                cursor: "grab",
                                                                backgroundColor: "#fff",
                                                                border: "1px solid #ddd",
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={column.visible}
                                                                onChange={() =>
                                                                    setColumns(
                                                                        columns.map((col) =>
                                                                            col.key === column.key ? { ...col, visible: !col.visible } : col
                                                                        )
                                                                    )

                                                                }
                                                                className="form-check-input"
                                                            />
                                                            <label className="form-check-label">{column.name}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="list-group">
                                                    {columns.map((column, index) => (
                                                        <div key={index} className="d-flex align-items-center gap-2 p-2 list-group-item">
                                                            <input
                                                                type="checkbox"
                                                                checked={column.visible}
                                                                onChange={() => toggleColumnVisibility(column.name)}
                                                                className="form-check-input"
                                                            />
                                                            <label className="form-check-label">{column.name}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                    )}
                </div>
            )}
            {
                enableDragandDrop ?
                    <div
                        ref={containerRef}
                        className={`${isScrollAllowed
                            ? ' overflow-auto  scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-bg-light w-30'
                            : 'w-100'
                            }`}
                        style={{ minHeight: "400px", maxHeight: "800px" }}
                    >
                        <table className="mx-auto  ">
                            <thead>
                                <tr>
                                    {isRowSelectionAllowed && !isLoading && (
                                        <th className={`${isScrollAllowed && isStickyHeaderEnabled
                                            ? 'position-sticky top-0 zindex-1 p-2 bg-light'
                                            : 'p-2'
                                            }`}>
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={handleGlobalCheckboxChange}

                                            />
                                        </th>
                                    )}

                                    {columns
                                        .filter((column) => column.visible)
                                        .map((column) => (
                                            <th
                                                key={column.key}

                                                className={`${isScrollAllowed && isStickyHeaderEnabled
                                                    ? 'position-sticky top-0 zindex-1 p-3 bg-light'
                                                    : 'p-2'
                                                    }`}
                                            >
                                                <ResizableBox
                                                    width={200} // Set an initial width or dynamically determine it
                                                    height={40}
                                                    axis="x"
                                                    minConstraints={[100, 40]}
                                                    maxConstraints={[400, 40]}
                                                   
                                                >
                                                    <div className="d-flex flex-column align-items-center bg-dark-custom ">
                                                        {/* Column Name & Icons */}
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <div className="fw-semibold">{column.name}</div>
                                                            {column?.sorting && !isLoading &&
                                                                column.type !== "array" &&
                                                                column.type !== "button" &&
                                                                column.type !== "boolean" &&
                                                                (sorting =="single" ? renderSortIcon1(column) : renderSortIcon(column))}

                                                            {column?.filter && !isLoading &&
                                                                column.type !== 'icon' &&
                                                                column.type !== 'button'
                                                                ? renderArrowIcon(column)
                                                                : ''}
                                                        </div>

                                                        {/* Aggregate Functionality - Positioned Below Column Name */}
                                                        {column.type === 'number' && !isLoading && column?.aggregateFunction?.visible && (

                                                            <div className="w-100 text-center mt-1">
                                                                <label className="fw-bold text-primary small">

                                                                    {column?.aggregateFunction?.function === "custom"
                                                                        ? column?.aggregateFunction?.title
                                                                        : addAggregateFunctionality?.[column?.aggregateFunction?.function]?.title}
                                                                </label>
                                                                :
                                                                <span className="ms-1 text-success fw-semibold">
                                                                {column?.aggregateFunction?.function === "custom"
                                                                        ? column?.aggregateFunction?.customFunction && column?.aggregateFunction?.customFunction(column.key, data)
                                                                        : addAggregateFunctionality?.[column?.aggregateFunction?.function]?.aggregateFunction(column.key)}
                                                                </span>
                                                            </div>

                                                        )}

                                                        {/* Filter Modal */}
                                                        {column?.filter && activeColumn === column.name && isModalVisible && (
                                                            <div
                                                                className="position-absolute bg-white border shadow-sm p-2 rounded"
                                                                ref={modalRef}
                                                                style={{
                                                                    top: '100%',
                                                                    left: isLastVisibleColumn(columns, column.name) ? '-110px' : '0',
                                                                    zIndex: 10,
                                                                    width: '180px',
                                                                    maxHeight: '250px', // Limit height of the modal
                                                                    overflowY: 'auto', // Make the modal scrollable vertically
                                                                }}
                                                            >
                                                                <div>
                                                                    {checkedItems[column.key]?.length > 0 ? (
                                                                        <div
                                                                            className="text-danger small fw-bold cursor-pointer"
                                                                            onClick={() => handleClearFilter(column)}
                                                                        >
                                                                            Clear Filter ({checkedItems[column.key]?.length})
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            className="text-danger small fw-bold cursor-pointer"
                                                                            onClick={() => handleClearFilter(column)}
                                                                        >
                                                                            Clear Filter
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {/*search bar logic inside the modal */}
                                                                {column.type !== 'date' &&
                                                                    column.type !== 'number' &&
                                                                    column.type !== 'array'&&(column.type == 'component' && (column.filter == "checkbox" || column.filter == "string"))
                                                                    && (
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Search"
                                                                            className="form-control form-control-sm mt-2"
                                                                            value={columnSearchItems[column.name] || ''}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                // setColumnSearchterm(value);
                                                                                console.log(e.target.value, "value");
                                                                                setColumnSearchItems((prevState) => ({
                                                                                    ...prevState,
                                                                                    [column.name]: value,
                                                                                }));
                                                                            }}
                                                                        />
                                                                    )}
                                                                {filterType === "advanced" ? renderAdvancedModalContent(column) : renderModalContent(column)}
                                                            </div>
                                                        )}
                                                    </div>


                                                </ResizableBox>
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <TableBody
                                isPaginationAllowed={isPaginationAllowed ?? false}
                                currentPageData={currentPageData}
                                data={(isScrollAllowed && virtualization) ? visibleData : data}
                                columns={columns}
                                canDoubleClick={canDoubleClick}
                                handleDoubleClick={handleDoubleClick}
                                handleTransFormation={handleTransFormation}
                                resizableObject={resizableObject}
                                variableSize={variableSize}
                                ExpandedRowComponent={ExpandedRowComponent}
                                handleExpandedRow={handleExpandedRow}
                                handleEdit={handleEdit}
                                canExpandRow={canExpandRow}
                                isCustomRowStyle={isCustomRowStyle}
                                customRowStyle={customRowStyle}
                                isRowSelectionAllowed={isRowSelectionAllowed}
                                selectedRows={selectedRows}   
                                handleSingleRowSelectDeselect={handleSingleRowSelectDeselect}
                                ArrayColumnRenderer={ArrayColumnRenderer}
                                expandedRow={expandedRow}
                                setExpandedRow={setExpandedRow}
                                eventList={eventList}
                                isLoading={isLoading}
                            />



                        </table>
                    </div>
                    :
                    <div
                        ref={containerRef}
                        className={`${isScrollAllowed
                            ? ' overflow-auto  scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-bg-light w-100'
                            : 'w-100'
                            }`}
                        style={{ minHeight: "400px", maxHeight: "800px" }}
                    >
                        <table className="table ">
                            <thead>
                                <tr>
                                    {isRowSelectionAllowed && !isLoading&& (
                                        <th className={`${isScrollAllowed && isStickyHeaderEnabled
                                            ? 'position-sticky top-0 zindex-1 p-2 bg-light'
                                            : 'p-2'
                                            }`}>
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={handleGlobalCheckboxChange}

                                            />
                                        </th>
                                    )}
                                    {columns
                                        .filter((column) => column.visible)
                                        .map((column) => (
                                            <th
                                                key={column.key}

                                                className={`${isScrollAllowed && isStickyHeaderEnabled
                                                    ? 'position-sticky top-0 zindex-1 bg-light'
                                                    : ''
                                                    }bg-dark-custom `}
                                            >
                                                <ResizableBox
                                                    width={200} // Set an initial width or dynamically determine it
                                                    height={40}
                                                    axis="x"
                                                    minConstraints={[100, 40]}
                                                    maxConstraints={[400, 40]}                                                
                                                >
                                                    <div className="d-flex flex-column align-items-center text-secondary">
                                                        {/* Column Name & Icons */}
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <div className="fw-semibold">{column.name}</div>
                                                            {column?.sorting && !isLoading &&
                                                                column.type !== 'array' &&
                                                                column.type !== 'button' &&
                                                                column.type !== 'boolean' 
                                                                ? (sorting =="single" ? renderSortIcon1(column) : renderSortIcon(column))
                                                                : ''}
                                                            {column?.filter && !isLoading &&
                                                                column.type !== 'icon' &&
                                                                column.type !== 'button' &&
                                                                column.type !== 'component'
                                                                ? renderArrowIcon(column)
                                                                : ''}
                                                        </div>
                                                        {/* Aggregate Functionality - Positioned Below Column Name */}
                                                        {column.type === 'number' && column?.aggregateFunction?.visible && !isLoading && (

                                                            <div className="w-100 text-center mt-1">
                                                                <label className="fw-bold text-primary small">

                                                                    {column?.aggregateFunction?.function === "custom"
                                                                        ? column?.aggregateFunction?.title
                                                                        : addAggregateFunctionality?.[column?.aggregateFunction?.function]?.title}
                                                                </label>
                                                                :
                                                                <span className="ms-1 text-success fw-semibold">
                                                                    {column?.aggregateFunction?.function === "custom"
                                                                        ? column?.aggregateFunction?.customFunction && column?.aggregateFunction?.customFunction(column.key, data)
                                                                        : addAggregateFunctionality?.[column?.aggregateFunction?.function]?.aggregateFunction(column.key)}
                                                                </span>
                                                            </div>

                                                        )}
                                                        {/* Filter Modal */}
                                                        {column?.filter && activeColumn === column.name && isModalVisible && (
                                                            <div
                                                                className="position-absolute bg-white border shadow-sm p-2 rounded"
                                                                ref={modalRef}
                                                                style={{
                                                                    top: '100%',
                                                                    left: isLastVisibleColumn(columns, column.name) ? '-110px' : '0',
                                                                    zIndex: 10,
                                                                    width: '180px',
                                                                    maxHeight: '250px', // Limit height of the modal
                                                                    overflowY: 'auto', // Make the modal scrollable vertically
                                                                }}
                                                            >
                                                                <div>
                                                                    {checkedItems[column.key]?.length > 0 ? (
                                                                        <div
                                                                            className="text-danger small fw-bold cursor-pointer"
                                                                            onClick={() => handleClearFilter(column)}
                                                                        >
                                                                            Clear Filter ({checkedItems[column.key]?.length})
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            className="text-danger small fw-bold cursor-pointer"
                                                                            onClick={() => handleClearFilter(column)}
                                                                        >
                                                                            Clear Filter
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {column.type !== 'date' &&
                                                                    column.type !== 'number' &&
                                                                    column.type !== 'array'&& (column.type == 'component' && (column.filter == "checkbox" || column.filter == "string")) && (
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Search"
                                                                            className="form-control form-control-sm mt-2"
                                                                            value={columnSearchItems[column.name] || ''}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                // setColumnSearchterm(value);
                                                                                console.log(e.target.value, "value");
                                                                                setColumnSearchItems((prevState) => ({
                                                                                    ...prevState,
                                                                                    [column.name]: value,
                                                                                }));
                                                                            }}
                                                                        />
                                                                    )}
                                                                {filterType === "advanced" ? renderAdvancedModalContent(column) : renderModalContent(column)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </ResizableBox>
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <TableBody
                                isPaginationAllowed={isPaginationAllowed ?? false}
                                currentPageData={currentPageData}
                                data={(isScrollAllowed && virtualization) ? visibleData : data}
                                columns={columns}
                                canDoubleClick={canDoubleClick}
                                handleDoubleClick={handleDoubleClick}
                                handleTransFormation={handleTransFormation}
                                resizableObject={resizableObject}
                                variableSize={variableSize}
                                ExpandedRowComponent={ExpandedRowComponent}
                                handleExpandedRow={handleExpandedRow}
                                handleEdit={handleEdit}
                                canExpandRow={canExpandRow}
                                isCustomRowStyle={isCustomRowStyle}
                                customRowStyle={customRowStyle}
                                isRowSelectionAllowed={isRowSelectionAllowed}
                                selectedRows={selectedRows}
                                handleSingleRowSelectDeselect={handleSingleRowSelectDeselect}
                                ArrayColumnRenderer={ArrayColumnRenderer}
                                expandedRow={expandedRow}
                                setExpandedRow={setExpandedRow}
                                eventList={eventList}
                                isLoading={isLoading}   
                            />
                        </table>
                    </div>
            }
            <TableFooter
                isPaginationAllowed={isPaginationAllowed ?? false}
                filteredData={filteredData}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                handleValuePerPage={handleValuePerPage as any}
                isLoading={isLoading}
            />
        </div>
    );
};
// @ts-expect-error
export default forwardRef(GenerateTable);