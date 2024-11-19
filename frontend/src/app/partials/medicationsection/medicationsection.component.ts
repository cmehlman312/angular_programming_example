import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'medicationsection',
  templateUrl: './medicationsection.component.html',
  styleUrls: ['./medicationsection.component.css'],
})
export class MedicationsectionComponent implements OnInit {
  @Input() sections: FormArray;
  @Input() section: FormGroup;
  @Input() sectionIndex: number;
  @Input() sectionControlName: string;
  @Input() sectionDetailName: string;
  @Input() showDetails: boolean = true;
  @Input() showComment: boolean = true;

  testStyle: string = 'odd';

  constructor() {}

  ngOnInit(): void {
    this.testStyle = this.sectionIndex % 2 ? 'even' : 'odd';
  }

  removeTestChild(index: number) {
    this.sections.removeAt(index);
  }
}
