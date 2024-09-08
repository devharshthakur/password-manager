// types/errorTypes.ts

export type ErrorType = {
  code?: number; // MongoDB error code (e.g., 11000 for duplicate key error)
  statusCode?: number; // HTTP status code if you're using it elsewhere
  message: string; // Error message
  stack?: string; // Stack trace (optional)
};

export interface inputData {
  label: string;
  encryptedUsername: string;
  encryptedPassword: string;
}
