import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'ja';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<Language>('en');
  currentLang$ = this.currentLang.asObservable();

  constructor() {
    // Check if language is stored in localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      this.currentLang.next(savedLang);
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.next(lang);
    localStorage.setItem('language', lang);
  }

  getCurrentLang(): Language {
    return this.currentLang.value;
  }
} 