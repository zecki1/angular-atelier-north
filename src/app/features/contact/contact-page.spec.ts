import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { SupabaseLeadsService } from '../../core/services/supabase-leads.service';
import { ContactPage } from './contact-page';

describe('ContactPage', () => {
  let fixture: ComponentFixture<ContactPage>;
  let page: ContactPage;
  let leads: { submit: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    leads = { submit: vi.fn(() => of({ id: '1', demo: true })) };

    await TestBed.configureTestingModule({
      imports: [ContactPage],
      providers: [{ provide: SupabaseLeadsService, useValue: leads }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  function preencher(name: string, email: string, message: string): void {
    page.form.setValue({ name, email, message });
  }

  it('começa no estado idle com formulário inválido', () => {
    expect(page.status()).toBe('idle');
    expect(page.form.valid).toBe(false);
  });

  it('marca os campos inválidos como touched ao enviar vazio', () => {
    page.submit();
    expect(page.status()).toBe('idle');
    expect(page.form.controls.name.touched).toBe(true);
    expect(page.invalid('name')).toBe(true);
    expect(leads.submit).not.toHaveBeenCalled();
  });

  it('envia um lead válido e entra em sucesso', () => {
    preencher('Ana', 'ana@exemplo.com', 'Quero um site novo para a marca.');
    page.submit();

    expect(leads.submit).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@exemplo.com',
      message: 'Quero um site novo para a marca.',
    });
    expect(page.status()).toBe('success');
    expect(page.demo()).toBe(true);
    expect(page.form.value.name).toBe('');
  });

  it('reconhece envio real (sem demo)', () => {
    leads.submit.mockReturnValue(of({ id: '2', demo: false }));
    preencher('Bia', 'bia@exemplo.com', 'Mensagem com mais de dez caracteres.');
    page.submit();

    expect(page.status()).toBe('success');
    expect(page.demo()).toBe(false);
  });

  it('vai para erro quando o serviço falha', () => {
    leads.submit.mockReturnValue(throwError(() => new Error('falhou')));
    preencher('Caio', 'caio@exemplo.com', 'Mensagem válida para o envio.');
    page.submit();

    expect(page.status()).toBe('error');
  });

  it('valida e-mail inválido', () => {
    preencher('Ana', 'sem-arroba', 'mensagem com dez caracteres');
    expect(page.form.controls.email.invalid).toBe(true);
  });
});
