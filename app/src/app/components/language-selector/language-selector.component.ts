import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { LOCALE_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  template: `
    <div class="language-switcher">
      <button 
        (click)="switchLanguage('en-US')" 
        [class.active]="!isJapanese"
        class="lang-btn">
        <span i18n="@@language.english">EN</span>
      </button>
      <button 
        (click)="switchLanguage('ja')" 
        [class.active]="isJapanese"
        class="lang-btn">
        <span i18n="@@language.japanese">日本語</span>
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 0.5rem;
    }

    .lang-btn {
      padding: 0.25rem 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      background: white;
      color: #666;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .lang-btn:hover {
      background-color: #FFF0F5;
      color: #FF69B4;
      border-color: #FF69B4;
    }

    .lang-btn.active {
      background-color: #FF69B4;
      color: white;
      border-color: #FF69B4;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  isJapanese = false;

  constructor(
    private locationStrategy: LocationStrategy,
    @Inject(LOCALE_ID) private localeId: string
  ) {}
  
  ngOnInit(): void {
    // Set current language based on locale ID
    this.isJapanese = this.localeId === 'ja';
  }

  switchLanguage(locale: string) {
    // Check if we need to change
    if ((locale === 'ja' && this.isJapanese) || 
        (locale === 'en-US' && !this.isJapanese)) {
      return; // Already on the right language
    }

    // Get current URL info
    const port = window.location.port;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // In development mode, we need to change the port
    if (port === '4200' || port === '4201') {
      const targetPort = locale === 'ja' ? '4201' : '4200';
      const pathname = this.getCleanPath();
      window.location.href = `${protocol}//${hostname}:${targetPort}${pathname}`;
      return;
    }
    
    // In production mode with English as default (no prefix) and Japanese at /ja
    const pathname = this.getCleanPath();
    
    if (locale === 'ja') {
      // For Japanese, add /ja prefix
      window.location.href = `${protocol}//${hostname}/ja${pathname}`;
    } else {
      // For English, use clean path with no prefix
      window.location.href = `${protocol}//${hostname}${pathname}`;
    }
  }

  /**
   * Gets the current path without any locale prefixes
   */
  private getCleanPath(): string {
    const pathname = window.location.pathname;
    
    // Remove /ja prefix if present
    if (pathname.startsWith('/ja/')) {
      return pathname.substring(3);
    } else if (pathname === '/ja') {
      return '/';
    }
    
    // For English (default), the path is already clean
    return pathname;
  }
} 