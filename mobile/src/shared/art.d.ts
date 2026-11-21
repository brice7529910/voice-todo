declare const ART: {
  scene(id: string): string;
  portrait(look: any): string;
  icon(ico: string): string;
  photos(found: Record<string, boolean>): string;
  carte(): string;
};
export default ART;
