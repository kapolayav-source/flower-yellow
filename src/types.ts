export type BouquetStyle = 'sunflowers' | 'wildflowers' | 'roses' | 'chamomile';

export type RelationshipType = 'amiga' | 'amor' | 'mama' | 'crush' | 'amigo' | 'general' | 'chistoso';

export type ToneType = 'tierno' | 'divertido' | 'poetico' | 'amistoso' | 'floricienta';

export interface CardData {
  id: string;
  recipientName: string;
  senderName: string;
  relationship: RelationshipType;
  tone: ToneType;
  bouquetStyle: BouquetStyle;
  message: string;
  dateStr?: string;
  accentColor?: string;
}

export interface PresetMessage {
  id: string;
  label: string;
  relationship: RelationshipType;
  tone: ToneType;
  message: string;
  style: BouquetStyle;
}
