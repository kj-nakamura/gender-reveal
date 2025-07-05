-- 既存の外部キー制約を一度削除
alter table public.profiles drop constraint profiles_id_fkey;

-- ON DELETE CASCADE 付きで外部キー制約を再追加
alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id)
  references auth.users (id)
  on delete cascade;