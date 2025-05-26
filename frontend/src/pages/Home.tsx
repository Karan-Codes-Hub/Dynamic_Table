import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiGrid, FiFilter, FiDownload, FiEdit, FiColumns, FiCode, FiZap, FiMaximize, FiMove, FiUsers, FiArrowRight,
    FiPieChart, FiSearch, FiLayers, FiArrowUp
} from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import ValidateAndGenerateTable from '../generatetable/ValidateAndGenerateTable';
import { Column } from "../generatetable/types";
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    // const [activeTab, setActiveTab] = useState('features');
    // const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const [count, setCount] = useState(30);


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
                id: 10000 + index,
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

    const features = [
        {
            icon: <FiGrid size={28} />,
            title: "Interactive Data Grid",
            description: "Render complex datasets in a dynamic, responsive grid with real-time updates, customizable layouts, and high performance rendering using virtualization for optimal performance with large datasets."
        },
        {
            icon: <FiFilter size={28} />,
            title: "Advanced Filtering System",
            description: "Toggle between simple quick-filter and advanced mode with custom operators (>, <, contains, etc.), multi-column filtering, and persistence options. Supports custom filter components for specialized needs."
        },
        {
            icon: <FiEdit size={28} />,
            title: "Inline Cell Editing",
            description: "Direct cell editing . Supports async validation, edit confirmation callbacks, and custom editor components for complex data types."
        },
        {
            icon: <FiColumns size={28} />,
            title: "Column Management",
            description: "Drag-and-drop column reordering, visibility toggles, column freezing, and persistent layout configurations. Customize column widths with auto-resize or manual adjustment."
        },
        {
            icon: <FiDownload size={28} />,
            title: "Data Export",
            description: "Export to CSV, Excel, or PDF with options to include current filters, selected rows only, or complete datasets. Customize exported columns and formatting."
        },
        {
            icon: <FiMaximize size={28} />,
            title: "View Modes",
            description: "Full-screen mode for focused data analysis, compact/detailed density options, and responsive layouts that adapt to different screen sizes."
        },
        {
            icon: <FiMove size={28} />,
            title: "Row Operations",
            description: "Resizable rows, virtual scrolling for performance, row grouping, and hierarchical data display with expand/collapse functionality."
        },
        {
            icon: <FiUsers size={28} />,
            title: "Selection & Actions",
            description: "Single/multi-row selection with keyboard support. Context menus, row actions, and bulk operations with selected records."
        },
        {
            icon: <FiCode size={28} />,
            title: "Developer Experience",
            description: "TypeScript support, comprehensive API documentation, customizable hooks, and event handlers for all interactions. Themeable with CSS variables."
        },
        {
            icon: <FiLayers size={28} />,
            title: "Showing Components in Cell",
            description: "Sometimes you need to show a component in a cell. This feature allows you to render a component in a cell and customize how it look. But this will not stop you from seraching , filtering or sorting that column."
        },
        {
            icon: <FiPieChart size={28} />,
            title: "Aggregations & Summaries",
            description: "Built-in calculations (sum, avg, count) with customizable footer rows. Display column statistics and KPIs directly in the table. Developer can add custom aggregation functions and custom component to display."
        },
        {
            icon: <FiSearch size={28} />,
            title: "Global Search",
            description: "Fuzzy search across all columns with highlight matching text. Supports regular expressions and custom search algorithms."
        },
        {
            icon: <FiZap size={28} />,
            title: "Triggering Events",
            description: "Trigger custom events on specific rows using the `eventList` prop. Supports event callbacks and conditional disabling of rows based on custom logic."
        },
        {
            icon: <FiFilter size={28} />,
            title: "Filtering",
            description: "Simple filtering with quick filters and advanced logic. Apply multiple filters on the same column using operators (>, <, contains) and combine them using Match Any (OR) or Match All (AND)."
        },
        {
            icon: <FiArrowUp size={28} />,
            title: "Sorting",
            description: "Enable single or multi-column sorting with clear ascending and descending order control for better data organization."
        }

    ];


    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const [dummyData, setDummyData] = useState<any[]>(generateCustomerData(count));
    const [dataColumns, setDataColumns] = useState<Column[]>([
        {
            key: "id",
            name: "ID",
            type: "number",
            visible: true,
            filter: true,
            sorting: true,

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
            sorting: true,
        },
        {
            key: "age",
            name: "Age",
            type: "number",
            visible: true,
            filter: true,
            sorting: true,
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
        },
    ]);
    return (
        <div className="min-vh-100 bg-light">
            {/* Navigation */}
            <Navbar
                expand="md"
                fixed="top"
                className={`transition-all ${isScrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-3'}`}
            >
                {/* <Container>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <FiGrid className="text-primary mr-2" size={24} />
            <span className="fs-4 fw-bold text-primary">React DataGrid Pro</span>
          </Navbar.Brand>
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto me-4">
              <Nav.Link href="#features" className="text-dark mx-2">Features</Nav.Link>
              <Nav.Link href="#demo" className="text-dark mx-2">Demo</Nav.Link>
              <Nav.Link href="#documentation" className="text-dark mx-2">Docs</Nav.Link>
              <Nav.Link href="#pricing" className="text-dark mx-2">Pricing</Nav.Link>
            </Nav>
            <div className="d-flex">
              <Button variant="outline-primary" className="me-2">Login</Button>
              <Button variant="primary">Get Started</Button>
            </div>
          </Navbar.Collapse>
        </Container> */}
            </Navbar>

            {/* Hero Section */}
            <section className="pt-5 pb-5 mt-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-5 mb-lg-0">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={variants}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="display-4 fw-bold mb-4">
                                    The Ultimate <span className="text-primary">React Data Table</span> Component
                                </h1>
                                <p className="lead text-muted mb-4">
                                    Feature-rich, performant, and customizable data grid for React applications with TypeScript support and enterprise-grade capabilities.
                                </p>
                                <div className="d-flex flex-column flex-sm-row gap-3">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="disabled-tooltip">Will be enabled soon</Tooltip>}
                                    >
                                        <span className="d-inline-block" style={{ cursor: 'not-allowed' }}>
                                            <Button variant="secondary" size="lg" disabled className="d-flex align-items-center pe-none">
                                                <span aria-label="Coming Soon" role="status">Get Started</span>
                                                <FiArrowRight className="ms-2" />
                                            </Button>
                                        </span>
                                    </OverlayTrigger>

                                    <Button variant="outline-primary" size="lg"
                                        onClick={() => {
                                            const section = document.getElementById('demo');
                                            section?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        Live Demo
                                    </Button>
                                </div>
                            </motion.div>
                        </Col>

                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="position-relative"
                            >
                                <div className="position-absolute top-0 start-0 w-50 h-50 bg-purple-100 rounded-circle opacity-25 blur"></div>
                                <div className="position-absolute bottom-0 end-0 w-50 h-50 bg-indigo-100 rounded-circle opacity-25 blur"></div>
                                <div className="position-absolute top-50 start-50 w-50 h-50 bg-pink-100 rounded-circle opacity-25 blur"></div>

                                <Card className="position-relative shadow-lg border-0 overflow-hidden">
                                    <Card.Header className="bg-light d-flex align-items-center">
                                        <div className="d-flex gap-2 me-3">
                                            <span className="bg-danger rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                                            <span className="bg-warning rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                                            <span className="bg-success rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                                        </div>
                                        <div className="text-muted small">customers.json</div>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="table-responsive">
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Status</th>
                                                        <th>LTV</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[1, 2, 3, 4].map((item) => (
                                                        <tr key={item}>
                                                            <td>{10000 + item}</td>
                                                            <td className="fw-medium">
                                                                {['James Smith', 'Maria Garcia', 'Robert Johnson', 'Sarah Williams'][item - 1]}
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${['bg-success', 'bg-warning', 'bg-info', 'bg-success'][item - 1]
                                                                    }`}>
                                                                    {['Active', 'Pending', 'New', 'Active'][item - 1]}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                ${(Math.random() * 10000 + 500).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div className="text-muted small">Showing 1 to 4 of 124 entries</div>
                                            <div className="btn-group">
                                                <Button variant="outline-secondary" size="sm">Previous</Button>
                                                <Button variant="primary" size="sm">1</Button>
                                                <Button variant="outline-secondary" size="sm">2</Button>
                                                <Button variant="outline-secondary" size="sm">3</Button>
                                                <Button variant="outline-secondary" size="sm">Next</Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section id="features" className="py-5 bg-white">
                <Container>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={variants}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-5"
                    >
                        <h2 className="display-5 fw-bold mb-3">Powerful Features</h2>
                        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                            Everything you need to build professional data-rich applications with React
                        </p>
                    </motion.div>

                    <Row className="g-4">
                        {features.map((feature, index) => (
                            <Col md={6} lg={4} key={index}>
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={variants}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style={{ width: '48px', height: '48px' }}>
                                                {feature.icon}
                                            </div>
                                            <h3 className="h4 fw-semibold mb-2">{feature.title}</h3>
                                            <p className="text-muted mb-0">{feature.description}</p>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-5 bg-light">
                <Container>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={variants}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-5"
                    >
                        <h2 className="display-5 fw-bold mb-3">Interactive Demo</h2>
                        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                            Try out the component with real data and see all features in action
                        </p>
                    </motion.div>

                    <Card className="border-0 shadow">
                        <Card.Body className="p-0">
                            <div className="bg-body-tertiary rounded p-5 d-flex align-items-center justify-content-center min-vh-25">
                                <div className="text-center">
                                    <FiZap className="text-primary mb-3 mx-auto" size={48} />
                                    <h3 className="h2 fw-semibold mb-2">Interactive Data Table</h3>
                                    <div 
                                    // style={{maxWidth: '500px'}}
                                    >
                                        <ValidateAndGenerateTable
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
                                            isCustomRowStyle={true}
                                            isRowSelectionAllowed={true}
                                            sorting={'single'}
                                            filterType={'simple'}
                                            isIndexVisible={true}
                                            transFormationObject={[]}
                                        />
                                    </div>
                                    <Button variant="primary"
                                        onClick={() => navigate('/features')}
                                    >View All Features</Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </section>

            {/* Documentation Section */}
            <section id="documentation" className="py-5 bg-white">
                <Container>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={variants}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-5"
                    >
                        <h2 className="display-5 fw-bold mb-3">Comprehensive Documentation</h2>
                        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                            Get started quickly with our detailed guides and API references
                        </p>
                    </motion.div>

                    <Row className="g-4">
                        <Col md={4}>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={variants}
                                transition={{ duration: 0.4 }}
                            >
                                <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-3" style={{ width: '48px', height: '48px' }}>
                                            <FiCode size={24} />
                                        </div>
                                        <h3 className="h4 fw-semibold mb-2">Quick Start</h3>
                                        <p className="text-muted mb-3">Get up and running in minutes with our simple installation guide</p>
                                       <Link to="/build" className="text-primary fw-medium d-flex align-items-center">
                                            Build Your Own <FiArrowRight className="ms-1" />
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>

                        <Col md={4}>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={variants}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center justify-content-center bg-info bg-opacity-10 text-info rounded-circle mb-3" style={{ width: '48px', height: '48px' }}>
                                            <FiGrid size={24} />
                                        </div>
                                        <h3 className="h4 fw-semibold mb-2">All Features</h3>
                                        <p className="text-muted mb-3">Detailed documentation for all props, methods, and events</p>
                                        <Link to="/features" className="text-primary fw-medium d-flex align-items-center">
                                            Explore Features <FiArrowRight className="ms-1" />
                                        </Link>

                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>

                        <Col md={4}>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={variants}
                                transition={{ duration: 0.4, delay: 0.4 }}
                            >
                                <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center justify-content-center bg-purple bg-opacity-10 text-purple rounded-circle mb-3" style={{ width: '48px', height: '48px' }}>
                                            <FiZap size={24} />
                                        </div>
                                        <h3 className="h4 fw-semibold mb-2">Examples</h3>
                                        <p className="text-muted mb-3">Practical examples for common use cases and scenarios</p>
                                        <Link to="/examples" className="text-primary fw-medium d-flex align-items-center">
                                            View Examples <FiArrowRight className="ms-1" />
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-primary text-white">
                <Container className="text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={variants}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="display-5 fw-bold mb-4">Ready to Transform Your Data Tables?</h2>
                        <p className="lead mb-5 mx-auto" style={{ maxWidth: '700px' }}>
                            Join developers who have enhanced their applications with our powerful React Data Grid.
                        </p>
                        {/* <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Button variant="light" size="lg" className="text-primary">
                Get Started for Free
              </Button>
              <Button variant="outline-light" size="lg">
                Schedule a Demo
              </Button>
            </div> */}
                    </motion.div>
                </Container>
            </section>

            {/* Footer */}
            {/* <footer className="bg-dark text-secondary py-5">
        <Container>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="d-flex align-items-center mb-3">
                <FiGrid className="text-primary me-2" size={24} />
                <span className="fs-4 fw-bold text-white">React DataGrid Pro</span>
              </div>
              <p className="mb-4">The most powerful and customizable data grid for React applications.</p>
              <div className="d-flex gap-3">
                <a href="#" className="text-secondary hover:text-white">
                  <i className="bi bi-github fs-5"></i>
                </a>
                <a href="#" className="text-secondary hover:text-white">
                  <i className="bi bi-facebook fs-5"></i>
                </a>
                <a href="#" className="text-secondary hover:text-white">
                  <i className="bi bi-twitter fs-5"></i>
                </a>
              </div>
            </Col>
            
            <Col md={6} lg={3}>
              <h3 className="text-white h5 fw-semibold mb-3">Product</h3>
              <ListGroup variant="flush" className="bg-transparent">
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Features</ListGroup.Item>
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Pricing</ListGroup.Item>
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Documentation</ListGroup.Item>
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Roadmap</ListGroup.Item>
              </ListGroup>
            </Col>
            
            <Col md={6} lg={3}>
              <h3 className="text-white h5 fw-semibold mb-3">Resources</h3>
              <ListGroup variant="flush" className="bg-transparent">
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Blog</ListGroup.Item>
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Tutorials</ListGroup.Item>
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Support</ListGroup.Item>
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Community</ListGroup.Item>
              </ListGroup>
            </Col>
            
            <Col md={6} lg={3}>
              <h3 className="text-white h5 fw-semibold mb-3">Company</h3>
              <ListGroup variant="flush" className="bg-transparent">
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">About</ListGroup.Item>
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Careers</ListGroup.Item>
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Contact</ListGroup.Item>
                <ListGroup.Item action className="bg-transparent text-secondary border-0 ps-0">Legal</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          
          <div className="border-top border-dark mt-5 pt-4 text-center">
            <p className="mb-0">© {new Date().getFullYear()} React DataGrid Pro. All rights reserved.</p>
          </div>
        </Container>
      </footer> */}
        </div>
    );
};

export default LandingPage;