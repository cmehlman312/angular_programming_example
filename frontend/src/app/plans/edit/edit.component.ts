import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DialogSaveMessageComponent } from '../../dialogs/dialog-save-message/dialog-save-message.component';
import { DialogErrorMessageComponent } from '../../dialogs/dialog-error-message/dialog-error-message.component';

import { TherapyplansService } from '../../services/therapyplans.service';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'planedit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class PlaneditComponent implements OnInit {
  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  previousPage$: Observable<string>;

  id = this.activatedRoute.snapshot.params['id'];
  pagetype = this.activatedRoute.snapshot.url[0].path;
  pageRoute = this.activatedRoute.snapshot.url[1].path;

  cancelButtonText = 'Cancel';

  foundChanges: any[] = [];
  planFormDefaultValues: any;
  planDetail: any;

  planForm = this.fb.group({
    number: [''],
    medicationname: [''],
    status: [''],
    requestor: [''],
    specialty: this.fb.group({
      rheumatology: new FormControl(false),
      gastroenterology: new FormControl(false),
      neurology: new FormControl(false),
      endocrinology: new FormControl(false),
      supportive: new FormControl(false),
    }),
    requiredlabs: this.fb.array([
      this.fb.group({
        lab: [''],
        interval: [''],
        custominterval: [''],
        comments: [''],
      }),
    ]),
    treatmentinformation: this.fb.array([
      this.fb.group({
        treatment: [''],
        interval: [''],
        custominterval: [''],
      }),
    ]), // no comment section
    treatmentparameters: this.fb.array([
      this.fb.group({
        parameter: [''],
        interval: [''],
        custominterval: [''],
      }),
    ]), // no comment section
    vitals: this.fb.array([
      this.fb.group({
        vitals: [''],
        interval: [''],
        custominterval: [''],
        comments: [''],
      }),
    ]),
    premedications: this.fb.array([
      this.fb.group({
        premedication: [''],
        dose: [''],
        adminduration: [''],
        route: [''],
        frequency: [''],
        rate: [''],
        admininstructions: [''],
        interval: [''],
        custominterval: [''],
        comments: [''],
      }),
    ]),
    hydration: this.fb.array([
      this.fb.group({
        hydration: [''],
        dose: [''],
        adminduration: [''],
        route: [''],
        frequency: [''],
        rate: [''],
        admininstructions: [''],
        interval: [''],
        custominterval: [''],
        comments: [''],
      }),
    ]),
    nonchemomedicationorders: this.fb.array([
      this.fb.group({
        nonchemomedicationorder: [''],
        dose: [''],
        adminduration: [''],
        route: [''],
        frequency: [''],
        rate: [''],
        admininstructions: [''],
        interval: [''],
        custominterval: [''],
        comments: [''],
      }),
    ]),
    postmedications: this.fb.array([
      this.fb.group({
        postmedication: [''],
        dose: [''],
        adminduration: [''],
        route: [''],
        frequency: [''],
        rate: [''],
        admininstructions: [''],
        interval: [''],
        custominterval: [''],
        comments: [''],
      }),
    ]),
    emergencymedications: this.fb.array([
      this.fb.group({
        emergencymedication: [''],
        dose: [''],
        adminduration: [''],
        route: [''],
        frequency: [''],
        rate: [''],
        admininstructions: [''],
        interval: [''],
        custominterval: [''],
        comments: [''],
      }),
    ]),
    takehomemedications: this.fb.array([
      this.fb.group({
        takehomemedication: [''],
        dose: [''],
        adminduration: [''],
        route: [''],
        frequency: [''],
        rate: [''],
        admininstructions: [''],
        interval: [''],
        custominterval: [''],
        comments: [''],
      }),
    ]),
    created: this.fb.group({
      created_date: [new Date()],
      user: [''],
    }),
  });

  requiredlabs(): FormArray {
    return this.planForm.get('requiredlabs') as FormArray;
  }

  requiredlabGroup(): FormGroup {
    return this.fb.group({
      lab: [''],
      interval: [''],
      custominterval: [''],
      comments: [''],
    });
  }

  addRequiredLab() {
    this.requiredlabs().push(this.requiredlabGroup());
  }

  requiredlabFormGroup(): FormGroup {
    return this.planForm.get('requiredlabs') as FormGroup;
  }

  treatmentinformation(): FormArray {
    return this.planForm.get('treatmentinformation') as FormArray;
  }

  treatmentInformationGroup(): FormGroup {
    return this.fb.group({
      treatment: [''],
      interval: [''],
      custominterval: [''],
    });
  }

  addTreatmentInformation() {
    this.treatmentinformation().push(this.treatmentInformationGroup());
  }

  treatmentInformationFormGroup(): FormGroup {
    return this.planForm.get('treatmentinformation') as FormGroup;
  }

  treatmentparameters(): FormArray {
    return this.planForm.get('treatmentparameters') as FormArray;
  }

  treatmentparametersGroup(): FormGroup {
    return this.fb.group({
      parameter: [''],
      interval: [''],
      custominterval: [''],
    });
  }

  addTreatmentParameters() {
    this.treatmentparameters().push(this.treatmentparametersGroup());
  }

  treatmentparametersFormGroup(): FormGroup {
    return this.planForm.get('treatmentparameters') as FormGroup;
  }

  vitals(): FormArray {
    return this.planForm.get('vitals') as FormArray;
  }

  vitalsGroup(): FormGroup {
    return this.fb.group({
      vitals: [''],
      interval: [''],
      custominterval: [''],
      comments: [''],
    });
  }

  addVitals() {
    this.vitals().push(this.vitalsGroup());
  }

  vitalsFormGroup(): FormGroup {
    return this.planForm.get('vitals') as FormGroup;
  }

  premedications(): FormArray {
    return this.planForm.get('premedications') as FormArray;
  }

  premedicationGroup(): FormGroup {
    return this.fb.group({
      premedication: [''],
      dose: [''],
      adminduration: [''],
      route: [''],
      frequency: [''],
      rate: [''],
      admininstructions: [''],
      interval: [''],
      custominterval: [''],
      comments: [''],
    });
  }

  addPremedication() {
    this.premedications().push(this.premedicationGroup());
  }

  premedicationFormGroup(): FormGroup {
    return this.planForm.get('premedications') as FormGroup;
  }

  hydration(): FormArray {
    return this.planForm.get('hydration') as FormArray;
  }

  hydrationGroup(): FormGroup {
    return this.fb.group({
      hydration: [''],
      dose: [''],
      adminduration: [''],
      route: [''],
      frequency: [''],
      rate: [''],
      admininstructions: [''],
      interval: [''],
      custominterval: [''],
      comments: [''],
    });
  }

  addHydration() {
    this.hydration().push(this.hydrationGroup());
  }

  hydrationFormGroup(): FormGroup {
    return this.planForm.get('hydration') as FormGroup;
  }

  nonchemomedicationorders(): FormArray {
    return this.planForm.get('nonchemomedicationorders') as FormArray;
  }

  nonchemomedicationordersGroup(): FormGroup {
    return this.fb.group({
      nonchemomedicationorder: [''],
      dose: [''],
      adminduration: [''],
      route: [''],
      frequency: [''],
      rate: [''],
      admininstructions: [''],
      interval: [''],
      custominterval: [''],
      comments: [''],
    });
  }

  addNonChemoMedicationOrder() {
    this.nonchemomedicationorders().push(this.nonchemomedicationordersGroup());
  }

  nonchemomedicationordersFormGroup(): FormGroup {
    return this.planForm.get('nonchemomedicationorders') as FormGroup;
  }

  postmedications(): FormArray {
    return this.planForm.get('postmedications') as FormArray;
  }

  postmedicationsGroup(): FormGroup {
    return this.fb.group({
      postmedication: [''],
      dose: [''],
      adminduration: [''],
      route: [''],
      frequency: [''],
      rate: [''],
      admininstructions: [''],
      interval: [''],
      custominterval: [''],
      comments: [''],
    });
  }

  addPostMedications() {
    this.postmedications().push(this.postmedicationsGroup());
  }

  postmedicationsFormGroup(): FormGroup {
    return this.planForm.get('postmedications') as FormGroup;
  }

  emergencymedications(): FormArray {
    return this.planForm.get('emergencymedications') as FormArray;
  }

  emergencymedicationsGroup(): FormGroup {
    return this.fb.group({
      emergencymedication: [''],
      dose: [''],
      adminduration: [''],
      route: [''],
      frequency: [''],
      rate: [''],
      admininstructions: [''],
      interval: [''],
      custominterval: [''],
      comments: [''],
    });
  }

  addEmergencyMedication() {
    this.emergencymedications().push(this.emergencymedicationsGroup());
  }

  emergencymedicationsFormGroup(): FormGroup {
    return this.planForm.get('emergencymedications') as FormGroup;
  }

  takehomemedications(): FormArray {
    return this.planForm.get('takehomemedications') as FormArray;
  }

  takehomemedicationsGroup(): FormGroup {
    return this.fb.group({
      takehomemedication: [''],
      dose: [''],
      adminduration: [''],
      route: [''],
      frequency: [''],
      rate: [''],
      admininstructions: [''],
      interval: [''],
      custominterval: [''],
      comments: [''],
    });
  }

  addTakeHomeMedication() {
    this.takehomemedications().push(this.takehomemedicationsGroup());
  }

  takehomemedicationsFormGroup(): FormGroup {
    return this.planForm.get('takehomemedications') as FormGroup;
  }

  sectionGroupElement(data: any) {
    return data as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private therapyplansService: TherapyplansService,
    private _router: Router,
    public dialog: MatDialog,
    private navService: NavService
  ) {
    this.previousPage$ = this.navService.viewPreviousPage;
  }

  ngOnInit(): void {
    if (this.id) {
      this.loadPlanDetail(this.id);
    } else {
      this.planFormDefaultValues = '';
    }

    Object.keys(this.planForm.controls).forEach((key) => {
      let control = this.planForm.get(key)?.valueChanges;
      this.planForm
        .get(key)
        ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((selectedValue: any) => {
          if (
            typeof this.planFormDefaultValues !== 'undefined' &&
            key in this.planFormDefaultValues
          ) {
            if (selectedValue !== this.planFormDefaultValues[key]) {
              this.cancelButtonText = 'Discard Changes';
            } else {
              if (this.foundChanges.hasOwnProperty(key)) {
                this.cancelButtonText = 'Cancel';
              }
            }
          }
        });
    });
  }

  loadPlanDetail(id: string) {
    this.therapyplansService
      .getTherapyPlanById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((plandata: any) => {
        if (this.pageRoute === 'copy') {
          delete plandata.data[0]._id;
          delete plandata.data[0].created;
          delete plandata.data[0].modified_date;
          delete plandata.data[0].number;
          delete plandata.data[0].requestor;
          delete plandata.data[0].status;
          delete plandata.data[0].meeting;
        }
        this.planForm.patchValue(plandata.data[0]);
        this.planFormDefaultValues = this.planForm.value;
      });
  }

  savePlan() {
    this.therapyplansService
      .updateTherapyPlan(this.id, this.planForm.getRawValue())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((savedata: any) => {
        if (Number(savedata.status) === 1) {
          this.therapyplansService
            .unlockPlan(this.id)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((removeLockData: any) => {
              if (removeLockData['status'] === 1) {
                let nextpage = 'plan/detail';
                this.previousPage$.subscribe((pageURL) => {
                  if (pageURL !== '') nextpage = pageURL;
                  this.navService.clearPreviousPage();
                  this.openSavedDialog(savedata.message, [nextpage, this.id]);
                });
              } else this.openErrorDialog(savedata.message);
            });
        } else {
          this.openErrorDialog(savedata.message);
        }
      });
  }

  createPlan() {
    // this.planForm.removeControl('_id');
    this.planForm.patchValue({ status: 'Draft' });
    // this.planForm.patchValue({
    //   created: {
    //     user: this.userdataService.userInfo['fullname'],
    //     created_date: new Date(),
    //   },
    // });

    this.therapyplansService
      .getNextPlanNumber()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((returnedData) => {
        let answeredNumber = returnedData.data[0]['nextNumber'];
        let answeredID = returnedData.data[0]['_id'];
        let tempNumber = parseInt(answeredNumber) + 1;
        let nextNumber = 'TP-' + tempNumber;
        this.planForm.patchValue({ number: nextNumber });

        this.therapyplansService
          .createTherapyPlan(this.planForm.getRawValue())
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((createddata: any) => {
            if (Number(createddata.status) === 1) {
              let savedMessage = createddata.message + ' - ' + nextNumber;
              this.openSavedDialog(savedMessage, ['plan/detail', answeredID]);
            } else {
              this.openErrorDialog(createddata.message);
            }
          });
      });
  }

  discardChangesToPlan() {
    if (this.id) {
      this.therapyplansService
        .unlockPlan(this.id)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((removeLockData: any) => {
          if (removeLockData['status'] === 1) {
            let nextpage = 'plan/detail';
            this.previousPage$
              .pipe(takeUntil(this.ngUnsubscribe$))
              .subscribe((pageURL: string) => {
                if (pageURL !== '') nextpage = pageURL;
                // this.navService.clearPreviousPage();
                this._router.navigate([nextpage, this.id]);
              });
          }
        });
    } else this._router.navigate(['plan']);
  }

  openSavedDialog(message: any, nextRoute: any[]): void {
    const timeout = 5000;
    const dialogRef = this.dialog.open(DialogSaveMessageComponent, {
      data: { savedMessage: message },
    });

    dialogRef.afterOpened().subscribe((_) => {
      setTimeout(() => {
        dialogRef.close();
      }, timeout);
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this._router.navigate(nextRoute);
      });
  }

  openErrorDialog(data: { [x: string]: any }): void {
    const dialogRef = this.dialog.open(DialogErrorMessageComponent, {
      data: data['message'],
    });

    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }
}
