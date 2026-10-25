-- شغّلي هذا السكربت في Supabase > SQL Editor بعد إنشاء مشروع.
-- سياسة الإدخال تسمح للزوار بإنشاء طلبات فقط. لا تسمحي بقراءة الطلبات العامة.
create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  area text not null,
  address text not null,
  notes text default '',
  payment_method text not null default 'cash_on_delivery',
  items jsonb not null,
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'new'
);

alter table public.orders enable row level security;

drop policy if exists "Public can submit orders" on public.orders;
create policy "Public can submit orders"
on public.orders
for insert
to anon
with check (
  length(trim(customer_name)) >= 3
  and length(trim(phone)) between 8 and 20
  and length(trim(area)) > 0
  and length(trim(address)) > 0
  and payment_method = 'cash_on_delivery'
  and jsonb_typeof(items) = 'array'
  and total >= 0
);

-- لا تنشئي سياسة SELECT عامة. راجعي الطلبات من لوحة Supabase بعد تسجيل الدخول.
-- مهم: مجموع الأسعار المرسل من المتصفح قابل للتلاعب. قبل تشغيل المتجر على نطاق واسع،
-- انقلي إنشاء الطلب إلى Edge Function/Backend يتحقق من الأسعار من مصدر موثوق.
