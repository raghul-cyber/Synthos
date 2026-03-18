import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth
export const register = async (email, name) => {
  const { data } = await apiClient.post('/api/auth/register', { email, name });
  return data;
};

export const login = async (email) => {
  const { data } = await apiClient.post('/api/auth/login', { email });
  return data;
};

export const getCurrentUser = async (userId) => {
  const { data } = await apiClient.get(`/api/auth/me/${userId}`);
  return data;
};

// Skills
export const searchSkills = async (query) => {
  if (!query) return [];
  const { data } = await apiClient.get(`/api/skills/search?q=${encodeURIComponent(query)}`);
  return data;
};

export const getSkillOntology = async () => {
  const { data } = await apiClient.get('/api/skills/ontology');
  return data;
};

export const addUserSkill = async (userId, skillId, proficiency) => {
  const { data } = await apiClient.post('/api/skills/user', { user_id: userId, skill_id: skillId, proficiency });
  return data;
};

export const removeUserSkill = async (userId, skillId) => {
  const { data } = await apiClient.delete(`/api/skills/user/${userId}/${skillId}`);
  return data;
};

export const getUserSkills = async (userId) => {
  const { data } = await apiClient.get(`/api/skills/user/${userId}`);
  return data;
};

export const getSkillAdjacency = async (skillId) => {
  const { data } = await apiClient.get(`/api/skills/adjacency/${skillId}`);
  return data;
};

// Market
export const getMarketOverlay = async (userId) => {
  const { data } = await apiClient.get(`/api/market/overlay/${userId}`);
  return data;
};

// Paths
export const getCareerPaths = async (userId) => {
  const { data } = await apiClient.get(`/api/paths/${userId}`);
  return data;
};

export const getPathDetail = async (userId, pathId) => {
  const { data } = await apiClient.get(`/api/paths/${userId}/${pathId}`);
  return data;
};

export const getLearningPlan = async (userId, pathId) => {
  const { data } = await apiClient.get(`/api/paths/${userId}/${pathId}/plan`);
  return data;
};

// Intelligence
export const buildKnowledgeGraph = async (skillIds) => {
  const { data } = await apiClient.post('/api/intelligence/graph', { skill_ids: skillIds });
  return data;
};

export const getPortfolioInsight = async (userId) => {
  const { data } = await apiClient.post('/api/intelligence/insight', { user_id: userId });
  return data;
};
