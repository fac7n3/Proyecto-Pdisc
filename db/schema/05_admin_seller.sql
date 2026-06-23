-- Phase 3: Admin and Seller Onboarding enhancements

-- 1. Extend seller_requests table with more detailed fields
alter table public.seller_requests 
  add column if not exists cuit text,
  add column if not exists address text,
  add column if not exists category_slug text, -- to store the main category
  add column if not exists phone text;

-- Admin policies for seller_requests (if not already fully covered)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'seller_requests' and policyname = 'seller_requests_select_admin'
  ) then
    create policy seller_requests_select_admin
      on public.seller_requests for select to authenticated
      using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), 'cliente') = 'admin');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'seller_requests' and policyname = 'seller_requests_update_admin'
  ) then
    create policy seller_requests_update_admin
      on public.seller_requests for update to authenticated
      using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), 'cliente') = 'admin');
  end if;
end $$;

-- 2. Create the RPC function to approve a seller
create or replace function public.approve_seller_request(req_id uuid)
returns void
language plpgsql
security definer -- runs as superuser to allow updating profiles and app_metadata
set search_path = public
as $$
declare
  v_req record;
  v_store_id uuid;
begin
  -- Fetch the request
  select * into v_req
  from public.seller_requests
  where id = req_id and status = 'pending';

  if not found then
    raise exception 'Request not found or not pending';
  end if;

  -- 1. Create the store
  insert into public.stores (owner_id, cuit, name, address, phone, status)
  values (v_req.user_id, v_req.cuit, v_req.shop_name, v_req.address, v_req.phone, 'approved')
  returning id into v_store_id;

  -- 2. Update the request status
  update public.seller_requests
  set status = 'approved', updated_at = now()
  where id = req_id;

  -- 3. Update the user's role in profiles
  update public.profiles
  set role = 'vendedor'
  where id = v_req.user_id;

  -- 4. Update the user's app_metadata in auth.users (requires superuser, hence security definer)
  update auth.users
  set raw_app_meta_data = 
    coalesce(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', 'vendedor')
  where id = v_req.user_id;
  
end;
$$;
