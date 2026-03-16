# Smart RTO Vehicle Intelligence and Risk Analysis System

## Project Description
The Smart RTO Vehicle Intelligence and Risk Analysis System is a comprehensive web-based platform designed to revolutionize vehicle management and monitoring. It features a dual-access role architecture for Citizens and Officers, providing a transparent, efficient, and user-friendly digital environment for transport-related services.

Citizens can seamlessly access vehicle details, view violation records, apply for licenses, and track application statuses. Officers are empowered with robust management tools for vehicle data, violation monitoring, and advanced risk analysis.

## Features
### For Citizens
*   **Profile Management**: Securely manage personal and contact information.
*   **Vehicle Lookup**: Instant access to vehicle registration details and status.
*   **DL Lookup**: Easy verification of Driving License information.
*   **Online Applications**: Submit applications for various RTO services digitally.
*   **Application Tracking**: Real-time tracking of submitted application statuses.
*   **E-Challan Services**: View and pay traffic violations online.
*   **Smart Sahayak**: AI-powered conversational assistant for RTO-related queries.

### For Officers
*   **Admin Dashboard**: High-level overview of revenue trends and key performance indicators.
*   **Application Management**: Streamlined workflow for reviewing and approving applications.
*   **User Management**: Monitor and manage registered users and their activities.
*   **Reporting & Analytics**: Comprehensive reports on revenue and operational metrics.

## Technologies Used
*   **Frontend**: React.js, Tailwind CSS, Lucide React (Icons), Axios, React Router.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (via Mongoose).
*   **Authentication**: JSON Web Token (JWT), BCryptJS.
*   **AI Integration**: OpenAI/Generative AI via specific API endpoints.

## Folder Structure
```text
smart-rto/
├── backend/                # Express.js server and API
│   ├── middleware/         # Auth and validation middleware
│   ├── models/             # Mongoose schemas (User, Vehicle, etc.)
│   ├── routes/             # API route definitions
│   ├── server.js           # Main server entry point
│   └── .env                # Backend environment variables
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # Reusable UI components and layouts
│   │   ├── pages/          # Individual screen/page components
│   │   ├── App.jsx         # Routing and core logic
│   │   └── main.jsx        # Entry point
│   └── tailwind.config.js  # Tailwind CSS configuration
└── README.md               # Project documentation
```

## Installation Steps
1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd smart-rto
    ```

2.  **Install Backend Dependencies**:
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Configure Environment Variables**:
    *   Create a `.env` file in the `backend/` directory.
    *   Add your `MONGO_URI` and `JWT_SECRET`.

## How to Run the Project
1.  **Start the Backend Server**:
    ```bash
    cd backend
    node server.js
    ```

2.  **Start the Frontend Development Server**:
    ```bash
    cd ../frontend
    npm run dev
    ```

3.  **Access the Application**:
    Open [http://localhost:5173](http://localhost:5173) in your web browser.

## Author
**Developed by:** Ishu S
