# Ticket Support Portal — Frontend

A small Vue 3 + TypeScript app for creating, viewing, updating and deleting support tickets.

## Requirements

- Node.js 20.19+ or 22.12+ (required by Vite)
- The backend API running by default on `http://127.0.0.1:8000`

## Setup & Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Check the API URL in `.env`. It should point to where the backend is running:

   ```env
   VITE_BASE_API_URL = 'http://127.0.0.1:8000'
   ```

   Requests are sent to `${VITE_BASE_API_URL}/api/app`, e.g. `http://127.0.0.1:8000/api/app/tickets`.

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (usually http://localhost:5173).

## Features

- **Ticket list (Home page)**: shows all tickets with their title, requester, created date, priority and status.
  - Filter by title, priority and status, then click **Search**.
  - Click **Reset** to clear the filters.
  - Click a ticket to open its details page.
  - Click **Create ticket** to open the creation page.
- **Create ticket**: fill in the title, requester name, priority, status and an optional description, then click **Create ticket**.
- **Ticket details**: shows the ticket in the same form, pre-filled.
  - Edit any field and click **Save changes** to update it.
  - Click **Delete** to remove the ticket (asks for confirmation first).
- **Validation**: errors returned by the API (e.g. a missing title) are shown under the matching field.

## Project Structure

```
src/
├── components/            # Reusable UI components (no UI library)
│   ├── buttons/           #   AppButton
│   └── input-fields/      #   AppTextField (input/textarea), AppSelect
├── composables/           # Page logic and state
│   ├── ticket/            #   useTicket (create/details/update/delete), useTicketList (listing + filters)
│   └── useDropdownList.ts #   Priority/status dropdown options
├── router/                # Routes: Home, TicketCreation, TicketDetails
├── services/
│   ├── api/ticket/        # Ticket API calls plus request/response types
│   └── http/              # Axios instance; converts keys between camelCase (frontend) and snake_case (backend)
├── utils/                 # Formatting helpers (dates, enum labels, error messages)
└── views/                 # Pages: Home, ticket/TicketCreation, ticket/TicketDetails
    └── ticket/components/ #   TicketForm, shared by the creation and details pages
```

## Running Tests

The tests use Vitest and Vue Test Utils. The API is mocked, so the backend does not need to be running.

```bash
npm test             # run once
```

| File                        | What it checks                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tests/http.helper.spec.ts` | Requests are sent in snake_case and responses come back in camelCase.                                                                                        |
| `tests/Home.spec.ts`        | The ticket list shows tickets, the empty state, and the error state (with Retry). Filters are sent to the API, and clicking a ticket opens its details page. |
| `tests/TicketForm.spec.ts`  | Creating a ticket, showing server validation errors under fields, loading and pre-filling a ticket, updating its status, and the "ticket not found" error.   |

## Tech Stack

Vue 3 (`<script setup>`), TypeScript, Vue Router, Axios, Tailwind CSS v4 (classes use the `tw:` prefix), Vite.
