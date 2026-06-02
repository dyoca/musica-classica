// Importa o módulo axios para fazer requisições HTTP
import axios from "axios";
// Cria uma instância do axios com a URL base da API
const api = axios.create({
  baseURL: "http://localhost:3000"
});
// Adiciona um interceptador às requisições para incluir o token JWT
api.interceptors.request.use((config) => {
  // Obtém o token armazenado no localStorage
  const token = localStorage.getItem("token");
  // Se o token existe, adiciona-o ao header de autorização
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Retorna a configuração modificada
  return config;
});
// Exporta a instância do axios configurada para uso em todo o projeto
export default api;