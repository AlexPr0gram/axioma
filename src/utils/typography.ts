/** Keep Russian prepositions, conjunctions and particles with the following word. */
export function typography(text: string): string {
  return text.replace(/(?<!\p{L})((?:[вксоуаяи]|во|ко|со|об|обо|из|изо|за|на|над|до|от|ото|по|под|при|про|без|для|не|ни|но|да|же|ли|бы))\s+(?=\S)/giu, '$1\u00a0');
}
