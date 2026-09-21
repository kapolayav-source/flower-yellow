import { PresetMessage, RelationshipType, BouquetStyle } from '../types';

export const RELATIONSHIPS: { id: RelationshipType; label: string; icon: string; defaultStyle: BouquetStyle }[] = [
  { id: 'amiga', label: 'Mejor Amiga', icon: '👭', defaultStyle: 'sunflowers' },
  { id: 'amor', label: 'Mi Pareja / Amor', icon: '💛', defaultStyle: 'roses' },
  { id: 'mama', label: 'Mamá / Familia', icon: '🌷', defaultStyle: 'wildflowers' },
  { id: 'crush', label: 'Crush / Especial', icon: '✨', defaultStyle: 'sunflowers' },
  { id: 'amigo', label: 'Pana / Amigo', icon: '🤝', defaultStyle: 'chamomile' },
  { id: 'chistoso', label: 'Modo Meme / Chistoso', icon: '🌻', defaultStyle: 'sunflowers' },
  { id: 'general', label: 'Cualquier Contacto', icon: '🌼', defaultStyle: 'wildflowers' },
];

export const BOUQUET_STYLES: { id: BouquetStyle; name: string; desc: string; icon: string }[] = [
  {
    id: 'sunflowers',
    name: 'Girasoles Radiantes',
    desc: 'Grandes, llenos de luz y energía dorada',
    icon: '🌻',
  },
  {
    id: 'wildflowers',
    name: 'Ramo Silvestre Primaveral',
    desc: 'Margaritas, flores campestres y lazo suave',
    icon: '🌼',
  },
  {
    id: 'roses',
    name: 'Rosas Amarillas Nobles',
    desc: 'Elegancia, ternura y aprecio profundo',
    icon: '🌹',
  },
  {
    id: 'chamomile',
    name: 'Manzanillas & Sol',
    desc: 'Delicado, minimalista y con vibra de calma',
    icon: '🌾',
  },
];

export const PRESET_MESSAGES: PresetMessage[] = [
  {
    id: 'p-amiga-1',
    label: 'Amiga Incondicional',
    relationship: 'amiga',
    tone: 'tierno',
    message: '¡Feliz 21 de septiembre a la amiga más leal y bonita del mundo! 🌻 Gracias por iluminar mis días con tus risas y consejos. Que este inicio de primavera te traiga tanta alegría como la que regalas a los demás.',
    style: 'sunflowers',
  },
  {
    id: 'p-amiga-2',
    label: 'Floricienta Vibes',
    relationship: 'amiga',
    tone: 'floricienta',
    message: 'Ella sabía que él sabía... ¡y yo sé que te mereces tus flores amarillas hoy y siempre! 💛✨ Promesa cumplida: aquí está tu ramo para recordarte lo valiosa y especial que eres.',
    style: 'sunflowers',
  },
  {
    id: 'p-amor-1',
    label: 'Amor de mi vida',
    relationship: 'amor',
    tone: 'poetico',
    message: 'Dicen que quien te regala flores amarillas el 21 de septiembre quiere quedarse a tu lado por siempre. Y yo no tengo dudas de que mi lugar favorito es contigo. Te amo con todo mi corazón 💛✨',
    style: 'roses',
  },
  {
    id: 'p-amor-2',
    label: 'Tierno y romántico',
    relationship: 'amor',
    tone: 'tierno',
    message: 'Para la persona que convierte cualquier día gris en un campo de girasoles brillantes. Gracias por cada sonrisa y por cada momento juntos. ¡Feliz día de las flores amarillas, mi amor! 🌻💛',
    style: 'roses',
  },
  {
    id: 'p-mama-1',
    label: 'Mamá del alma',
    relationship: 'mama',
    tone: 'tierno',
    message: 'Mamá, tú eres la verdadera luz de nuestra vida y quien florece con más fuerza. Te mando estas flores amarillas con todo mi amor y agradecimiento por cuidarme siempre. ¡Te amo infinito! 🌷💛',
    style: 'wildflowers',
  },
  {
    id: 'p-crush-1',
    label: 'Indirecta bonita',
    relationship: 'crush',
    tone: 'floricienta',
    message: 'No podía dejar que termine este 21 de septiembre sin que recibas tus flores amarillas. Espero que este pequeño detalle te robe al menos una sonrisa hoy ✨🌻',
    style: 'sunflowers',
  },
  {
    id: 'p-chistoso-1',
    label: 'Para que no llores jaja',
    relationship: 'chistoso',
    tone: 'divertido',
    message: 'Para que mañana no andes publicando en estados que nadie te dio tus flores amarillas 😂🌻 Aquí tienes tu ramo virtual de lujo, libre de marchitarse. ¡Valóralo mano!',
    style: 'sunflowers',
  },
  {
    id: 'p-amigo-1',
    label: 'Pana de verdad',
    relationship: 'amigo',
    tone: 'amistoso',
    message: 'Un detalle con buena vibra por el día de las flores amarillas para recordarte el gran aprecio que te tengo. ¡Que este año te salgan todos tus proyectos y metas, bro! 🌼🤝',
    style: 'chamomile',
  },
  {
    id: 'p-general-1',
    label: 'Buena vibra y primavera',
    relationship: 'general',
    tone: 'tierno',
    message: '¡Que este 21 de septiembre llegue cargado de nuevas oportunidades, luz y mucha paz! Te deseo una hermosa temporada de primavera y que nunca te falten razones para sonreír 🌻✨💛',
    style: 'wildflowers',
  },
];
