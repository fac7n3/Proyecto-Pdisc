-- Update store logos based on the generated IA mockups
update public.stores set logo_url = '../Assets/images/mockups/logo_ferreteria_1782235257665.png' where name = 'Ferretería El Clavo';
update public.stores set logo_url = '../Assets/images/mockups/logo_tecno_1782235266278.png' where name = 'TecnoCenter Baradero';
update public.stores set logo_url = '../Assets/images/mockups/logo_moda_1782235274778.png' where name = 'Indumentaria La Moda';
update public.stores set logo_url = '../Assets/images/mockups/logo_limpieza_1782235283399.png' where name = 'Todo Limpio S.A.';
update public.stores set logo_url = '../Assets/images/mockups/logo_panaderia_1782235292661.png' where name = 'Panadería El Sol';
update public.stores set logo_url = '../Assets/images/mockups/logo_bebidas_1782235309803.png' where name = 'Bebidas La Esquina';
update public.stores set logo_url = '../Assets/images/mockups/logo_kiosco_1782235321036.png' where name = 'Kiosco El Paso';
update public.stores set logo_url = '../Assets/images/mockups/logo_petshop_1782235331554.png' where name = 'PetShop Huellitas';
update public.stores set logo_url = '../Assets/images/mockups/logo_farmacia_1782235340789.png' where name = 'Farmacia Central';
update public.stores set logo_url = '../Assets/images/mockups/logo_deportes_1782235349776.png' where name = 'Deportes Maratón';

-- Update product images based on their category
-- We first update by category slug
update public.products
set image_url = '../Assets/images/mockups/prod_herramientas_1782235368387.png'
where category_id in (select id from public.categories where slug = 'ferreteria');

update public.products
set image_url = '../Assets/images/mockups/prod_tecnologia_1782235378748.png'
where category_id in (select id from public.categories where slug = 'tecnologia');

update public.products
set image_url = '../Assets/images/mockups/prod_ropa_1782235388688.png'
where category_id in (select id from public.categories where slug = 'indumentaria');

update public.products
set image_url = '../Assets/images/mockups/prod_limpieza_1782235399097.png'
where category_id in (select id from public.categories where slug = 'limpieza');

update public.products
set image_url = '../Assets/images/mockups/prod_panaderia_1782235409695.png'
where category_id in (select id from public.categories where slug = 'panaderia');

update public.products
set image_url = '../Assets/images/mockups/prod_bebidas_1782235426021.png'
where category_id in (select id from public.categories where slug = 'bebidas');

update public.products
set image_url = '../Assets/images/mockups/prod_kiosco_1782235437519.png'
where category_id in (select id from public.categories where slug = 'kiosco');

-- For the ones that failed rate limit, keep the default generic placeholder
update public.products
set image_url = '../Assets/images/placeholder.png'
where category_id in (select id from public.categories where slug in ('mascotas', 'farmacia', 'deportes'));
