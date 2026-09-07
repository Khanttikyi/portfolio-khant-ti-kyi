import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.services';
import { Session, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly sessionSubject =
    new BehaviorSubject<Session | null>(null);

  readonly session$ = this.sessionSubject.asObservable();

  private readonly userSubject =
    new BehaviorSubject<User | null>(null);

  readonly user$ = this.userSubject.asObservable();

  constructor(
    private readonly supabaseService: SupabaseService
  ) {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    const {
      data: { session }
    } = await this.supabaseService.client.auth.getSession();

    this.updateAuthState(session);

    this.supabaseService.client.auth.onAuthStateChange(
      (_event, session) => {
        this.updateAuthState(session);
      }
    );
  }

  private updateAuthState(session: Session | null): void {
    this.sessionSubject.next(session);
    this.userSubject.next(session?.user ?? null);
  }

  async login(
    email: string,
    password: string
  ): Promise<{ error: string | null }> {

    const {
      data,
      error
    } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        error: error.message
      };
    }

    this.updateAuthState(data.session);

    return {
      error: null
    };
  }

  async logout(): Promise<void> {
    await this.supabaseService.client.auth.signOut();

    this.updateAuthState(null);
  }

  async getSession(): Promise<Session | null> {
    const {
      data: { session }
    } = await this.supabaseService.client.auth.getSession();

    return session;
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();

    return !!session;
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get currentSession(): Session | null {
    return this.sessionSubject.value;
  }
}