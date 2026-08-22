import { supabase } from 'https://cdn.doruklu.com/supabase-config.js';
import { state } from './state.js';

export async function saveSchemaToSupabase(uiStatusCallback) {
    uiStatusCallback('Kaydediliyor...', 'text-amber-500');

    // owner_id zorunlu: reports RLS'i artık sahiplik kontrolü yapıyor, böylece bir admin
    // başka bir admin'in raporunu sessizce ezemiyor. Bkz. migrations/2026-08-22-security.sql
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        uiStatusCallback('Oturum bulunamadı', 'text-red-500');
        alert('Kayıt için oturum gerekiyor. Sayfayı yenileyip tekrar dene.');
        return;
    }

    const { error } = await supabase
        .from('reports')
        .upsert({
            id: state.reportSchema.id,
            schema: state.reportSchema,
            owner_id: user.id
        });

    if (error) {
        console.error(error);
        uiStatusCallback('Hata Oluştu', 'text-red-500');
        alert("Kayıt sırasında hata: " + error.message);
    } else {
        uiStatusCallback('Supabase\'e Kaydedildi', 'text-emerald-500');
    }
}
