// Axios calls to backend
import axios from "axios";

// Use a relative path in production so the deployed frontend calls the same host.
// In development, allow a local backend override via VITE_API_URL or default to localhost.
const envApiUrl = import.meta.env.VITE_API_URL;
const isLocalhostOverride =
  envApiUrl === "http://localhost:8000" || envApiUrl === "https://localhost:8000";
const API_BASE_URL = import.meta.env.PROD
  ? isLocalhostOverride
    ? ""
    : envApiUrl || ""
  : envApiUrl || "http://localhost:8000";

const client = axios.create({ baseURL: API_BASE_URL || undefined });

export async function uploadResume(resumeFile, jobDescription) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);

  const { data } = await client.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getSession(sessionId) {
  const { data } = await client.get(`/api/session/${sessionId}`);
  return data;
}
