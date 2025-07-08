-- Add unique constraint to ensure one family tree per user
ALTER TABLE family_trees ADD CONSTRAINT unique_owner_family_tree UNIQUE (owner_id);