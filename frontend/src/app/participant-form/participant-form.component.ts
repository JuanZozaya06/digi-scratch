import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Participant } from '../models/demo.models';

@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.scss']
})
export class ParticipantFormComponent implements OnInit {
  @Input() initialValue: Participant | null = null;
  @Output() submitted = new EventEmitter<Participant>();

  participantForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.participantForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentId: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.initialValue) {
      this.participantForm.patchValue(this.initialValue);
    }
  }

  onSubmit(): void {
    if (this.participantForm.invalid) {
      this.participantForm.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.participantForm.getRawValue() as Participant);
  }

  hasError(controlName: string, errorName?: string): boolean {
    const control = this.participantForm.get(controlName);

    if (!control || !control.touched) {
      return false;
    }

    if (!errorName) {
      return control.invalid;
    }

    return control.hasError(errorName);
  }
}
