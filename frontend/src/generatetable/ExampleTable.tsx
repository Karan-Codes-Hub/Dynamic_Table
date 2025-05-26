import { useState, useEffect, useRef } from 'react';
import { Column } from "./types";
import ValidateAndGenerateTable from './ValidateAndGenerateTable';
import { tablePropsList } from '../json';
import readmeContent from './Readme.md?raw';
import { marked } from 'marked';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';


const ExampleTable = () => {
  const localRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(50);

  const [dataColumns, setDataColumns] = useState<Column[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [expandedItem, setExpandedItem] = useState<any>(null);
  const [isAdvancedFilter, setIsAdvancedFilter] = useState(false);

  const [showReadme, setShowReadme] = useState(false);
  const [activeTab, setActiveTab] = useState<any>('documentation');
  const [selectedKey, setSelectedKey] = useState<any>(tablePropsList[0]?.key || null);
  const [isCopied, setIsCopied] = useState(false);

  // Sober header with subtle styling
  const HEADING_FORMAT = (
    <div className="d-flex align-items-center gap-3 p-3 border-bottom">
      <i className="bi bi-table text-muted fs-4"></i>
      <div className="m-0 text-dark fw-semibold fs-5">
        Customer Management
      </div>
    </div>
  );


  // Subtle aggregate functions
  const handleMax = (columnKey: string, data: any[]) => {
    const validValues = data
      .map(item => item[columnKey])
      .filter(value => value !== null && value !== undefined && value !== "" && !isNaN(value))
      .map(Number);

    const result = validValues.length ? Math.max(...validValues) : null;

    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <span className="small">Max:</span>
        <span className="fw-semibold">${result?.toLocaleString()}</span>
      </div>
    );
  };

  const handleMin = (columnKey: string, data: any[]) => {
    const validValues = data
      .map(item => item[columnKey])
      .filter(value => value !== null && value !== undefined && value !== "" && !isNaN(value))
      .map(Number);

    const result = validValues.length ? Math.min(...validValues) : null;

    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <span className="small">Min:</span>
        <span className="fw-semibold">${result?.toLocaleString()}</span>
      </div>
    );
  };

  const handleAvg = (columnKey: string, data: any[]) => {
    const validValues = data
      .map(item => item[columnKey])
      .filter(value => value !== null && value !== undefined && value !== "" && !isNaN(value))
      .map(Number);

    const sum = validValues.reduce((a, b) => a + b, 0);
    const result = validValues.length ? (sum / validValues.length).toFixed(2) : null;

    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <span className="small">Avg:</span>
        <span className="fw-semibold">${result}</span>
      </div>
    );
  };

  // Clean column definitions
  const basicColumns: Column[] = [
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
    // {
    //   key: "age",
    //   name: "Age",
    //   type: "number",
    //   visible: true,
    //   filter: true,
    //   sorting: true,
    //   aggregateFunction: {
    //     // visible: true,
    //     // function: "custom",
    //     // title: "Age Analysis",
    //     // customFunction: handleMax
    //     visible: true,
    //     function: "max",
    //     title: "Total Records"
    //   }
    // },
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
      filter: true,
      sorting: true,
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
  ];


  const advancedColumns: Column[] = [
    ...basicColumns.slice(0, -1), // Take all except last column
    {
      key: "status",
      name: "Status",
      type: "component",
      visible: true,
      filter: "checkbox",
      sorting: true,
    },
    ...basicColumns.slice(-1) // Add back the last column
  ];

  // Generate realistic customer data
  const generateCustomerData = (dataLength: number) => {
    const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "protonmail.com", "icloud.com"];
    const membershipLevels = ["Basic", "Silver", "Gold", "Platinum", "VIP"];
    const statuses = ["Active", "Inactive", "Pending", "Suspended", "Churned"];

    return Array.from({ length: dataLength }, (_, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const membership = membershipLevels[Math.floor(Math.random() * membershipLevels.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const joinYear = 2015 + Math.floor(Math.random() * 9);
      const joinMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      const joinDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");

      return {
        id: 100 + index,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
        age: 18 + Math.floor(Math.random() * 50),
        membership: {
          data: membership,
          displayData: (
            <span className={`badge ${getMembershipBadgeClass(membership)}`}>
              {membership}
            </span>
          )
        },
        status: {
          data: status,
          displayData: (
            <span className={`badge ${getStatusBadgeClass(status)}`}>
              {status}
            </span>
          )
        },
        joinedDate: `${joinYear}-${joinMonth}-${joinDay}`,
        lifetimeValue: Math.floor(Math.random() * 10000) + 500,
        lastPurchase: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        purchaseCount: Math.floor(Math.random() * 50) + 1
      };
    });
  };



  // Subtle styling helpers
  const getMembershipBadgeClass = (level: string) => {
    switch (level) {
      case "Basic": return "bg-light text-dark border";
      case "Silver": return "bg-light text-dark border";
      case "Gold": return "bg-light text-dark border border-warning";
      case "Platinum": return "bg-light text-dark border border-info";
      case "VIP": return "bg-light text-dark border border-primary";
      default: return "bg-light text-dark border";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active": return "bg-success bg-opacity-10 text-success";
      case "Inactive": return "bg-secondary bg-opacity-10 text-secondary";
      case "Pending": return "bg-warning bg-opacity-10 text-warning";
      case "Suspended": return "bg-danger bg-opacity-10 text-danger";
      case "Churned": return "bg-dark bg-opacity-10 text-dark";
      default: return "bg-secondary bg-opacity-10 text-secondary";
    }
  };

  // Action handlers
  const handleViewProfile = (item: any) => {
    setSelectedItem(item);
  };

  const handleEdit = async (item: any, column: any, newValue: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2;
        if (success) {
          setDummyData(prev => prev.map(customer =>
            customer.id === item.id ? { ...customer, [column.key]: newValue } : customer
          ));
        }
        resolve(success);
      }, 1000);
    });
  };

  // Data management
  const regenerateData = () => {
    setCount(prev => prev + 10);
  };

  const getSelectedFilterItems = () => {
    const filterItems = localRef?.current?.getFilterItems();
    console.log("Current filters:", filterItems);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const getSelectedRows = () => {
    const selectedRows = localRef?.current?.getSelectedRows();
    console.log("Selected rows:", selectedRows);
  };

  // Row styling
  const customRowStyle = (index: number, item: any) => {
    return index % 2 === 0 ? "bg-white" : "bg-light";
  };

  const handleClick = (item: any) => {
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
  };

  const handleRowSelection = (allSelectedRows: any[], currentRow: any) => {
    console.log("Selection changed:", { allSelectedRows, currentRow });
  };

  const handleDisable = (
    rowItem: any,
    rowIndex: number,
    type: any,
    columnItem?: any,
    value?: any,

  ): boolean => {
    // any condition to disable the row

    // return Math.random() > 0.5 ? false : true;
    return rowIndex % 2 === 0 ? false : true;
  };

  const [dummyData, setDummyData] = useState<any[]>(generateCustomerData(count));

  // Expanded row component
  const ExpandedRowComponent: React.FC<{ item: any; columns: Column[] }> = ({ item }) => {
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDetails({
          purchaseHistory: Array.from({ length: 3 }, (_, i) => ({
            id: `PH-${item.id}-${i}`,
            date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            amount: (Math.random() * 500 + 10).toFixed(2),
            items: Math.floor(Math.random() * 5) + 1,
            status: ['Completed', 'Shipped', 'Processing'][Math.floor(Math.random() * 3)]
          })),
          totalSpent: item.lifetimeValue,
          averageOrder: (item.lifetimeValue / item.purchaseCount).toFixed(2)
        });
        setLoading(false);
      }, 1200);

      return () => clearTimeout(timer);
    }, [item]);

    return (
      <div className="p-3 bg-body-tertiary border-top rounded-bottom">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-4">
            <div className="spinner-border text-primary" style={{ width: '1rem', height: '1rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Customer Info */}
            <div className="col-md-6">
              <div className="border rounded shadow-sm p-3 h-100 bg-white">
                <h6 className="text-primary fw-semibold mb-3 border-bottom pb-2">Customer Info</h6>
                <dl className="row small mb-0">
                  <dt className="col-sm-4 text-muted">Email</dt>
                  <dd className="col-sm-8">{item.email}</dd>

                  <dt className="col-sm-4 text-muted">Joined</dt>
                  <dd className="col-sm-8">{new Date(item.joinedDate).toLocaleDateString()}</dd>

                  <dt className="col-sm-4 text-muted">Last Purchase</dt>
                  <dd className="col-sm-8">{new Date(item.lastPurchase).toLocaleDateString()}</dd>
                </dl>
              </div>
            </div>

            {/* Purchase Summary */}
            <div className="col-md-6">
              <div className="border rounded shadow-sm p-3 h-100 bg-white">
                <h6 className="text-primary fw-semibold mb-3 border-bottom pb-2">Purchase Summary</h6>
                <dl className="row small mb-0">
                  <dt className="col-sm-4 text-muted">Total Spent</dt>
                  <dd className="col-sm-8">${item.lifetimeValue.toLocaleString()}</dd>

                  <dt className="col-sm-4 text-muted">Orders</dt>
                  <dd className="col-sm-8">{item.purchaseCount}</dd>

                  <dt className="col-sm-4 text-muted">Avg. Order</dt>
                  <dd className="col-sm-8">${details?.averageOrder}</dd>
                </dl>
              </div>
            </div>

            {/* Orders Table */}
            <div className="col-12">
              <div className="border rounded shadow-sm p-3 bg-white">
                <h6 className="text-primary fw-semibold mb-3 border-bottom pb-2">Recent Orders</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle mb-0">
                    <thead className="table-light text-nowrap">
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Date</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.purchaseHistory?.map((purchase: any) => (
                        <tr key={purchase.id}>
                          <td>{purchase.id}</td>
                          <td>{new Date(purchase.date).toLocaleDateString()}</td>
                          <td>${purchase.amount}</td>
                          <td>
                            <span className={`badge rounded-pill ${getStatusBadgeClass(purchase.status)}`}>
                              {purchase.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Initialize data and columns
  useEffect(() => {
    setDummyData(generateCustomerData(count));
    setDataColumns(isAdvancedFilter ? advancedColumns : basicColumns);
  }, [count, isAdvancedFilter]);

  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="d-flex" style={{
      height: '80vh',
      backgroundColor: '#f9fafb',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: "100%",
      overflowX: "hidden",
    }}>

      {/* Sidebar - Professional Design */}
      <div
        className="bg-white p-4 border-end custom-scrollbar"
        style={{
          width: '400px',
          minWidth: '320px',
          boxShadow: '0 0 24px rgba(0,0,0,0.03)',
          position: 'sticky',
          top: 0,
          overflowY: 'auto'
        }}
      >
        <div className="d-flex align-items-center mb-6">
          <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
            <i className="bi bi-table text-primary" style={{ fontSize: '1.5rem' }}></i>
          </div>
          <h5 className="text-dark mb-0 fw-semibold">Table Properties</h5>
        </div>



        <div className="mb-4">
          <div
            className={`d-flex align-items-center p-3 rounded-2 cursor-pointer transition-all ${showReadme ? 'bg-primary text-white' : 'bg-gray-50 hover-bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setShowReadme(true);
              setSelectedKey(null);
              setActiveTab('documentation');
            }}
            style={{ cursor: 'pointer',
              marginTop: '2rem',
             }}
          >
            <i className={`bi ${showReadme ? 'bi-file-earmark-text-fill' : 'bi-file-earmark-text'} me-3`}></i>
            <span className="fw-medium">Component Documentation</span>
          </div>
        </div>

        <div className="border-top pt-4">
          <h6 className="text-uppercase text-muted fw-semibold small mb-3">Configuration</h6>

          {/* Modern Search Bar */}
          <div className="mb-4 position-relative">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 ps-3 pe-2">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                placeholder="Search properties..."
                className="form-control border-start-0 ps-2 shadow-none"
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  height: '42px',
                  borderLeft: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                }}
              />
              {searchQuery && (
                <button
                  className="btn btn-link text-muted position-absolute end-0 top-50 translate-middle-y me-3"
                  onClick={() => setSearchQuery('')}
                  style={{
                    transform: 'translateY(-50%)',
                    padding: '0',
                    fontSize: '1rem'
                  }}
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              )}
            </div>
          </div>

          {/* Property List */}

     {
  tablePropsList
    .filter((prop) => prop.key.toLowerCase().includes(searchQuery))
    .map((prop) => (
      <motion.div
        key={prop.key}
        initial={{ opacity: 0, y: 5 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileHover={{
          x: 8,
          scale: 1.03,
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'rgba(248, 249, 250, 0.9)',
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 15
          }
        }}
        whileTap={{ 
          scale: 0.97,
          backgroundColor: 'rgba(233, 236, 239, 0.9)'
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        className={`d-flex align-items-center p-3 cursor-pointer transition-all ${
          selectedKey === prop.key
            ? 'bg-primary-soft border-start border-3 border-primary text-dark'
            : 'bg-white hover-bg-gray-50 text-gray-700 border'
        }`}
        style={{
          borderRadius: '12px',
          marginBottom: '8px',
          cursor: 'pointer',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={() => {
          setSelectedKey(prop.key);
          setShowReadme(false);
          setActiveTab('documentation');
          setIsCopied(false);
        }}
      >
        {/* Animated background highlight on hover */}
        <motion.div
          className="position-absolute start-0 top-0 h-100 bg-primary"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: selectedKey === prop.key ? '4px' : 0,
            opacity: selectedKey === prop.key ? 1 : 0
          }}
          style={{
            borderRadius: '12px 0 0 12px'
          }}
        />
        
        {/* Icon container with more interesting shape */}
        <motion.div
          animate={{
            color: selectedKey === prop.key ? '#0d6efd' : '#6c757d',
            backgroundColor: selectedKey === prop.key 
              ? 'rgba(13, 110, 253, 0.1)' 
              : 'rgba(108, 117, 125, 0.1)',
            rotate: selectedKey === prop.key ? 5 : 0
          }}
          whileHover={{
            rotate: 10,
            scale: 1.1
          }}
          className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px 10px 2px 10px',
            transformOrigin: 'center'
          }}
        >
          <motion.i 
            className={`bi bi-${selectedKey === prop.key ? 'tag-fill' : 'tag'}`}
            animate={{
              scale: selectedKey === prop.key ? 1.2 : 1
            }}
          />
        </motion.div>

        <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
          <div className="d-flex align-items-center justify-content-between">
            <motion.span 
              className="fw-semibold text-truncate"
              animate={{
                color: selectedKey === prop.key ? '#212529' : '#495057'
              }}
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: '200px'
              }}
            >
              {prop.key}
            </motion.span>
            
            {prop.required && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: 1,
                  transition: { type: 'spring', stiffness: 500 }
                }}
                whileHover={{ scale: 1.05 }}
              >
                <span
                  className="badge bg-danger-soft text-danger small d-flex align-items-center"
                  style={{ 
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    lineHeight: 1
                  }}
                >
                  <motion.span
                    animate={{
                      scale: selectedKey === prop.key ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                      repeat: selectedKey === prop.key ? 1 : 0,
                      repeatType: 'reverse',
                      duration: 0.4
                    }}
                    className="me-1"
                  >
                    ⚡
                  </motion.span>
                  Required
                </span>
              </motion.div>
            )}
          </div>
          
         
        </div>

        {/* Animated chevron with bounce effect */}
        <motion.div
          animate={{
            opacity: selectedKey === prop.key ? 1 : 0.7,
            x: selectedKey === prop.key ? [0, 4, 0] : -5,
            color: selectedKey === prop.key ? '#0d6efd' : '#6c757d'
          }}
          transition={{
            x: { 
              repeat: selectedKey === prop.key ? Infinity : 0,
              repeatType: 'reverse',
              duration: 1.5
            }
          }}
          className="ms-2 flex-shrink-0"
          style={{ fontSize: '1.1rem' }}
        >
          <i className="bi bi-chevron-right"></i>
        </motion.div>

        {/* Subtle pulse effect when selected */}
        {selectedKey === prop.key && (
          <motion.div
            className="position-absolute top-0 start-0 w-100 h-100"
            initial={{ boxShadow: 'inset 0 0 0 0 rgba(13, 110, 253, 0.1)' }}
            animate={{
              boxShadow: [
                'inset 0 0 0 0 rgba(13, 110, 253, 0.1)',
                'inset 0 0 20px 10px rgba(13, 110, 253, 0.1)',
                'inset 0 0 0 0 rgba(13, 110, 253, 0.1)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            style={{
              pointerEvents: 'none',
              borderRadius: '11px'
            }}
          />
        )}
      </motion.div>
    ))
}

        </div>
      </div>

      {/* Main Content - Professional Documentation */}
      <div
        className="flex-grow-1 ps-3"
        style={{

          overflowY: 'auto',
          overflowX: 'auto',
          maxWidth: '1600px',
          width: '100%',
          paddingRight: '1rem',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {/* Header */}
        <div className="mb-5 ">
          <div
            className="text-dark fw-bold mb-2  p-2 rounded text-start"
            style={{ fontSize: '1.3rem', lineHeight: 1.2, fontWeight: '700' }}
          >
            {selectedKey ? `${selectedKey} Property` : 'Table Component Documentation'}
          </div>

          <p className="text-muted fs-7 text-start">
            {selectedKey
              ? tablePropsList.find(p => p.key === selectedKey)?.description || 'Detailed documentation for this property'
              : 'Comprehensive guide to implementing and customizing your data tables'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-5 border-bottom pb-2">
          <ul className="nav nav-pills gap-2">
            <li className="nav-item">
              <button
                className={`nav-link px-4 py-2 rounded-pill fw-semibold shadow-sm ${activeTab === 'documentation' ? 'active bg-primary text-white' : 'bg-light text-dark'
                  }`}
                onClick={() => setActiveTab('documentation')}
              >
                <i className="bi bi-file-text me-2"></i>
                Documentation
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link px-4 py-2 rounded-pill fw-semibold shadow-sm ${activeTab === 'example' ? 'active bg-primary text-white' : 'bg-light text-dark'
                  }`}
                onClick={() => setActiveTab('example')}
              >
                <i className="bi bi-code-square me-2"></i>
                Live Example
              </button>
            </li>
          </ul>
        </div>

        {/* Documentation Content */}
        {activeTab === 'documentation' && selectedKey && (
          <div className="bg-white rounded-4 border p-5 shadow-sm mb-5">
            {tablePropsList
              .filter((prop) => prop.key === selectedKey)
              .map((prop) => (
                <div key={prop.key}>
                  {/* Header */}
                  <div className="d-flex align-items-start flex-wrap gap-3 mb-4">
                    <h3 className="fw-bold text-dark mb-0 d-flex align-items-center">
                      <code className="bg-body-secondary text-dark px-3 py-2 rounded-2 font-monospace fs-5">
                        {prop.key}
                      </code>
                    </h3>
                    {prop.required && (
                      <span className="badge bg-danger-subtle text-danger-emphasis px-3 py-2 rounded-pill fw-medium">
                        Required
                      </span>
                    )}
                  </div>


                  {/* Description */}
                  <div className="mb-4 border-start ps-4 border-3 border-primary-subtle">
                    <h6 className="text-dark fw-semibold mb-2 d-flex align-items-center">
                      <i className="bi bi-info-circle me-2 text-primary"></i>
                      Description
                    </h6>
                    <p className="mb-0 text-body-secondary text-start">{prop.description}</p>
                  </div>

                  {/* Type & Default */}
                  <div className="row g-4 mb-5">
                    <div className="col-md-6">
                      <div className="bg-light rounded-3 p-4 h-100 border shadow-sm">
                        <h6 className="fw-semibold text-dark mb-2 d-flex align-items-center">
                          <i className="bi bi-type me-2 text-primary"></i>
                          Type Definition
                        </h6>
                        <code className="text-body text-start">{prop.type}</code>
                      </div>
                    </div>
                    {prop.default && (
                      <div className="col-md-6">
                        <div className="bg-light rounded-3 p-4 h-100 border shadow-sm">
                          <h6 className="fw-semibold text-dark mb-2 d-flex align-items-center">
                            <i className="bi bi-gear me-2 text-primary"></i>
                            Default Value
                          </h6>
                          <code className="text-body text-start">{prop.default}</code>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Dependencies Section */}
                  {prop.dependencies && prop.dependencies.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-semibold text-dark mb-3 d-flex align-items-center">
                        <i className="bi bi-diagram-3 me-2 text-primary"></i>
                        Dependencies
                      </h6>
                      <div className="alert alert-info bg-light border-0 text-start">
                        <ul className="mb-0">
                          {prop.dependencies.map((dep, index) => (
                            <li key={index} className="text-body-secondary">
                              <code>{dep}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Methods Section */}
                  {prop.methods && prop.methods.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-semibold text-dark mb-3 d-flex align-items-center">
                        <i className="bi bi-code-slash me-2 text-primary"></i>
                        Methods
                      </h6>
                      <div className="bg-light border rounded-3 p-3 shadow-sm text-start">
                        {prop.methods.map((method, index) => (
                          <div key={index} className="mb-3">
                            <h6 className="mb-1 fw-semibold text-secondary">
                              <code>{method.name}()</code>
                            </h6>
                            <p className="mb-1 text-body-secondary">{method.description}</p>
                            <small className="text-muted">
                              Returns: <code>{method.returns}</code>
                            </small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                  {/* Notes Section */}
                  {prop.notes && prop.notes.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-semibold text-dark mb-3 d-flex align-items-center">
                        <i className="bi bi-pencil-square me-2 text-primary"></i>
                        Important Notes
                      </h6>
                      <div className="alert alert-warning bg-light border-0 text-start">
                        <ul className="mb-0">
                          {prop.notes.map((note, index) => (
                            <li key={index} className="text-body-secondary">
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Validation Section */}
                  {prop.validation && (
                    <div className="mb-4">
                      <h6 className="fw-semibold text-dark mb-3 d-flex align-items-center">
                        <i className="bi bi-shield-check me-2 text-primary"></i>
                        Validation Rules
                      </h6>
                      <div className="alert alert-light border text-start">
                        <p className="mb-0 text-body-secondary">{prop.validation}</p>
                      </div>
                    </div>
                  )}

                  {/* Sub-Properties Section */}
                  {prop.subProps && prop.subProps.length > 0 && (
                    <div className="mb-5">
                      <h6 className="fw-semibold text-dark mb-3 d-flex align-items-center">
                        <i className="bi bi-list-nested me-2 text-primary fs-5"></i>
                        Sub-Properties
                      </h6>
                      <div className="border rounded-4 shadow-sm overflow-hidden">
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead className="bg-primary-subtle text-primary">
                              <tr>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Required</th>
                                <th className="py-3 px-4">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prop.subProps.map((subProp, index) => (
                                <tr key={index}>
                                  <td className="py-3 px-4">
                                    <code className="text-primary fw-medium">{subProp.name}</code>
                                  </td>
                                  <td className="py-3 px-4">
                                    <code className="text-primary">{subProp.type}</code>
                                  </td>
                                  <td className="py-3 px-4">
                                    {subProp.required ? (
                                      <span className="badge bg-danger-subtle text-danger px-2 py-1">Yes</span>
                                    ) : (
                                      <span className="badge bg-success-subtle text-success px-2 py-1">No</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-body-secondary">
                                    {subProp.description}
                                    {subProp.default && (
                                      <div className="mt-1 small">
                                        <strong className="text-dark">Default:</strong>{" "}
                                        <code>{subProp.default}</code>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Usage Examples */}
                  {prop.usage && (
                    <div className="mb-4">
                      <h6 className="fw-semibold text-dark mb-3 d-flex align-items-center">
                        <i className="bi bi-code-slash text-primary me-2"></i>
                        Usage Example
                      </h6>
                      <div className="border rounded-3 bg-light-subtle shadow-sm overflow-hidden">
                        <div className="bg-body-tertiary px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
                          <span className="text-muted small">Code Snippet</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => (
                              navigator.clipboard.writeText(
                                Array.isArray(prop.usage) ? prop.usage.join('\n') : prop.usage
                              ),
                              setIsCopied(true)
                            )
                            }
                          >
                            <i className="bi bi-clipboard"></i> {isCopied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          language="jsx"
                          style={oneLight}
                          customStyle={{
                            margin: 0,
                            padding: '1.25rem',
                            fontSize: '0.875rem',
                            backgroundColor: '#f8f9fa',
                          }}
                        >
                          {Array.isArray(prop.usage) ? prop.usage.join('\n') : prop.usage}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* README Content */}
        {activeTab === "documentation" && showReadme && (

          <div
            style={{
              padding: '2rem',
              textAlign: 'left',
            }}
            dangerouslySetInnerHTML={{ __html: marked.parse(readmeContent) }}
          />

        )}

        {/* Live Example */}
        {activeTab === 'example' && (
          <div className="bg-white rounded-3 border p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-dark fw-semibold mb-0">
                <i className="bi bi-table text-primary me-2"></i>
                Interactive Example
              </h3>
              <div className="d-flex">
                <button
                  className="btn btn-outline-primary me-2 d-flex align-items-center"
                  onClick={regenerateData}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh Data
                </button>
                <div className="btn-group">
                  <button
                    className={`btn ${!isAdvancedFilter ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setIsAdvancedFilter(false)}
                  >
                    Basic Mode
                  </button>
                  <button
                    className={`btn ${isAdvancedFilter ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setIsAdvancedFilter(true)}
                  >
                    Advanced Mode
                  </button>
                </div>
              </div>
            </div>

            <div className="border rounded overflow-hidden"
            // style={{
            //   overflowX: 'auto',

            //   width: '100%',
            //   paddingRight: '1rem',
            //   msOverflowStyle: 'none',
            //   scrollbarWidth: 'none',

            // }}
            >
              <ValidateAndGenerateTable
                key={count + (isAdvancedFilter ? 'advanced' : 'basic')}
                Data={dummyData}
                DataColumns={dataColumns}
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
                ExpandedRowComponent={ExpandedRowComponent}
                handleExpandedRow={(item, columns) => console.log('Expanded:', item)}
                handleEdit={handleEdit}
                // canExpandRow={true}
                customRowStyle={customRowStyle}
                isCustomRowStyle={true}
                isRowSelectionAllowed={true}
                virtualization={true}
                ref={localRef}
                eventList={eventList}
                sorting={isAdvancedFilter ? 'multi' : 'single'}
                filterType={isAdvancedFilter ? 'advanced' : 'simple'}
                isIndexVisible={true}
                isCustomHeaderVisible={true}
                customHeader={HEADING_FORMAT}
                onRowSelection={handleRowSelection}
                transFormationObject={[]}
                externalStyle={{ border: '1px solid #dee2e6' }}
                // handleDisable={handleDisable}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

      </div>
      {selectedItem && (
        <div
          className="modal fade show d-block bg-blur"
          tabIndex={-1}
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered animate__animated animate__fadeInDown">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-white border-0 px-4 py-3">
                <h5 className="modal-title fw-semibold text-gradient">
                  👤 Customer Profile
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedItem(null)}
                ></button>
              </div>

              <div className="modal-body px-4 pb-4">
                <div className="row g-4">
                  {/* LEFT SIDE */}
                  <div className="col-md-4">
                    <div className="text-center mb-4">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center bg-light position-relative shadow avatar-glow"
                        style={{ width: '100px', height: '100px' }}
                      >
                        <i className="bi bi-person text-muted" style={{ fontSize: '2.5rem' }}></i>
                      </div>
                      <h5 className="mt-3 mb-1 fw-semibold">{selectedItem.name}</h5>
                      <div className="text-muted small">{selectedItem.email}</div>
                      <div className="mt-2 badge rounded-pill bg-gradient-primary px-3 py-2">
                        {selectedItem.membership.displayData}
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm bg-white rounded-3">
                      <div className="card-body">
                        <dl className="mb-0">
                          <dt className="text-muted small">Customer ID</dt>
                          <dd className="mb-2">{selectedItem.id}</dd>

                          <dt className="text-muted small">Age</dt>
                          <dd className="mb-2">{selectedItem.age}</dd>

                          <dt className="text-muted small">Member Since</dt>
                          <dd>{new Date(selectedItem.joinedDate).toLocaleDateString()}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="col-md-8">
                    <div className="card border-0 shadow-sm mb-4 bg-white rounded-3">
                      <div className="card-body">
                        <div className="row text-center">
                          <div className="col">
                            <div className="h4 text-dark fw-semibold">
                              ${selectedItem.lifetimeValue.toLocaleString()}
                            </div>
                            <div className="text-muted small">Lifetime Value</div>
                          </div>
                          <div className="col">
                            <div className="h4 text-dark fw-semibold">{selectedItem.purchaseCount}</div>
                            <div className="text-muted small">Total Orders</div>
                          </div>
                          <div className="col">
                            <div className="h4 text-dark fw-semibold">
                              {new Date(selectedItem.lastPurchase).toLocaleDateString()}
                            </div>
                            <div className="text-muted small">Last Purchase</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm bg-white rounded-3">
                      <div className="card-header bg-white border-bottom">
                        <h6 className="m-0 fw-semibold text-secondary">📋 Recent Activity</h6>
                      </div>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-sm mb-0">
                            <thead className="bg-light text-muted">
                              <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({ length: 5 }).map((_, i) => {
                                const date = new Date(
                                  `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
                                ).toLocaleDateString();
                                const amount = (Math.random() * 500 + 10).toFixed(2);
                                const statusOptions = ['Completed', 'Shipped', 'Processing'];
                                const status = statusOptions[Math.floor(Math.random() * 3)];

                                return (
                                  <tr key={i}>
                                    <td>{date}</td>
                                    <td>${amount}</td>
                                    <td>
                                      <span className={`badge ${getStatusBadgeClass(status)}`}>
                                        {status}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-outline-dark rounded-pill px-4"
                  onClick={() => setSelectedItem(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default ExampleTable;