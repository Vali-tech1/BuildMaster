export function getAuthErrorMessage(cause: unknown): string {
  if (!(cause instanceof Error)) {
    return "Ndodhi një gabim i papritur gjatë hyrjes.";
  }

  if (/network|fetch|connection/i.test(cause.message)) {
    return "Nuk u lidhëm me Supabase. Kontrollo internetin dhe provo përsëri.";
  }

  return cause.message;
}
