This is starter template for [Learn Next.js](https://nextjs.org/learn).
### Construction Company Resource Management Application - Client-Side Documentation

#### 1. **📁 Folder Structure Overview**
The folder structure is organized into logical modules, ensuring that each part of the application is modular and easy to maintain. The primary components include UI elements, data handling hooks, pages for different entities (suppliers, projects, inventory), and state management using Redux (RTK and RTK-Query).

#### 2. **⚙️ Components Breakdown**

- **@extended**: This contains reusable components such as custom buttons, avatars, tooltips, progress indicators, and transitions.
    - **AnimateButton.tsx**: Custom button with animation.
    - **Avatar.tsx**: Avatar component used across the UI.
    - **Tooltip.tsx**: Custom tooltip for providing additional information on hover.
  
- **cards**: Contains the UI card components, like `AuthFooter.tsx` used in authentication screens.
  
- **logo**: Stores logo-related components, including `LogoIcon.tsx` and `LogoMain.tsx` for branding elements.
  
- **third-party**: Custom wrappers for third-party libraries like `Notistack` for notifications and `SimpleBar` for scrollbars.

#### 3. **📄 Pages**
- **accounting**: Manages the accounting module with reporting features. Page-specific logic for displaying and managing accounting data.
  
- **inventory**: Handles inventory management, including viewing and updating materials. Uses React Table for tabular data presentation.
  
- **projects**: Displays a list of projects and their details. Each project is managed on a separate page (`[id].tsx`) where data is dynamically loaded based on the project ID.

- **suppliers**: Manages the supplier entities, allowing users to view, edit, and create suppliers. Integrated with Redux for state management.
  
- **requests**: Manages material requests for projects, allowing users to create, update, and track requests. The `[id].tsx` page dynamically renders request details.

#### 4. **🛠️ Hooks**

- **useConfig.ts**: Handles app-level configurations (e.g., theme, language).
  
- **usePagination.ts**: Provides pagination utilities for managing large datasets, integrated with RTK-Query for data fetching.

- **useUser.ts**: Manages user authentication and profile information, interacting with the `/api/auth` endpoints.

#### 5. **🔗 State Management**
Redux Toolkit (RTK) is used for centralized state management. Each module (accounting, projects, suppliers, etc.) has its own slice in `store/reducers`. This enables efficient state management and data fetching with RTK-Query.

- **materialsSlice.ts**: Handles CRUD operations for the materials in the inventory.
  
- **projectsSlice.ts**: Manages project data, including fetching, adding, and updating projects.
  
- **suppliersSlice.ts**: Handles supplier data management, including interactions with the backend via RTK-Query.

#### 6. **🔄 Data Fetching & API Interaction**

The application utilizes RTK-Query for data fetching. This approach provides caching, automatic updates, and efficient server interactions. Key data fetching occurs within the slices:
  
- **materialsSlice.ts**: Fetches inventory data.
  
- **projectsSlice.ts**: Fetches project data.

All API endpoints follow the Next.js convention (e.g., `/api/auth/login.ts`) and are integrated with the application’s state management.

#### 7. **📝 Form Handling with Formik and Yup**
The application uses Formik for form handling and validation, while Yup handles form validation schemas.

- **Example Usage**: In pages like `requests/index.tsx`, Formik forms are implemented to handle request creation, with Yup schemas validating fields like request quantity, project association, and material details.

#### 8. **🎨 UI Styling with MUI**
Material-UI (MUI) is used for UI components, providing pre-built components and styling. The overrides in the `themes` folder allow customization of MUI components.

- **themes/overrides**: Contains style overrides for specific components like `Button`, `Checkbox`, `Table`, etc.
  
- **themes/palette.ts**: Defines the color palette for the application’s theme.

#### 9. **📊 Tables with React Table**
React Table is used to display large datasets in the application. For example, the `RequestsTable.tsx` and `InventoryTable.tsx` components utilize React Table to handle dynamic rendering, pagination, and sorting of data.

#### 10. **🔧 Global Utilities**

- **utils/axios.ts**: Custom axios instance with interceptors for handling API requests.
  
- **utils/formatUtils.ts**: Contains utility functions for formatting data (e.g., date formatting).
  
- **utils/mock-data.ts**: Provides mock data for testing and development purposes.

#### 11. **🔐 Authentication and Authorization**

Authentication is handled using NextAuth, integrated in the `pages/api/auth/[...nextauth].tsx` file. The app uses the following guards to restrict access:

- **route-guard/AuthGuard.tsx**: Protects routes that require authentication.
  
- **route-guard/GuestGuard.tsx**: Restricts access for authenticated users on certain pages (e.g., login, register).

---

### Best Practices and Development Notes

- **Component Reusability**: The components in the `@extended` folder are designed to be reusable across different pages, following DRY (Don't Repeat Yourself) principles.

- **State Normalization**: Redux Toolkit with RTK-Query ensures a normalized state, improving performance and reducing unnecessary re-renders.

- **UI Consistency**: With Material-UI’s theme overrides, the application maintains a consistent look and feel across all pages.
