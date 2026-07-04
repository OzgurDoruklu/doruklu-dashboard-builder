import { supabase } from 'https://cdn.doruklu.com/supabase-config.js';
import { state } from './state.js';

export async function saveSchemaToSupabase(uiStatusCallback) {
    uiStatusCallback('Kaydediliyor...', 'text-amber-500');

    const { error } = await supabase
        .from('reports')
        .upsert({ 
            id: state.reportSchema.id, 
            schema: state.reportSchema 
        });

    if (error) {
        console.error(error);
        uiStatusCallback('Hata Oluştu', 'text-red-500');
        alert("Kayıt sırasında hata: " + error.message);
    } else {
        uiStatusCallback('Supabase\'e Kaydedildi', 'text-emerald-500');
    }
}