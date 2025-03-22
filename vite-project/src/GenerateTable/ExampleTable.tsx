import { useState, useEffect, useRef } from 'react'
import GenerateTable, { TextInputRef } from "./GenerateTable";
import { Column } from "./types";
import ValidateAndGenerateTable from './ValidateAndGenerateTable';


const ExampleTable = () => {


  const isAdvacnedFilter = true;
  const handleMax = (columnKey: string, data: any[]) => {
    const validValues = data
      .map(item => item[columnKey])
      .filter(value => value !== null && value !== undefined && value !== "" && !isNaN(value))
      .map(Number);
    return validValues.length ? Math.max(...validValues) : null; // Return null if no valid values
  };
  // const [currentItem, setCurrentItem] = useState(null);
  // const handleClickONComponent = (item: any) => {
  //   // console.log(item, "itemmmm");
  //   setCurrentItem(item);
  // }
  const localRef = useRef<TextInputRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  //while redefining filter 
  //1.add a filtertype key : string, checkbox, number , date
  //2. can add a optional filter  content key  which will have custom content for filter 
  //3.add a  global key for client side or server side filter, which will return an object 
  //with columnName : [values] type of object user can mamnipulate it based on its needs to send in the api 
  //while applying filter form serverside user will add a filter button on his side
  //with a fucntion attached to it inside which it will call , localref?.current?.getFilterObject()
  //that will return the filter objet according to which the data will get changed,  while sending 
  //and manipulating that object to the api , the new data will then get set using setData
  //this way  the user can get the filter object and manipulate it according to his needs whenever he wants
  //also u can make a fuxntion for getselected rows which will give the selected rows at that time 
  // localref?.current?.getSelectedRows(), 


  const dummyColumns: Column[] = [
    {
      key: "id", name: "ID", type: "number", visible: true, filter: true, sorting: true,
      aggregateFunction: {
        visible: true,
        function: "count",

      }
    },
    {
      key: "name", name: "Name", type: "unusual_string2", visible: true, filter: true, sorting: true,
      isEditable: true,
      //  filterContent: ["User 1", "User 2", "User 3"]
    },
    {
      key: "age", name: "Age", type: "number", visible: true, filter: true,sorting: true,
      aggregateFunction: {
        visible: true,
        function: "custom",
        title: "Maxxxxx",
        customFunction: handleMax
      }
    },
    { key: "status", name: "Status", type: "component", visible: true, sorting: true, filter: "string" },
    { key: "createdAt", name: "Created At", type: "date", visible: true, filter: true },
    { key: "amount", name: "Amount", type: "number", visible: true, filter: true },
    {
      key: "action",
      name: "Action",
      type: "button",
      visible: true,
      buttonName: "Click Me",
      action: (item) => (
        localRef?.current?.rowExpand(item?.id )
      )
    },
    {
      key: "component",
      name: "Component",
      type: "component",
      visible: true,
     
    },
    {
      name:"Delete",
      key:"delete",
      type:"icon",
      visible:true,
      action: (item) => (
       alert(item?.id)
      )
    }

  ];
  const dummyColumns2: Column[] = [
    {
      key: "id", name: "ID", type: "number", visible: true, filter: true, sorting: true,
      aggregateFunction: {
        visible: true,
        function: "count",

      }
    },
    {
      key: "name", name: "Name", type: "checkbox", visible: true, filter: true, sorting: true,
      isEditable: true,
      //  filterContent: ["User 1", "User 2", "User 3"]
    },
    {
      key: "age", name: "Age", type: "number", visible: true, filter: true,sorting: true,
      aggregateFunction: {
        visible: true,
        function: "custom",
        title: "Maxxxxx",
        customFunction: handleMax
      }
    },
    { key: "status", name: "Status", type: "component", visible: true, sorting: true, filter: "checkbox"
     },
    { key: "createdAt", name: "Created At", type: "date", visible: true, filter: true , sorting: true},
    { key: "amount", name: "Amount", type: "number", visible: true, filter: true },
    {
      key: "action",
      name: "Action",
      type: "button",
      visible: true,
      buttonName: "Click Me",
      action: (item) => (
        localRef?.current?.rowExpand(item?.id )
      )
    },
    {
      key: "component",
      name: "Component",
      type: "component",
      visible: true,
     
    },
    {
      name:"Delete",
      key:"delete",
      type:"icon",
      visible:true,
      action: (item) => (
       alert(item?.id)
      )
    }

  ];
  //   const componentItem = (item: any) => ({
  //     data: Math.floor(Math.random() * 100),
  //     displayData: (
  //         <div
  //             style={{
  //                 marginTop: "8px",
  //                 display: "flex",
  //                 gap: "10px",
  //                 alignContent: "center",
  //                 alignItems: "center",
  //             }}
  //         >
  //             <button
  //                 onClick={() => {
  //                     console.log(item, "clicked in Yes", "currentItem");
  //                     handleClickONComponent(item); // Update state if needed
  //                 }}
  //                 style={{
  //                     backgroundColor: "#28a745",
  //                     color: "white",
  //                     border: "none",
  //                     padding: "6px 12px",
  //                     borderRadius: "5px",
  //                     cursor: "pointer",
  //                     fontWeight: "bold",
  //                 }}
  //             >
  //                 Yes
  //             </button>
  //             <button
  //                 onClick={() => {
  //                     console.log(item, "clicked in No", "currentItem");
  //                     handleClickONComponent(item); // Update state if needed
  //                 }}
  //                 style={{
  //                     backgroundColor: "#dc3545",
  //                     color: "white",
  //                     border: "none",
  //                     padding: "6px 12px",
  //                     borderRadius: "5px",
  //                     cursor: "pointer",
  //                     fontWeight: "bold",
  //                 }}
  //             >
  //                 No
  //             </button>
  //         </div>
  //     ),
  // });


  // const dummyData = Array.from({ length: 50 }, (_, index) => {
  //   const isOpen = index % 2 === 0; // Alternate between "Open" and "Closed"
  
  //   return {
  //     id: index + 1,
  //     name: `User ${index + 1}`,
  //     age: 20 + (index % 30), // Randomized age between 20-50
  //     status: {
  //       data: isOpen ? "Open" : "Closed",
  //       displayData: (
  //         <div
  //           className={`d-inline-block px-3 py-1 rounded-pill fw-bold text-uppercase ${
  //             isOpen ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
  //           }`}
  //         >
  //           {isOpen ? "Open" : "Closed"}
  //         </div>
  //       ),
  //     },
  //     component: {
  //       data: Math.floor(Math.random() * 100),
  //       displayData: (item: any) => (
  //         <div className="mt-2 d-flex gap-2 justify-content-center align-items-center">
  //           <button
  //             onClick={() => handleAction(item, "Yes")}
  //             className="btn btn-success fw-bold px-3 py-1"
  //           >
  //             Yes
  //           </button>
  //           <button
  //             onClick={() => handleAction(item, "No")}
  //             className="btn btn-danger fw-bold px-3 py-1"
  //           >
  //             No
  //           </button>
  //         </div>
  //       ),
  //     },
  //     createdAt: `202${Math.floor(Math.random() * 5)}-${String(
  //       Math.floor(Math.random() * 12) + 1
  //     ).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`, // Randomized dates from 2020-2024
  //     amount: Math.floor(Math.random() * 3000) + 500, // Randomized amount between 500-3500
  //   };
  // });
  
  // Action handler function
  
  const generateDummyData = (dataLength: number) => {
    return Array.from({ length: dataLength  }, (_, index) => {
      const isOpen = index % 2 === 0;
      return {
        id: index + 1,
        name: `User ${index + 1}`,
        age: 20 + (index % 30),
        status: {
          data: isOpen ? "Open" : "Closed",
          displayData: (
            <div
              className={`d-inline-block px-3 py-1 rounded-pill fw-bold text-uppercase ${
                isOpen ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
              }`}
            >
              {isOpen ? "Open" : "Closed"}
            </div>
          ),
        },
        component: {
          data: Math.floor(Math.random() * 100),
          displayData: (item: any) => (
            <div className="mt-2 d-flex gap-2 justify-content-center align-items-center">
              <button
                onClick={() => handleAction(item, "Yes")}
                className="btn btn-success fw-bold px-3 py-1"
              >
                Yes
              </button>
              <button
                onClick={() => handleAction(item, "No")}
                className="btn btn-danger fw-bold px-3 py-1"
              >
                No
              </button>
            </div>
          ),
        },
        createdAt: `202${Math.floor(Math.random() * 5)}-${String(
          Math.floor(Math.random() * 12) + 1
        ).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        amount: Math.floor(Math.random() * 3000) + 500,
      };
    });
  }
  const [count , setCount] = useState(10);
  const [dummyData, setDummyData] = useState(generateDummyData(10));

  const regenerateData = () => {

    setCount(prev => prev + 1);
     // Ensure a new reference
  };

  useEffect(() => {
    setDummyData([...generateDummyData(count)]); // Ensuring a new reference
   

  }, [count]);
  
  const handleAction = (item: any, action: string) => {
    if(action == "Yes"){
      localRef?.current?.rowExpand(item?.id);
    }
    if(action == "No"){
      localRef?.current?.rowExpand(null);
    }
    console.log(`Item ID: ${item.id}, Name: ${item.name}, Action: ${action}`);
    // Perform additional actions here...
  };
  const handleEdit = async (item: any, column: any, newValue: any) => {
    console.log(`Item ID: ${item.id}, Name: ${column?.name}, Action: ${newValue}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% chance of success, 30% failure
        resolve(success);
      }, Math.random() * 1000 + 2000); // Delay between 2-3 seconds
    });
    

  };
  const [dataColumns, setDataColumns] = useState<Column[]>(dummyColumns);
  const [expandedRowItem, setExpandedRowItem] = useState<any>(null);
  const [expandedRowColumns, setExpandedRowColumns] = useState<Column[]>();
  const handleExpandedRow = (item: any, columns: Column[]) => (

    setExpandedRowItem(item),
    setExpandedRowColumns(columns),
    console.log(expandedRowItem, expandedRowColumns, "expandedRowItem")
  );
  const ExpandedRowComponent: React.FC<{ item: any; columns: Column[] }> = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Simulating API call delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // Adjust delay time as needed

      return () => clearTimeout(timer);
    }, []);



    return (
      <div >
        {isLoading ? (
          // Bootstrap loader while waiting
          <div className="d-flex justify-content-center align-items-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-white border rounded shadow-sm">
            <h6 className="text-secondary">Related Data</h6>
            <GenerateTable
              Data={dummyData}
              DataColumns={dataColumns}
              setDataColumns={setDataColumns}
              isPaginationAllowed={true}
              enableDragandDrop={true}
              isScrollAllowed={true}
              isStickyHeaderEnabled={true}
              ExpandedRowComponent={ExpandedRowComponent}
              handleExpandedRow={handleExpandedRow}
            />
          </div>
        )}
      </div>
    );
  };
  const customRowStyle = (index: number) => {

    if (index % 2 == 0) {
      return "table-row-primary"
    }
    else {
      return "table-row-secondary"
    }

  }
  
 
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const closeModal = () => {
    setSelectedItem(null);
  };
  const handleClick = (item: any) => {
    setSelectedItem(item);
  };
  const [expandedItem, setExpandedItem] = useState<any>(null);
  const handleDoubleClick = (item: any) => {
    console.log(item, expandedItem, "itemmmm");
    if (expandedItem?.id == item?.id) {
      setExpandedItem(null);
      //closing the expanded row
      localRef?.current?.rowExpand(null);
      return;
    }
    localRef?.current?.rowExpand(item?.id);
    setExpandedItem(item);
  }
  const eventList = {
    onClick: handleClick,
    onDoubleClick: handleDoubleClick
  }
  const getSelectedRows = () =>{
    console.log(localRef?.current?.getSelectedRows(), "rows")
  }
  const getSelectedFilterItems = () => {
    let filterItems = localRef?.current?.getFilterItems();
    console.log(filterItems, "filterItems");
    
    setIsLoading(true);

    setTimeout(() => {
        setIsLoading(false);
    }, filterItems && Object.keys(filterItems).length === 0 ? 1000 : 3000);
};

  return (
    <>
      <h1 className="text-center text-primary my-4">React Table </h1>
      <button className="btn btn-primary me-2" onClick={() => localRef.current?.rowExpand(4)}>
        <i className="bi bi-play-fill"></i> Start
      </button>
      <button className="btn btn-danger" onClick={() => localRef.current?.rowExpand(null)}>
        <i className="bi bi-stop-fill"></i> Stop
      </button>
      <div className="border rounded p-3 bg-white m-5 gap-2 p-4">
      <button className="btn btn-primary mb-3" onClick={regenerateData}>
        Refresh Data
      </button>    
      <button className="btn btn-primary mb-3 me-2 gap-2" onClick={getSelectedRows}>
        Get Selected rows
      </button>
      <button className="btn btn-primary mb-3 me-2 gap-2" onClick={getSelectedFilterItems}>
        Get Filter items
      </button>      
      <ValidateAndGenerateTable
        key={count}
        Data={dummyData} 
        DataColumns={isAdvacnedFilter ? dummyColumns2 : dataColumns}
        setDataColumns={setDataColumns}
        isHiddenColumnsAllowed={true}
        isPaginationAllowed={true}
        isSearchAllowed={true}
        enableDragandDrop={true}
        isScrollAllowed={true}
        isFullScreenAllowed={true}
        canDownloadData={true}
        canResizeRows={true}
        isStickyHeaderEnabled={false}
        ExpandedRowComponent={ExpandedRowComponent}//not required after refferences
        handleExpandedRow={handleExpandedRow}//not required after refferences
        handleEdit={handleEdit}
        canExpandRow={true}//not required after refferences
        isCustomRowStyle={true}
        customRowStyle={customRowStyle}
        isRowSelectionAllowed={true}
        virtualization={false}
        ref={localRef}
        eventList={eventList}
        isLoading={isLoading}
        sorting = {"single"}
        filterType = {isAdvacnedFilter ? "advanced" : "simple"}
      />    
      {selectedItem && (
        <div
          className="position-absolute bg-white border rounded shadow p-3"
          style={{
            transform: "translate(-50%, -50%)",
            zIndex: 1050,
          }}
        >
          <h5 className="mb-3">Row Details</h5>
          <p>Modal: {selectedItem.name}</p>
          <button className="btn btn-primary w-100" onClick={closeModal}>
            Close
          </button>
        </div>
      )}
    </div>
    </>
  )
}

export default ExampleTable
