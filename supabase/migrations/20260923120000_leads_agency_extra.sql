-- Campo de mensagem do formulário de contato (agência).
-- Aplica no projeto compartilhado angular-portfolio na tabela public.leads.
alter table public.leads
  add column if not exists name text,
  add column if not exists message text;