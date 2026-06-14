import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Participant } from '../models/promotion.models';

type DocumentPrefix = 'V' | 'E' | 'J';

@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.scss']
})
export class ParticipantFormComponent implements OnInit {
  @Input() initialValue: Participant | null = null;
  @Output() submitted = new EventEmitter<Participant>();

  readonly documentPrefixes: DocumentPrefix[] = ['V', 'E', 'J'];
  participantForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.participantForm = this.formBuilder.group({
      firstName: ['Valeria', Validators.required],
      lastName: ['Morales', Validators.required],
      documentPrefix: ['V', Validators.required],
      documentNumber: ['18452763', [Validators.required, Validators.pattern(/^\d{6,9}$/)]],
      phone: ['0412-7364590', [Validators.required, this.phoneValidator()]],
      email: ['valeria.morales@mail.com', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.initialValue) {
      const parsedDocument = this.parseDocumentId(this.initialValue.documentId);

      this.participantForm.patchValue({
        ...this.initialValue,
        documentPrefix: parsedDocument.prefix,
        documentNumber: parsedDocument.number,
        phone: this.formatPhoneValue(this.initialValue.phone)
      });
    }
  }

  onSubmit(): void {
    if (this.participantForm.invalid) {
      this.participantForm.markAllAsTouched();
      return;
    }

    const formValue = this.participantForm.getRawValue();
    const participant: Participant = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      documentId: `${formValue.documentPrefix}-${formValue.documentNumber}`,
      phone: this.formatPhoneValue(formValue.phone),
      email: formValue.email
    };

    this.submitted.emit(participant);
  }

  normalizeDocumentNumber(): void {
    const documentNumber = this.participantForm.get('documentNumber');
    const normalizedValue = String(documentNumber?.value || '').replace(/\D/g, '').slice(0, 9);

    documentNumber?.setValue(normalizedValue, { emitEvent: false });
  }

  formatPhone(): void {
    const phone = this.participantForm.get('phone');
    const formattedValue = this.formatPhoneValue(phone?.value || '');

    phone?.setValue(formattedValue, { emitEvent: false });
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

  private parseDocumentId(documentId: string): { prefix: DocumentPrefix; number: string } {
    const match = /^([VEJ])-(\d{6,9})$/.exec(documentId);

    if (!match) {
      return { prefix: 'V', number: '' };
    }

    return {
      prefix: match[1] as DocumentPrefix,
      number: match[2]
    };
  }

  private formatPhoneValue(phone: string): string {
    const digitsOnly = String(phone).replace(/\D/g, '').slice(0, 11);

    if (digitsOnly.length <= 4) {
      return digitsOnly;
    }

    return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 11)}`;
  }

  private phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value || '');
      const isValid = /^(0414|0424|0416|0426|0412|0422|02\d{2})-\d{7}$/.test(value);

      return isValid ? null : { phonePrefix: true };
    };
  }
}
