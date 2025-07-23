// Projects Data for Portfolio

const projectsData = [
    {
        id: 1,
        title: "Pulse AI HMS - Hospital Management System",
        description: "A comprehensive Hospital Management System built with AI-powered analytics, patient monitoring, and automated workflows. Features include real-time patient tracking, medical record management, appointment scheduling, and predictive analytics for hospital resource optimization.",
        category: "ai",
        technologies: ["Python", "FastAPI", "PostgreSQL", "Redis", "TensorFlow", "Docker", "React", "WebSocket"],
        icon: "fas fa-hospital",
        year: "2025",
        linesOfCode: "157000",
        status: "Completed",
        features: [
            "AI-powered patient diagnosis assistance",
            "Real-time patient monitoring dashboard",
            "Automated appointment scheduling",
            "Medical record digitization with OCR",
            "Resource allocation optimization",
            "Predictive analytics for bed management",
            "Integration with medical devices",
            "Multi-language support for international hospitals"
        ],
        challenges: [
            "Handling large-scale medical data with HIPAA compliance",
            "Real-time synchronization across multiple hospital departments",
            "Integration with legacy hospital systems",
            "Ensuring 99.9% uptime for critical patient data"
        ],
        liveUrl: null,
        githubUrl: null, // Private repository
        demoVideo: null,
        testimonial: {
            text: "Pulse AI HMS revolutionized our hospital operations. The AI-powered analytics helped us reduce patient wait times by 40% and optimize our resource allocation significantly.",
            author: "Dr. Sarah Johnson",
            role: "Chief Medical Officer, Regional Medical Center"
        }
    },
    {
        id: 2,
        title: "Inbox Shield - AI Email Security",
        description: "Advanced AI-powered email security system that detects and prevents phishing attacks, spam, and malicious content. Uses machine learning algorithms to analyze email patterns, sender reputation, and content to provide real-time protection.",
        category: "ai",
        technologies: ["Python", "TensorFlow", "Scikit-learn", "Gmail API", "FastAPI", "PostgreSQL", "Redis", "Celery"],
        icon: "fas fa-shield-alt",
        year: "2024",
        linesOfCode: "45000",
        status: "Completed",
        features: [
            "Real-time phishing detection using NLP",
            "Sender reputation analysis",
            "Content-based threat assessment",
            "Automated email quarantine",
            "Learning from user feedback",
            "Integration with major email providers",
            "Custom threat reporting dashboard",
            "Bulk email analysis for enterprises"
        ],
        challenges: [
            "Achieving high accuracy while minimizing false positives",
            "Processing large volumes of emails in real-time",
            "Adapting to new phishing techniques",
            "Maintaining user privacy while analyzing content"
        ],
        results: {
            "Phishing Detection Accuracy": "99.2%",
            "False Positive Rate": "<0.5%",
            "Average Processing Time": "0.3 seconds",
            "Emails Analyzed Daily": "500,000+"
        },
        liveUrl: null,
        githubUrl: null,
        demoVideo: null
    },
    {
        id: 3,
        title: "Mail Hawk - Smart Inbox Protection",
        description: "Next-generation inbox protection system with advanced threat detection, automated response capabilities, and intelligent email filtering. Currently in development with cutting-edge AI models for email security.",
        category: "ai",
        technologies: ["Python", "FastAPI", "PostgreSQL", "Redis", "Celery", "TensorFlow", "BERT", "Docker"],
        icon: "fas fa-eye",
        year: "2025",
        linesOfCode: "32000",
        status: "In Development",
        features: [
            "Advanced threat detection with deep learning",
            "Automated threat response system",
            "Intelligent email categorization",
            "Real-time threat intelligence integration",
            "Custom security policies for organizations",
            "Advanced reporting and analytics",
            "API for third-party integrations",
            "Multi-tenant architecture for SaaS deployment"
        ],
        upcomingFeatures: [
            "Integration with Microsoft 365 and Google Workspace",
            "Mobile app for iOS and Android",
            "Advanced threat hunting capabilities",
            "Blockchain-based email verification"
        ],
        liveUrl: null,
        githubUrl: null,
        expectedCompletion: "Q2 2025"
    },
    {
        id: 4,
        title: "E-commerce Backend API",
        description: "Scalable REST API for a multi-vendor e-commerce platform with comprehensive payment integration, inventory management, and real-time order tracking. Built to handle high-traffic scenarios with optimized database queries.",
        category: "backend",
        technologies: ["Python", "Flask", "SQLAlchemy", "PostgreSQL", "Redis", "Stripe API", "SendGrid", "AWS S3"],
        icon: "fas fa-shopping-cart",
        year: "2024",
        linesOfCode: "28000",
        status: "Completed",
        features: [
            "Multi-vendor marketplace support",
            "Comprehensive payment processing",
            "Real-time inventory management",
            "Order tracking and notifications",
            "Advanced search and filtering",
            "Automated tax calculations",
            "Integration with shipping providers",
            "Comprehensive admin dashboard"
        ],
        apiEndpoints: [
            "Product Management (CRUD)",
            "User Authentication & Authorization",
            "Shopping Cart & Checkout",
            "Payment Processing",
            "Order Management",
            "Inventory Tracking",
            "Vendor Management",
            "Analytics & Reporting"
        ],
        performance: {
            "Response Time": "< 200ms",
            "Concurrent Users": "10,000+",
            "Database Queries": "Optimized with indexing",
            "API Rate Limiting": "1000 requests/minute"
        },
        liveUrl: null,
        githubUrl: null
    },
    {
        id: 5,
        title: "Cryptocurrency Trading Bot",
        description: "Intelligent trading bot with machine learning algorithms for cryptocurrency market analysis and automated trading. Features include risk management, portfolio optimization, and real-time market data processing.",
        category: "automation",
        technologies: ["Python", "Pandas", "NumPy", "Scikit-learn", "WebSocket", "PostgreSQL", "Redis", "Binance API"],
        icon: "fas fa-chart-line",
        year: "2024",
        linesOfCode: "35000",
        status: "Completed",
        features: [
            "Machine learning price prediction",
            "Automated trading strategies",
            "Risk management algorithms",
            "Real-time market data analysis",
            "Portfolio optimization",
            "Backtesting framework",
            "Multi-exchange support",
            "Performance analytics dashboard"
        ],
        tradingStrategies: [
            "Moving Average Crossover",
            "RSI-based Mean Reversion",
            "MACD Trend Following",
            "Machine Learning Prediction",
            "Arbitrage Opportunities",
            "Bollinger Bands Strategy"
        ],
        performance: {
            "Average Monthly Return": "12.3%",
            "Sharpe Ratio": "1.85",
            "Max Drawdown": "8.2%",
            "Win Rate": "68%"
        },
        liveUrl: null,
        githubUrl: null
    },
    {
        id: 6,
        title: "Real Estate Management Platform",
        description: "Comprehensive real estate management application with property listings, virtual tours, client portal, and automated lead management. Features include CRM integration and advanced property analytics.",
        category: "fullstack",
        technologies: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "AWS S3", "Mapbox API", "SendGrid"],
        icon: "fas fa-building",
        year: "2024",
        linesOfCode: "42000",
        status: "Completed",
        features: [
            "Property listing management",
            "Virtual tour integration",
            "Client relationship management",
            "Automated lead tracking",
            "Property valuation tools",
            "Document management system",
            "Appointment scheduling",
            "Financial reporting dashboard"
        ],
        modules: [
            "Property Management",
            "Client Portal",
            "Lead Management",
            "Financial Tracking",
            "Document Storage",
            "Communication Tools",
            "Reporting & Analytics",
            "Mobile Responsive Interface"
        ],
        liveUrl: null,
        githubUrl: null
    },
    {
        id: 7,
        title: "Custom CMS with Role-Based Access",
        description: "Enterprise-grade Content Management System with granular role-based permissions, advanced media management, and multi-language support. Built for scalability and security.",
        category: "backend",
        technologies: ["Django", "PostgreSQL", "Redis", "AWS S3", "Elasticsearch", "Celery", "Docker", "Nginx"],
        icon: "fas fa-cogs",
        year: "2023",
        linesOfCode: "38000",
        status: "Completed",
        features: [
            "Granular role-based permissions",
            "Advanced media management",
            "Multi-language content support",
            "SEO optimization tools",
            "Content versioning system",
            "Automated backup system",
            "Advanced search capabilities",
            "API for headless CMS usage"
        ],
        userTypes: [
            "Super Admin - Full system access",
            "Content Manager - Content CRUD operations",
            "Editor - Content editing and publishing",
            "Author - Content creation and editing",
            "Contributor - Content creation only",
            "Subscriber - Read-only access"
        ],
        liveUrl: null,
        githubUrl: null
    },
    {
        id: 8,
        title: "Task Automation Framework",
        description: "Flexible automation framework for business process automation, including email automation, data processing, report generation, and system integration. Designed for non-technical users with a visual workflow builder.",
        category: "automation",
        technologies: ["Python", "Celery", "Redis", "PostgreSQL", "Flask", "React", "Docker", "RabbitMQ"],
        icon: "fas fa-robot",
        year: "2024",
        linesOfCode: "31000",
        status: "Completed",
        features: [
            "Visual workflow builder",
            "Email automation sequences",
            "Data processing pipelines",
            "Report generation automation",
            "System integration capabilities",
            "Scheduled task execution",
            "Error handling and retry logic",
            "Performance monitoring dashboard"
        ],
        automationTypes: [
            "Email Marketing Sequences",
            "Data Import/Export",
            "Report Generation",
            "File Processing",
            "API Integrations",
            "Database Operations",
            "Notification Systems",
            "Social Media Posting"
        ],
        liveUrl: null,
        githubUrl: null
    },
    {
        id: 9,
        title: "API Gateway & Microservices",
        description: "Scalable API Gateway solution with microservices architecture, load balancing, rate limiting, and comprehensive monitoring. Designed for high-availability enterprise applications.",
        category: "backend",
        technologies: ["Python", "FastAPI", "Docker", "Kubernetes", "Redis", "PostgreSQL", "Prometheus", "Grafana"],
        icon: "fas fa-network-wired",
        year: "2024",
        linesOfCode: "25000",
        status: "Completed",
        features: [
            "API Gateway with routing",
            "Microservices architecture",
            "Load balancing and failover",
            "Rate limiting and throttling",
            "Authentication and authorization",
            "Request/response transformation",
            "Comprehensive logging",
            "Performance monitoring"
        ],
        microservices: [
            "User Management Service",
            "Authentication Service",
            "Notification Service",
            "File Storage Service",
            "Analytics Service",
            "Payment Processing Service"
        ],
        liveUrl: null,
        githubUrl: null
    },
    {
        id: 10,
        title: "Data Analytics Dashboard",
        description: "Interactive data analytics dashboard with real-time visualizations, custom reporting, and automated insights generation. Features include data connectors for multiple sources and advanced filtering capabilities.",
        category: "fullstack",
        technologies: ["React", "D3.js", "Python", "FastAPI", "PostgreSQL", "Redis", "Apache Kafka", "Docker"],
        icon: "fas fa-chart-bar",
        year: "2024",
        linesOfCode: "33000",
        status: "Completed",
        features: [
            "Real-time data visualization",
            "Custom dashboard builder",
            "Automated report generation",
            "Multiple data source connectors",
            "Advanced filtering and segmentation",
            "Collaborative dashboard sharing",
            "Export capabilities (PDF, Excel)",
            "Mobile-responsive design"
        ],
        visualizations: [
            "Line Charts & Time Series",
            "Bar Charts & Histograms",
            "Pie Charts & Donut Charts",
            "Scatter Plots & Bubble Charts",
            "Heatmaps & Geographic Maps",
            "Funnel & Conversion Charts",
            "KPI Indicators & Gauges",
            "Custom Interactive Widgets"
        ],
        liveUrl: null,
        githubUrl: null
    }
];

// Export for global access
window.projectsData = projectsData;
