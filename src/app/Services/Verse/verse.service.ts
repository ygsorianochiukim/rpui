import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerseService {

  constructor() { }
  private verses = [
    { ref: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
    { ref: 'Philippians 4:6', text: 'Do not be anxious about anything...' },
    { ref: 'John 3:16', text: 'For God so loved the world...' },
    { ref: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart...' },
    { ref: 'Isaiah 40:31', text: 'Those who hope in the Lord will renew their strength...' },
  ];
  getLocalVerseFor(date = new Date()) {
    const dayIndex = Math.floor(
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000)
      % this.verses.length
    );
    return this.verses[dayIndex];
  }
}
