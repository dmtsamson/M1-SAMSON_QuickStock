import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  items: Item[] = [];
  loading = true;

  // uniqueness controls
  q = '';
  brand: string = 'ALL';
  sortBy: 'name' | 'code' | 'brand' | 'unitPrice' = 'name';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(private api: ItemService, private router: Router) {}

  ngOnInit(): void {
    this.api.list().subscribe({
      next: res => { this.items = res; this.loading = false; },
      error: _ => { this.loading = false; }
    });
  }

  // brand options
  get brands(): string[] {
    const set = new Set(this.items.map(i => i.brand));
    return Array.from(set.values()).sort();
  }

  // filtered + sorted rows
  get filtered(): Item[] {
    const v = this.q.trim().toLowerCase();
    let rows = this.items.filter(it => {
      const matchesText =
        it.name.toLowerCase().includes(v) ||
        it.code.toLowerCase().includes(v) ||
        it.brand.toLowerCase().includes(v);
      const matchesBrand = this.brand === 'ALL' || it.brand === this.brand;
      return matchesText && matchesBrand;
    });

    rows = rows.sort((a: any, b: any) => {
      const dir = this.sortDir === 'asc' ? 1 : -1;
      let A = a[this.sortBy], B = b[this.sortBy];
      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();
      if (A < B) return -1 * dir;
      if (A > B) return  1 * dir;
      return 0;
    });

    return rows;
  }

  toggleSort(field: 'name'|'code'|'brand'|'unitPrice') {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = 'asc';
    }
  }

  totalValue(): number {
    return this.filtered.reduce((s, it) => s + (Number(it.unitPrice) || 0), 0);
  }

  edit(it: Item){ this.router.navigate(['/items', it.id]); }
  del(it: Item){
    if (!confirm(`Delete ${it.name}?`)) return;
    this.api.remove(it.id!).subscribe(() =>
      this.items = this.items.filter(x => x.id !== it.id)
    );
  }

  // proper trackBy function
  trackById(index: number, it: Item) { return it.id ?? index; }
}
