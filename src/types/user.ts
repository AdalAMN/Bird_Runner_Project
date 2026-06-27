export interface UserInput {
  name: string;
  email: string;
  password: string;
  majorId: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  majorId: string;
  createdAt: Date;
  updatedAt: Date;
}
