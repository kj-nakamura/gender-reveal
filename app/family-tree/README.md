# family-treeプロジェクト概要

## 📄 家系図サービス 要件定義・構成案
1. プロジェクト概要
ユーザーが直感的な操作で自身の家系図を作成、閲覧、管理できるWebアプリケーション。作成した家系図は家族や親戚と共有することも可能。

サービスURL: family.tabmac.site/family-tree

ターゲットユーザー:

自身のルーツや家族の歴史を記録・整理したい個人

家族や親戚との繋がりを可視化し、共有したいファミリー層

2. 機能要件
ユーザーがサービス上でできることを定義します。

コア機能（家系図の作成・編集）
人物の追加: 名前、性別、生年月日、没年月日などの基本情報を入力して、人物を家系図に追加できる。

人物の編集・削除: 追加した人物の情報を修正したり、削除したりできる。

関係性の定義: 人物同士を親子、夫婦（パートナー）の関係で結びつけられる。

複数家系図の管理: ユーザーは複数の家系図（例：「父方の家系図」「母方の家系図」）を作成・管理できる。

表示・閲覧機能
グラフィカル表示: 作成した人物と関係性を、グラフィカルなツリー構造で表示する。

インタラクティブ操作:

家系図のズームイン・ズームアウト、ドラッグでの表示位置移動ができる。

家系図上の人物をクリックすると、その人物の詳細情報（プロフィール、写真など）をポップアップやサイドバーで表示できる。

エクスポート機能: 作成した家系図を画像（PNG/JPEG）やPDF形式で書き出し、保存・印刷できる。

ユーザー・共有機能
認証: 共通の認証基盤を使い、ログイン・新規登録できる。（revealサービスと共通）

共有機能: 特定の家系図を、他のユーザーを招待して「閲覧のみ」または「共同編集」の権限で共有できる。

3. 非機能要件
システムの品質に関する要件です。

ユーザビリティ: PCやタブレットに不慣れな人でも、直感的に操作できるシンプルなUI/UXを提供する。

パフォーマンス: 家系図に数百人登録されても、表示や操作が遅延なくスムーズに行えること。

セキュリティ: 最重要項目。 ユーザーのプライベートな個人情報を扱うため、不正アクセスや情報漏洩対策を徹底する。SupabaseのRLS（Row Level Security）を活用し、本人の許可なく他人のデータにアクセスできないようにする。

デバイス対応: まずはPCやタブレットでの利用をメインターゲットとし、レスポンシブデザインで対応する。

4. 推奨技術スタックと構成
これまでの決定事項を元にした技術選定です。

フロントエンド: Next.js (App Router)

バックエンド & DB: Supabase (PostgreSQL)

認証: Supabase Auth

デプロイ: Vercel

構成: 単一プロジェクト（モノレポ）内の /family-tree サブディレクトリとして開発

家系図描画ライブラリ: React Flow を推奨。

ノード（人物）とエッジ（関係線）を扱うのに特化しており、カスタマイズ性も高く、モダンなNext.jsアプリと非常に相性が良いです。

5. データベース設計（案）
Supabase (PostgreSQL) でのテーブル構成案です。

family_trees テーブル: 家系図そのものを管理

id (UUID): 主キー

name (TEXT): 家系図の名前（例: 〇〇家の家系図）

owner_id (UUID): 作成者のユーザーID (auth.usersへの外部キー)

persons テーブル: 人物情報を管理

id (UUID): 主キー

tree_id (UUID): 所属する家系図のID (family_treesへの外部キー)

name (TEXT): 氏名

gender (TEXT): 性別 ("male", "female", "other")

date_of_birth (DATE): 生年月日

date_of_death (DATE): 没年月日 (NULL許容)

father_id (UUID): 父親のID (personsへの自己参照、NULL許容)

mother_id (UUID): 母親のID (personsへの自己参照、NULL許容)

metadata (JSONB): 写真URLや経歴など、その他の情報を柔軟に格納

marriages テーブル: 婚姻関係を管理（親子関係だけでは表現できないため）

id (UUID): 主キー

tree_id (UUID): 所属する家系図のID

partner1_id (UUID): パートナー1のID (personsへの外部キー)

partner2_id (UUID): パートナー2のID (personsへの外部キー)

start_date (DATE): 婚姻日など

6. 開発ステップ（案）
このプロジェクトを段階的に進めるためのロードマップです。

フェーズ1: 基盤構築

Next.jsプロジェクトのセットアップとSupabase連携。

上記データベース設計に基づき、テーブルを作成。

Supabase Authによる認証機能の実装。

フェーズ2: 基本CRUD機能の実装

人物情報、家系図情報を登録・更新・削除するためのフォーム画面を作成。

まずはテキストベースで登録した情報が一覧表示できることを目指す。

フェーズ3: 家系図の可視化

React Flowを導入し、DBの情報を元に家系図をグラフィカルに描画する。

ズームやパンなどのインタラクティブ操作を実装。

フェーズ4: 応用機能と仕上げ

他ユーザーへの共有機能を実装。

PDF/画像エクスポート機能を実装。

UI/UXの改善と全体的なブラッシュアップ。

