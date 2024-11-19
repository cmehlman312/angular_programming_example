import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'displaymedicationsection',
  templateUrl: './displaymedicationsection.component.html',
  styleUrls: ['./displaymedicationsection.component.css'],
})
export class DisplaymedicationsectionComponent implements OnInit {
  @Input() showDetails: boolean = true;
  @Input() data: any;
  @Input() detailfield: string;
  @Input() detailName: string;
  @Input() showComment: boolean = true;
  @Input() sectionIndex: number;

  detailInformation: string;

  constructor() {}

  ngOnInit(): void {
    Object.keys(this.data).forEach((key) => {
      if (key === this.detailfield) this.detailInformation = this.data[key];
    });
  }
}
