import { supabase } from '../../supabase.client';
import { LoginDto, RegisterDto } from '../validation/auth.validation'
import { PrismaClient } from '@prisma/client'

export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async register(data: RegisterDto) {
    try {
      // Register with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      })

      if (error) throw error;

      if (!authData.user) {
        throw new Error('Registration failed');
      }

      // Create user profile in your database
      const user = await this.prisma.user.create({
        data: {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: data.role,
          [data.role === 'JOB_SEEKER' ? 'jobSeeker' : 'jobPoster']: {
            create: data.role === 'JOB_SEEKER' 
              ? {
                  education: data.education,
                  skills: data.skills || []
                }
              : {
                  company: data.company,
                  companyDescription: data.companyDescription
                }
          }
        },
        include: {
          jobSeeker: true,
          jobPoster: true
        }
      });

      return {
        user,
        session: authData.session
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(data: LoginDto) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) throw error;

      // Get user profile from your database
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
        include: {
          jobSeeker: true,
          jobPoster: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        user,
        session: authData.session
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password'
    });
    
    if (error) throw error;
  }

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  }
}