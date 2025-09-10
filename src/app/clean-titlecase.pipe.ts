import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanTitlecase',
  standalone: true
})
export class CleanTitlecasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const cleaned = value.replace(/[^a-zA-Z0-9 ]/g, '');
    return cleaned
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
