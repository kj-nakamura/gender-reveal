-- このファイルに書いたSQLは、マイグレーション適用後に自動実行されます

-- テスト用のデータは実際のユーザー作成後に手動で追加
-- テスト用の家系図を作成
-- 注意: owner_id は、ローカルテスト用のサンプルユーザーのUUIDに合わせる必要があります。
-- Supabaseのローカル開発では、テストユーザーは自動作成されません。
-- そのため、まず手動でローカルのStudioからユーザーを作成し、そのUUIDをコピーして使うのが一般的です。
/*
INSERT INTO public.family_trees (name, owner_id)
VALUES
    ('山田家の家系図', '8a8d8a8a-8a8a-8a8a-8a8a-8a8a8a8a8a8a'), -- ← サンプルユーザーのUUID
    ('鈴木家の家系図', '8a8d8a8a-8a8a-8a8a-8a8a-8a8a8a8a8a8a'); -- ← サンプルユーザーのUUID

-- テスト用の人物を作成
INSERT INTO public.persons (tree_id, name, gender)
VALUES
    ((SELECT id FROM public.family_trees WHERE name = '山田家の家系図'), '山田 太郎', 'male'),
    ((SELECT id FROM public.family_trees WHERE name = '山田家の家系図'), '山田 花子', 'female');
*/