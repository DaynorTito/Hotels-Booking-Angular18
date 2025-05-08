export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export interface UserLogin {
  token: string;
  name: string;
}
