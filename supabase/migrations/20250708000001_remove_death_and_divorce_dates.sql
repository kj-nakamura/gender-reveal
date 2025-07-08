-- 没年月日と離婚年月日のフィールドを削除するマイグレーション

-- 1. persons テーブルから date_of_death カラムを削除
ALTER TABLE public.persons DROP COLUMN IF EXISTS date_of_death;

-- 2. marriages テーブルから end_date カラムを削除
ALTER TABLE public.marriages DROP COLUMN IF EXISTS end_date;