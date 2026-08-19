revoke all on function public.grant_admin_for_verified_email() from anon, authenticated, public;
revoke all on function public.set_updated_at() from anon, authenticated, public;
revoke all on function public.has_role(uuid, public.app_role) from anon, public;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;