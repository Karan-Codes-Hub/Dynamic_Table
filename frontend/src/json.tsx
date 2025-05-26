export const tablePropsList = [
  {
    key: "Data",
    description: "The primary dataset to be displayed in the table. Must be an array of objects where each object represents a row. Each key in the object should correspond to a column defined in DataColumns. For optimal performance, maintain stable references - avoid creating new array references on each render unless the data has actually changed. The table implements efficient rendering by tracking row identity internally.",
    type: "Array<object>",
    required: true,
    usage: [
      `<ValidateAndGenerateTable Data={[{id: 1, name: 'Item 1'}, {id: 2, name: 'Item 2'}]} />`,
      `// For dynamic data:`,
      `const [data, setData] = useState(initialData);`,
      `<ValidateAndGenerateTable Data={data} />`
    ],
    notes: [
      "Performance Tip: For datasets exceeding 1000 rows, combine with virtualization prop",
      "Data integrity: Objects should contain all keys referenced in DataColumns",
      "Row identity: Include unique 'id' properties for best performance with stateful operations"
    ],
    validation: "Must be an array - verified during prop validation"
  },
  {
    key: "DataColumns",
    description: "Defines the complete column configuration for the table. Each column specification determines how data is rendered, sorted, filtered, and interacted with. The component supports multiple column types with specialized behaviors for each. Columns can be grouped hierarchically for complex data presentation. The order of columns in this array determines their initial display order.",
    type: "Array<Column>",
    required: true,
    usage: [
      `  const basicColumns: Column[] = [
            {
              key: "id",
              name: "ID",
              type: "number",
              visible: true,
              filter: true,
              sorting: true,
              aggregateFunction: {
                visible: true,
                function: "count",
                title: "Total Records"
              }
            },
            {
              key: "name",
              name: "Name",
              type: "string",
              visible: true,
              filter: true,
              sorting: true,
              isEditable: true
            },
            {
              key: "email",
              name: "Email",
              type: "string",
              visible: true,
              filter: true,
              sorting: true,
            },
            {
              key: "age",
              name: "Age",
              type: "number",
              visible: true,
              filter: true,
              sorting: true,
              aggregateFunction: {
                // visible: true,
                // function: "custom",
                // title: "Age Analysis",
                // customFunction: handleMax
                visible: true,
                function: "max",
                title: "Total Records"
              }
            },
            {
              key: "membership",
              name: "Membership",
              type: "component",
              visible: true,
              sorting: true,
              filter: "string"
            },
            {
              key: "joinedDate",
              name: "Join Date",
              type: "date",
              visible: true,
              filter: true
            },
            {
              key: "lifetimeValue",
              name: "LTV",
              type: "number",
              visible: true,
              filter: true,
              aggregateFunction: {
                visible: true,
                function: "sum",
                title: "Total LTV"
              }
            },
            {
              key: "actions",
              name: "View data",
              type: "button",
              visible: true,
              buttonName: "View",
              action: (item) => handleViewProfile(item),
            },
            {
              key: "eye",
              name: "View Icon",
              type: "icon",
              visible: true,
              action: (item) => handleViewProfile(item),
             }
          ];`,
      `<ValidateAndGenerateTable DataColumns={basicColumns} />`
    ],
    subProps: [
      {
        name: "key",
        type: "string",
        description: "Must exactly match a property key in your data objects. Used for data binding and column identification.",
        required: true
      },
      {
        name: "type",
        type: "'string' | 'number' | 'date' | 'component' | 'button' | 'icon' | 'custom'",
        description: "Determines default rendering, sorting, and filtering behavior. Component type allows custom React components. Button type renders clickable buttons with configurable actions.",
        required: true
      },
      {
        name: "label",
        type: "string",
        description: "Display text for column header. Falls back to capitalized key if not provided.",
        default: "Capitalized column key"
      },
      {
        name: "width",
        type: "number | string",
        description: "Fixed width in pixels or flexible width as CSS string (e.g., '20%'). Columns without width share remaining space proportionally."
      },
      {
        name: "sorting",
        type: "boolean | { compareFn?: (a: any, b: any) => number }",
        description: "Enables sorting with optional custom comparator. Multi-column sorting requires sorting='multi' prop.",
        default: "false"
      },
      {
        name: "filter",
        type: "boolean | { filterFn?: (rowValue: any, filterValue: any) => boolean }",
        description: "Enables filtering with optional custom filter function. Requires filterType prop to be set.",
        default: "false"
      },
      {
        name: "isEditable",
        type: "boolean",
        description: "Allows inline editing when handleEdit prop is provided. Triggers validation before submission.",
        default: "false"
      },
      {
        name: "format",
        type: "(value: any, rowData?: object) => string | ReactNode",
        description: "Transformation function for cell display values. Receives the raw value and complete row data."
      },
      {
        name: "aggregateFunction",
        type: "object",
        description: "Configuration for footer aggregates including sum, average, count, or custom calculations."
      },
      {
        name: "cellStyle",
        type: "React.CSSProperties | ((value: any, rowData?: object) => React.CSSProperties)",
        description: "Inline styles or style generator for individual cells. Dynamic functions receive cell value and row data."
      },
      {
        name: "headerStyle",
        type: "React.CSSProperties",
        description: "Inline styles for column headers. Useful for emphasis or branding."
      }
    ],
    validation: "Must be an array with valid column objects - verified during prop validation"
  },
  {
    key: "setDataColumns",
    description: "Callback function that receives the updated column configuration whenever columns are modified by user interaction (reordering, resizing, visibility toggling). Essential for persisting column state between sessions. The callback should typically update the state that provides the DataColumns prop.",
    type: "(columns: Column[]) => void",
    required: false,
    usage: [
      `const [columns, setColumns] = useState(initialColumns);`,
      `<ValidateAndGenerateTable DataColumns={columns} setDataColumns={setColumns} />`
    ],
    dependencies: [
      "isHiddenColumnsAllowed - Required for visibility changes",
      "enableDragandDrop - Required for column reordering",
      "canResizeColumns - Required for width adjustments"
    ],
    notes: [
      "The callback receives a complete new array reference - avoid deep comparison in effects",
      "Column state should be persisted if user preferences are important"
    ],
    validation: "Must be a function when provided - verified during prop validation"
  },
  {
    key: "isHiddenColumnsAllowed",
    description: "Enables user-controlled column visibility through a dropdown selector. When enabled, users can show/hide columns dynamically. The current visibility state should be preserved via setDataColumns callback. Hidden columns are completely removed from the DOM for performance.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable isHiddenColumnsAllowed={true} />`,
    visual: [
      "Adds a column configuration dropdown button to the toolbar",
      "Dropdown shows checkboxes for each column with visibility toggle"
    ],
    dependencies: [
      "setDataColumns - Required to persist visibility changes"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "isPaginationAllowed",
    description: "Controls the display and behavior of pagination controls. When enabled, the table automatically paginates data exceeding 10 rows. Offers configurable page sizes (10, 25, 50, 100 items per page) with responsive layout. Maintains sort/filter state across page changes.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable isPaginationAllowed={true} />`,
    visual: [
      "Pagination controls appear at table bottom",
      "Includes page navigation, size selector, and item count"
    ],
    notes: [
      "For client-side pagination: Let table manage pagination internally",
      "For server-side pagination: Manage Data prop externally with only current page data"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "isSearchAllowed",
    description: "Enables a global search feature that filters across all string-type columns. The search is case-insensitive by default and implements a 300ms debounce to prevent excessive filtering. Supports custom search implementations through optional callback.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable isSearchAllowed={true} />`,
    visual: [
      "Search input appears in the upper right toolbar",
      "Clear button appears when search has value",
      "Search icon provides visual feedback"
    ],
    notes: [
      "Search applies to all string-type columns by default",
      "Customize search behavior via column filter configurations"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "enableDragandDrop",
    description: "Enables drag-and-drop column reordering. Provides visual feedback during drag operations with a placeholder indicator. Column order changes are reported via setDataColumns callback for persistence. Includes accessibility support for keyboard reordering.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable enableDragandDrop={true} />`,
    visual: [
      "Drag handles appear on column headers when hovered",
      "Placeholder shows drop position during drag",
      "Smooth animation on drop completion"
    ],
    dependencies: [
      "setDataColumns - Required to persist order changes"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "isScrollAllowed",
    description: "Enables scrollable table container for handling large datasets or many columns. When enabled, headers remain visible during vertical scrolling (with isStickyHeaderEnabled). Horizontal scrolling reveals off-screen columns. Essential for virtualization.",
    type: "boolean",
    default: "false",
    usage: [
      `<ValidateAndGenerateTable isScrollAllowed={true} style={{ height: '500px' }} />`,
      `// For horizontal scroll only:`,
      `<div style={{ width: '100%', overflowX: 'auto' }}>`,
      `  <ValidateAndGenerateTable isScrollAllowed={false} />`,
      `</div>`
    ],
    notes: [
      "Requires explicit height/width for proper scroll container sizing",
      "Combine with virtualization for large datasets"
    ],
    dependencies: [
      "virtualization - Requires scrolling to be enabled"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "isFullScreenAllowed",
    description: "Adds a fullscreen toggle button that expands the table to fill the viewport. Maintains all UI state (sort, filter, selection) during fullscreen transitions. Implements proper fullscreen API with fallback for older browsers. Exits fullscreen on ESC key or button click.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable isFullScreenAllowed={true} />`,
    visual: [
      "Fullscreen toggle button appears in toolbar",
      "Modal overlay in fullscreen mode",
      "Original position restored on exit"
    ],
    notes: [
      "Uses browser native fullscreen API where available",
      "Fallback implementation uses fixed positioning"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "canDownloadData",
    description: "Enables data export functionality with options for CSV and Excel formats. Export includes current filtered/sorted data with configurable column selection. Filename is customizable with timestamp auto-appending option. Requires xlsx library for Excel export.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable canDownloadData={true} />`,
    visual: [
      "Download button in toolbar",
      "Dropdown with format options on click",
      "Progress indicator during large exports"
    ],
    notes: [
      "CSV export works out-of-the-box",
      "Excel export requires xlsx dependency",
      "Exports reflect current filters/sorts"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "canResizeRows",
    description: "Enables dynamic row height adjustment through user interaction. Provides three preset sizes (compact, normal, spacious) and remembers user preference. Row resize handles appear between rows when enabled. Affects all rows uniformly.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable canResizeRows={true} />`,
    visual: [
      "Resize handles between rows",
      "Visual feedback during resize",
      "Persistent size preference"
    ],
    notes: [
      "For per-row height control, use rowStyle prop",
      "Virtualization requires fixed row heights"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "isStickyHeaderEnabled",
    description: "Keeps column headers fixed during vertical scrolling for better data orientation. Works with column groups and maintains all header functionality (sort, filter) while sticky. Requires scroll container to be enabled.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable isStickyHeaderEnabled={true} isScrollAllowed={true} />`,
    visual: [
      "Headers remain fixed at top during scroll",
      "Shadow appears when scrolled to indicate more content",
      "Perfect alignment with scrolled content"
    ],
    dependencies: [
      "isScrollAllowed - Must be enabled for sticky headers"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "ExpandedRowComponent",
    description: "Custom component to render as expanded content below a row. Receives the complete row data item and column configuration as props. Commonly used for detailed views, sub-tables, or related data presentation. Rendered only when row is expanded.",
    type: "React.ComponentType<{ item: any, columns: Column[] }>",
    required: false,
    usage: [
      `const handleDoubleClick = (item: any) => {
          if (expandedItem?.id === item?.id) {
          setExpandedItem(null);
          localRef?.current?.rowExpand(null);
          return;
          }
      localRef?.current?.rowExpand(item?.id);
      setExpandedItem(item);
      };`,
      `<ValidateAndGenerateTable ExpandedRowComponent={componentToShow}  />`
    ],
    validation: "Must be a valid component when yopu are calling the .rowExpand() method from reference"
  },
  {
    key: "handleEdit",
    description: "Callback function for inline cell editing. Receives the row item, column definition, and new value. Should return a Promise resolving to true/false for success/failure states. Failed promises trigger error display and value reversion.",
    type: "(item: any, column: Column, newValue: any) => Promise<boolean>",
    required: false,
    usage: [
      `const handleEdit = async (item, column, value) => {`,
      `  const success = await api.updateItem(item.id, { [column.key]: value });`,
      `  return success;`,
      `};`,
      `<ValidateAndGenerateTable handleEdit={handleEdit} />`
    ],
    dependencies: [
      "Column isEditable - Required on columns needing edit"
    ],
    notes: [
      "Always return a Promise - async/await recommended",
      "Rejections are treated as failures",
      "Consider optimistic updates for better UX"
    ],
    validation: "Must be a function when any column has isEditable: true"
  },
  {
    key: "isCustomRowStyle",
    description: "Enables dynamic row styling through the customRowStyle function. Allows conditional formatting based on row data or index. Useful for highlighting, zebra striping, or status indicators. Overrides default row styling.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable isCustomRowStyle={true} />`,
    dependencies: [
      "customRowStyle - Required function when enabled"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "customRowStyle",
    description: "Function that returns style objects for each row. Receives the row index and should return valid React CSS properties. Commonly used for alternating colors, status highlighting, or conditional formatting.",
    type: "(index: number) => React.CSSProperties",
    required: false,
    usage: [
      `  const customRowStyle = (index: number, item: any) => {
    return index % 2 === 0 ? "bg-white" : "bg-light";
  };
        `,
      `<ValidateAndGenerateTable customRowStyle={getRowStyle} isCustomRowStyle={true} />`
    ],
    dependencies: [
      "isCustomRowStyle - Must be enabled to apply styles"
    ],
    validation: "Must be a function returning valid styles when isCustomRowStyle is true"
  },
  {
    key: "isRowSelectionAllowed",
    description: "Enables row selection through checkboxes in the first column. Supports both single and multi-select modes. Selected rows can be accessed programmatically via ref methods. Visual feedback indicates selection state.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable isRowSelectionAllowed={true} />`,
    visual: [
      "Checkboxes in first column",
      "Select-all checkbox in header",
      "Visual highlighting of selected rows"
    ],
    dependencies: [
      "onRowSelection - Recommended for selection changes"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "virtualization",
    description: "Dramatically improves performance for large datasets by only rendering visible rows. Requires fixed row heights and scroll container. Best for tables with thousands of rows. Not recommended for variable height rows.",
    type: "boolean",
    default: "false",
    usage: [
      `<ValidateAndGenerateTable `,
      `  virtualization={true} `,
      `  isScrollAllowed={true} `,
      `  style={{ height: '600px' }} `,
      `/>`
    ],
    dependencies: [
      "isScrollAllowed - Must be enabled",
      "Fixed row heights - Required for calculation"
    ],
    notes: [
      "For tables with >1000 rows",
      "Row height must be predictable",
      "Smooth scrolling performance"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "ref",
    description: "Provides imperative handle for table methods including row manipulation, selection access, UI controls, and refresh triggers. Essential for programmatic control from parent components. Methods and UI handles are stable across renders.",
    type: "React.Ref<TableMethods>",
    required: false,
    usage: [
      `const tableRef = useRef();`,
      `// Access methods and UI handles:`,
      `tableRef.current?.getSelectedRows();`,
      `tableRef.current?.rowExpand(3);`,
      `tableRef.current?.searchBox // React node for search input`,
      `<ValidateAndGenerateTable ref={tableRef} />`
    ],
    methods: [
      {
        name: "rowExpand(rowindex: number | null)",
        description: "Toggle expansion for specific row by index or null to collapse all",
        returns: "void"
      },
      {
        name: "getSelectedRows()",
        description: "Returns array of currently selected row data",
        returns: "Array<any>"
      },
      {
        name: "getFilterItems()",
        description: "Returns current filter state as an object",
        returns: "Object"
      },
      {
        name: "searchBox",
        description: "React element of the search input box for direct rendering or customization",
        returns: "React.ReactNode"
      },
      {
        name: "downloadButtons",
        description: "React element of download/export buttons",
        returns: "React.ReactNode"
      },
      {
        name: "filterButton",
        description: "React element of the filter toggle button",
        returns: "React.ReactNode"
      },
      {
        name: "resizeButton",
        description: "React element of the resize toggle button",
        returns: "React.ReactNode"
      },
      {
        name: "fullScreenButton",
        description: "React element of the fullscreen toggle button",
        returns: "React.ReactNode"
      }
    ],
    validation: "Must be a valid ref object when provided"
  },
  {
    key: "eventList",
    description: "Array of event objects to display as visual indicators in specific rows. Typically used for status alerts, notifications, or action indicators. Events are matched to rows by id or custom predicate.",
    type: "Array<EventObject>",
    required: false,
    usage: [
      `  const handleClick = (item: any) => {
    console.log("Clicked:", item);
    setSelectedItem(item);
  };

  const handleDoubleClick = (item: any) => {
    if (expandedItem?.id === item?.id) {
      setExpandedItem(null);
      localRef?.current?.rowExpand(null);
      return;
    }
    localRef?.current?.rowExpand(item?.id);
    setExpandedItem(item);
  };

  const eventList = {
    onClick: handleClick,
    onDoubleClick: handleDoubleClick
  };`,
      `<ValidateAndGenerateTable eventList={events} />`
    ],
    notes: [
      "Events are rendered in the row's first column by default",
      "Customize rendering via eventRender prop"
    ],
    validation: "Must be an array when provided"
  },
  {
    key: "isLoading",
    description: "Shows a loading state with shimmer placeholders when true. Maintains current column structure during loading for smooth transitions. Customizable through CSS variables for animation and colors.",
    type: "boolean",
    default: "false",
    usage: [
      `const [loading, setLoading] = useState(true);`,
      `<ValidateAndGenerateTable isLoading={loading} />`
    ],
    visual: [
      "Shimmer animation over table body",
      "Preserved column widths",
      "Optional loading message"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "sorting",
    description: "Configures sorting behavior for the table. 'single' allows only one active sort column. 'multi' enables shift-click to add secondary sort columns. Sort indicators show direction in headers.",
    type: "'single' | 'multi'",
    default: "'single'",
    usage: [
      `<ValidateAndGenerateTable sorting="multi" />`,
      '||',
      `<ValidateAndGenerateTable sorting="single" />`
    ],
    dependencies: [
      "Column sorting - Must be enabled on sortable columns"
    ],
    validation: "Must be either 'single' or 'multi' when provided"
  },
  {
    key: "filterType",
    description: "Determines the filtering interface style. 'simple' provides quick text filters. 'advanced' enables complex filtering with multiple conditions, operators, and type-specific inputs. Filter state can be accessed via ref.",
    type: "'simple' | 'advanced'",
    default: "'simple'",
    usage: [
      `<ValidateAndGenerateTable filterType="advanced"/> || <ValidateAndGenerateTable filterType="simple"/>`,
      `// Access filters:`,
      `tableRef.current?.getFilterObject();`
    ],
    visual: [
      "Simple: Text input per column",
      "Advanced: Dropdown with operator selection"
    ],
    dependencies: [
      "Column filter - Must be enabled on filterable columns"
    ],
    validation: "Must be either 'simple' or 'advanced' when provided"
  },
  {
    key: "isIndexVisible",
    description: "Prepends a column showing each row's index (1-based). Useful for reference in discussions or when order matters. Automatically adjusts with sorting/filtering. Styled to differentiate from data columns.",
    type: "boolean",
    default: "false",
    usage: `<ValidateAndGenerateTable isIndexVisible={true} />`,
    visual: [
      "Numbered first column",
      "Subtle styling to distinguish from data",
      "Updates with sort/filter changes"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "isCustomHeaderVisible",
    description: "Allows insertion of a custom header component above the table. Commonly used for titles, summary statistics, or custom controls. Rendered inside the table container for consistent width.",
    type: "boolean",
    default: "false",
    usage: [
      `const TableHeader = () => (<div>Sales Report</div>);`,
      `<ValidateAndGenerateTable `,
      `  isCustomHeaderVisible={true} `,
      `  customHeader={<TableHeader />} `,
      `/>`
    ],
    dependencies: [
      "customHeader - Required when enabled"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "customHeader",
    description: "React node to render as a custom table header. Receives table state props when function component. Useful for global filters, table titles, or action buttons. Styled to match table width and theme.",
    type: "React.ReactNode",
    required: false,
    usage: [
      `const CustomHeader = ({ tableState }) => (`,
      `  <div className="table-title">`,
      `    <h2>Sales Data</h2>`,
      `    <span>Showing {tableState.filteredCount} records</span>`,
      `  </div>`,
      `);`,
      `<ValidateAndGenerateTable customHeader={<CustomHeader />} />`
    ],
    dependencies: [
      "isCustomHeaderVisible - Must be enabled to display"
    ],
    validation: "Must be provided when isCustomHeaderVisible is true"
  },
  {
    key: "onRowSelection",
    description: "Callback triggered when row selection changes. Provides all currently selected rows and the most recently changed row. Essential for implementing bulk actions or detail views based on selection.",
    type: "(selectedRows: any[], changedRow: any) => void",
    required: false,
    usage: [
      `const handleSelection = (selected, changed) => {`,
      `  setSelectedItems(selected);`,
      `  if (changed) fetchDetails(changed.id);`,
      `};`,
      `<ValidateAndGenerateTable onRowSelection={handleSelection} />`
    ],
    dependencies: [
      "isRowSelectionAllowed - Must be enabled for selection"
    ],
    validation: "Must be a function accepting two arguments when provided"
  },
  {
    key: "transFormationObject",
    description: "Array of transformation rules for conditional styling and formatting. Each rule specifies conditions, target columns, and style/format modifications. Evaluated in order with later rules overriding earlier ones. Powerful for data visualization.",
    type: "Array<Transformation>",
    required: false,
    usage: [
      `const transformations = [{`,
      `  condition: "value > 100",`,
      `  apply_on: ["sales"],`,
      `  style: { backgroundColor: "#ffebee" }`,
      `}];`,
      `<ValidateAndGenerateTable transFormationObject={transformations} />`
    ],
    notes: [
      "Conditions can be string expressions or functions",
      "Apply to specific columns or 'all'",
      "Supports both style and format transformations"
    ],
    validation: "Must be an array when provided"
  },
  {
    key: "externalStyle",
    description: "Custom CSS styles applied to the table's outermost container. Useful for positioning, margins, or overriding default styling. Merged with internal styles with precedence given to externalStyle properties.",
    type: "React.CSSProperties",
    required: false,
    usage: [
      `<ValidateAndGenerateTable `,
      `  externalStyle={{ `,
      `    margin: '20px 0', `,
      `    border: '1px solid #eee' `,
      `  }} `,
      `/>`
    ],
    validation: "Must be a valid style object when provided"
  },
  {
    key: "canDoubleClick",
    description: "Enables double-click interaction on table rows. Requires handleDoubleClick callback to implement behavior. Useful for quick editing or detail viewing. Distinct from single-click selection.",
    type: "boolean",
    default: "false",
    usage: [
      `const handleDoubleClick = (row) => openEditor(row);`,
      `<ValidateAndGenerateTable `,
      `  canDoubleClick={true} `,
      `  handleDoubleClick={handleDoubleClick} `,
      `/>`
    ],
    dependencies: [
      "handleDoubleClick - Required when enabled"
    ],
    validation: "Must be boolean when provided"
  },
  {
    key: "handleDoubleClick",
    description: "Callback function triggered when a row is double-clicked. Receives the complete row data object. Use for quick actions like editing, previewing, or navigation.",
    type: "(rowData: any) => void",
    required: false,
    usage: [
      `const handleDoubleClick = (row) => {`,
      `  setCurrentItem(row);`,
      `  showDetailModal();`,
      `};`,
      `<ValidateAndGenerateTable `,
      `  handleDoubleClick={handleDoubleClick} `,
      `  canDoubleClick={true} `,
      `/>`
    ],
    dependencies: [
      "canDoubleClick - Must be enabled for double-click events"
    ],
    validation: "Must be a function when canDoubleClick is true"
  },
  {
    key: "handleDisable",
    description: "It is function that can be used if you want to disable click operations of any cell based on some condition. Whether it can be disableing the selct box, or any button  or icon ",
    type: "Function that takes complete row data item, row index, type, column item, and value as arguments and returns a boolean",
    required: false,
    usage: [
      ` const handleDisable = (
    rowItem: any,
    rowIndex: number,
    type: any,
    columnItem?: any,
    value?: any,

  ): boolean => {
    // any condition to disable the row

    // return Math.random() > 0.5 ? false : true;
    return rowIndex % 2 === 0 ? false : true;

    <ValidateAndGenerateTable 
    ..rest of the props
    handleDisable={handleDisable} 
    />
  };`
    ],
    validation: "Must be a valid function when provided"
  }
];