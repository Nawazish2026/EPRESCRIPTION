# E-Prescription Application

This is a MERN stack application for creating and managing electronic prescriptions.

## Smart Dashboard

The "Smart Dashboard" feature provides a "Practice Overview" for logged-in doctors. It displays the following information:

- **Patients treated this week:** A bar chart showing the number of patients treated each day for the last seven days.
- **Most Common Diagnosis:** A pie chart showing the most common diagnoses.
- **Recent Prescriptions:** A table of the most recent prescriptions.

### Implementation Details

#### Backend

- The backend is built with Node.js and Express.
- The data is stored in a MongoDB database.
- An aggregation pipeline is used to efficiently calculate the statistics for the charts on the database side.
- The API endpoint for the dashboard is `/api/dashboard/stats`.

#### Frontend

- The frontend is built with React.
- The charts are rendered using `react-chartjs-2`.
- The `SmartDashboard.jsx` component fetches the data from the backend and displays the charts and table.

### Testing

A test file `frontend/src/Components/SmartDashboard.test.jsx` has been created to test the `SmartDashboard` component. You can run the tests using the following command:

```bash
npm test
```

### Running the Application

1.  Start the backend server:

```bash
cd backend
npm start
```

2.  Start the frontend development server:

```bash
cd frontend
npm run dev
```

### Recent Changes

- **Smart Dashboard Update Fix:** Modified the `CartPage.jsx` component to save the prescription to the database before generating the PDF. This ensures that the "Smart Dashboard" charts are updated with the latest prescription data. A redirect to the dashboard has also been added after the prescription is generated.
