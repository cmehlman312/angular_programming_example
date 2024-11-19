import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'displaysummary',
  templateUrl: './displaysummary.component.html',
  styleUrls: ['./displaysummary.component.css'],
})
export class DisplaysummaryComponent implements OnInit {
  @Input() planForm: any;
  @Input() sidebar: boolean = false;

  cardDisplay: string = 'details';

  constructor() {}

  ngOnInit(): void {}

  titleCase(tempstr: string) {
    return tempstr
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(' ');
  }

  checkFormArraySize(objType: string, objectKey: any) {
    let tempObj;
    let valuesFound = false;

    if (objType === 'array') {
      if (typeof objectKey !== 'undefined') tempObj = objectKey[0];
    } else {
      tempObj = objectKey;
    }

    let sectionEmpty = this.isEmpty(objectKey);
    if (!sectionEmpty)
      for (let prop in tempObj) {
        if (Object.values(tempObj[prop]).length > 0) valuesFound = true;
      }
    return valuesFound;
  }

  isEmpty(obj: any) {
    for (var prop in obj) {
      if (Number.isInteger(parseInt(prop))) {
        let result: any = this.isEmpty(obj[prop]);
        return result;
      }
      if (prop !== '_id') return obj[prop].trim().length > 0 ? false : true;
    }
    return true;
  }

  displaySectionSelected(sectionName: string) {
    this.cardDisplay = sectionName;
  }
}
