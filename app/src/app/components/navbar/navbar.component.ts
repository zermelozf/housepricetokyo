import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LanguageSelectorComponent],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a routerLink="/" class="navbar-brand">
          <img src="logo.svg" alt="Tokyo House Price" class="navbar-logo">
          <span class="navbar-title">Tokyo House Price</span>
        </a>
        
        <button class="hamburger" (click)="toggleMenu()" [class.active]="isMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="navbar-menu" [class.active]="isMenuOpen">
          <div class="nav-links">
            <a routerLink="/" 
               class="navbar-item" 
               routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: true}"
               (click)="closeMenu()" 
               i18n="@@nav.calculator">
              Calculator
            </a>
            <a routerLink="/article" 
               class="navbar-item" 
               routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: false}"
               (click)="closeMenu()"
               i18n="@@nav.article">
              Article
            </a>
          </div>

          <div class="language-switcher">
            <app-language-selector></app-language-selector>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #333;
    }

    .navbar-logo {
      height: 32px;
      margin-right: 0.5rem;
    }

    .navbar-title {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .navbar-menu {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .navbar-item {
      text-decoration: none;
      color: #666;
      font-weight: 500;
      padding: 0.5rem;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .navbar-item:hover {
      color: #FF69B4;
      background-color: #FFF0F5;
    }

    .navbar-item.active {
      color: #FF69B4;
      background-color: #FFF0F5;
    }

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

    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 21px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 10;
    }

    .hamburger span {
      width: 100%;
      height: 3px;
      background-color: #333;
      border-radius: 3px;
      transition: all 0.3s ease;
    }

    .hamburger.active span:nth-child(1) {
      transform: translateY(9px) rotate(45deg);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: translateY(-9px) rotate(-45deg);
    }

    @media (min-width: 769px) {
      .navbar-container {
        justify-content: space-between;
      }

      .navbar-menu {
        flex: 1;
        justify-content: center;
        margin-left: 2rem;
        margin-right: 2rem;
      }

      .nav-links {
        justify-content: center;
        flex: 1;
      }

      .language-switcher {
        margin-left: auto;
      }
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
      }

      .navbar-title {
        font-size: 1.5rem;
      }

      .navbar-logo {
        height: 36px;
      }

      .hamburger {
        display: flex;
      }

      .navbar-menu {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .navbar-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .nav-links {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
      }

      .navbar-item {
        width: 100%;
        padding: 0.75rem;
      }

      .language-switcher {
        width: 100%;
        justify-content: center;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid #eee;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentLang: string;
  isMenuOpen = false;

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.getCurrentLang();
  }
  
  ngOnInit(): void {
    // Subscribe to language changes
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
} 