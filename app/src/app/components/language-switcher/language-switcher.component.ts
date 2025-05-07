import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button 
        [class.active]="currentLang === 'en'"
        (click)="switchLanguage('en')"
        class="lang-btn">
        EN
      </button>
      <button 
        [class.active]="currentLang === 'ja'"
        (click)="switchLanguage('ja')"
        class="lang-btn">
        日本語
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .lang-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      color: #4b5563;

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }

      &.active {
        background: #ec4899;
        color: white;
        border-color: #ec4899;
      }
    }
  `]
})
export class LanguageSwitcherComponent {
  currentLang: 'en' | 'ja';

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.getCurrentLang();
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  switchLanguage(lang: 'en' | 'ja') {
    this.languageService.setLanguage(lang);
  }
} 