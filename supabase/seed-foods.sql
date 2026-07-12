-- Seed foods from nutrition spreadsheet
-- Categories: carbs, protein, fruits, fats
-- Skips rows with serving_size = 0 / no nutrition data
--
-- Run this once in the Supabase SQL Editor.
-- After this, every new signup automatically gets these foods
-- via public.handle_new_user().

create or replace function public.seed_default_foods(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Avoid double-seeding if called more than once
  if exists (select 1 from public.foods where user_id = p_user_id limit 1) then
    return;
  end if;

  insert into public.foods
    (user_id, name, serving_size, serving_unit, protein, carbs, fats, calories, category)
  values
    -- ========== CARBS ==========
    (p_user_id, 'קוואקר', 100, 'grams', 11, 60, 8, 337, 'carbs'),
    (p_user_id, 'דבש', 100, 'grams', 0, 80, 0, 320, 'carbs'),
    (p_user_id, 'חלב שקדים', 100, 'grams', 0.5, 3, 1.1, 24, 'carbs'),
    (p_user_id, 'פתיתים מבושלים', 100, 'grams', 4.4, 29.4, 1.8, 154, 'carbs'),
    (p_user_id, 'בטטה מבושלת', 100, 'grams', 0, 17.72, 0, 76, 'carbs'),
    (p_user_id, 'אורז לאחר בישול', 100, 'grams', 2.7, 28, 0, 125, 'carbs'),
    (p_user_id, 'נייצ''ר ואלי', 100, 'grams', 8.1, 64.5, 1.72, 456, 'carbs'),
    (p_user_id, 'תפוח אדמה מבושל', 100, 'grams', 0, 20, 0, 86, 'carbs'),
    (p_user_id, 'פיתה', 100, 'grams', 8.2, 45.5, 1.2, 225, 'carbs'),
    (p_user_id, 'אנג''ל חיטה מלאה', 100, 'grams', 11.8, 40.7, 6.5, 233, 'carbs'),
    (p_user_id, 'לחם אחיד דגנית', 100, 'grams', 9.5, 56.5, 2.5, 298, 'carbs'),
    (p_user_id, 'כוסמת לאחר בישול', 100, 'grams', 3.38, 19.94, 0, 92, 'carbs'),
    (p_user_id, 'קורנפלקס', 100, 'grams', 7, 86.3, 0.9, 381, 'carbs'),
    (p_user_id, 'לחמניה', 100, 'grams', 9.5, 57.5, 1.8, 284, 'carbs'),
    (p_user_id, 'פריכיות שופרסל', 100, 'grams', 0, 79, 2.9, 385, 'carbs'),
    (p_user_id, 'דגנית עין בר מלא', 100, 'grams', 10.8, 43.5, 3.6, 250, 'carbs'),
    (p_user_id, 'פרנה', 100, 'grams', 8.3, 51.7, 3.7, 277, 'carbs'),
    (p_user_id, 'לחם נאייקס', 100, 'grams', 4.6, 27.6, 7.3, 196, 'carbs'),
    (p_user_id, 'גלידה', 100, 'grams', 4, 20, 12, 206, 'carbs'),
    (p_user_id, 'תירס שימורים', 100, 'grams', 2, 8, 1, 45, 'carbs'),
    (p_user_id, 'קינואה', 100, 'grams', 4.4, 21.3, 1.9, 120, 'carbs'),
    (p_user_id, 'שעועית שחורה', 100, 'grams', 6, 17, 0, 117, 'carbs'),
    (p_user_id, 'ציפס', 100, 'grams', 0, 37.5, 17, 319, 'carbs'),
    (p_user_id, 'חלב 3%', 100, 'grams', 3.3, 5, 3, 60, 'carbs'),
    (p_user_id, 'אטריות', 100, 'grams', 7, 49.3, 1.1, 221, 'carbs'),
    (p_user_id, 'פסטה אסם', 100, 'grams', 5, 32.3, 0.7, 161, 'carbs'),

    -- ========== PROTEIN ==========
    (p_user_id, 'פסטרמה', 100, 'grams', 16, 5, 3, 111, 'protein'),
    (p_user_id, 'טונה סטארקיסט', 100, 'grams', 25, 0, 4.5, 140, 'protein'),
    (p_user_id, 'בשר עוף מבושל', 100, 'grams', 27, 0, 6.7, 177, 'protein'),
    (p_user_id, 'ביצה M מבושלת', 1, 'piece', 6, 0, 6.7, 86, 'protein'),
    (p_user_id, 'ביצה L מבושלת', 1, 'piece', 7.3, 0, 8.2, 105, 'protein'),
    (p_user_id, 'ביצה XL מבושלת', 1, 'piece', 8.7, 0, 9.7, 125, 'protein'),
    (p_user_id, 'כבד עוף', 1, 'piece', 0.25, 0, 0.065, 1.72, 'protein'),
    (p_user_id, 'גבינה לבנה 5%', 100, 'grams', 9, 4.3, 5, 98, 'protein'),
    (p_user_id, 'קוטג'' 3%', 100, 'grams', 0, 1.5, 3, 77, 'protein'),
    (p_user_id, 'קוטג'' 5%', 100, 'grams', 11, 1.5, 5, 95, 'protein'),
    (p_user_id, 'קוטג'' 9%', 100, 'grams', 10.5, 1.2, 9, 128, 'protein'),
    (p_user_id, 'גבינה צהובה', 100, 'grams', 22, 0, 28, 340, 'protein'),
    (p_user_id, 'ביצה קשה', 100, 'grams', 12.58, 1.2, 10.6, 155, 'protein'),

    -- ========== FRUITS ==========
    (p_user_id, 'בננה', 100, 'grams', 0, 23, 0, 89, 'fruits'),
    (p_user_id, 'תפוח עץ', 100, 'grams', 0, 14, 0, 54, 'fruits'),
    (p_user_id, 'אגס', 100, 'grams', 0, 15, 0, 57, 'fruits'),
    (p_user_id, 'אפרסק', 100, 'grams', 0, 10, 0, 39, 'fruits'),
    (p_user_id, 'תפוז', 100, 'grams', 1, 12, 0, 43, 'fruits'),
    (p_user_id, 'תמר', 100, 'grams', 0, 1270, 0, 4700, 'fruits'),
    (p_user_id, 'חמוציות', 100, 'grams', 0, 78, 0, 320, 'fruits'),
    (p_user_id, 'מיקס פירות', 100, 'grams', 1.2, 7.9, 0, 48, 'fruits'),
    (p_user_id, 'תות', 100, 'grams', 0, 4.9, 0, 32, 'fruits'),
    (p_user_id, 'ברוקולי', 100, 'grams', 2.38, 7.18, 0.41, 35, 'fruits'),

    -- ========== FATS ==========
    (p_user_id, 'חמאת בוטנים', 100, 'grams', 28, 16, 53, 619, 'fats'),
    (p_user_id, 'אגוזי מלך', 100, 'grams', 15, 14, 65, 654, 'fats'),
    (p_user_id, 'שמן זית', 100, 'grams', 0, 0, 91, 822, 'fats'),
    (p_user_id, 'מיונז (כף=15)', 100, 'grams', 0, 0, 65, 600, 'fats'),
    (p_user_id, 'אבוקדו', 100, 'grams', 2, 9, 15, 160, 'fats'),
    (p_user_id, 'בוטנים', 100, 'grams', 26, 16, 49, 567, 'fats'),
    (p_user_id, 'טחינה גולמית', 100, 'grams', 24, 2, 60, 665, 'fats'),
    (p_user_id, 'שקדים', 100, 'grams', 21, 22, 49, 575, 'fats'),
    (p_user_id, 'חמאה', 100, 'grams', 0, 0, 82, 742, 'fats'),
    (p_user_id, 'פקאן', 100, 'grams', 9.2, 13.9, 72, 691, 'fats'),
    (p_user_id, 'במבה', 100, 'grams', 17.5, 39.5, 34, 534, 'fats'),
    (p_user_id, 'זרעי צ''יה', 100, 'grams', 17, 42, 31, 486, 'fats'),
    (p_user_id, 'זרעי חמניה', 100, 'grams', 21, 20, 51, 584, 'fats');
end;
$$;

-- Create profile + default food library on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );

  perform public.seed_default_foods(new.id);

  return new;
end;
$$;

-- Backfill existing users who have no foods yet
select public.seed_default_foods(id)
from auth.users u
where not exists (
  select 1 from public.foods f where f.user_id = u.id
);
