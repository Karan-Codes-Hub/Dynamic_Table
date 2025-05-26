# GenerateTable Component Documentation

The `GenerateTable` component is a highly customizable and feature-rich table component built using React. It supports various functionalities such as sorting, filtering, pagination, column resizing, drag-and-drop column reordering, and more. Below is a comprehensive guide to help developers understand and use this component effectively.

---

## Table of Contents
1. [Features](#1-features)
2. [Props](#2-props)
3. [State Management](#3-state-management)
4. [Methods](#4-methods)
5. [Styling](#5-styling)
6. [Usage](#6-usage)
7. [Notes](#9-notes)

---

## 1. Features

- **Search**: Allows users to search across the table data.
- **Sorting**: Supports sorting by column values (ascending/descending).
- **Filtering**: Enables filtering by column values (e.g., string, number, date, etc.).
- **Pagination**: Supports pagination for large datasets.
- **Rows Resizing**: Allows users to resize rows dynamically.
- **Drag-and-Drop Column Reordering**: Columns can be reordered via drag-and-drop.
- **Customizable Styling**: Supports custom CSS classes and styles.
- **Fullscreen Mode**: Toggle between fullscreen and normal view.
- **Download Data**: Export table data as CSV or Excel.
- **Aggregate Functions**: Display aggregate values (sum, average, min, max, count) for numeric columns.
- **Highlighting**: Apply conditional styling to rows or cells based on custom rules.
- **Column Resizing**: Resize columns dynamically.
- **Hidden Columns Allowed**: Toggle the visibility of columns that are being shown 

---

## 2. Props

The `GenerateTable` component accepts the following props:

| Prop Name               | Type                      | Description                                                                 |
|-------------------------|---------------------------|-----------------------------------------------------------------------------|
| `isfilterAllowed`        | `boolean`                 | Enables/disables filtering functionality.                                   |
| `isHiddenColumnsAllowed` | `boolean`                 | Allows users to hide/show columns dynamically.                              |
| `enableDragandDrop`      | `boolean`                 | Enables drag-and-drop column reordering.                                    |
| `isPaginationAllowed`    | `boolean`                 | Enables/disables pagination.                                                |
| `isScrollAllowed`        | `boolean`                 | Enables horizontal/vertical scrolling for the table.                        |
| `isSearchAllowed`        | `boolean`                 | Enables/disables the search functionality.                                  |
| `canDoubleClick`         | `boolean`                 | Enables double-click functionality on rows.                                 |
| `handleDoubleClick`      | `(item: any, columns: Column[]) => void` | Callback function triggered on row double-click.                     |
| `Data`                   | `any[]`                   | The data to be displayed in the table.                                      |
| `DataColumns`            | `Column[]`                | Configuration for table columns (see `Column` type below).                  |
| `setDataColumns`         | `(columns: Column[]) => void` | Function to update column configuration.                              |
| `externalStyle`          | `string`                  | Custom CSS class for the table container.                                   |
| `isFullScreenAllowed`    | `boolean`                 | Enables/disables fullscreen mode.                                           |
| `canDownloadData`        | `boolean`                 | Enables/disables data download functionality (CSV/Excel).                   |
| `canResizeRows`          | `boolean`                 | Enables/disables row resizing functionality.                                |

---

## 3. State Management

The component manages the following internal states:

| State Name               | Type                      | Description                                                                 |
|--------------------------|---------------------------|-----------------------------------------------------------------------------|
| `initialData`            | `any[]`                   | Original dataset before any filtering or sorting.                           |
| `filteredData`           | `any[]`                   | Dataset after applying filters.                                             |
| `data`                   | `any[]`                   | Dataset currently displayed in the table (after filtering, sorting, etc.).  |
| `currentPage`            | `number`                  | Current page number for pagination.                                         |
| `itemsPerPage`           | `number`                  | Number of items to display per page.                                        |
| `checkedItems`           | `CheckedItems`            | Stores checked items for filtering.                                         |
| `sortOrder`              | `{ [key: string]: string }` | Stores sorting order for each column.                                     |
| `activeSortColumn`       | `Column \| null`          | Currently active column for sorting.                                        |
| `searchTerm`             | `string`                  | Search term for filtering data.                                             |
| `isFullScreen`           | `boolean`                 | Tracks whether the table is in fullscreen mode.                             |
| `variableSize`           | `number`                  | Tracks the current row height setting (small, medium, large).               |
| `isColumnModalOpen`      | `boolean`                 | Tracks whether the column modal is open.                                    |
| `isModalVisible`         | `boolean`                 | Tracks whether the filter modal is visible.                                 |
| `activeColumn`           | `string \| null`          | Currently active column for filtering.                                      |
| `columnWidths`           | `{ [key: string]: number }` | Stores the width of each column.                                         |
| `rowHeights`             | `{ [key: number]: number }` | Stores the height of each row.                                           |

---

## 4. Methods

### Key Methods

| Method Name               | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `handleSearchValueChange` | Updates the search term and filters the data accordingly.                   |
| `handleSortIconClick`     | Handles column sorting (ascending/descending).                              |
| `handleCheckboxChange`    | Updates the checked items for filtering.                                    |
| `handleClearFilter`       | Clears the filter for a specific column.                                    |
| `handleDownload`          | Exports table data as CSV or Excel.                                         |
| `toggleFullScreen`        | Toggles fullscreen mode for the table.                                      |
| `changeSize`              | Changes the row height (small, medium, large).                              |
| `handleColumnDragEnd`     | Handles column reordering after drag-and-drop.                              |
| `handleTransFormation`    | Applies conditional styling to rows or cells.                               |

---

## 5. Styling

The component uses a combination of Bootstrap classes and custom CSS. You can override the default styles by providing your own CSS classes via the `externalStyle` prop.

### Custom CSS Classes

- **Table Container**: `.tableContainer`
- **Search Box**: `.searchBox`
- **Action Buttons**: `.downloadBtn`, `.fullScreenBtn`
- **Column Headers**: `.columnName`, `.column`
- **Rows**: `.tr`, `.td`
- **Modals**: `.modal`, `.modalContent`

---

## 6. Usage

### Basic Usage

```jsx
import React from 'react';
import GenerateTable from './GenerateTable';

const data = [
    { id: 1, name: 'John Doe', age: 28, status: 'Active' },
    { id: 2, name: 'Jane Smith', age: 34, status: 'Inactive' },
];

const columns = [
    { key: 'id', name: 'ID', type: 'number', visible: true },
    { key: 'name', name: 'Name', type: 'string', visible: true },
    { key: 'age', name: 'Age', type: 'number', visible: true },
    { key: 'status', name: 'Status', type: 'string', visible: true },
];

const App = () => (
    <GenerateTable
        Data={data}
        DataColumns={columns}
        isfilterAllowed={true}
        isHiddenColumnsAllowed={true}
        enableDragandDrop={true}
        isPaginationAllowed={true}
        isSearchAllowed={true}
        canDoubleClick={true}
        handleDoubleClick={(item) => console.log('Double-clicked:', item)}
    />
);

export default App;
```

###  Usage for candoubleclick on the row 
Sometimes you need to  display some infromation on doubleclick of the row , so you can pass canDoubleClick key true , but with that you also need to pass the  handledoubleclick function with it , with boundation that it must be expexting **item** as a parameter so that whenever the user clicks on the sepecific row you can get complete data of that row 

```jsx

const handleClickBrowerInvoice = async (item) => {
  try {
    setViewInvoiceLoader(true);
    await fetchViewInvoice(item?.clientIDforborrower.data?.['client-id']); 
    setIsViewInvoiceOpen(true);
  } catch (error) {
    console.error("Error in handleClickBrowerInvoice:", error);
  } finally {
    setViewInvoiceLoader(false);
  }
};
 <GenerateTable
     Style3={Style}
     Data={borrowerData}
     DataColumns={columns}
     isfilterAllowed={false}
     handleDoubleClick={handleClickBrowerInvoice}
     isHiddenColumnsAllowed={false}
     setDataColumns={setColumns}
     canDoubleClick={true}
     isPaginationAllowed={false}
     isScrollAllowed={true}
     isSearchAllowed={false}
     enableDragandDrop={false}
/>
```
You can see how it is getting used in the above code snippet and how you can perform different operations based on double click on partiucular row 

###  Usage for Aggregate function and Actions(Button or Icon)
There are toe cases either you can use some predefined functions , like: sum, max, min, count,average
You need to specify in which column you want to use aggregate function .
Or you can pass a different aggregate function according to your usuage but with that you also need to provide
the titrle for that aggregate function you have passed and also pas the function for the respective column 
below is the implementation of both cases

```jsx
import React from 'react';
import GenerateTable from './GenerateTable';


function App() {
  const handleMax = (columnKey: string, data: any[]) => {
    const validValues = data
      .map(item => item[columnKey])
      .filter(value => value !== null && value !== undefined && value !== "" && !isNaN(value))
      .map(Number);
    return validValues.length ? Math.max(...validValues) : null; // Return null if no valid values
  };

  const dummyColumns: Column[] = [
    {
      key: "id", name: "ID", type: "number", visible: true,
      aggregateFunction: {
        visible: true,
        function: "sum"
      }
    },
    {
      key: "name", name: "Name", type: "string", visible: true,
    },
    {
      key: "age", name: "Age", type: "number", visible: true,
      aggregateFunction: {
        visible: true,
        function: "custom",
        title: "Maxx",
        customFunction: handleMax
      }
    },
    { key: "status", name: "Status", type: "boolean", visible: true },
    { key: "createdAt", name: "Created At", type: "date", visible: true },
    { key: "amount", name: "Amount", type: "number", visible: true }, 
    {
      key: "action",
      name: "Action",
      type: "button",
      visible: true,
      buttonName: "Click Me",
      action: (item) => alert(`Clicked on ${item.name}`)
    }
  ];
const dummyData = [
    { id: 1, name: "John Doe", age: 28, status: true, createdAt: "2024-01-15", amount: 500 },
    { id: 2, name: "Jane Smith", age: 32, status: false, createdAt: "2023-12-20", amount: 1500 },
    { id: 3, name: "Alice Johnson", age: 25, status: true, createdAt: "2022-10-05", amount: 1200 },
    { id: 4, name: "Michael Brown", age: 40, status: false, createdAt: "2021-06-30", amount: 2000 },
    { id: 5, name: "Emily Wilson", age: 22, status: true, createdAt: "2023-02-18", amount: 900 },
    { id: 6, name: "Daniel Martinez", age: 35, status: false, createdAt: "2020-11-22", amount: 1300 },
    { id: 7, name: "Sophia Lee", age: 29, status: true, createdAt: "2024-04-10", amount: 700 },
    ];
    
     return (
    <>

      <h1 className="text-center text-primary my-4">React Table </h1>

      <GenerateTable
        Data={dummyData}
        DataColumns={dataColumns}
        setDataColumns={setDataColumns}
        isfilterAllowed={true}
        isHiddenColumnsAllowed={true}
        isPaginationAllowed={true}
        isSearchAllowed={true}
        enableDragandDrop={true}
        isScrollAllowed={true}
        isFullScreenAllowed={true}
        canDownloadData={true}
        canResizeRows={true}

      />



    </>
  )
}

export default App
```
as you can see in the above code snippet the usuage of aggregate functions , also if  you take close look at the dummycolumns array, you can also pass a button as a colu8mn with thatv you need to pass the name of the button and the function you want to use when user will click on the button, the boundationj is that whatever function you pass must accept a argument **item** as whenever the user wil click on the button you will get all the items of that row for further use case



**Important Point**
As you will see than various types of column are already covered and styles are mostly as required but you are not bounded , as if you want you can  modify your data taht you are passing in the component , and whereever you want to display the component you desired , set type of that column as component and you can easily render the component you want with wahtever style you pass in the compomnent 


```jsx
const [columns, setColumns] = useState([
  { name: 'Status', key: 'status', visible: true, type: "string" },
  { name: 'Name', key: 'name', visible: true, type: "string" },
  { name: 'Pan', key: 'pan', visible: true, type: "string" },
  { name: 'Sanctioned Limit', key: 'proposedLimit', visible: true, type: "number" },
  { name: 'Utilized Limit', key: 'utilizedLimit', visible: true, type: "number" },
  { name: 'Vintage', key: 'vintage', visible: ['2', '3'].includes(Portfolio_id), type: "number" },
  { name: 'Download SOA', key: 'downloadSoa', visible: facilityDataForBorrower?.type === 3 || facilityDataForBorrower?.type === 4, type: "component" },
  { name: 'Related Party Status', key: 'relatedPartyStatus', visible: true, type: "component" },
  { name: 'Related Party check', key: 'relatedPartyCheck', visible: true, type: "component" },
  { name: 'View/Edit', key: 'viewEdit', visible: true, type: "component" },
]);



///////
 return {
              status: matchingLmsData?.limitStatus || null,
              name: item["company-detail"]?.name || null,
              pan: item["company-detail"]?.pan || null,
              proposedLimit: item?.['proposed-limit'] || null,
              utilizedLimit: matchingLmsData?.utilizedLimit || null,
              vintage: item["related-detail"]?.vintage || null,
              downloadSoa: (
                  <Tooltip
                      title={item?.["company-detail"]?.["data"]?.['client-id'] ? "" : "Client ID not found"}
                      arrow
                  >
                      <span>
                          {item?.["company-detail"]?.["data"]?.['client-id'] ? (
                              <DownloadIcon
                                  className={Style.SoaStyle}
                                  onClick={() => handleClickDownloadSOA(item?.["company-detail"]?.data?.["client-id"])}
                              />
                          ) : (
                              <DownloadIcon
                                  style={{ cursor: "not-allowed", color: "gray" }}
                              />
                          )}
                </span>
              </Tooltip>
            ),
            relatedPartyStatus: (
              <>
                {
                  item?.["related-party"]?.data &&
                  Object?.keys(item?.["related-party"]?.data).map((key, index) => {

                    return (
                      <div key={index}>
                        {(item?.["related-party"]?.data?.[key]?.status)?.includes('Manual Check Required') ? <p className={Style.manualCheckcolor}>{item?.["related-party"]?.data?.[key]?.status}</p> :
                          (item?.["related-party"]?.data?.[key]?.status) === ('Related') ? <p className={Style.relatedColor}>{item?.["related-party"]?.data?.[key]?.status}</p> :
                            (item?.["related-party"]?.data?.[key]?.status) === ('Not Related') ? <p className={Style.notRelatedColor}>{item?.["related-party"]?.data?.[key]?.status}</p> :
                              (item?.["related-party"]?.data?.[key]?.status) === ('Check Not Needed') ? <p className={Style.checkNotNeeded}>{item?.["related-party"]?.data?.[key]?.status}</p> :
                                <p>{item?.["related-party"]?.data?.[key]?.status}</p>}
                      </div>
                    );
                  }
                  )
                }
              </>
            ),
            clientIDforborrower: item?.['company-detail'],
            relatedPartyCheck: (
              <button className={Style.buttonRelatedParty} onClick={() => handleClickRelatedPartiesCheck(item)}>
                View
              </button>
            ),
            viewEdit: (
              <Box onClick={(e) => handleClickStartupDetail(e, item)}>
                <Image src={ViewEdit} width={20} height={20} alt="View/Edit" />
                  </Box>
              ),
          };
/////
```
as you can see the data was not coming direct so you neede to modify the data so that it can be passed directly all at once, in the above code a newdata taht is needed to be apssed is being formed by combining data 
from different api or locations also you can see a complete component is getting passed against a key in the data[with column type of that column as component] so that you can display the component of any type or style you want .


## 7. Notes

1.Ensure that the Data and DataColumns props are properly structured to avoid rendering issues.

2.Also ensure that whatever data you are passing have the associated key that you are passing with column 

3.While using it check whether you have passed true for the particular features[props] you want in the table, description of all props are given above for reference 




