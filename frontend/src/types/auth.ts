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
    id: number;
    email: string;
    role: string;
  };
}