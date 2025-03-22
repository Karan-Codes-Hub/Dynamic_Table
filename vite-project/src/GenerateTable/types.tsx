import { SelectChangeEvent } from "@mui/material";

type aggregatorFunc = "sum" | "avg" | "max" | "min" | "count" | "custom";

export interface ArrayColumnRendererProps {
    item: Record<string, any>; // The item is an object with dynamic keys and values.
    column: {
        key: string;
        subKey?: string;
    };
    index: number;
}

export type DropResult = {
    source: { index: number };
    destination?: { index: number };
    draggableId: string;
    type: string;
};

export interface ObjectColumnRendererProps {
    item: Record<string, any>; // The item is an object with dynamic keys and values.
    column: {
        key: string;
        sub_key?: string;
    };
    index: number;
}

export interface Column {
    id?: string | number,
    key: string;
    name: string;
    type: string;
    visible?: boolean;
    subKey?: string;
    action?: (item?: any, column?: Column) => void;
    buttonName?: string;
    sorting?:boolean;
    filter?:boolean | string;
    aggregateFunction?: {
        visible: boolean;
        function: aggregatorFunc
        title ?: string;
        customFunction?: (columnKey: string, data: any[]) => any;
    };
    isEditable?: boolean;
    filterContent?: any[];

}

export interface DataItem {
    [key: string]: any;
}

export interface ResizableItem {
    id: number;
    title: string;
    icon: JSX.Element; // JSX.Element is used for React components like icons
    height: number;
}

export interface ColumnModalProps {
    isHiddenColumnsAllowed: boolean;
    enableDragandDrop: boolean;
    columns: Column[];
    isColumnModalOpen: boolean;
    toggleColumnVisibility: (columnName: string) => void;
    handleColumnButtonClick: () => void;
    handleColumnDragEnd: (result: any) => void;
}

export interface DateRange {
    [key: string]:{ start?: string | any | undefined;
        end?: string | any | undefined;}
   
}

export interface CheckedItems {
    [key: string]: any[];
}

export interface ChildRef {
    showAlert: () => void;
}
export interface BaseGenerateTableProps {
    isHiddenColumnsAllowed?: boolean;
    enableDragandDrop?: boolean;
    isPaginationAllowed?: boolean;
    isScrollAllowed?: boolean;
    isSearchAllowed?: boolean;
    canDoubleClick?: boolean;
    isStickyHeaderEnabled: boolean;
    handleDoubleClick?: (item: any, columns: Column[]) => void;
    Data: any[];
    DataColumns: Column[];
    setDataColumns: (columns: Column[]) => void;
    externalStyle?: any;
    isFullScreenAllowed?: boolean;
    canDownloadData?: boolean;
    canResizeRows?: boolean;
    ExpandedRowComponent?: (item: any, columns: Column[]) => any;
    handleExpandedRow?: (item: any, columns: Column[]) => void;
    canExpandRow?: boolean;
    handleEdit?: (item: any, column: Column, newValue: any) => void;
    isCustomRowStyle?: boolean;
    customRowStyle?: (index: number) => string;
    virtualization?: boolean;
    isRowSelectionAllowed?: boolean; // Keep optional in base type
    eventList ?: any;
    isLoading?: boolean;
    sorting?: "single" | "multi";
    filterType?: "simple" | "advanced";
}


// Type union for conditional enforcement
export type GenerateTableProps = BaseGenerateTableProps ;



export interface Transformation {
    type: string;
    conditon: string;
    apply_on: string[];
    moified_style: {
        color: string;
    };
}

export interface TableFooterProps {
    isPaginationAllowed: boolean;
    filteredData: any[];
    itemsPerPage: number;
    currentPage: number;
    isLoading?: boolean;
    handlePageChange: (value: number) => void;
    handleValuePerPage: (event: SelectChangeEvent<number>) => void;
}
export interface TableBodyProps {
    isPaginationAllowed: boolean;
    currentPageData: DataItem[];
    data: DataItem[];
    columns: Column[];
    canDoubleClick?: boolean;
    handleDoubleClick?: (item: DataItem, columns: Column[]) => void;
    handleTransFormation?: (item: DataItem, key: string) => React.CSSProperties;
    resizableObject?: ResizableItem[];
    variableSize?: Number;
    ExpandedRowComponent?: (item: DataItem, columns: Column[]) => any;
    handleExpandedRow?: (item: DataItem, columns: Column[]) => void; 
    handleEdit?: (item: DataItem, column: Column, newValue: any) => void;
    canExpandRow?: boolean;
    isCustomRowStyle? : boolean,
    customRowStyle?: (index: number) => string
    isRowSelectionAllowed?: boolean;
    selectedRows?: any[];
    virtualization?: boolean;
    handleSingleRowSelectDeselect: (item: DataItem) => void;
    ArrayColumnRenderer : any;
    expandedRow : any,
    setExpandedRow : any,
    eventList : any,
    isLoading?: boolean;
    
}
