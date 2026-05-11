# Proof of Grind - Todo List App

"Proof of Grind" is a modern and feature-rich todo list application designed to help you track your tasks, stay organized, and share your accomplishments. It's more than just a simple todo list; it's a tool to visualize your progress and celebrate your hard work.

## Features

*   **User Authentication**: Secure user authentication powered by Supabase.
*   **CRUD Operations**: Full Create, Read, Update, and Delete functionality for your todos.
*   **Advanced Filtering**: Filter tasks by their status (all, active, completed), category, and priority.
*   **Flexible Sorting**: Sort your tasks by due date, priority, or category to focus on what matters most.
*   **Custom Categories**: Organize your tasks with custom categories that fit your workflow.
*   **Share Your Grind**: Generate a shareable link to showcase your completed tasks to others.
*   **Toast Notifications**: Get instant feedback on your actions with non-intrusive toast notifications.
*   **Sleek & Responsive Design**: A beautiful and intuitive user interface that works seamlessly across all devices.

## Tech Stack

*   **Frontend**:
    *   [React](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
*   **Backend & Authentication**:
    *   [Supabase](https://supabase.io/)
*   **UI Components & Libraries**:
    *   [Radix UI](https://www.radix-ui.com/)
    *   [Lucide React](https://lucide.dev/guide/packages/lucide-react) (for icons)
    *   [Framer Motion](https://www.framer.com/motion/) (for animations)
    *   [Sonner](https://sonner.emilkowal.ski/) (for toast notifications)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or higher)
*   npm

### Installation & Setup

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your-username/proof-of-grind.git
    cd proof-of-grind
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

3.  **Set up environment variables**
    -   Create a free Supabase project at [supabase.com](https://supabase.com/).
    -   In your Supabase project dashboard, go to **Settings** > **API**.
    -   Find your **Project URL** and **anon (public) API Key**.
    -   Rename the `.env.example` file to `.env` and add your Supabase credentials:
        ```env
        VITE_SUPABASE_URL=YOUR_SUPABASE_URL
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

4.  **Run the development server**
    ```sh
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view the app in your browser.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Design

*   Find the Figma template [here](https://www.figma.com/design/j9z2cEdQB25J8pVD4k8v8n/Todo-List-App-Design).
