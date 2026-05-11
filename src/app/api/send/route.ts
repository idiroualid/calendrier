import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Initialisation du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, name, date, time, location, notes } = await req.json();

    // 1. On construit la date et l'heure en format ISO LOCAL (sans le Z à la fin)
    // Format attendu par Supabase pour rester tel quel : "YYYY-MM-DDTHH:mm:ss"
    const startISO = `${date}T${time}:00`;
    
    // Pour calculer l'heure de fin (+30 min), on passe par un objet Date temporaire
    const tempDate = new Date(`${date}T${time}:00`);
    const endTempDate = new Date(tempDate.getTime() + 30 * 60000);
    
    // On formate l'heure de fin manuellement pour éviter toISOString()
    const endISO = `${date}T${endTempDate.getHours().toString().padStart(2, '0')}:${endTempDate.getMinutes().toString().padStart(2, '0')}:00`;

    console.log('Insertion dans Supabase (Heures locales):', { startISO, endISO });

    const insertPayload = [
      {
        title: `Appel découverte : ${name}`,
        description: notes,
        event_type: 'discovery_call',
        location: location,
        start_datetime: startISO, // On envoie la string "2024-05-11T09:00:00"
        end_datetime: endISO,
        status: 'scheduled',
        attendees: [
          { email: email, name: name }
        ]
      }
    ];

    // 2. Vérification des conflits (Optionnel mais recommandé)
    // On vérifie si un événement existe déjà exactement à cette heure
    const { data: conflicts, error: respError } = await supabase
      .from('events')
      .select('id')
      .eq('start_datetime', startISO);

    if (respError) {
      console.error('Erreur vérification conflits:', respError);
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Ce créneau est déjà réservé.' }, { status: 409 });
    }

    // 3. Insertion finale
    const { data: dbData, error: dbError } = await supabase
      .from('events')
      .insert(insertPayload)
      .select();

    if (dbError) {
        console.error('Erreur Supabase:', dbError);
        return NextResponse.json({ error: 'Erreur lors de l\'enregistrement.', details: dbError }, { status: 500 });
    }

    return NextResponse.json({ success: true, dbData });

  } catch (error: any) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue" }, 
      { status: 500 }
    );
  }
}