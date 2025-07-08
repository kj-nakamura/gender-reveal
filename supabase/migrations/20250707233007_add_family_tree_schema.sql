-- 1. 性別を定義するためのカスタム型を作成
CREATE TYPE public.gender_enum AS ENUM ('male', 'female', 'other');

-- 2. family_trees テーブルを作成
-- 家系図そのものを管理します
CREATE TABLE public.family_trees (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.family_trees IS '家系図そのものを管理するテーブル';

-- 3. persons テーブルを作成
-- 家系図に属する人物の情報を管理します
CREATE TABLE public.persons (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tree_id uuid NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
    name text NOT NULL,
    gender public.gender_enum,
    date_of_birth date,
    date_of_death date,
    father_id uuid REFERENCES public.persons(id) ON DELETE SET NULL,
    mother_id uuid REFERENCES public.persons(id) ON DELETE SET NULL,
    metadata jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.persons IS '人物情報を管理するテーブル';

-- 4. marriages テーブルを作成
-- 人物間の婚姻関係を管理します
CREATE TABLE public.marriages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tree_id uuid NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
    partner1_id uuid NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    partner2_id uuid NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    start_date date,
    end_date date,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT partner_check CHECK (partner1_id <> partner2_id)
);
COMMENT ON TABLE public.marriages IS '婚姻関係を管理するテーブル';


-- 5. Row Level Security (RLS) を有効化【重要】
-- これにより、他人があなたのデータを閲覧・編集できなくなります
ALTER TABLE public.family_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marriages ENABLE ROW LEVEL SECURITY;

-- 6. family_trees テーブル用のRLSポリシーを作成
-- 自分の家系図のみを操作できるようにします
CREATE POLICY "Allow owner to manage their own family trees"
    ON public.family_trees
    FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- 7. persons テーブル用のRLSポリシーを作成
-- 自分が所有する家系図に属する人物情報のみを操作できるようにします
CREATE POLICY "Allow owner to manage persons in their trees"
    ON public.persons
    FOR ALL
    USING ((SELECT owner_id FROM public.family_trees WHERE id = tree_id) = auth.uid())
    WITH CHECK ((SELECT owner_id FROM public.family_trees WHERE id = tree_id) = auth.uid());

-- 8. marriages テーブル用のRLSポリシーを作成
-- 自分が所有する家系図に属する婚姻関係のみを操作できるようにします
CREATE POLICY "Allow owner to manage marriages in their trees"
    ON public.marriages
    FOR ALL
    USING ((SELECT owner_id FROM public.family_trees WHERE id = tree_id) = auth.uid())
    WITH CHECK ((SELECT owner_id FROM public.family_trees WHERE id = tree_id) = auth.uid());