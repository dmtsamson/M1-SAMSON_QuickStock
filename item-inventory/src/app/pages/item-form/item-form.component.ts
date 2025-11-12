import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  model: Item = { name: '', code: '', brand: '', unitPrice: 0 };
  isEdit = false;
  saving = false; // <-- added

  constructor(private api: ItemService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEdit = true;
      this.api.get(id).subscribe(res => this.model = res);
    }
  }

  save() {
    if (!this.model.name || !this.model.code || !this.model.brand || this.model.unitPrice < 0) {
      alert('Please fill all fields and ensure Unit Price is ≥ 0.');
      return;
    }
    this.saving = true;
    if (this.isEdit) {
      this.api.update(this.model).subscribe({
        next: () => this.router.navigate(['/items']),
        error: () => this.saving = false
      });
    } else {
      this.api.create(this.model).subscribe({
        next: () => this.router.navigate(['/items']),
        error: () => this.saving = false
      });
    }
  }
}
