import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  email = '';
  isSubmitting = false;
  message = '';
  messageType = '';
  
  // Countdown timer
  countdown = {
    days: 15,
    hours: 8,
    minutes: 30,
    seconds: 45
  };
  
  private countdownInterval: any;
  private launchDate = new Date('2025-08-15T00:00:00');
  
  // Background elements
  codeLines = [
    'const developer = { passionate: true };',
    'function createAwesome() { return magic; }',
    'if (coding) { wear(onlydevs); }',
    'class Developer extends Human { }',
    'npm install @onlydevs/style',
    'git commit -m "Added style to life"',
    'console.log("Hello, World!");',
    'const style = new OnlyDevs();',
    'export default Awesome;',
    'import { Style } from "onlydevs";',
    'while (true) { code(); }',
    'const coffee = fuel.for(developers);',
    'sudo make me a sandwich',
    'git push origin awesome',
    'docker run --rm happiness'
  ];
  
  floatingIcons = [
    'code', 'computer', 'terminal', 'bug_report', 'memory'
  ];

  ngOnInit(): void {
    this.startCountdown();
    setTimeout(() => {
      this.initializeBackgroundElements();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.launchDate.getTime() - now;

    if (distance > 0) {
      this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    } else {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
    }
  }

  initializeBackgroundElements(): void {
    try {
      const codeElements = document.querySelectorAll('.code-line');
      codeElements.forEach((element: any, index) => {
        if (element) {
          element.style.left = Math.random() * 100 + '%';
          element.style.animationDelay = Math.random() * 10 + 's';
        }
      });

      const iconElements = document.querySelectorAll('.floating-icon');
      iconElements.forEach((element: any, index) => {
        if (element) {
          element.style.left = Math.random() * 100 + '%';
          element.style.top = Math.random() * 100 + '%';
          element.style.animationDelay = Math.random() * 6 + 's';
        }
      });
    } catch (error) {
      console.log('Background elements initialization skipped');
    }
  }

  onSubscribe(): void {
    if (!this.email || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    setTimeout(() => {
      console.log('Email subscribed:', this.email);
      
      this.message = 'Thank you! You\'ll receive our updates soon! 🚀';
      this.messageType = 'success';
      this.email = '';
      this.isSubmitting = false;

      setTimeout(() => {
        this.message = '';
      }, 5000);
    }, 2000);
  }
}