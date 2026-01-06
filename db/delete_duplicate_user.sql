-- Script para deletar usuário duplicado
-- Substitua 'SEU_EMAIL_AQUI' pelo email que deseja remover
-- Execute este script no SQL Editor do Supabase Dashboard (https://supabase.com/dashboard/project/_/sql/new)

delete from auth.users
where email = 'SEU_EMAIL_AQUI';
