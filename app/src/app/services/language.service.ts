import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en-US' | 'ja';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'preferred_language';
  private langSubject = new BehaviorSubject<Language>(this.getInitialLanguage());
  
  currentLang$: Observable<Language> = this.langSubject.asObservable();
  
  constructor() {}
  
  private getInitialLanguage(): Language {
    // Check localStorage first
    const storedLang = localStorage.getItem(this.STORAGE_KEY) as Language;
    if (storedLang && ['en-US', 'ja'].includes(storedLang)) {
      return storedLang;
    }
    
    // Check browser language
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) {
      return 'ja';
    }
    
    // Default to English
    return 'en-US';
  }
  
  getCurrentLang(): Language {
    return this.langSubject.value;
  }
  
  setLanguage(lang: Language): void {
    if (lang !== this.langSubject.value) {
      localStorage.setItem(this.STORAGE_KEY, lang);
      this.langSubject.next(lang);
      this.redirectToLocalizedVersion(lang);
    }
  }
  
  private redirectToLocalizedVersion(lang: Language): void {
    // In production this would redirect to the localized version of the site
    // E.g., from example.com/page to example.com/ja/page
    const currentPath = window.location.pathname;
    const currentLang = this.extractLanguageFromPath(currentPath);
    
    if (currentLang) {
      // Replace language in path
      const newPath = currentPath.replace(`/${currentLang}/`, `/${lang}/`);
      window.location.href = newPath;
    } else {
      // Add language to path
      const newPath = `/${lang}${currentPath}`;
      window.location.href = newPath;
    }
  }
  
  private extractLanguageFromPath(path: string): Language | null {
    const match = path.match(/^\/(en-US|ja)\//);
    return match ? match[1] as Language : null;
  }
} 