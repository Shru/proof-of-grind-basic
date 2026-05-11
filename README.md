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

### Prerequisites

*   Node.js (v18 or higher)
*   npm
*   A [Supabase](https://supabase.com/) project

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
    -   In your Supabase project dashboard, go to **Settings** → **API**.
    -   Find your **Project URL** and **anon (public) API Key**.
    -   Copy `.env.example` to `.env` and fill in your credentials:
        ```env
        VITE_SUPABASE_URL=YOUR_SUPABASE_URL
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

4.  **Create the database table**
    -   In your Supabase dashboard, go to **SQL Editor** and run:
        ```sql
        CREATE TABLE kv_store_92eeb12f (
          key TEXT NOT NULL PRIMARY KEY,
          value JSONB NOT NULL
        );
        ```

5.  **Deploy the Edge Function**
    -   Download the [Supabase CLI](https://github.com/supabase/cli/releases/latest) binary for your platform.
    -   Login and link your project:
        ```sh
        supabase login
        supabase link --project-ref YOUR_PROJECT_REF
        ```
    -   Deploy the function:
        ```sh
        supabase functions deploy <function-name> --use-api
        ```
    -   In the Supabase dashboard, go to **Edge Functions** → **Manage secrets** and add:
        -   `SB_URL` = your Supabase project URL
        -   `SB_SERVICE_ROLE_KEY` = your service role key (from **Settings** → **API** → `service_role`)

6.  **Run the development server**
    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view the app in your browser.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Design

*   Find the Figma template [here](https://www.figma.com/design/j9z2cEdQB25J8pVD4k8v8n/Todo-List-App-Design).
