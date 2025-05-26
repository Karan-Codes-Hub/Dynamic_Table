import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCopy, FiCode, FiTable, FiInfo, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ValidateAndGenerateTable from '../generatetable/ValidateAndGenerateTable';
import { Column } from '../generatetable/types';

const UseCasesPage = () => {
    const [activeUseCase, setActiveUseCase] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const tableRef = useRef<any>(null);

    // Base columns configuration that will be extended for each use case
    const baseColumns: Column[] = [
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
        },
        {
            key: "email",
            name: "Email",
            type: "string",
            visible: true,
            filter: true,
            sorting: true
        },
        {
            key: "age",
            name: "Age",
            type: "number",
            visible: true,
            filter: true,
            sorting: true
        },

        {
            key: "joinedDate",
            name: "Join Date",
            type: "date",
            visible: true,
            filter: true,
            sorting: true
        },
        {
            key: "status",
            name: "Status",
            type: "component",
            visible: true,  
            sorting: true, 
            filter: "string"
        },
        {
            key: "lifetimeValue",
            name: "LTV",
            type: "number",
            visible: true,
            filter: true
        }
    ];

    const [dataColumns, setDataColumns] = useState<Column[]>(baseColumns);

    // Sample data for all use cases
    const sampleData = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            age: 32,
            joinedDate: '2022-01-15',
            lifetimeValue: 2500,
            membership: 'Gold',
            status : {
                data: 'Active',
                displayData: <span className="badge bg-success">Active</span>
            }
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            age: 28,
            joinedDate: '2022-03-22',
            lifetimeValue: 1800,
            membership: 'Silver',
            status : {
                data: 'Pending',
                displayData: <span className="badge bg-warning">Pending</span>
            }
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            age: 45,
            joinedDate: '2021-11-05',
            lifetimeValue: 4200,
            membership: 'Basic',
            status : {
                data: 'Inactive',
                displayData: <span className="badge bg-danger">Inactive</span>
            }
        },
    ];

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    // Helper function for status badges
    const getStatusBadge = (status: string) => {
        const statusClasses: Record<string, string> = {
            'Active': 'bg-success bg-opacity-10 text-success',
            'Pending': 'bg-warning bg-opacity-10 text-warning',
            'Inactive': 'bg-danger bg-opacity-10 text-danger'
        };
        return (
            <span className={`badge rounded-pill ${statusClasses[status] || 'bg-secondary'}`}>
                {status}
            </span>
        );
    };

    // Helper function for membership badges
    const getMembershipBadge = (level: string) => {
        const levelClasses: Record<string, string> = {
            'Basic': 'bg-light text-dark border',
            'Silver': 'bg-light text-dark border border-secondary',
            'Gold': 'bg-light text-dark border border-warning',
            'Platinum': 'bg-light text-dark border border-info'
        };
        return (
            <span className={`badge ${levelClasses[level] || 'bg-light'}`}>
                {level}
            </span>
        );
    };

    const useCases = [
        {
            id: 'basic-setup',
            title: 'Basic Table Setup',
            description: 'Learn how to set up a basic data table with essential features like sorting, filtering, and pagination.',
            benefits: [
                'Quickly display tabular data with minimal configuration',
                'Enable basic user interactions like sorting and filtering',
                'Responsive design that works across device sizes'
            ],
            code: `// Basic table setup with essential features
const columns = [
  {
    key: "id",
    name: "ID",
    type: "number",
    visible: true,
    filter: true,
    sorting: true
  },
  {
    key: "name",
    name: "Name",
    type: "string",
    visible: true,
    filter: true,
    sorting: true
  },
  // Add more columns as needed
];

<ValidateAndGenerateTable
  Data={sampleData}
  DataColumns={columns}
  isPaginationAllowed={true}
  isSearchAllowed={true}
  sorting="single"
  filterType="simple"
/>`,
            tableProps: {
                isPaginationAllowed: true,
                isSearchAllowed: true,
                sorting: "single",
                filterType: "simple"
            },
            columns: baseColumns
        },
        {
            id: 'event-list',
            title: 'Row Event Handling',
            description: 'Attach click and double-click event handlers to table rows to enable interactive features like showing details, editing, or navigation.',
            benefits: [
                'Enhance user interaction with clickable rows',
                'Support both single and double-click actions',
                'Access full row data in event handlers'
            ],
            code: `// Example of row event handling
const ExpandedRowComponent: React.FC<{ item: any; columns: Column[] }> = ({ item }) => {
        const [details, setDetails] = useState<any>(null);
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
          const timer = setTimeout(() => {
            setDetails({
              purchaseHistory: Array.from({ length: 3 }, (_, i) => ({
              id : 'id',
              date :'date', 
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
                      <dd className="col-sm-8">{item.lifetimeValue.toLocaleString()}</dd>
    
                      <dt className="col-sm-4 text-muted">Orders</dt>
                      <dd className="col-sm-8">{item.purchaseCount}</dd>
    
                      <dt className="col-sm-4 text-muted">Avg. Order</dt>
                      <dd className="col-sm-8">{details?.averageOrder}</dd>
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
                              <td>{purchase.amount}</td>
                              <td>
                                <span className={"badge rounded-pill {getStatusBadgeClass(purchase.status)}"}>
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


<ValidateAndGenerateTable
  Data={data}
  DataColumns={columns}
  eventList={eventList}
  // Visual feedback for clickable rows
  rowClassName="cursor-pointer hover-bg-light"
/>`,
            columns: baseColumns,
            tableProps: {
            }
        },
        {
            id: 'expanded-row',
            title: 'Expandable Rows',
            description: 'Implement expandable rows to show additional details without leaving the table view, perfect for hierarchical or detailed data.',
            benefits: [
                'Show detailed information on demand',
                'Customize the expanded content with any React component',
                'Improve table readability by hiding secondary data'
            ],
            code: `// Expanded row component example
    const ExpandedRowComponent: React.FC<{ item: any; columns: Column[] }> = ({ item }) => {
        const [details, setDetails] = useState<any>(null);
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
          const timer = setTimeout(() => {
            setDetails({
              purchaseHistory: Array.from({ length: 3 }, (_, i) => ({
              id : 'id',
              date :'date', 
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
                      <dd className="col-sm-8">{item.lifetimeValue.toLocaleString()}</dd>
    
                      <dt className="col-sm-4 text-muted">Orders</dt>
                      <dd className="col-sm-8">{item.purchaseCount}</dd>
    
                      <dt className="col-sm-4 text-muted">Avg. Order</dt>
                      <dd className="col-sm-8">{details?.averageOrder}</dd>
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
                              <td>{purchase.amount}</td>
                              <td>
                                <span className={"badge rounded-pill {getStatusBadgeClass(purchase.status)}"}>
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

<ValidateAndGenerateTable
  Data={data}
  DataColumns={columns}
  ExpandedRowComponent={ExpandedRowComponent}
  canExpandRow={true}
  // Optional: Control which rows can be expanded
  handleExpandedRow={(item) => item.status === 'Active'}
/>`,
            columns: baseColumns,
            tableProps: {
            }
        },
        {
            id: 'aggregate',
            title: 'Aggregate Functions',
            description: 'Display summary statistics like sums, averages, or counts in the table footer to provide data insights at a glance.',
            benefits: [
                'Show key metrics without additional calculations',
                'Support for sum, avg, min, max, and custom functions',
                'Fully customizable display format'
            ],
            code: `// Column configuration with aggregate functions
const columns = [
  {
    key: 'lifetimeValue',
    name: 'LTV',
    type: 'number',
    aggregateFunction: {
      visible: true,
      function: 'sum', // 'sum', 'avg', 'min', 'max', or 'count'
      title: 'Total Value',
    }
  },
  {
    key: 'age',
    name: 'Age',
    type: 'number',
    aggregateFunction: {
    //if you want to pass your own function
     visible: true,
     function: "custom",
     title: "Age Analysis",
     customFunction: handleFunction
    }
  }
];

<ValidateAndGenerateTable
  Data={data}
  DataColumns={columns}
/>`,
            columns: [
                ...baseColumns.filter(col => col.key !== 'lifetimeValue' && col.key !== 'age'),
                {
                    key: 'lifetimeValue',
                    name: 'LTV',
                    type: 'number',
                    visible: true,
                    filter: true,
                    aggregateFunction: {
                        visible: true,
                        function: 'sum',
                        title: 'Total Value',
                        format: (value: number) => `$${value.toLocaleString()}`
                    }
                },
                {
                    key: 'age',
                    name: 'Age',
                    type: 'number',
                    visible: true,
                    filter: true,
                    sorting: true,
                    aggregateFunction: {
                        visible: true,
                        function: 'avg',
                        title: 'Average Age',
                        format: (value: number) => value.toFixed(1) + ' years'
                    }
                }
            ],
            tableProps: {}
        },
        {
            id: 'conditional-disable',
            title: 'Conditional Interactions',
            description: 'Disable interactions like selection or editing for specific rows based on custom business logic.',
            benefits: [
                'Prevent actions on invalid or incomplete data',
                'Visual feedback for disabled rows',
                'Flexible condition evaluation'
            ],
            code: `// Example: Disable inactive users
const handleDisable = (rowItem, rowIndex, type, columnItem) => {
  // Disable entire row if status is inactive
  if (type === 'row') return rowItem.status === 'Inactive';
  
  // Or disable specific cells/columns
  if (columnItem?.key === 'email') return rowItem.status !== 'Verified';
  
  return false;
};

<ValidateAndGenerateTable
  Data={data}
  DataColumns={columns}
  handleDisable={handleDisable}
  // Optional: Custom styling for disabled rows
  disabledRowClassName="opacity-75"
/>`,
            columns: baseColumns,
            tableProps: {
                handleDisable: (rowItem: any) => rowItem.status?.data === 'Inactive',  
                disabledRowClassName: "opacity-75",
                isRowSelectionAllowed: true
            }
        },
        {
            id: 'custom-styling',
            title: 'Custom Row Styling',
            description: 'Apply dynamic styling to rows based on their data values to highlight important information or statuses.',
            benefits: [
                'Visual hierarchy and data emphasis',
                'Conditional formatting based on values',
                'Full CSS customization'
            ],
            code: `// Custom row styling based on status
const customRowStyle = (index, item) => {
  // Return CSS class names based on item properties
  if (item.status === 'Active') return 'bg-success bg-opacity-10';
  if (item.status === 'Pending') return 'bg-warning bg-opacity-10';
  if (item.status === 'Inactive') return 'bg-danger bg-opacity-10';
  return '';
};

<ValidateAndGenerateTable
  Data={data}
  DataColumns={columns}
  customRowStyle={customRowStyle}
  isCustomRowStyle={true}
/>`,
            columns: baseColumns,
            tableProps: {
                customRowStyle: (index: number, item: any) => {
                    if (item.status?.data === 'Active') return 'bg-success bg-opacity-10';
                    if (item.status?.data === 'Pending') return 'bg-warning bg-opacity-10';
                    if (item.status?.data === 'Inactive') return 'bg-danger bg-opacity-10';
                    return '';
                },
                isCustomRowStyle: true
            }
        },
        {
            id: 'component-columns',
            title: 'Component Columns',
            description: 'Render custom React components in table cells for rich interactive content like badges, buttons, or progress bars.',
            benefits: [
                'Embed interactive elements in cells',
                'Display complex data visually',
                'Maintain table functionality'
            ],
            code: ` 
  //suppose status is of column type component 
  //you need to pass actual data(to perform calculations, search, sorting, filtering etc) 
  //and displayData is the component to be displayed in the cell
     const baseColumns: Column[] = [
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
        },
        {
            key: "email",
            name: "Email",
            type: "string",
            visible: true,
            filter: true,
            sorting: true
        },
        {
            key: "age",
            name: "Age",
            type: "number",
            visible: true,
            filter: true,
            sorting: true
        },

        {
            key: "joinedDate",
            name: "Join Date",
            type: "date",
            visible: true,
            filter: true,
            sorting: true
        },
        {
            key: "status",
            name: "Status",
            type: "component",
            visible: true,  
            sorting: true, 
            filter: "string"
        },
        {
            key: "lifetimeValue",
            name: "LTV",
            type: "number",
            visible: true,
            filter: true
        }
    ];
  const generateCustomerData = (dataLength: number) => {
  const firstNames = ["James", "Mary", "Robert", "Patricia"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown"];
  const domains = ["gmail.com", "yahoo.com"];
  const statuses = ["Active", "Inactive"];

  return Array.from({ length: dataLength }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = \`\${firstName.toLowerCase()}.\${lastName.toLowerCase()}@\${domains[Math.floor(Math.random() * domains.length)]}\`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: index + 1,
      name: \`\${firstName} \${lastName}\`,
      email: email,
      status: {
        data: status,
        displayData: <span className="badge bg-success">{status}</span>
      }
    };
  });
};;


<ValidateAndGenerateTable
  Data={data}
  DataColumns={columns}
/>`,
            columns: [
                ...baseColumns.filter(col => col.key !== 'status' && col.key !== 'membership'),
                {
                    key: 'status',
                    name: 'Status',
                    type: 'component',
                    visible: true,
                    component: (item: any) => getStatusBadge(item.status)
                },
                {
                    key: 'membership',
                    name: 'Membership',
                    type: 'component',
                    visible: true,
                    component: (item: any) => getMembershipBadge(item.membership)
                }
            ],
            tableProps: {}
        }
    ];


    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [expandedItem, setExpandedItem] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const localRef = useRef<any>(null);

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
    const handleClick = (item: any) => {
        console.log("Clicked:", item);
        setSelectedItem(item);
    };

    const handleDoubleClick = (item: any) => {
        localRef?.current?.rowExpand("1");

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

    const onRowSelection = (allSelectedRows: any, currentRow: any) => {
        console.log("Selection changed:", { allSelectedRows, currentRow });
    };
    const customRowStyle = (index, item) => {
  // Return CSS class names based on item properties
  if (item.status === 'Active') return 'bg-success bg-opacity-10';
  if (item.status === 'Pending') return 'bg-warning bg-opacity-10';
  if (item.status === 'Inactive') return 'bg-danger bg-opacity-10';
  return '';
};
    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="row g-4">
                {/* Sidebar Navigation */}
                <div className="col-lg-4">
                    <div className="sticky-top " style={{ top: '1rem' }}>
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white border-bottom">
                                <h2 className="h5 mb-0 d-flex align-items-center">
                                    <FiTable className="me-2 text-primary" />
                                    Table Use Cases
                                </h2>
                            </div>
                            <div className="card-body p-0">
                                <div className="list-group list-group-flush rounded-bottom">
                                    {useCases.map((useCase) => (
                                        <motion.button
                                            key={useCase.id}
                                            whileHover={{ x: 5 }}
                                            className={`list-group-item list-group-item-action border-0 d-flex justify-content-between align-items-center py-3 ${activeUseCase === useCase.id ? 'bg-primary text-white' : ''
                                                }`}
                                            onClick={() => setActiveUseCase(useCase.id === activeUseCase ? null : useCase.id)}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className={`me-3 p-2 rounded-circle ${activeUseCase === useCase.id ? 'bg-white text-primary' : 'bg-light'
                                                    }`}>
                                                    <FiInfo size={16} />
                                                </div>
                                                <span className="fw-medium">{useCase.title}</span>
                                            </div>
                                            <FiChevronDown className={`transition-all ${activeUseCase === useCase.id ? 'rotate-180 text-white' : 'text-muted'
                                                }`} />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {activeUseCase && (
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-bottom">
                                    <h3 className="h6 mb-0">About This Example</h3>
                                </div>
                                <div className="card-body">
                                    <p className="small text-muted">
                                        Select different use cases from the menu to explore various table features and their implementations.
                                    </p>
                                    <div className="d-grid">
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={() => {
                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: 'smooth'
                                                });
                                            }}
                                        >
                                            Back to Top
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="col-lg-8">
                    <AnimatePresence mode="wait">
                        {activeUseCase ? (
                            useCases.filter(uc => uc.id === activeUseCase).map((useCase) => (
                                <motion.div
                                    key={useCase.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="card border-0 shadow-sm mb-4"
                                >
                                    <div className="card-header bg-white border-bottom py-3">
                                        <h2 className="h4 mb-0 text-primary">{useCase.title}</h2>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-4">
                                            <p className="lead">{useCase.description}</p>

                                            {useCase.benefits && (
                                                <div className="mb-4">
                                                    <h5 className="h6 mb-3 d-flex align-items-center">
                                                        <FiCheck className="me-2 text-success" />
                                                        Key Benefits
                                                    </h5>
                                                    <ul className="list-unstyled">
                                                        {useCase.benefits.map((benefit, index) => (
                                                            <li key={index} className="mb-2 d-flex">
                                                                <span className="me-2 text-success">•</span>
                                                                <span>{benefit}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="alert alert-info bg-light border-0">
                                                <div className="d-flex align-items-center">
                                                    <FiInfo className="me-2 flex-shrink-0" />
                                                    <div>
                                                        This example demonstrates a common implementation pattern.
                                                        You can customize it further to meet your specific requirements.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h3 className="h5 mb-0 d-flex align-items-center">
                                                    <FiCode className="me-2" />
                                                    Implementation Code
                                                </h3>
                                                <button
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                                    onClick={() => copyToClipboard(useCase.code)}
                                                >
                                                    <FiCopy className="me-1" />
                                                    {copiedCode === useCase.code ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                            <SyntaxHighlighter
                                                language="jsx"
                                                style={atomOneLight}
                                                customStyle={{
                                                    borderRadius: '8px',
                                                    padding: '1.25rem',
                                                    backgroundColor: '#f8f9fa',
                                                    fontSize: '0.9rem',
                                                    border: '1px solid #eee',
                                                    textAlign: 'left'
                                                }}
                                                showLineNumbers
                                            >
                                                {useCase.code}
                                            </SyntaxHighlighter>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="h5 mb-3">Live Example</h3>
                                            <div className="border rounded overflow-hidden mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                <div className="p-3 bg-white">
                                                    <ValidateAndGenerateTable
                                                        ref={tableRef}
                                                        Data={sampleData}
                                                        DataColumns={dataColumns}
                                                        setDataColumns={setDataColumns}
                                                        isPaginationAllowed={false}
                                                        isSearchAllowed={false}
                                                        sorting="single"
                                                        filterType="simple"
                                                        eventList={eventList}
                                                        ExpandedRowComponent={ExpandedRowComponent}
                                                        onRowSelection={onRowSelection}
                                                        {...(useCase.tableProps as { sorting?: "single" | "multi" })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="alert alert-warning bg-light border-0">
                                            <div className="d-flex align-items-center">
                                                <FiAlertTriangle className="me-2 flex-shrink-0" />
                                                <div>
                                                    <strong>Note:</strong> The live example shows a simplified version 
                                                    for demonstration purposes. In a real application, you would 
                                                    typically connect to an API for data and implement more complex logic.
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="card border-0 shadow-sm text-center py-5 bg-white"
                                style={{ minHeight: '500px' }}
                            >
                                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                    <div className="bg-primary bg-opacity-10 p-4 rounded-circle mb-4">
                                        <FiTable size={48} className="text-primary" />
                                    </div>
                                    <h2 className="mb-3">Explore Table Features</h2>
                                    <p className="text-muted mb-4" style={{ maxWidth: '600px' }}>
                                        Select a use case from the sidebar to view detailed examples,
                                        implementation code, and live demonstrations of various table
                                        component features and capabilities.
                                    </p>
                                    <div className="d-flex flex-wrap justify-content-center gap-2">
                                        {useCases.slice(0, 3).map(useCase => (
                                            <button
                                                key={useCase.id}
                                                className="btn btn-outline-primary"
                                                onClick={() => setActiveUseCase(useCase.id)}
                                            >
                                                {useCase.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default UseCasesPage;