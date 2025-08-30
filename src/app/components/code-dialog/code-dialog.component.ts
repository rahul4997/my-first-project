import { Component, ElementRef, inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

function exactCode(expected: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v: string = (control.value ?? '').toString();
    return v === expected ? null : { codeMismatch: true };
  };
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
  selector: 'app-code-dialog',
  templateUrl: './code-dialog.component.html',
  styleUrl: './code-dialog.component.scss'
})
export class CodeDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('codeInput') codeInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('scroll')     scrollRef?: ElementRef<HTMLElement>;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<CodeDialogComponent>);

  private vv = (window as any).visualViewport as VisualViewport | undefined;
  private vvHandler?: () => void;

  form = this.fb.group({
    // validate EXACTLY "22320"
    code: this.fb.control('', {
      validators: [Validators.required, exactCode('22320')],
      updateOn: 'change'
    }),
  });

  ngAfterViewInit() {
    // Optional autofocus (slight delay so dialog finishes animating)
    setTimeout(() => this.codeInputRef?.nativeElement.focus(), 300);

    // Listen to visual viewport changes (keyboard show/hide) and update bottom inset
    if (this.vv) {
      this.vvHandler = () => {
        const inset = (window.innerHeight - this.vv!.height + this.vv!.offsetTop);
        this.scrollRef?.nativeElement.style.setProperty('--kb-inset', `${Math.max(0, inset)}px`);
      };
      this.vv.addEventListener('resize', this.vvHandler);
      this.vv.addEventListener('scroll', this.vvHandler);
      // initialize once
      this.vvHandler();
    }
  }

  ngOnDestroy() {
    if (this.vv && this.vvHandler) {
      this.vv.removeEventListener('resize', this.vvHandler);
      this.vv.removeEventListener('scroll', this.vvHandler);
    }
  }

  onFocusInput() {
    const el = this.codeInputRef?.nativeElement;
    if (!el) return;

    const scrollCentered = () => el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // If VisualViewport exists, wait for keyboard (viewport) resize once, then scroll
    if (this.vv) {
      const once = () => scrollCentered();
      this.vv.addEventListener('resize', once, { once: true });
      // fallback in case resize fires too soon
      requestAnimationFrame(() => requestAnimationFrame(scrollCentered));
    } else {
      // Fallback for older browsers/WebViews
      setTimeout(scrollCentered, 250);
    }
  }

  onInput() {
    // keep only digits and hard-limit to 5 chars for UX
    const el = this.codeInputRef?.nativeElement;
    if (!el) return;
    const sanitized = el.value.replace(/\D+/g, '').slice(0, 5);
    if (sanitized !== el.value) {
      const pos = sanitized.length;
      el.value = sanitized;
      this.form.get('code')!.setValue(sanitized, { emitEvent: true });
      el.setSelectionRange(pos, pos);
    } else {
      this.form.get('code')!.setValue(sanitized, { emitEvent: true });
    }
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close();
      this.router.navigate(['/gallery']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
