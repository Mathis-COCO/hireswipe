export interface RegisterData {
  email: string;
  password: string;
  role: 'candidat' | 'entreprise';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    email: string;
    role: 'candidat' | 'entreprise';
  };
}

export interface ApiError {
  message: string;
  status: number;
}