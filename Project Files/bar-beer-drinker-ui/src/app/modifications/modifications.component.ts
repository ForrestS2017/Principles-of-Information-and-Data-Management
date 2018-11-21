import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/components/common/selectitem';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.component.html',
  styleUrls: ['./modifications.component.css']
})
export class ModificationsComponent implements OnInit {
    
  action: string;
  actionSelect: SelectItem[];
  result: string;
  insert_table: string;
  insert_rows: string;
  delete_table: string;
  delete_condition: string;
  update_table: string;
  update_set: string;
  update_where: string;

  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.actionSelect = [
        { value: 'insert', label: 'Insert' },
        { value: 'update', label: 'Update' },
        { value: 'delete', label: 'Delete' },
    ];
  }

  
  showAction(event) {
    this.action = event;
    this.result = null;
  }
  
  insert_row() {
      if (this.insert_table !== null && this.insert_table !== undefined && this.insert_table.length > 0
          && this.insert_rows !== null && this.insert_rows !== undefined && this.insert_rows.length > 0) {
          this.result = 'Inserting row. . .';
          this.http.get<string>('/api/insert/' + this.insert_table + '/' + this.insert_rows).subscribe(
            data => {
                this.result = data;
            }, error => {
                this.result = 'Could not insert row';
            }
          );
      }
  }
  
  delete_row() {
       if (this.delete_table !== null && this.delete_table !== undefined && this.delete_table.length > 0
          && this.delete_condition !== null && this.delete_condition !== undefined && this.delete_condition.length > 0) {
          this.result = 'Deleting rows. . .';
          this.http.get<string>('/api/delete/' + this.delete_table + '/' + this.delete_condition).subscribe(
            data => {
                this.result = data;
            }, error => {
                this.result = 'Could not delete rows';
            }
          );
      }     
  }
  
  update_row() {
        if (this.update_table !== null && this.update_table !== undefined && this.update_table.length > 0
          && this.update_set !== null && this.update_set !== undefined && this.update_set.length > 0
          && this.update_where !== null && this.update_where !== undefined && this.update_where.length > 0) {
          this.result = 'Updating rows. . .';
          this.http.get<string>('/api/update/' + this.update_table + '/' + this.update_set + '/' + this.update_where).subscribe(
            data => {
                this.result = data;
            }, error => {
                this.result = 'Could not update rows';
            }
          );
      }        
  }
  
}
