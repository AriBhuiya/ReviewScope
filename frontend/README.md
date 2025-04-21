# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
src/
├── assets/              # Icons, SVGs, logos (optional)
├── components/          # Reusable UI components (Chart, TableRow, etc.)
├── pages/               # Page-level views (e.g., Dashboard.jsx, NotFound.jsx)
├── services/            # Axios API services (api.js or /api/ folder)
├── router/              # react-router config (Router.jsx)
├── App.jsx              # Main entry point
├── main.jsx             # Vite/ReactDOM root
└── index.css            # Tailwind CSS entry

```


| Route   | Page Component | Description                        |
|---------|----------------|------------------------------------|
| `/`     | Dashboard.jsx  | Main dashboard, loads by default   |
| `/jobs` | Jobs.jsx       | Queue/job monitoring page (future) |
| `*`     | NotFound.jsx   | Fallback 404                       |



| Role            | Description                             |
|------------------|-----------------------------------------|
| SearchBar        | Input + “Analyze” button                |
| SentimentChart   | Line chart (Recharts)                   |
| RatingBarChart   | Bar chart (Recharts)                    |
| ThemesCloud      | List or cloud (D3 or Tailwind pills)    |


// services/api.js

```
export const getSentimentOverTime = (appId) => axios.get(`/results/${appId}/sentiment-over-time`);
```