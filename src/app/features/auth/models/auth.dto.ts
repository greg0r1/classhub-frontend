/**
 * DTOs pour l'authentification
 * Ces interfaces correspondent aux DTOs du backend NestJS
 * et seront remplacées par le client API généré
 */

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'coach' | 'member';
    organizationId: string;
  };
}
