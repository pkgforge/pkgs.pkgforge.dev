import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getDB, getJSONFromDB } from './utils/db.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

getDB().then(() => {
  console.log("✅ Database initialized");
  console.log(getJSONFromDB());
})
  .catch((e) => {
    console.warn(e);
    console.warn("⚠️ Database not initialized, using memory cache");
  });