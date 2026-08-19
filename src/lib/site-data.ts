import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { latestTournamentWinners, nextTournament, type Winner } from "@/data/albastini";

export type DbWinner = {
  id: string;
  position: number;
  name: string;
  image_url: string | null;
  tournament: string;
  event_date: string | null;
  city: string | null;
  prize: string | null;
};

export type DbSettings = {
  id: string;
  tournament_number: number;
  name: string;
  starts_at: string;
  prize_pool: string | null;
};

/** Maps a DB row onto the shape the presentation components already use. */
export function toWinner(row: DbWinner): Winner {
  return {
    id: row.id,
    name: row.name,
    ...(row.image_url ? { image: row.image_url } : {}),
    tournament: row.tournament,
    date: row.event_date ?? "",
    year: new Date().getFullYear(),
    position: row.position,
    ...(row.prize ? { prize: row.prize } : {}),
    ...(row.city ? { city: row.city } : {}),
  };
}

export const winnersQuery = queryOptions({
  queryKey: ["winners"],
  queryFn: async (): Promise<Winner[]> => {
    const { data, error } = await supabase
      .from("winners")
      .select("id, position, name, image_url, tournament, event_date, city, prize")
      .order("position", { ascending: true });
    if (error) throw error;
    return (data as DbWinner[]).map(toWinner);
  },
  initialData: latestTournamentWinners,
  staleTime: 60_000,
});

export const settingsQuery = queryOptions({
  queryKey: ["tournament-settings"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("tournament_settings")
      .select("id, tournament_number, name, starts_at, prize_pool")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as DbSettings | null;
  },
  staleTime: 60_000,
});

/** Falls back to the bundled defaults so the site never renders empty. */
export function settingsToTournament(s: DbSettings | null | undefined) {
  if (!s) return nextTournament;
  return {
    name: s.name,
    startsAt: s.starts_at,
    prizePool: s.prize_pool ?? undefined,
  };
}
