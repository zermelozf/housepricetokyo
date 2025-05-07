import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-giscus-comments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="comments-section">
      <h2>Comments</h2>
      <div class="giscus-container">
        <div id="giscus"></div>
      </div>
    </div>
  `,
  styles: [`
    .comments-section {
      margin: 2rem 0;
      padding: 1rem;
    }

    h2 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .giscus-container {
      width: 100%;
      min-height: 400px;
    }

    @media (max-width: 600px) {
      .comments-section {
        padding: 0.5rem;
      }
    }
  `]
})
export class GiscusCommentsComponent implements OnInit {
  ngOnInit() {
    // Add Giscus script
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', 'zermelozf/tokyohouseprice');
    script.setAttribute('data-repo-id', 'R_kgDOOjNgVw');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOOjNgV84Cp3kB');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');
    document.getElementById('giscus')?.appendChild(script);
  }
} 